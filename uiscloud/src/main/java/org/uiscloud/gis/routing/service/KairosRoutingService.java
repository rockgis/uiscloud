package org.uiscloud.gis.routing.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.routing.web.TargetParam;

public interface KairosRoutingService {

	List<RoutingVO> kairosroute(RoutingVO routingVO) throws Exception;
	
	List<RoutingVO> kairosroutenode(String path_id) throws Exception;		
	
}
