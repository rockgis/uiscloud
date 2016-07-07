package org.uiscloud.gis.routing.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.uiscloud.gis.routing.service.KairosRoutingService;
import org.uiscloud.gis.routing.service.RoutingVO;

import egovframework.rte.fdl.property.impl.EgovPropertyServiceImpl;

@Service
public class KairosRoutingServiceImpl implements KairosRoutingService {

	@Autowired
	private KairosRoutingDAO kairosRoutingDAO;

	@Resource(name = "propertiesService")
	private EgovPropertyServiceImpl propertiesService;

	@Override
	public List<RoutingVO> kairosroute(RoutingVO routingVO) throws Exception {
		return kairosRoutingDAO.kairosroute(routingVO);
	}
	
	@Override
	public List<RoutingVO> kairosroutenode(String path_id) throws Exception {
		return kairosRoutingDAO.kairosroutenode(path_id);
	}
}
