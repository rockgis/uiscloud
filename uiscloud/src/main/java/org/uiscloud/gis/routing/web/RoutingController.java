package org.uiscloud.gis.routing.web;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.JsonConverterService;
import org.uiscloud.gis.mapsv.service.SaveMapService;
import org.uiscloud.gis.routing.service.RoutingService;
import org.uiscloud.gis.routing.service.RoutingVO;
import org.uiscloud.gis.routing.service.KairosRoutingService;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

import egovframework.rte.fdl.property.impl.EgovPropertyServiceImpl;

@Controller
public class RoutingController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	@Resource
	private RoutingService routingService;
	
	@Resource
	private KairosRoutingService kairosRoutingService;
	 

	@Resource(name = "propertiesService")
	private EgovPropertyServiceImpl propertiesService;

	/** jsonConverterService */
	@Resource(name = "jsonConverterService")
	private JsonConverterService jsonConverterService;

	/** SaveMapService */
	@Resource(name = "saveMapService")
	SaveMapService saveMapService;

	public ModelAndView routeOld(@RequestParam String startPoint, @RequestParam String endPoint, @RequestParam String stopOverPoints, @RequestParam String stopOverLines, @RequestParam String nonStopOverPoints, @RequestParam String nonStopOverLines, @RequestParam String capacity,
			@RequestParam String remainCapacity, @RequestParam String connectingPointCount, @RequestParam String ungrLocs, @RequestParam(required = false) String gisCodes, @RequestParam String sysClf, @RequestParam String coreCount, @RequestParam String netClfs, @RequestParam String bbox) {

		RoutingVO routingVO = setRoutingVOOld(startPoint, endPoint, stopOverPoints, stopOverLines, nonStopOverPoints, nonStopOverLines, capacity, remainCapacity, connectingPointCount, ungrLocs, gisCodes, sysClf, coreCount, netClfs, bbox);

		List<Map<String, Object>> features = getFeatures(routingVO);

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);
		modelAndView.addObject("type", "FeatureCollection");
		modelAndView.addObject("features", features);

		return modelAndView;
	}

	@RequestMapping(value = "/gis/routing")
	public ModelAndView route(RoutingParam routingParam) {
		RoutingVO routingVO = setRoutingVO(routingParam);
		List<Map<String, Object>> features = getFeatures(routingVO);

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);
		modelAndView.addObject("type", "FeatureCollection");
		modelAndView.addObject("features", features);

		return modelAndView;
	}
	
	
	@RequestMapping(value = "/gis/kairosrouting")
	public ModelAndView kairosrouting(RoutingParam routingParam) {
		RoutingVO routingVO = setRoutingVO(routingParam);
		List<Map<String, Object>> features = kgetFeatures(routingVO);

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);
		modelAndView.addObject("type", "FeatureCollection");
		modelAndView.addObject("features", features);

		return modelAndView;
	}
	

	private String createJsonRequest(RoutingVO routingVO) {
		ObjectMapper mapper = new ObjectMapper();

		System.out.println(routingVO);

		LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("startPoint", routingVO.getStartPointId());
		map.put("endPoint", routingVO.getEndPointId());
		map.put("stopOverPoints", toInts(routingVO.getStopOverPoints()));
		map.put("stopOverLines", toInts(routingVO.getStopOverLines()));
		map.put("nonStopOverPoints", toInts(routingVO.getNonStopOverPoints()));
		map.put("nonStopOverLines", toInts(routingVO.getNonStopOverLines()));
		map.put("capacity", toInt(routingVO.getCapacity()));
		map.put("remainCapacity", toInt(routingVO.getRemainCapacity()));
		map.put("connectingPointCount", toInt(routingVO.getConnectingPointCount()));
		map.put("ungrLocs", nullToBlank(routingVO.getUngrLocsArr()));
		map.put("gisCodes", routingVO.getGisCodesArr() != null ? "CN002" : "");
		map.put("sysClf", routingVO.getSysClf());
		map.put("coreCount", toInt(routingVO.getCoreCount()));
		//map.put("netClfs", nullToBlank(routingVO.getNetClfsArr()));
		map.put("bbox", nullToBlank(routingVO.getBbox()));

		map.put("sktBbring", routingVO.getSktBbring());
		map.put("sktCtring", routingVO.getSktCtring());
		map.put("sktBsring", routingVO.getSktBsring());
		map.put("sktRfptp", routingVO.getSktRfptp());
		map.put("sktEtc", routingVO.getSktEtc());
		map.put("skbRing", routingVO.getSkbRing());
		map.put("conCoreCount", routingVO.getConCoreCount());
		map.put("byCost", routingVO.getByCost());
		map.put("byICost", nullToBlank(routingVO.getByICost()));
		map.put("routingCount", toInt(routingVO.getRoutingCount()));
		map.put("orderRequired", routingVO.getOrderRequired());
		map.put("allowOverlap", routingVO.getAllowOverlap());
		map.put("avoidCoring", routingVO.getAvoidCoring());

		// convert object to json string
		String jsonString = null;
		try {
			jsonString = mapper.writeValueAsString(map);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return jsonString;
	}

	private Object nullToBlank(String[] ungrLocsArr) {
		return ungrLocsArr == null ? new String[0] : ungrLocsArr;
	}

	private String nullToBlank(String str) {
		return str == null ? "" : str;
	}

	private int toInt(String param) {
		if (param == null) {
			return 0;
		}

		try {
			return Integer.parseInt(param);
		} catch (Exception e) {

		}

		return 0;
	}

	private int[] toInts(String param) {
		if (param == null) {
			return new int[0];
		}

		String[] strs = param.split(",");
		String[] nsols = strs;
		final int[] ints = new int[nsols.length];
		for (int i = 0; i < nsols.length; i++) {
			ints[i] = Integer.parseInt(nsols[i]);
		}
		return ints;
	}

	private RoutingVO setRoutingVOOld(String startPoint, String endPoint, String stopOverPoints, String stopOverLines, String nonStopOverPoints, String nonStopOverLines, String capacity, String remainCapacity, String connectingPointCount, String ungrLocs, String gisCodes, String sysClf,
			String coreCount, String netClfs, String bbox) {
		RoutingVO routingVO = new RoutingVO();
		routingVO.setStartPoint(startPoint);
		routingVO.setEndPoint(endPoint);
		routingVO.setStopOverPoints(stopOverPoints);
		routingVO.setStopOverLines(stopOverLines);
		routingVO.setNonStopOverPoints(nonStopOverPoints);
		routingVO.setNonStopOverLines(nonStopOverLines);

		if (bbox != null && bbox.trim().length() > 0) {
			routingVO.setBbox(bbox);
		}

		routingVO.setCapacity(capacity);
		routingVO.setRemainCapacity(remainCapacity);
		routingVO.setConnectingPointCount(connectingPointCount);

		if (ungrLocs != null && ungrLocs.trim().length() > 0) {
			String[] ungrLocsArr = ungrLocs.split(",");
			routingVO.setUngrLocsArr(ungrLocsArr);
		}

		if (gisCodes != null && gisCodes.trim().length() > 0) {
			String[] gisCodesArr = gisCodes.split(",");
			routingVO.setGisCodesArr(gisCodesArr);
		}

		routingVO.setSysClf(sysClf);

		routingVO.setCoreCount(coreCount);

		if (netClfs != null && netClfs.trim().length() > 0) {
			String[] netClfsArr = netClfs.split(",");
			routingVO.setNetClfsArr(netClfsArr);
		}

		int buffer = propertiesService.getInt("buffer");
		routingVO.setBuffer(buffer);
		return routingVO;
	}

	private RoutingVO setRoutingVO(RoutingParam routingParam) {
		RoutingVO routingVO = new RoutingVO();
		routingVO.setStartPoint(routingParam.getStartPoint());
		routingVO.setEndPoint(routingParam.getEndPoint());
		routingVO.setStartPointId(routingParam.getStartPointId());
		routingVO.setEndPointId(routingParam.getEndPointId());

		String nonStopOverPoints = routingParam.getNonStopOverPoints();
		if (nonStopOverPoints != null && nonStopOverPoints.trim().length() > 0) {
			routingVO.setNonStopOverPoints(nonStopOverPoints);
		}

		String nonStopOverLines = routingParam.getNonStopOverLines();
		if (nonStopOverLines != null && nonStopOverLines.trim().length() > 0) {
			routingVO.setNonStopOverLines(nonStopOverLines);
		}

		String stopOverPoints = routingParam.getStopOverPoints();
		if (stopOverPoints != null && stopOverPoints.trim().length() > 0) {
			routingVO.setStopOverPoints(stopOverPoints);
		}

		String stopOverLines = routingParam.getStopOverLines();
		if (stopOverLines != null && stopOverLines.trim().length() > 0) {
			routingVO.setStopOverLines(stopOverLines);
		}

		String bbox = routingParam.getBbox();
		if (bbox != null && bbox.trim().length() > 0) {
			routingVO.setBbox(bbox);
		}

		routingVO.setCapacity(routingParam.getCapacity());
		routingVO.setRemainCapacity(routingParam.getRemainCapacity());
		routingVO.setConnectingPointCount(routingParam.getConnectingPointCount());

		String ungrLocs = routingParam.getUngrLocs();
		if (ungrLocs != null && ungrLocs.trim().length() > 0) {
			String[] ungrLocsArr = ungrLocs.split(",");
			routingVO.setUngrLocsArr(ungrLocsArr);
		}

		String gisCodes = routingParam.getGisCodes();
		if (gisCodes != null && gisCodes.trim().length() > 0) {
			String[] gisCodesArr = gisCodes.split(",");
			routingVO.setGisCodesArr(gisCodesArr);
		}

		routingVO.setSysClf(routingParam.getSysClf());

		//
		routingVO.setCoreCount(routingParam.getCoreCount());
		//
		//		if (netClfs != null && netClfs.trim().length() > 0) {
		//			String[] netClfsArr = netClfs.split(",");
		//			routingVO.setNetClfsArr(netClfsArr);
		//		}

		routingVO.setByICost(routingParam.getByICost());
		routingVO.setSktBbring(routingParam.getSkBbring() != null ? Integer.parseInt(routingParam.getSkBbring()) : 0);
		routingVO.setSktCtring(routingParam.getSktCtring() != null ? Integer.parseInt(routingParam.getSktCtring()) : 0);
		routingVO.setSktBsring(routingParam.getSktBsring() != null ? Integer.parseInt(routingParam.getSktBsring()) : 0);
		routingVO.setSktRfptp(routingParam.getSktRfptp() != null ? Integer.parseInt(routingParam.getSktRfptp()) : 0);
		routingVO.setSktEtc(routingParam.getSktEtc() != null ? Integer.parseInt(routingParam.getSktEtc()) : 0);
		routingVO.setSkbRing(routingParam.getSkbRing() != null ? Integer.parseInt(routingParam.getSkbRing()) : 0);
		routingVO.setByCost(routingParam.getByCost());
		routingVO.setConCoreCount(routingParam.getConCoreCount());
		routingVO.setNewPpPrice(routingParam.getNewPpPrice());
		routingVO.setRoutingCount(routingParam.getRoutingCount());
		routingVO.setOrderRequired(routingParam.getOrderRequired());
		routingVO.setAllowOverlap(routingParam.getAllowOverlap());
		routingVO.setAvoidCoring(routingParam.getAvoidCoring());

		int buffer = propertiesService.getInt("buffer");
		routingVO.setBuffer(buffer);
		return routingVO;
	}

	private List<List<Double>> parseLineString(LineString ls) {
		List<List<Double>> gh = new ArrayList<List<Double>>();

		// geom
		Coordinate[] coordinates = ls.getCoordinates();
		for (Coordinate coordinate : coordinates) {
			List<Double> vert = new ArrayList<Double>();
			vert.add(coordinate.x);
			vert.add(coordinate.y);

			gh.add(vert);
		}
		return gh;
	}

	@RequestMapping(value = "/gis/findNearestEdge")
	public ModelAndView findNearestEdge(@RequestParam double x, @RequestParam double y) {

		int id = -1;
		try {
			Map<String, Object> result = routingService.findNearestEdge(x, y);
			id = (Integer) result.get("id");
			x = (Double) result.get("x");
			y = (Double) result.get("y");
		} catch (Exception e) {
			e.printStackTrace();
		}

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);

		modelAndView.addObject("id", id);
		modelAndView.addObject("x", x);
		modelAndView.addObject("y", y);

		return modelAndView;
	}

	@RequestMapping(value = "/gis/findNearestLine")
	public ModelAndView findNearestLine(@RequestParam double x, @RequestParam double y) {

		String wkt = null;
		int gid = -1;
		try {
			Map<String, Object> result = routingService.findNearestLine(x, y);
			gid = (Integer) result.get("gid");
			wkt = (String) result.get("wkt");
		} catch (Exception e) {
			e.printStackTrace();
		}

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);

		modelAndView.addObject("gid", gid);
		modelAndView.addObject("wkt", wkt);

		return modelAndView;
	}

	/**
	 * 
	 * 지도정보 검색 엑셀 다운로드 기능
	 * 
	 * @param 
	 * 		HttpServletRequest
	 * 		HttpServletResponse
	 * @return Excel 파일
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/pgRouting/downloadExcel")
	public void downloadExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String jsonFieldString = request.getParameter("jsonFieldString");
		String jsonDataString = request.getParameter("jsonDataString");
		String jsonNewLineFieldString = "";
		String jsonNewLineDataString = request.getParameter("jsonNewLineDataString");

		jsonNewLineFieldString = "[{\"field\":\"cableTypeName\", \"title\":\"케이블 종류\", \"width\":\"120\", \"align\":\"center\"}, {\"field\":\"measureDist\",\"title\":\"길이\", \"width\":\"120\", \"align\":\"center\"}, {\"field\":\"measureUnit\", \"title\":\"단위\", \"width\":\"50\", \"align\":\"center\"}]";

		// Start: 이미지 생성		
		String data = request.getParameter("data");

		/*
		 * 시큐어코딩점검보고서(2차)에 의한 코드 리팩토링
		 * 
		 * 널이 될 수 있는 레퍼런스(Reference)는 참조하기 전에 널 값인지를 검사하여 안전한 경우에만 사용한다
		 */
		data = (data == null) ? "" : data;

		ByteArrayOutputStream imgOutputStream = new ByteArrayOutputStream();

		try {
			data = URLDecoder.decode(data, "UTF-8");
			String contextPath = request.getRequestURL().substring(0, request.getRequestURL().indexOf(request.getRequestURI()));
			BufferedImage bi = saveMapService.createImages(data, contextPath);
			ImageIO.write(bi, "png", imgOutputStream);

			HSSFWorkbook excel = jsonConverterService.json2excelWithImage(jsonFieldString, jsonDataString, "추가 포설", jsonNewLineFieldString, jsonNewLineDataString, imgOutputStream, 9, 30);

			String fileName = "BIES" + (new Date()).getTime() + ".xls";

			if (request.getHeader("User-Agent").indexOf("MSIE 5.5") > -1) {
				response.setHeader("Content-Disposition", "filename=" + fileName + ";");
			} else {
				response.setContentType("application/vnd.ms-excel");
				response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ";");
			}

			excel.write(response.getOutputStream());

			response.getOutputStream().flush();
			response.getOutputStream().close();
		} catch (Exception e1) {
			log.error("Error File Download");
		} finally {
			if (imgOutputStream != null) {
				imgOutputStream.close();
			}
		}
		// Finish: 이미지 생성
	}
	
	
	private List<Map<String, Object>> kgetFeatures(RoutingVO routingVO) {
		List<Map<String, Object>> features = new ArrayList<Map<String, Object>>();

		try {
			List<RoutingVO> routes = kairosRoutingService.kairosroute(routingVO);

			for (RoutingVO route : routes) {
				if (route.getEdge() == -1) {
					break;
				}

				Map<String, Object> feature = new HashMap<String, Object>();

				feature.put("type", "Feature");
				feature.put("id", route.getEdge());
				feature.put("seq", route.getSeq() + 1);
				feature.put("caMgno", route.getCaMgno());
				feature.put("unqMgno", route.getUnqMgno());
				feature.put("fctsNm", route.getFctsNm());
				feature.put("cost", route.getbCost());
				feature.put("sysClf", route.getSysClf());
				feature.put("coreCnt", route.getCoreCnt());
				feature.put("compLen", route.getCompLen());

				String sTemp = "";

				if ("A".equals(route.getUngrLoc())) {
					sTemp = "가공";
				} else if ("D".equals(route.getUngrLoc())) {
					sTemp = "지중";
				} else if ("F".equals(route.getUngrLoc())) {
					sTemp = "FTTH";
				} else {
					sTemp = "기타";
				}

				feature.put("ungrLoc", sTemp);

				feature.put("useCoreC", route.getUseCoreC());
				feature.put("useCoreP", route.getUseCoreGrade()); //use_core_cnt / core_cnt * 100
				feature.put("sido", route.getLglCd());
				//feature.put("sgg", route.getSgg());
				//feature.put("emd", route.getEmd());

				feature.put("gisCode", route.getGisCode());

				Map<String, Object> prop = new HashMap<String, Object>();

				String wellKnownText = route.getGeom();
				GeometryFactory fac = new GeometryFactory();
				WKTReader wktReader = new WKTReader(fac);
				try {
					Geometry geom = wktReader.read(wellKnownText);
					if (geom instanceof LineString) {
						prop.put("type", "LineString");

						LineString ls = (LineString) geom;
						List<List<Double>> gh = parseLineString(ls);
						prop.put("coordinates", gh);

					} else if (geom instanceof MultiLineString) {
						prop.put("type", "MultiLineString");

						MultiLineString mls = (MultiLineString) geom;

						List<List<List<Double>>> coords = new ArrayList<List<List<Double>>>();

						int numGeometries = mls.getNumGeometries();
						for (int i = 0; i < numGeometries; i++) {
							LineString ls = (LineString) mls.getGeometryN(i);
							List<List<Double>> gh = parseLineString(ls);
							coords.add(gh);
						}

						prop.put("coordinates", coords);
					}
				} catch (ParseException e) {
					e.printStackTrace();
				}

				feature.put("geometry", prop);

				features.add(feature);
			}
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return features;
	}
	

	private List<Map<String, Object>> getFeatures(RoutingVO routingVO) {
		List<Map<String, Object>> features = new ArrayList<Map<String, Object>>();

		try {
			List<RoutingVO> routes = routingService.route(routingVO);

			for (RoutingVO route : routes) {
				if (route.getEdge() == -1) {
					break;
				}

				Map<String, Object> feature = new HashMap<String, Object>();

				feature.put("type", "Feature");
				feature.put("id", route.getEdge());
				feature.put("seq", route.getSeq() + 1);
				feature.put("caMgno", route.getCaMgno());
				feature.put("unqMgno", route.getUnqMgno());
				feature.put("fctsNm", route.getFctsNm());
				feature.put("cost", route.getbCost());
				feature.put("sysClf", route.getSysClf());
				feature.put("coreCnt", route.getCoreCnt());
				feature.put("compLen", route.getCompLen());

				String sTemp = "";

				if ("A".equals(route.getUngrLoc())) {
					sTemp = "가공";
				} else if ("D".equals(route.getUngrLoc())) {
					sTemp = "지중";
				} else if ("F".equals(route.getUngrLoc())) {
					sTemp = "FTTH";
				} else {
					sTemp = "기타";
				}

				feature.put("ungrLoc", sTemp);

				feature.put("useCoreC", route.getUseCoreC());
				feature.put("useCoreP", route.getUseCoreGrade()); //use_core_cnt / core_cnt * 100
				feature.put("sido", route.getLglCd());
				//feature.put("sgg", route.getSgg());
				//feature.put("emd", route.getEmd());

				feature.put("gisCode", route.getGisCode());

				Map<String, Object> prop = new HashMap<String, Object>();

				String wellKnownText = route.getGeom();
				GeometryFactory fac = new GeometryFactory();
				WKTReader wktReader = new WKTReader(fac);
				try {
					Geometry geom = wktReader.read(wellKnownText);
					if (geom instanceof LineString) {
						prop.put("type", "LineString");

						LineString ls = (LineString) geom;
						List<List<Double>> gh = parseLineString(ls);
						prop.put("coordinates", gh);

					} else if (geom instanceof MultiLineString) {
						prop.put("type", "MultiLineString");

						MultiLineString mls = (MultiLineString) geom;

						List<List<List<Double>>> coords = new ArrayList<List<List<Double>>>();

						int numGeometries = mls.getNumGeometries();
						for (int i = 0; i < numGeometries; i++) {
							LineString ls = (LineString) mls.getGeometryN(i);
							List<List<Double>> gh = parseLineString(ls);
							coords.add(gh);
						}

						prop.put("coordinates", coords);
					}
				} catch (ParseException e) {
					e.printStackTrace();
				}

				feature.put("geometry", prop);

				features.add(feature);
			}
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return features;
	}
}
