package org.uiscloud.gis.routing.web;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.JsonConverterService;
import org.uiscloud.gis.mapsv.service.SaveMapService;
import org.uiscloud.gis.routing.service.EdgeVo;
import org.uiscloud.gis.routing.service.KroutingVO;
import org.uiscloud.gis.routing.service.RoutingService;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

import egovframework.rte.fdl.property.impl.EgovPropertyServiceImpl;

@Controller
public class MroutingController {
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

	@RequestMapping(value = "/gis/mrouting")
	public ModelAndView route(RoutingParam routingParam) {

		// List<String> notfounds = new LinkedList<String>();
		Map<String, LinkedHashMap<String, Object>> last = new LinkedHashMap<String, LinkedHashMap<String, Object>>();
		List<String> targetsToDelete = new LinkedList<String>();
		List<NotReachableDemand> notReachableBldg = new LinkedList<NotReachableDemand>();

		try {

			// 상위국별로 kdijkstra 검색을 한다.
			List<Future<MRouteThreadResult>> results = new LinkedList<Future<MRouteThreadResult>>();
			ExecutorService executor = Executors.newFixedThreadPool(20);

			/*
			 * 상위국이 있을 때는 상위국을 기준으로 경로 검색을 하지만
			 * 상위국이 없을 때는 하위국 개별적으로 가장 가까운 상위국을 찾아서 경로 검색을 한다.
			 */
			String sourcePoints = routingParam.getSourcePoints();
			if (sourcePoints != null && sourcePoints.length() > 0) {
				routeBySource(routingParam, results, executor);
			} else {
				routeByTarget(routingParam, results, executor);
			}

			/*
			 * 결과들을 모두 기다린 후 처리한다.
			 */
			for (Future<MRouteThreadResult> future : results) {
				MRouteThreadResult mRouteThreadResult = future.get();
				addLast(mRouteThreadResult.getLast(), last);
			}

			for (Future<MRouteThreadResult> future : results) {
				MRouteThreadResult mRouteThreadResult = future.get();
				addNotReachableBldg(mRouteThreadResult.getNotReachableBldg(), notReachableBldg, last);
			}

			for (Future<MRouteThreadResult> future : results) {
				MRouteThreadResult mRouteThreadResult = future.get();
				targetsToDelete.addAll(mRouteThreadResult.getTargetsToDelete());
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);
		modelAndView.addObject("results", last.values());
		// modelAndView.addObject("notfounds", notfounds);
		modelAndView.addObject("targetsToDelete", targetsToDelete);
		modelAndView.addObject("notReachableBldg", notReachableBldg);

		return modelAndView;
	}

	public void routeBySource(RoutingParam routingParam, List<Future<MRouteThreadResult>> results, ExecutorService executor) throws ParseException {
		String[] sourcePointsArr = routingParam.getSourcePoints().split(",");
		String[] bboxWkts = routingParam.getBboxes().split("_BBOX_");
		String[] sources = routingParam.getSource().split(",");

		/*
		 * 상위국을 기준으로 모든 하위국과 경로를 검색한다.
		 * 모든 Thread가 끝나고 나면 cost에 따라 경로를 선택하게 된다.
		 */
		int idx = 0;
		for (String sourcePoint : sourcePointsArr) {
			String bbox = bboxWkts[idx];
			String source = sources[idx];
			String[] sourcePointArr = sourcePoint.split("::");
			String sourcePointWkt = sourcePointArr[0];
			String isFromExcel = sourcePointArr[1];

			GeometryFactory fac = new GeometryFactory();
			WKTReader wktReader = new WKTReader(fac);
			com.vividsolutions.jts.geom.Point center = (Point) wktReader.read(sourcePointWkt);

			routingParam.setSource(source);

			/*
			 * 엑셀로 부터 온 상위국은 허브반경에 영향을 받지 않고
			 * 임으로 상위국을 찍었을 때만 허브반경에 영향을 받는다.
			 * 이게 아니잖아$$$$$
			 * 수요는 허브반경으로 찾는 것이다
			 * 이 bbox는 단순히 속도를 올리기 위한 것으로 쓰일 뿐이다 흐
			 */
			/*
			if("N".equals(isFromExcel)) {
				routingParam.setBbox(bbox);
			}
			*/

			routingParam.setX(center.getX());
			routingParam.setY(center.getY());

			// thread
			KroutingVO routingVO = setRoutingVO(routingParam);

			Callable<MRouteThreadResult> worker = new MRouteThread(routingService, routingVO);
			Future<MRouteThreadResult> future = executor.submit(worker);
			results.add(future);

			idx++;
		}
	}

	public void routeByTarget(RoutingParam routingParam, List<Future<MRouteThreadResult>> results, ExecutorService executor) throws ParseException {

		// TODO
		String[] targets = routingParam.getTargets().split(",");
		String[] bboxWkts = routingParam.getBboxes().split("_BBOX_");
		int idx = 0;
		for (String newTarget : targets) {
			String bbox = bboxWkts[idx];

			System.out.println("newTarget : " + newTarget);

			KroutingVO routingVO = setRoutingVO(routingParam);
			routingVO.setTarget(Integer.parseInt(newTarget));

			try {
				Map<String, EdgeVo> sourceAndTarget = routingService.findSourceAndTarget(routingVO);
				if (sourceAndTarget == null) {
					continue;
				}

				EdgeVo source = sourceAndTarget.get("source");
				if (source == null) {
					continue;
				}

				EdgeVo demand = sourceAndTarget.get("demand");
				if (demand == null) {
					continue;
				}

				EdgeVo ta = sourceAndTarget.get("target");
				if (ta == null) {
					continue;
				}

				// source
				routingVO.setSource(String.valueOf(source.getId()));

				GeometryFactory fac = new GeometryFactory();
				WKTReader wktReader = new WKTReader(fac);
				try {
					Geometry geom = wktReader.read(source.getWellKnownText());
					if (geom instanceof Point) {
						Point point = (Point) geom;
						double x = point.getX();
						double y = point.getY();

						routingParam.setX(x);
						routingParam.setY(y);
					}
				} catch (Exception e) {

				}

				// demand
				int bldgId = demand.getGid();
				String bldgWkt = demand.getWellKnownText();

				// ta
				int targetId = ta.getId();
				String wkt = ta.getWellKnownText();

				String target = bldgId + "::" + targetId + "::" + bldgWkt + "::" + wkt;

				routingVO.setTargets(target);

				// thread
				Callable<MRouteThreadResult> worker = new MRouteThread(routingService, routingVO);
				Future<MRouteThreadResult> future = executor.submit(worker);
				results.add(future);

				idx++;

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	private void addNotReachableBldg(List<NotReachableDemand> result, List<NotReachableDemand> notReachableBldg, Map<String, LinkedHashMap<String, Object>> last) {
		for (NotReachableDemand notReachableDemand : result) {
			if (!last.containsKey(notReachableDemand.getDemandId())) {
				notReachableBldg.add(notReachableDemand);
			}
		}
	}

	private void addLast(List<LinkedHashMap<String, Object>> result, Map<String, LinkedHashMap<String, Object>> last) {
		for (LinkedHashMap<String, Object> re : result) {
			String demandId = (String) re.get("demandId");
			if (last.containsKey(demandId)) {
				last.put(demandId, selectByLowCost(last, demandId, re));
			} else {
				last.put(demandId, re);
			}
		}
	}

	private LinkedHashMap<String, Object> selectByLowCost(Map<String, LinkedHashMap<String, Object>> last, String demandId, LinkedHashMap<String, Object> re) {
		LinkedHashMap<String, Object> pre = last.get(demandId);
		double preCost = (Double) pre.get("totalCost");
		double reCost = (Double) re.get("totalCost");

		return reCost < preCost ? re : pre;
	}

	private KroutingVO setRoutingVO(RoutingParam routingParam) {
		KroutingVO routingVO = new KroutingVO();

		routingVO.setX(routingParam.getX());
		routingVO.setY(routingParam.getY());
		routingVO.setSource(routingParam.getSource());
		routingVO.setTargets(routingParam.getTargets());
		routingVO.setDemands(routingParam.getDemands());
		routingVO.setHubMeters(routingParam.getHubMeters());
		routingVO.setBldgMeters(routingParam.getBldgMeters());

		String polyWkt = routingParam.getPolyWkt();
		if (polyWkt != null && polyWkt.trim().length() > 0) {
			routingVO.setPolyWkt(polyWkt);
		}

		String bbox = routingParam.getBbox();
		if (bbox != null && bbox.trim().length() > 0) {
			routingVO.setBbox(bbox);
		}

		String lglCd = routingParam.getLglCd();
		if (lglCd != null && lglCd.trim().length() > 0) {
			routingVO.setLglCd(lglCd);

			int length = lglCd.length();

			// 시도
			if (length == 2) {
				routingVO.setLglCdType("sido");
			}

			// 구군
			else if (length == 5) {
				routingVO.setLglCdType("sgg");
			}

			// 읍/면/동
			else if (length == 10) {
				routingVO.setLglCdType("lgld");
			}

			try {
				routingVO.setLglCdWkt(routingService.getLglWkt(routingVO));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		// demandWkt
		polyWkt = routingVO.getPolyWkt();
		String lglCdWkt = routingVO.getLglCdWkt();
		if (polyWkt != null && polyWkt.trim().length() > 0) {
			routingVO.setDemandWkt(polyWkt);
		} else if (lglCdWkt != null && lglCdWkt.trim().length() > 0) {
			routingVO.setDemandWkt(lglCdWkt);
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

}