package org.uiscloud.gis.bookmark.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.uiscloud.gis.bookmark.service.BookmarkSearchVO;
import org.uiscloud.gis.bookmark.service.BookmarkService;
import org.uiscloud.gis.bookmark.service.BookmarkVO;
import org.uiscloud.com.service.ExcelConverterService;
import org.uiscloud.gis.mapInfo.service.MapInfoTpoService;
import org.uiscloud.gis.routing.service.RoutingService;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

@Controller("bookmarkController")
@SessionAttributes(types = BookmarkVO.class)
public class BookmarkController {

	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	@Resource(name = "bookmarkService")
	private BookmarkService bookmarkService;

	@Resource(name = "mapInfoTpoService")
	private MapInfoTpoService mapInfoTpoService;

	/** BookmarkConverterService */
	@Resource(name = "excelConverterService")
	ExcelConverterService excelConverterService;

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	@Resource
	private RoutingService routingService;

	public BookmarkService getBookmarkService() {
		return bookmarkService;
	}

	public void setBookmarkService(BookmarkService bookmarkService) {
		this.bookmarkService = bookmarkService;
	}

	public ExcelConverterService getExcel2JSONService() {
		return excelConverterService;
	}

	public void setExcel2JSONService(ExcelConverterService excelConverterService) {
		this.excelConverterService = excelConverterService;
	}

	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
	}

	/**
	 * 
	 * 본부 Combo Data
	 * 
	 * @param
	 * 		
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/bookmark/regionList")
	public View regionList(Model model) throws Exception {
		List<Map<String, String>> result = bookmarkService.regionList();

		model.addAttribute("result", result);

		return jacksonJsonView;
	}

	/**
	 * 
	 * Bookmark 제목 검색
	 * 
	 * @param
	 * 		BookmarkSearchVO // BookmarkSearchVO
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/bookmark/search")
	public View search(Model model, @ModelAttribute BookmarkSearchVO vo, BindingResult bindingResult) throws Exception {
		if (bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}

		Integer total = 0;

		if (vo.getTotalCount() == null) {
			total = bookmarkService.searchTotalCount(vo);
		} else {
			total = vo.getTotalCount();
		}

		List<Map<String, String>> result = bookmarkService.search(vo);

		model.addAttribute("total", total);
		model.addAttribute("rows", result);

		return jacksonJsonView;
	}

	/**
	 * 
	 * Bookmark 상세 검색
	 * 
	 * @param
	 * 		headOffice
	 * 		creator
	 * 		title
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/bookmark/detail")
	public String bookmarkDetail(Model model, @RequestParam String headOffice, @RequestParam String creator, @RequestParam String title) {
		model.addAttribute("headOffice", headOffice);
		model.addAttribute("creator", creator);
		model.addAttribute("title", title);

		return "/gis/bookmark/bookmarkDetail";
	}

	@RequestMapping(value = "/gis/bookmark/selectBookmarkDetail")
	public ModelAndView selectBookmarkDetail(Model model, @RequestParam String headOffice, @RequestParam String creator, @RequestParam String title) throws Exception {
		GeometryFactory fac = new GeometryFactory();
		WKTReader wktReader = new WKTReader(fac);
		

		List<Map<String, Object>> returnHighers = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> returnLowers = new ArrayList<Map<String, Object>>();

		List<Map<String, Object>> highers = bookmarkService.getHighers(headOffice, creator, title);
		
		for(Map<String, Object> higher : highers) {
			
			// higher
			Map<String, Object> near = findNearestEdge(wktReader, String.valueOf(higher.get("geomWkt")));
			int id = (Integer) near.get("id");
			double x = (Double) near.get("x");
			double y = (Double) near.get("y");

			Map<String, Object> newHigher = new HashMap<String, Object>();
			newHigher.put("id", id);
			newHigher.put("x", x);
			newHigher.put("y", y);
			
			returnHighers.add(newHigher);

			// lower
			int higherRankOfficeId = (Integer) higher.get("bookmark_higher_rank_office_id");
			List<Map<String, Object>> lowers = bookmarkService.getLowers(higherRankOfficeId);

			try {
				for (Map<String, Object> lower : lowers) {

					Object bldgIDObj = lower.get("fkTcpInbdInfoGid");
					if(bldgIDObj == null) {
						continue;
					}

					int bldgId = Integer.parseInt( String.valueOf(bldgIDObj));
					String bldgWkt =  String.valueOf(lower.get("geomWkt"));
					
					// TODO
					Map<String, Object> lowerNear = findNearestEdge(wktReader, bldgWkt);
					int lowerId = (Integer) lowerNear.get("id");
					double lowerX = (Double) lowerNear.get("x");
					double lowerY = (Double) lowerNear.get("y");

					Map<String, Object> info = new HashMap<String, Object>();
					info.put("id", lowerId);
					info.put("x", lowerX);
					info.put("y", lowerY);
					info.put("wkt", lower.get("geomWkt"));
					info.put("bldgId", bldgId);
					info.put("bldgWkt", bldgWkt);

					returnLowers.add(info);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);
		modelAndView.addObject("highers", returnHighers);
		modelAndView.addObject("lowers", returnLowers);

		return modelAndView;
	}

	private Map<String, Object> findNearestEdge(WKTReader wktReader, String wkt) {

		double x = 0.0d;
		double y = 0.0d;
		try {
			Geometry geom = wktReader.read(wkt);
			if (geom instanceof Point) {
				Point p = (Point) geom;
				x = p.getX();
				y = p.getY();
			}

			return routingService.findNearestEdge(x, y);

		} catch (ParseException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * 
	 * 업로드된 Excel 파일을 List<Properties> 변환후 JSON 으로 전송
	 * JSON으로 변환하면 Array<JSONObject> 형태로 변환됨
	 * 
	 * @param MultipartHttpServletRequest request 요청
	 * @param Model model
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/bookmark/create", method = RequestMethod.POST)
	public View createBookmark(Model model, final MultipartHttpServletRequest multiRequest) throws Exception {
		String excelErrorMessage = "";

		try {
			final Map<String, MultipartFile> files = multiRequest.getFileMap();
			Integer sheetNumber = 0;
			Integer resultCode = 200;
			Integer size = 0;
			Integer countError = 0;

			Iterator<Entry<String, MultipartFile>> itr = files.entrySet().iterator();
			Entry<String, MultipartFile> entry = itr.next();
			MultipartFile file = entry.getValue();

			String fileName = file.getOriginalFilename();
			String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);

			List<Properties> propertiesInList = excelConverterService.excel2PropertiesInList(file.getInputStream(), fileExt, sheetNumber);

			size = propertiesInList.size();

			if (size == 0) {
				excelErrorMessage = "엑셀이 비어 있습니다.";
				model.addAttribute("excelErrorMessage", excelErrorMessage);
				model.addAttribute("resultCode", 710);

				return jacksonJsonView;
			}

			Properties prop = propertiesInList.get(0);

			Set<String> keys = prop.stringPropertyNames();

			List<String> requiredKeys = new ArrayList<String>();

			requiredKeys.add("본부명");
			requiredKeys.add("작성자");
			requiredKeys.add("입력구분");
			requiredKeys.add("명칭");
			requiredKeys.add("상위국unq_mgno");

			if (keys.containsAll(requiredKeys)) {

			} else {
				excelErrorMessage = "엑셀 양식이 올바르지 않습니다.";
				model.addAttribute("excelErrorMessage", excelErrorMessage);
				model.addAttribute("resultCode", 720);

				return jacksonJsonView;
			}

			for (Integer index = 0; index < size; index++) {
				prop = propertiesInList.get(index);

				String kind = prop.getProperty("입력구분").toString().trim();
				
				if("".equals(kind)) {
					continue;
				}
				
				String unqMgno = prop.getProperty("상위국unq_mgno").toString().trim();
				String pnu = prop.getProperty("하위국PNU").toString().trim();
				String jibunBon = prop.getProperty("하위국대번지").toString().trim();
				String jibunBu = prop.getProperty("하위국소번지").toString().trim();
				String rowErrorMessage = "";
				
				// START: 상위국 정보가 있는지 확인
				List<Map<String, String>> tpoInfo = mapInfoTpoService.findTpoInfo(unqMgno);

				if (tpoInfo == null || tpoInfo.size() == 0) {
					rowErrorMessage += "[없음] 상위국 unq_mgno 가 존재하지 않습니다. ";
					countError++;
				} else if (tpoInfo.size() > 1) {
					// 여기 오면 DB Table 정비 필요
					rowErrorMessage += "[중복] 상위국 unq_mgno 가 여러 개 존재합니다. ";
					countError++;
				} else {
					prop.put("name", tpoInfo.get(0).get("name"));
					prop.put("address", tpoInfo.get(0).get("address"));
					prop.put("higherGeom", tpoInfo.get(0).get("higherGeom"));
				}
				// FINISH: 상위국 정보가 있는지 확인
				// START: 하위국 the_geom 이 있는지 확인
				if ("PNU".equalsIgnoreCase(kind)) {
					Integer lowerTcpInfo = bookmarkService.findLowerTcpInfo(pnu, jibunBon, jibunBu);

					if (lowerTcpInfo != null && lowerTcpInfo > 0) {
						prop.put("fkTcpInbdInfoGid", lowerTcpInfo);
					} else {
						rowErrorMessage += "[없음] 하위국PNU, 대번지, 소번지에 의한 하위국 공간 정보가 존재하지 않습니다.";
						countError++;
					}
				} else if ("GPS".equalsIgnoreCase(kind)) {

					String longD = prop.getProperty("경도(도)").toString().trim();
					String longM = prop.getProperty("경도(분)").toString().trim();
					String longS = prop.getProperty("경도(초)").toString().trim();
					String latD = prop.getProperty("위도(도)").toString().trim();
					String latM = prop.getProperty("경도(분)").toString().trim();
					String latS = prop.getProperty("경도(초)").toString().trim();

					if (longD == null || longD == "" || longM == null || longM == "" || longS == null || longS == "" || latD == null || latD == "" || latM == null || latM == "" || latS == null || latS == "") {
						rowErrorMessage += "[없음] 경위도 정보가 존재하지 않습니다.";
						countError++;
					}
				} else {
					rowErrorMessage += "[구분 오류] 입력구분은 PNU 또는 GPS 만 가능합니다.";
					countError++;
				}
				// FINISH: 하위국 the_geom 이 있는지 확인
				prop.put("오류", rowErrorMessage);
			}
			
			if (countError > 0) {
				excelErrorMessage = "[엑셀 오류] 엑셀 변환에 문제가 있습니다.";
				model.addAttribute("excelErrorMessage", excelErrorMessage);
				model.addAttribute("excel", propertiesInList);
				resultCode = 730;
			}
			//DB등록 	
			else {
				Set<Properties> bookmarkMasters = new HashSet<Properties>();
				Set<Properties> bookmarkHighers = new HashSet<Properties>();
				Set<Properties> bookmarkLowers = new HashSet<Properties>();

				for (Integer index = 0; index < size; index++) {
					prop = propertiesInList.get(index);
					
					String kind = prop.getProperty("입력구분").toString().trim();
					
					if("".equals(kind)) {
						continue;
					}

					// bookmarkMaster
					Properties bookmarkMaster = new Properties();

					bookmarkMaster.put("headOffice", prop.get("본부명").toString().trim());
					bookmarkMaster.put("creator", prop.get("작성자").toString().trim());
					bookmarkMaster.put("title", prop.get("명칭").toString().trim());

					bookmarkMasters.add(bookmarkMaster);

					// bookmarkHigher
					Properties bookmarkHigher = new Properties();

					bookmarkHigher.put("headOffice", prop.get("본부명").toString().trim());
					bookmarkHigher.put("creator", prop.get("작성자").toString().trim());
					bookmarkHigher.put("title", prop.get("명칭").toString().trim());
					bookmarkHigher.put("unqMgno", prop.get("상위국unq_mgno").toString().trim());
					bookmarkHigher.put("name", prop.get("name").toString().trim());
					bookmarkHigher.put("address", prop.get("address").toString().trim());
					bookmarkHigher.put("theGeom", prop.get("higherGeom").toString().trim());

					bookmarkHighers.add(bookmarkHigher);

					// bookmarkLower
					Properties bookmarkLower = new Properties();

					bookmarkLower.put("headOffice", prop.get("본부명").toString().trim());
					bookmarkLower.put("creator", prop.get("작성자").toString().trim());
					bookmarkLower.put("title", prop.get("명칭").toString().trim());
					bookmarkLower.put("unqMgno", prop.get("상위국unq_mgno").toString().trim());
					bookmarkLower.put("type", prop.get("입력구분").toString().trim());
					bookmarkLower.put("jibunBon", prop.get("하위국대번지").toString().trim());
					bookmarkLower.put("jibunBu", prop.get("하위국소번지").toString().trim());
					bookmarkLower.put("address", prop.get("하위국 주소").toString().trim());

					if (bookmarkLower.getProperty("type").equals("GPS")) {
						bookmarkLower.put("longD", Double.parseDouble(prop.get("경도(도)").toString().trim()));
						bookmarkLower.put("longM", Double.parseDouble(prop.get("경도(분)").toString().trim()));
						bookmarkLower.put("longS", Double.parseDouble(prop.get("경도(초)").toString().trim()));
						bookmarkLower.put("latD", Double.parseDouble(prop.get("위도(도)").toString().trim()));
						bookmarkLower.put("latM", Double.parseDouble(prop.get("위도(분)").toString().trim()));
						bookmarkLower.put("latS", Double.parseDouble(prop.get("위도(초)").toString().trim()));
					} else {
						bookmarkLower.put("pnu", prop.get("하위국PNU").toString().trim());
						bookmarkLower.put("fkTcpInbdInfoGid", Integer.parseInt(prop.get("fkTcpInbdInfoGid").toString().trim()));
					}

					bookmarkLowers.add(bookmarkLower);
				}

				// Insert bookmarkMasters
				for (Properties propBookMaster : bookmarkMasters) {
					bookmarkService.insertBookmark(propBookMaster);

					// Insert bookmarkHighers
					for (Properties propBookHigher : bookmarkHighers) {
						if (propBookHigher.getProperty("headOffice").equals(propBookMaster.getProperty("headOffice")) && propBookHigher.getProperty("creator").equals(propBookMaster.getProperty("creator")) && propBookHigher.getProperty("title").equals(propBookMaster.getProperty("title"))) {
							propBookHigher.put("fkBookmarkMasterId", propBookMaster.get("bookmarkMasterId"));
							bookmarkService.insertBookmarkHigher(propBookHigher);

							// Insert bookmarkLowers
							for (Properties propBookLower : bookmarkLowers) {
								if (propBookLower.getProperty("headOffice").equals(propBookHigher.getProperty("headOffice")) && propBookLower.getProperty("creator").equals(propBookHigher.getProperty("creator")) && propBookLower.getProperty("title").equals(propBookHigher.getProperty("title"))
										&& propBookLower.getProperty("unqMgno").equals(propBookHigher.getProperty("unqMgno"))) {
									propBookLower.put("fkBookmarkHigherRankOfficeId", propBookHigher.get("bookmarkHigherRankOfficeId"));

									if (propBookLower.getProperty("type").equals("PNU")) {
										bookmarkService.insertBookmarkLowerByPNU(propBookLower);
									} else {
										bookmarkService.insertBookmarkLowerByGPS(propBookLower);
									}
								}
							}
						}
					}
				}
			}

			model.addAttribute("resultCode", resultCode);

			return jacksonJsonView;
		} catch (Exception ex) {
			excelErrorMessage = "[서버 오류] 엑셀 변환에 문제가 있습니다. 관리자에게 문의하세요.";
			model.addAttribute("excelErrorMessage", excelErrorMessage);
			model.addAttribute("resultCode", 600);

			return jacksonJsonView;
		}
	}

	@RequestMapping(value = "/gis/bookmark/errorDetail")
	public String bookmarkErrorDetail(Model model, @RequestParam String excelErrorMessage, @RequestParam String excel) {
		model.addAttribute("excelErrorMessage", excelErrorMessage);
		model.addAttribute("excel", excel);

		return "/gis/bookmark/bookmarkErrorDetail";
	}

}