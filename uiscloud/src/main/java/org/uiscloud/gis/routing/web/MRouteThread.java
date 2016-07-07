package org.uiscloud.gis.routing.web;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;

import org.uiscloud.gis.routing.service.EdgeVo;
import org.uiscloud.gis.routing.service.KroutingVO;
import org.uiscloud.gis.routing.service.RoutingService;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class MRouteThread implements Callable<MRouteThreadResult> {

	private RoutingService routingService;
	private KroutingVO kroutingVO;
	private Map<String, String> targetBldgMap = new HashMap<String, String>();
	private Map<String, List<String>> bldgTargetsMap = new HashMap<String, List<String>>();
	private Map<String, String> bldgWktMap = new HashMap<String, String>();

	/*
	 * key는 targetId 즉 pk;
	 */
	private Map<String, String> targetWktMap = new HashMap<String, String>();

	public MRouteThread(RoutingService routingService, KroutingVO kroutingVO) {
		this.routingService = routingService;
		this.kroutingVO = kroutingVO;
	}

	@Override
	public MRouteThreadResult call() throws Exception {

		List<String> notfounds = new LinkedList<String>();
		List<LinkedHashMap<String, Object>> last = new LinkedList<LinkedHashMap<String, Object>>();

		/*
		 * value는 target id 다 즉 pk;
		 */
		List<String> targetsToDelete = new LinkedList<String>();
		List<NotReachableDemand> notReachableDemands = new LinkedList<NotReachableDemand>();

		/*
		 * key는 bldgId + "::" + targetId 다 pk...
		 */
		LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>> featureCollectionOfTarget = new LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>>();

		// targets
		String targets = null;
		try {
			// find targets
			targets = findFinalTargets(targetsToDelete);

			System.out.println("targets : " + targets);

			// 검색할 대상이 없으면 중지한다.
			if (targets == null || targets.length() == 0) {
				return new MRouteThreadResult(notfounds, last, targetsToDelete, notReachableDemands);
			}

			/*
			 * 경로 검색 대상 target들을 모두 저장한다.
			 * client로 보낼 때  feature가 없으면
			 * 경로 검색에 실패한 것으로 간주한다.
			 */
			StringBuffer targetIds = new StringBuffer();
			String[] targetArr = targets.split(",");
			for (String target : targetArr) {
				String[] bt = target.split("::");

				try {
					if (bt != null && bt.length == 4) {

						String bldgId = bt[0];
						String targetId = bt[1];
						String bldgWkt = bt[2];
						String wkt = bt[3];

						featureCollectionOfTarget.put(bldgId + "::" + targetId, new LinkedList<LinkedHashMap<String, Object>>());

						// targetIds
						if (targetIds.toString().length() > 0) {
							targetIds.append(",");
						}
						targetIds.append(targetId);

						// TargetWktMap
						targetWktMap.put(targetId, wkt);

						// BldgWktMap
						bldgWktMap.put(bldgId, bldgWkt);

					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

			if (targetIds.toString().length() > 0) {
				kroutingVO.setTargets(targetIds.toString());

				/*
				 * 여러가지 검색 조건에 해당하는 target을 골라낸다.
				 */
				String availableTagets = routingService.filterTargets(kroutingVO);

				// 경로 검색할 target이 있으면 검색한다.
				if (availableTagets != null && availableTagets.trim().length() > 0) {

					System.out.println("Filtered : " + availableTagets.split(",").length + " / " + targetArr.length);

					// 유효한 target으로 검색한다.
					kroutingVO.setTargets(availableTagets);
					List<KroutingVO> routes = routingService.kroute(kroutingVO);
					for (KroutingVO route : routes) {
						if (route.getEdge() == -1) {
							continue;
						}

						String targetId = String.valueOf(route.getPath());
						String bldgId = targetBldgMap.get(targetId);

						if (!featureCollectionOfTarget.containsKey(bldgId + "::" + targetId)) {
							featureCollectionOfTarget.put(bldgId + "::" + targetId, new LinkedList<LinkedHashMap<String, Object>>());
						}

						LinkedList<LinkedHashMap<String, Object>> fc = featureCollectionOfTarget.get(bldgId + "::" + targetId);

						// add feature
						LinkedHashMap<String, Object> feature = parseFeature(bldgId, targetId, route.getGeom(), route, -1, -1, null, null);
						if (feature != null) {
							fc.add(feature);
						}
					}
				} else {
					// targets 이 없으면? TODO
				}
			}

		} catch (Exception e1) {
			e1.printStackTrace();
		}

		// client로 전송
		narrowShorestPathTargetByBildId(bldgTargetsMap, featureCollectionOfTarget, targetsToDelete);

		int seq = 0;
		String[] targetArr = targets.split(",");

		// 모든 하위국 주소를 가져온다.
		StringBuffer sb = new StringBuffer();
		for (String target : targetArr) {
			String[] bt = target.split("::");
			String demandId = (bt != null && bt.length > 0 ? bt[0] : "NaN");
			if (demandId != null && demandId.length() > 0) {

				if (sb.toString().length() > 0) {
					sb.append(",");
				}

				sb.append(demandId);
			}

		}

		List<Map<String, Object>> demandInfos = routingService.getDemandInfos(sb.toString());

		for (String target : targetArr) {
			String[] bt = target.split("::");
			String bldgId = bt[0];
			String targetId = bt[1];

			LinkedList<LinkedHashMap<String, Object>> features = featureCollectionOfTarget.get(bldgId + "::" + targetId);

			if (features != null && features.size() > 0) {
				LinkedHashMap<String, Object> results = new LinkedHashMap<String, Object>();

				results.put("seq", ++seq);
				results.put("target", target);

				// 속성
				double investmentCost = 0.0; // 투자비
				double rentCost = 0; // 임차비
				String startAddr = ""; // 상위국주소
				String endAddr = ""; // 하위국주소

				results.put("demandId", (bt != null && bt.length > 0 ? bt[0] : "NaN"));
				results.put("demandWkt", bldgWktMap.get(results.get("demandId")));
				results.put("targetId", (bt != null && bt.length > 1 ? bt[1] : "NaN"));
				results.put("targetWkt", targetWktMap.get(results.get("targetId")));

				calculateFC(results, features);

				// 투자비 계산식(임시) : 신설길이(한전루트길이합)*0.645 + (SKT케이블 수)*20
				investmentCost = ((Integer) results.get("totalLengthForKE")) * 0.645 + ((Integer) results.get("cableCountForSKT")) * 20;
				results.put("investmentCost", investmentCost);

				// 임차비 계산식(임시) : (SKB 케이블 길이합) * 0.063
				rentCost = ((Integer) results.get("totalLengthForSKB")) * 0.063;
				results.put("rentCost", rentCost);

				// 기존 타켓에서 수요지점까지 라인(신규포설)을 그린다.
				GeometryFactory fac = new GeometryFactory();
				WKTReader wktReader = new WKTReader(fac);
				com.vividsolutions.jts.geom.Point start = (Point) wktReader.read((String) results.get("targetWkt"));
				com.vividsolutions.jts.geom.Point end = (Point) wktReader.read((String) results.get("demandWkt"));

				String wkt = "LINESTRING (" + start.getX() + " " + start.getY() + ", " + end.getX() + " " + end.getY() + ")";
				LinkedHashMap<String, Object> newRoutingPath = parseFeature((String) results.get("demandId"), target, wkt, null, -1, -1, null, demandInfos);

				features.add(newRoutingPath);
				results.put("entranceLength", newRoutingPath.get("cost"));

				// feature collection				
				LinkedHashMap<String, Object> targetMap = new LinkedHashMap<String, Object>();
				targetMap.put("type", "FeatureCollection");
				targetMap.put("features", features);
				results.put("fc", targetMap);

				last.add(results);

			} else {
				if (!targetsToDelete.contains(target)) {
					notfounds.add(target);
				}
			}
		}

		// 수요에 경로가 하나도 없으면 모든 target을 삭제한다.
		Iterator<String> itr = bldgTargetsMap.keySet().iterator();
		while (itr.hasNext()) {
			String demandId = itr.next();
			List<String> targetsOfBldg = bldgTargetsMap.get(demandId);
			int size = targetsOfBldg.size();

			int emptyTargetCount = 0;
			for (String targetId : targetsOfBldg) {
				LinkedList<LinkedHashMap<String, Object>> features = featureCollectionOfTarget.get(demandId + "::" + targetId);

				if (features == null || features.size() == 0) {
					if (!targetsToDelete.contains(targetId)) {
						targetsToDelete.add(targetId);
					}

					emptyTargetCount++;
				}
			}

			if (size == emptyTargetCount) {
				NotReachableDemand notReachableDemand = new NotReachableDemand(demandId, bldgWktMap.containsKey(bldgWktMap) ? bldgWktMap.get(demandId) : "");
				if (!notReachableDemands.contains(notReachableDemand)) {
					notReachableDemands.add(notReachableDemand);
				}
			}
		}

		// return MRouteThreadResult
		return new MRouteThreadResult(notfounds, last, targetsToDelete, notReachableDemands);
	}

	/*
	 * Target의 소스란?
	 * 1. 상위국만 찍히고 하위국 vertex가 안 찍힌 경우
	 * 2. 사용자의 마우스로 임의로 vertex를 찍은 것
	 * 3. 엑셀 파일에 의해서 vertex가 아니라 수요가 들어온 경우
	 */
	private String findFinalTargets(List<String> targetsToDelete) {
		String targets = kroutingVO.getTargets();
		String demands = kroutingVO.getDemands();

		StringBuffer newTargets = new StringBuffer();

		/*
		 * 1. 상위국만 찍히고 하위국 vertex가 안 찍힌 경우
		 * 허브반경과 수요반경에 의해서 vertex를 찾는다.
		 */
		if ((demands == null || demands.length() == 0) && (targets == null || targets.length() == 0)) {

			/*
			 * 1. tcp_inbd_info 에서 hubmeters 로 수요를 찾는다.
			 * 2. gotc_ca_network_vertices_pgr 에서 수요를 기준으로 bldgMeters 안에 들어 있는 vertices를 찾는다.
			 * 
			 * 결과 모양은 다음과 같다
			 * 
			 * 수요ID::수요WKT::버텍스ID::버텍스WKT
			 * bldg.gid || '::' || bldg.wkt || '::' || df.id || '::' || df.the_geom
			 */
			String ts = findFinalTargetsBySource(kroutingVO.getX(), kroutingVO.getY(), kroutingVO.getHubMeters(), kroutingVO.getBldgMeters(), kroutingVO.getDemandWkt());
			newTargets.append(ts);

		}

		/*
		 * 2. 사용자의 마우스로 임의로 vertex를 찍은 것
		 * 여기에는 vertex id만 들어있다.
		 */
		if (targets != null && targets.length() > 0) {

			// target에 부가정보를 넣는다
			String[] targetArr = targets.split(",");
			for (String target : targetArr) {
				try {

					/*
					 * 현재 vertex에서 수요반경에 있는 모든 수요를 찾아야 한다.
					 * 그리고 나서 경로 검색한 후 cost가 젤 적은 경로를 찾아야 한다.
					 * 그런데 지금 같은 경우는 네트워크의 target이 잡혀버린 경우로
					 * cost를 계산해 봤자 결국 현재 vertext에서 젤 가까운 수요가 최종 cost가 가장 작게 된다.
					 * 그래서 여기서는 현재 vertex와 제일 가까운 수요를 찾는다.
					 */
					String newTarget = addNearestDemandInfo(target);
					if (newTarget != null) {
						if (newTargets.toString().length() > 0) {
							newTargets.append(",");
						}

						String[] bt = newTarget.split("::");
						if (bt != null && bt.length == 4) {
							String bldgId = bt[0];
							String targetId = bt[1];
							String bldgWkt = bt[2];
							String wkt = bt[3];

							bldgWktMap.put(bldgId, bldgWkt);

							targetBldgMap.put(targetId, bldgId);
						}

						newTargets.append(newTarget);
					}

				} catch (Exception e) {
					e.printStackTrace();
				}
				if (target == null) {
					continue;
				}
			}
		}

		/*
		 * 3. 엑셀 파일에 의해서 vertex가 아니라 수요가 들어온 경우
		 * 사용자가 임으로 찍은 targets와 합친다.
		 * 허브반경으로 수요를 찾고 나서 그 수요에 대해서 수요반경으로 vertex를 찾아야 하는데
		 * 여기서는 수요를 찾아버렸으므로 수요반경에 의한 vertex를 찾는다.
		 */
		if (demands == null) {
			return newTargets.toString();
		}
		String[] demandArr = demands.split(",");
		for (String demand : demandArr) {

			try {
				String[] bt = demand.split("::");
				if (bt != null && bt.length == 4) {
					String bldgId = bt[0];
					// String targetId = bt[1];
					String bldgWkt = bt[2];
					// String wkt = bt[3];

					bldgWktMap.put(bldgId, bldgWkt);

					List<String> bts = bldgTargetsMap.get(bldgId);
					if (bts == null) {
						bts = new ArrayList<String>();
						bldgTargetsMap.put(bldgId, bts);
					}
					bts = bldgTargetsMap.get(bldgId);

					/*
					 * 수요에 의한 vertex 목록을 뽑는다.
					 */
					kroutingVO.setBldgWkt(bldgWkt);
					List<EdgeVo> targetsByDemand = routingService.getTargetsByDemand(kroutingVO);
					for (EdgeVo ta : targetsByDemand) {
						/*
						 * bts는 수요에 대한 vertex id 목록이다. 단지 pk인 id만 들어간다.
						 */
						String targetId = String.valueOf(ta.getId());
						if (!bts.contains(targetId)) {
							bts.add(targetId);
						}

						// target
						if (newTargets.length() > 0) {
							newTargets.append(",");
						}

						String wkt = ta.getWellKnownText();
						String newTarget = bldgId + "::" + targetId + "::" + bldgWkt + "::" + wkt;
						newTargets.append(newTarget);

						// TODO
						targetBldgMap.put(targetId, bldgId);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return newTargets.toString();
	}

	private String addNearestDemandInfo(String target) throws Exception {
		KroutingVO routingVO = new KroutingVO();

		int targetInt = -1;
		try {
			targetInt = Integer.parseInt(target);
		} catch (NumberFormatException e) {
			return null;
		}
		routingVO.setTarget(targetInt);
		routingVO.setBldgMeters(kroutingVO.getBldgMeters());

		Map<String, EdgeVo> targetAndDemand = routingService.findTargetAndDemand(routingVO);

		// target
		EdgeVo demand = targetAndDemand.get("demand");
		if (demand == null) {
			return null;
		}

		int bldgId = demand.getGid();
		String bldgWkt = demand.getWellKnownText();

		// ta
		EdgeVo ta = targetAndDemand.get("target");
		if (ta == null) {
			return null;
		}

		int targetId = ta.getId();
		String wkt = ta.getWellKnownText();

		return bldgId + "::" + targetId + "::" + bldgWkt + "::" + wkt;
	}

	private void calculateFC(LinkedHashMap<String, Object> results, LinkedList<LinkedHashMap<String, Object>> features) {
		int totalLengthForKE = 0;
		int totalLengthForSKT = 0;
		int totalLengthForSKB = 0;
		int cableCountForSKT = 0;
		int remandCoreMin = Integer.MAX_VALUE;
		double useCoreRateMax = Double.MIN_VALUE;
		double totalCost = 0.0d;

		for (LinkedHashMap<String, Object> feature : features) {
			String sysClf = (String) feature.get("sysClf");
			if (sysClf == null) {
				continue;
			}

			int compLen = 0;
			try {
				compLen = Integer.parseInt(String.valueOf(feature.get("compLen")));
			} catch (Exception e) {
				//
			}

			int coreCnt = 0;
			try {
				coreCnt = Integer.parseInt(String.valueOf(feature.get("coreCnt")));
			} catch (Exception e) {
				//
			}

			int useCoreC = 0;
			try {
				useCoreC = Integer.parseInt(String.valueOf(feature.get("useCoreC")));
			} catch (Exception e) {
				//
			}

			// 신설(한전) 총길이
			if (sysClf.equals("KE")) {
				totalLengthForKE += compLen;
			} else {
				if (sysClf.equals("SK")) {
					// T 총길이
					totalLengthForSKT += compLen;

					// T 케이블수
					cableCountForSKT++;

				} else if (sysClf.equals("HT")) {
					// B 총길이
					totalLengthForSKB += compLen;
				}

				// 잔여코어 최소량
				if (remandCoreMin > (coreCnt - useCoreC)) {
					remandCoreMin = coreCnt - useCoreC;
				}
			}

			// 코어사용률 최대량
			if (coreCnt > 0) {
				if (useCoreRateMax < Math.ceil(useCoreC * 1.0 / coreCnt * 100)) {
					useCoreRateMax = Math.ceil(useCoreC * 1.0 / coreCnt * 100);
				}
			}

			// cost
			totalCost += (Double) feature.get("cost");
		}

		if (remandCoreMin == Integer.MAX_VALUE) {
			remandCoreMin = 0;
		}

		if (useCoreRateMax == Double.MIN_VALUE) {
			useCoreRateMax = 0;
		}

		results.put("totalCost", totalCost);
		results.put("totalLengthForKE", totalLengthForKE);
		results.put("totalLengthForSKT", totalLengthForSKT);
		results.put("totalLengthForSKB", totalLengthForSKB);
		results.put("cableCountForSKT", cableCountForSKT);
		results.put("cableCount", features == null ? 0 : features.size());
		results.put("remandCoreMin", remandCoreMin);
		results.put("useCoreRateMax", useCoreRateMax + " %");

	}

	private void narrowShorestPathTargetByBildId(Map<String, List<String>> bldgTargetsMap, LinkedHashMap<String, LinkedList<LinkedHashMap<String, Object>>> featureCollectionByTarget, List<String> targetsToDelete) {

		Iterator<String> bldgIds = bldgTargetsMap.keySet().iterator();
		while (bldgIds.hasNext()) {
			String bldgId = bldgIds.next();
			List<String> targetsOfBldgId = bldgTargetsMap.get(bldgId);

			List<Target> fcs = new LinkedList<Target>();
			for (String targetId : targetsOfBldgId) {
				LinkedList<LinkedHashMap<String, Object>> fc = featureCollectionByTarget.get(targetId);
				if (fc != null && fc.size() > 0) {
					double cost = calculateCost(fc);
					fcs.add(new Target(targetId, fc, cost));
				}
			}

			// sorts by cost
			Collections.sort(fcs, new Comparator<Target>() {

				@Override
				public int compare(Target fc1, Target fc2) {
					double cost1 = fc1.getCost();
					double cost2 = fc2.getCost();

					if (cost1 == cost2) {
						return 0;
					}

					if (cost1 < cost2) {
						return -1;
					}

					return 1;
				}

			});

			// i = 0만 남겨 놓고 i = 1 부터 모두 삭제한다.
			for (int i = 1; i < fcs.size(); i++) {
				Target target = fcs.get(i);

				targetsToDelete.add(bldgId + "::" + target.getTargetId());

				featureCollectionByTarget.remove(target.getTargetId());
			}
		}

		// TODO Auto-generated method stub

	}

	private double calculateCost(LinkedList<LinkedHashMap<String, Object>> fc) {
		double cost = 0;
		try {
			for (LinkedHashMap<String, Object> feature : fc) {
				cost += (Double) feature.get("cost");
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return cost;
	}

	private LinkedHashMap<String, Object> parseFeature(String bldgId, String targetId, String wellKnownText, KroutingVO route, double x, double y, String bldgWkt, List<Map<String, Object>> demandInfos) {
		LinkedHashMap<String, Object> feature = new LinkedHashMap<String, Object>();
		feature.put("type", "Feature");
		feature.put("bldgId", bldgId);
		feature.put("bldgWkt", bldgWkt);
		feature.put("id", targetId);

		if (route != null) {
			feature.put("caMgno", route.getCaMgno());
			feature.put("unqMgno", route.getUnqMgno());
			feature.put("fctsNm", route.getFctsNm());
			feature.put("bCost", route.getbCost()); // KRoute 는 feature.put("bCost", route.getbCost()); 를 쓸 수 없음 Line 685 참고
			feature.put("sysClf", route.getSysClf());
			feature.put("coreCnt", route.getCoreCnt());
			feature.put("compLen", route.getCompLen());

			String ungrLoc = (String) route.getUngrLoc();
			String sTemp = "";
			if ("A".equals(ungrLoc)) {
				sTemp = "가공";
			} else if ("D".equals(ungrLoc)) {
				sTemp = "지중";
			} else if ("F".equals(ungrLoc)) {
				sTemp = "FTTH";
			} else {
				sTemp = "기타";
			}

			feature.put("ungrLoc", sTemp);
			feature.put("useCoreC", route.getUseCoreC());
			feature.put("useCoreP", route.getUseCoreGrade()); //use_core_cnt / core_cnt * 100
			feature.put("sido", route.getLglCd());
		}

		// 하위국 주소 추가
		if (demandInfos != null) {
			for (Map<String, Object> demandInfo : demandInfos) {
				int gid = (Integer) demandInfo.get("gid");
				if (bldgId.equals(String.valueOf(gid))) {
					feature.put("sido", demandInfo.get("address"));
					feature.put("bdName", demandInfo.get("bd_name"));
					break;
				}
			}
		}

		LinkedHashMap<String, Object> prop = new LinkedHashMap<String, Object>();

		GeometryFactory fac = new GeometryFactory();
		WKTReader wktReader = new WKTReader(fac);
		try {
			Geometry geom = wktReader.read(wellKnownText);

			if (geom instanceof Point) {
				Point p = (Point) geom;

				if (p.getX() == x && p.getY() == y) {
					return null;
				}

				List<Double> gh = new ArrayList<Double>();
				gh.add(p.getX());
				gh.add(p.getY());

				prop.put("type", "Point");
				prop.put("coordinates", gh);

			} else if (geom instanceof LineString) {
				prop.put("type", "LineString");

				LineString ls = (LineString) geom;
				List<List<Double>> gh = parseLineString(ls);
				prop.put("coordinates", gh);

				feature.put("cost", ls.getLength());

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

				feature.put("cost", mls.getLength());
			}

		} catch (ParseException e) {
			e.printStackTrace();
		}

		feature.put("geometry", prop);

		return feature;
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

	private String findFinalTargetsBySource(double x, double y, double hubMeters, double bldgMeters, String demandWkt) {
		// LinkedList<LinkedHashMap<String, Object>> fc = new LinkedList<LinkedHashMap<String, Object>>();

		// LinkedList<String> demands = new LinkedList<String>();
		LinkedList<String> targets = new LinkedList<String>();

		TargetParam targetParam = new TargetParam();
		targetParam.setX(x);
		targetParam.setY(y);
		targetParam.setHubMeters(hubMeters * 1000);
		targetParam.setBldgMeters(bldgMeters);
		targetParam.setDemandWkt(demandWkt);

		/*
		 * 1. tcp_inbd_info 에서 hubmeters 로 수요를 찾는다.
		 * 2. gotc_ca_network_vertices_pgr 에서 수요를 기준으로 bldgMeters 안에 들어 있는 vertices를 찾는다.
		 */
		String results = null;
		try {
			results = routingService.findTargets(targetParam);
		} catch (Exception e) {
			e.printStackTrace();

			return null;
		}

		StringBuffer returnValue = new StringBuffer();

		String[] resultsArr = results.split(",");
		for (String result : resultsArr) {
			String[] items = result.split("::");
			if (items != null && items.length == 4) {
				String bldgId = items[0];
				String bldgWkt = items[1];
				String target = items[2];
				String wkt = items[3];

				targetBldgMap.put(target, bldgId);

				/*
				if (!demands.contains(bldgWkt)) {
					demands.add(bldgWkt);
				}
				*/

				if (!targets.contains(target)) {

					if (targets.size() > 0) {
						returnValue.append(",");
					}
					returnValue.append(bldgId);
					returnValue.append("::");
					returnValue.append(target);
					returnValue.append("::");
					returnValue.append(bldgWkt);
					returnValue.append("::");
					returnValue.append(wkt);

					/*
					LinkedHashMap<String, Object> feature = parseFeature(bldgId, target, wkt, null, x, y, bldgWkt);
					if (feature != null) {
						fc.add(feature);
					}
					*/

					targets.add(target);
				}
			}
		}

		/*
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setView(jacksonJsonView);
		modelAndView.addObject("results", fc);
		modelAndView.addObject("demands", demands);
		
		System.out.println("fc : " + fc.size());
		*/

		return returnValue.toString();
	}

}
