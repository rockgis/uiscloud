package org.uiscloud.gis.routing.web;

import java.util.List;
import java.util.concurrent.Callable;

import org.uiscloud.gis.routing.service.KroutingVO;
import org.uiscloud.gis.routing.service.RoutingService;

public class RouteThread implements Callable<List<KroutingVO>> {

	private RoutingService routingService;
	private KroutingVO kroutingVO;

	public RouteThread(RoutingService routingService, KroutingVO kroutingVO) {
		this.routingService = routingService;
		this.kroutingVO = kroutingVO;
	}

	@Override
	public List<KroutingVO> call() throws Exception {
		return routingService.kroute(kroutingVO);
	}
}
