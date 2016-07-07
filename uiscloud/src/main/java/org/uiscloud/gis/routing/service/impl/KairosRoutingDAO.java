package org.uiscloud.gis.routing.service.impl;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.routing.service.AroutingVO;
import org.uiscloud.gis.routing.service.EdgeVo;
import org.uiscloud.gis.routing.service.KroutingVO;
import org.uiscloud.gis.routing.service.RoutingVO;
import org.uiscloud.gis.routing.web.TargetParam;

@Repository("kairosRoutingDAO")
public class KairosRoutingDAO {
	
	
	@Resource(name="sqlSessionTemplateForKAIROS")
	private SqlSessionTemplate sqlSessionForKAIROS;

	
	
	public List<RoutingVO> kairosroute(RoutingVO routingVO) throws Exception {
		return sqlSessionForKAIROS.selectList("routingDAO.route", routingVO);
	}
	
	public List<RoutingVO> kairosroutenode(String path_id) throws Exception {
		return sqlSessionForKAIROS.selectList("routingDAO.routenode", path_id);
	}
	


	
}