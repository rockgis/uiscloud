package org.uiscloud.gis.routing.web;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.JsonConverterService;
import org.uiscloud.gis.mapsv.service.SaveMapService;
import org.uiscloud.gis.routing.service.KroutingVO;
import org.uiscloud.gis.routing.service.RoutingService;
import org.uiscloud.gis.routing.service.RoutingVO;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

import egovframework.rte.fdl.property.impl.EgovPropertyServiceImpl;

@Controller
public class KroutingController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	@Resource
	private RoutingService routingService;

	@Resource(name = "propertiesService")
	private EgovPropertyServiceImpl propertiesService;

	/** jsonConverterService */
	@Resource(name = "jsonConverterService")
	private JsonConverterService jsonConverterService;

	/** SaveMapService */
	@Resource(name = "saveMapService")
	SaveMapService saveMapService;

	@RequestMapping(value = "/gis/krouting")
	public ModelAndView route(RoutingParam routingParam) {

		List<String> notfounds = new LinkedList<String>();
		List<LinkedHashMap<String, Object>> last = new LinkedList<LinkedHashMap<String, Object>>();

		KroutingVO routingVO = setRoutingVO(routingParam);

		findLastAndNotFounds(last, notfounds, routingVO, routingParam.getSource(), routingParam.getTargets());

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);
		modelAndView.addObject("results", last);
		modelAndView.addObject("notfounds", notfounds);

		return modelAndView;
	}

	private void findLastAndNotFounds(List<LinkedHashMap<String, Object>> last, List<String> notfounds, KroutingVO kroutingVO, String source, String targets) {
		// calculate routing
		LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>> featureColectionByTarget = new LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>>();
		try {
			String[] targetArr = targets.split(",");

			for (String target : targetArr) {
				// for json
				featureColectionByTarget.put(target, new LinkedList<LinkedHashMap<String, Object>>());
			}

			// filter targets
			String availableTagets = routingService.filterTargets(kroutingVO);

			// 경로 검색할 target이 있으면 검색한다.
			if (availableTagets != null && availableTagets.trim().length() > 0) {

				// 유효한 target으로 검색한다.
				kroutingVO.setTargets(availableTagets);
				List<KroutingVO> routes = routingService.kroute(kroutingVO);
				if (targets != null) {
					for (KroutingVO route : routes) {
						if (route.getEdge() == -1) {
							continue;
						}

						String target = String.valueOf(route.getPath());

						if (!featureColectionByTarget.containsKey(target)) {
							featureColectionByTarget.put(target, new LinkedList<LinkedHashMap<String, Object>>());
						}

						List<LinkedHashMap<String, Object>> fc = featureColectionByTarget.get(target);

						LinkedHashMap<String, Object> feature = new LinkedHashMap<String, Object>();
						feature.put("type", "Feature");
						feature.put("id", route.getEdge());
						feature.put("seq", fc.size() + 1);
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

						LinkedHashMap<String, Object> prop = new LinkedHashMap<String, Object>();

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

								List<List<List<Double>>> coords = new ArrayList<List<List<Double>>>();

								MultiLineString mls = (MultiLineString) geom;
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

						fc.add(feature);
					}
				}
			}

		} catch (Exception e1) {
			e1.printStackTrace();
		}

		int seq = 0;
		Iterator<String> itr = featureColectionByTarget.keySet().iterator();
		while (itr.hasNext()) {
			String target = itr.next();
			LinkedList<LinkedHashMap<String, Object>> features = featureColectionByTarget.get(target);

			if (features != null && features.size() > 0) {
				LinkedHashMap<String, Object> results = new LinkedHashMap<String, Object>();
				LinkedHashMap<String, Object> targetMap = new LinkedHashMap<String, Object>();
				targetMap.put("type", "FeatureCollection");
				targetMap.put("features", features);

				results.put("seq", ++seq);
				results.put("target", target);
				results.put("fc", targetMap);

				last.add(results);
			} else {
				notfounds.add(target);
			}
		}
	}

	private void findLastAndNotFoundsOld(List<LinkedHashMap<String, Object>> last, List<String> notfounds, RoutingVO routingVO, String source, String targets) {
		// calculate routing
		LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>> featureColectionByTarget = new LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>>();
		try {

			List<Future<List<KroutingVO>>> results = new LinkedList<Future<List<KroutingVO>>>();
			ExecutorService executor = Executors.newFixedThreadPool(20);

			String[] targetArr = targets.split(",");

			for (String target : targetArr) {
				KroutingVO kroutingVO = makeVO(routingVO, source, target);

				Callable<List<KroutingVO>> worker = new RouteThread(routingService, kroutingVO);
				Future<List<KroutingVO>> future = executor.submit(worker);
				results.add(future);

				// for json
				featureColectionByTarget.put(target, new LinkedList<LinkedHashMap<String, Object>>());
			}

			for (Future<List<KroutingVO>> future : results) {
				List<KroutingVO> routes = future.get();
				for (KroutingVO route : routes) {
					if (route.getEdge() == -1) {
						continue;
					}

					String target = String.valueOf(route.getPath());

					if (!featureColectionByTarget.containsKey(target)) {
						featureColectionByTarget.put(target, new LinkedList<LinkedHashMap<String, Object>>());
					}

					List<LinkedHashMap<String, Object>> fc = featureColectionByTarget.get(target);

					LinkedHashMap<String, Object> feature = new LinkedHashMap<String, Object>();
					feature.put("type", "Feature");
					feature.put("id", route.getEdge());
					feature.put("seq", fc.size() + 1);
					feature.put("caMgno", route.getCaMgno());
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

					LinkedHashMap<String, Object> prop = new LinkedHashMap<String, Object>();

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

							List<List<List<Double>>> coords = new ArrayList<List<List<Double>>>();

							MultiLineString mls = (MultiLineString) geom;
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

					fc.add(feature);
				}

			}

		} catch (Exception e1) {
			e1.printStackTrace();
		}

		int seq = 0;
		Iterator<String> itr = featureColectionByTarget.keySet().iterator();
		while (itr.hasNext()) {
			String target = itr.next();
			LinkedList<LinkedHashMap<String, Object>> features = featureColectionByTarget.get(target);

			if (features != null && features.size() > 0) {
				LinkedHashMap<String, Object> results = new LinkedHashMap<String, Object>();
				LinkedHashMap<String, Object> targetMap = new LinkedHashMap<String, Object>();
				targetMap.put("type", "FeatureCollection");
				targetMap.put("features", features);

				results.put("seq", ++seq);
				results.put("target", target);
				results.put("fc", targetMap);

				last.add(results);
			} else {
				notfounds.add(target);
			}
		}
	}

	private KroutingVO setRoutingVO(RoutingParam routingParam) {
		KroutingVO routingVO = new KroutingVO();
		routingVO.setSource(routingParam.getSource());
		routingVO.setTargets(routingParam.getTargets());

		String nonStopOverPoints = routingParam.getNonStopOverPoints();
		if (nonStopOverPoints != null && nonStopOverPoints.trim().length() > 0) {
			routingVO.setNonStopOverPoints(nonStopOverPoints);
		}

		String nonStopOverLines = routingParam.getNonStopOverLines();
		if (nonStopOverLines != null && nonStopOverLines.trim().length() > 0) {
			routingVO.setNonStopOverLines(nonStopOverLines);
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

		int buffer = propertiesService.getInt("buffer");
		routingVO.setBuffer(buffer);
		return routingVO;
	}

	private KroutingVO makeVO(RoutingVO routingVO, String source, String target) {
		KroutingVO kroutingVO = new KroutingVO();
		kroutingVO.setSource(source);
		kroutingVO.setTargets(target);

		kroutingVO.setBbox(routingVO.getBbox());
		kroutingVO.setCapacity(routingVO.getCapacity());
		kroutingVO.setRemainCapacity(routingVO.getRemainCapacity());
		kroutingVO.setConnectingPointCount(routingVO.getConnectingPointCount());
		kroutingVO.setUngrLocsArr(routingVO.getUngrLocsArr());
		kroutingVO.setGisCodesArr(routingVO.getGisCodesArr());
		kroutingVO.setSysClf(routingVO.getSysClf());
		kroutingVO.setCoreCount(routingVO.getCoreCount());
		kroutingVO.setNetClfsArr(routingVO.getNetClfsArr());
		kroutingVO.setBuffer(routingVO.getBuffer());

		return kroutingVO;
	}

	public ModelAndView routeOld(@RequestParam String source, @RequestParam String targets, @RequestParam(required = false) String capacity, @RequestParam(required = false) String connectingPointCount, @RequestParam(required = false) String ungrLocs, @RequestParam(required = false) String gisCodes,
			@RequestParam(required = false) String sysClf, @RequestParam(required = false) String coreCount, @RequestParam(required = false) String netClfs, @RequestParam(required = false) String bbox) {
		KroutingVO routingVO = new KroutingVO();
		routingVO.setSource(source);
		routingVO.setTargets(targets);

		if (bbox != null && bbox.trim().length() > 0) {
			routingVO.setBbox(bbox);
		}

		routingVO.setCapacity(capacity);
		routingVO.setConnectingPointCount(connectingPointCount);

		if (ungrLocs != null && ungrLocs.trim().length() > 0) {
			String[] ungrLocsArr = ungrLocs.split(",");
			routingVO.setUngrLocsArr(ungrLocsArr);
		}

		if (gisCodes != null && gisCodes.trim().length() > 0) {
			String[] gisCodesArr = gisCodes.split(",");
			routingVO.setGisCodesArr(gisCodesArr);
		}

		routingVO.setCoreCount(coreCount);

		if (netClfs != null && netClfs.trim().length() > 0) {
			String[] netClfsArr = netClfs.split(",");
			routingVO.setNetClfsArr(netClfsArr);
		}

		int buffer = propertiesService.getInt("buffer");
		routingVO.setBuffer(buffer);

		// calculate routing
		LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>> featureColectionByTarget = new LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>>();
		try {
			String availableTagets = routingService.filterTargets(routingVO);
			availableTagets = availableTagets.replaceAll("\\{", "");
			availableTagets = availableTagets.replaceAll("\\}", "");
			routingVO.setTargets(availableTagets);
			List<KroutingVO> routes = routingService.kroute(routingVO);
			if (targets != null) {
				for (String target : targets.split(",")) {
					featureColectionByTarget.put(target, new LinkedList<LinkedHashMap<String, Object>>());
				}

				for (KroutingVO route : routes) {
					if (route.getEdge() == -1) {
						continue;
					}

					String target = String.valueOf(route.getPath());

					if (!featureColectionByTarget.containsKey(target)) {
						featureColectionByTarget.put(target, new LinkedList<LinkedHashMap<String, Object>>());
					}

					List<LinkedHashMap<String, Object>> fc = featureColectionByTarget.get(target);

					LinkedHashMap<String, Object> feature = new LinkedHashMap<String, Object>();
					feature.put("type", "Feature");
					feature.put("id", route.getEdge());
					feature.put("seq", fc.size() + 1);
					feature.put("caMgno", route.getCaMgno());
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

					LinkedHashMap<String, Object> prop = new LinkedHashMap<String, Object>();

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

							List<List<List<Double>>> coords = new ArrayList<List<List<Double>>>();

							MultiLineString mls = (MultiLineString) geom;
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

					fc.add(feature);
				}
			}

		} catch (Exception e1) {
			e1.printStackTrace();
		}

		int seq = 0;
		List<LinkedHashMap<String, Object>> last = new LinkedList<LinkedHashMap<String, Object>>();
		Iterator<String> itr = featureColectionByTarget.keySet().iterator();
		while (itr.hasNext()) {
			String target = itr.next();
			LinkedList<LinkedHashMap<String, Object>> features = featureColectionByTarget.get(target);

			LinkedHashMap<String, Object> results = new LinkedHashMap<String, Object>();
			LinkedHashMap<String, Object> targetMap = new LinkedHashMap<String, Object>();
			targetMap.put("type", "FeatureCollection");
			targetMap.put("features", features);

			results.put("seq", ++seq);
			results.put("target", target);
			results.put("fc", targetMap);

			last.add(results);
		}

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);
		modelAndView.addObject("results", last);

		return modelAndView;
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

	@RequestMapping(value = "/gis/krouting/detailPath")
	public String detailPath(Model model, @RequestParam String data) {
		model.addAttribute("path", data);

		return "/gis/krouting/detailPath";
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
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/gis/krouting/DownloadExcelDelte")
	public void searchDownloadExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String jsonFieldString = request.getParameter("jsonFieldString");
		String jsonDataString = "";

		String source = request.getParameter("source");
		String targets = request.getParameter("targets");
		String capacity = request.getParameter("capacity");
		String remainCapacity = request.getParameter("remainCapacity");
		String connectingPointCount = request.getParameter("connectingPointCount");
		String ungrLocs = request.getParameter("ungrLocs");
		String gisCodes = request.getParameter("gisCodes");
		String sysClf = request.getParameter("sysClf");
		String coreCount = request.getParameter("coreCount");
		// String netClfs = request.getParameter("netClfs");
		String bbox = request.getParameter("bbox");
		// String stopOverPoints = request.getParameter("stopOverPoints");
		// String stopOverLines = request.getParameter("stopOverLines");
		String nonStopOverPoints = request.getParameter("nonStopOverPoints");
		String nonStopOverLines = request.getParameter("nonStopOverLines");

		String newLineDataString = request.getParameter("newLines");

		List<String> notfounds = new LinkedList<String>();
		List<LinkedHashMap<String, Object>> last = new LinkedList<LinkedHashMap<String, Object>>();

		// create pojo
		RoutingParam routingParam = new RoutingParam();
		routingParam.setSource(source);
		routingParam.setTargets(targets);
		routingParam.setNonStopOverPoints(nonStopOverPoints);
		routingParam.setNonStopOverLines(nonStopOverLines);
		routingParam.setCapacity(capacity);
		routingParam.setRemainCapacity(remainCapacity);
		routingParam.setConnectingPointCount(connectingPointCount);
		routingParam.setUngrLocs(ungrLocs);
		routingParam.setGisCodes(gisCodes);
		routingParam.setSysClf(sysClf);
		routingParam.setCoreCount(coreCount);
		routingParam.setBbox(bbox);
		
		KroutingVO routingVO = setRoutingVO(routingParam);

		findLastAndNotFounds(last, notfounds, routingVO, source, targets);

		ObjectMapper om = new ObjectMapper();
		/* 시도시군수 수정*/
		//jsonFieldString = "[{\"field\":\"seq\", \"title\":\"순번\", \"width\":\"50\", \"align\":\"center\"}, {\"field\":\"caMgno\",\"title\":\"관리번호\", \"width\":\"120\", \"align\":\"center\"}, {\"field\":\"sysClf\", \"title\":\"TB\", \"width\":\"50\", \"align\":\"center\"}, {\"field\":\"coreCnt\",\"title\":\"코어용량\", \"width\":\"100\", \"align\":\"center\"}, {\"field\":\"compLen\",\"title\":\"길이\", \"width\":\"150\", \"align\":\"right\"}, {\"field\":\"ungrLoc\",\"title\":\"가공/지중\", \"width\":\"100\", \"align\":\"center\"}, {\"field\":\"useCoreC\",\"title\":\"사용코어수\", \"width\":\"100\", \"align\":\"center\"}, {\"field\":\"useCoreP\",\"title\":\"코어사용률\", \"width\":\"100\", \"align\":\"center\"}, {\"field\":\"sido\",\"title\":\"시도\", \"width\":\"100\", \"align\":\"center\"}, {\"field\":\"sgg\",\"title\":\"시군구\", \"width\":\"100\", \"align\":\"center\"}, {\"field\":\"emd\",\"title\":\"읍면동\", \"width\":\"100\", \"align\":\"center\"}]";

		jsonFieldString = "[{\"field\":\"seq\", \"title\":\"순번\", \"width\":\"50\", \"align\":\"center\"}, {\"field\":\"target\",\"title\":\"target\", \"width\":\"120\", \"align\":\"center\"}, {\"field\":\"foo\", \"title\":\"케이블수\", \"width\":\"50\", \"align\":\"center\"}, {\"field\":\"bar\",\"title\":\"도착지 시설물고유관리번호\", \"width\":\"200\", \"align\":\"center\"}, {\"field\":\"temp\",\"title\":\"도착지 주소\", \"width\":\"150\", \"align\":\"right\"}]";

		List<Map<String, Object>> jds = new ArrayList<Map<String, Object>>();

		for (LinkedHashMap<String, Object> results : last) {
			Map<String, Object> tmp = new LinkedHashMap<String, Object>();

			LinkedHashMap<String, Object> targetMap = (LinkedHashMap<String, Object>) results.get("fc");

			LinkedList<LinkedHashMap<String, Object>> features = (LinkedList<LinkedHashMap<String, Object>>) targetMap.get("features");

			Integer size = features.size();

			tmp.put("seq", (Integer) results.get("seq"));
			tmp.put("target", (String) results.get("target"));
			tmp.put("foo", size);
			tmp.put("bar", features.get(size - 1).get("caMgno"));
			tmp.put("temp", features.get(size - 1).get("sido"));

			jds.add(tmp);
		}

		jsonDataString = om.writeValueAsString(jds);

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

			String newLineFieldString = "[{&#38;quot;field&#38;quot;:&#38;quot;cableTypeName&#38;quot;, &#38;quot;title&#38;quot;:&#38;quot;케이블 종류&#38;quot;, &#38;quot;width&#38;quot;:&#38;quot;120&#38;quot;, &#38;quot;align&#38;quot;:&#38;quot;center&#38;quot;}, {&#38;quot;field&#38;quot;:&#38;quot;measureDist&#38;quot;,&#38;quot;title&#38;quot;:&#38;quot;길이&#38;quot;, &#38;quot;width&#38;quot;:&#38;quot;120&#38;quot;, &#38;quot;align&#38;quot;:&#38;quot;center&#38;quot;}, {&#38;quot;field&#38;quot;:&#38;quot;measureUnit&#38;quot;, &#38;quot;title&#38;quot;:&#38;quot;단위&#38;quot;, &#38;quot;width&#38;quot;:&#38;quot;50&#38;quot;, &#38;quot;align&#38;quot;:&#38;quot;center&#38;quot;}]";

			HSSFWorkbook excel = jsonConverterService.json2excelWithImage(jsonFieldString, jsonDataString, "추가 포설", newLineFieldString, newLineDataString, imgOutputStream, 9, 30);

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
	@RequestMapping(value = "/gis/krouting/downloadExcel")
	public void downloadExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String jsonFieldString = request.getParameter("jsonFieldString");
		String jsonDataString = request.getParameter("jsonDataString");
		String jsonStatisticsFieldString = request.getParameter("jsonStatisticsFieldString");
		String jsonStatisticsDataString = request.getParameter("jsonStatisticsDataString");
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

			HSSFWorkbook excel = jsonConverterService.json2excelWithImage(
					jsonFieldString
					, jsonDataString
					, jsonStatisticsFieldString
					, jsonStatisticsDataString
					, "추가 포설"
					, jsonNewLineFieldString
					, jsonNewLineDataString
					, imgOutputStream
					, 9, 30);

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
}