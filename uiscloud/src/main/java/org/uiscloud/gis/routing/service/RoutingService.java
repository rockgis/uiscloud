package org.uiscloud.gis.routing.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.routing.web.TargetParam;

public interface RoutingService {

	List<RoutingVO> route(RoutingVO routingVO) throws Exception;

	EdgeVo findNearestEdge(RoutingVO routingVO) throws Exception;

	List<KroutingVO> kroute(KroutingVO routingVO) throws Exception;

	List<AroutingVO> aroute(AroutingVO routingVO) throws Exception;

	String filterTargets(KroutingVO routingVO) throws Exception;

	String findTargets(TargetParam targetParam) throws Exception;

	Map<String, Object> findNearestEdge(double x, double y) throws Exception;

	String getLglWkt(KroutingVO routingVO) throws Exception;

	Map<String, Object> findNearestLine(double x, double y) throws Exception;

	Map<String, EdgeVo> findSourceAndTarget(KroutingVO routingVO) throws Exception;

	List<Map<String, Object>> getDemandInfos(String string) throws Exception;

	Map<String, EdgeVo> findTargetAndDemand(KroutingVO routingVO) throws Exception;

	List<EdgeVo> getTargetsByDemand(KroutingVO kroutingVO) throws Exception;
}
