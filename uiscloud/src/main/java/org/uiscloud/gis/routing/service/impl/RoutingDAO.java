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

@Repository
public class RoutingDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;

	public List<RoutingVO> route(RoutingVO routingVO) throws Exception {
		return sqlSession.selectList("routingDAO.route", routingVO);
	}

	public EdgeVo findNearestEdge(RoutingVO routingVO) {
		Object o = sqlSession.selectOne("routingDAO.findNearestEdge", routingVO);
		if (o != null) {
			return (EdgeVo) o;
		}

		return null;
	}

	public String filterTargets(KroutingVO routingVO) {
		Object tar1 = sqlSession.selectOne("routingDAO.filterTargets1", routingVO);
		Object tar2 = sqlSession.selectOne("routingDAO.filterTargets2", routingVO);

		// make results
		List<String> results = new LinkedList<String>();
		if (tar1 != null) {
			String targets1 = (String) tar1;
			for (String target : targets1.split(",")) {
				if (!results.contains(target)) {
					results.add(target);
				}
			}
		}
		if (tar2 != null) {
			String targets2 = (String) tar2;
			for (String target : targets2.split(",")) {
				if (!results.contains(target)) {
					results.add(target);
				}
			}
		}

		if (tar1 != null || tar2 != null) {
			StringBuffer sb = new StringBuffer();
			int idx = 0;
			for (String t : results) {
				sb.append(t);
				if (++idx < results.size()) {
					sb.append(",");
				}
			}
			return sb.toString();
		}

		return null;
	}

	public List<KroutingVO> kroute(KroutingVO routingVO) {
		return sqlSession.selectList("routingDAO.kroute", routingVO);
	}

	public List<AroutingVO> aroute(AroutingVO routingVO) {
		return sqlSession.selectList("routingDAO.aroute", routingVO);
	}

	public String findTargets(TargetParam targetParam) {
		Object o = sqlSession.selectOne("routingDAO.findTargets", targetParam);
		if (o != null) {
			return (String) o;
		}

		return null;
	}

	public String getLglWkt(KroutingVO routingVO) {
		Object o = sqlSession.selectOne("routingDAO.getLglWkt", routingVO);
		if (o != null) {
			return (String) o;
		}

		return null;
	}

	public EdgeVo findNearestLine(RoutingVO routingVO) {
		Object o = sqlSession.selectOne("routingDAO.findNearestLine", routingVO);
		if (o != null) {
			return (EdgeVo) o;
		}

		return null;
	}

	public EdgeVo findNearestTpo(KroutingVO routingVO) {
		Object o = sqlSession.selectOne("routingDAO.findNearestTpo", routingVO);
		if (o != null) {
			return (EdgeVo) o;
		}

		return null;
	}

	public EdgeVo findNearestDemand(RoutingVO routingVO) {
		Object o = sqlSession.selectOne("routingDAO.findNearestDemand", routingVO);
		if (o != null) {
			return (EdgeVo) o;
		}

		return null;
	}

	public EdgeVo getTarget(int targetId) {
		Object o = sqlSession.selectOne("routingDAO.getTarget", targetId);
		if (o != null) {
			return (EdgeVo) o;
		}

		return null;
	}

	public List<Map<String, Object>> getDemandInfos(String demandIds) {
		return sqlSession.selectList("routingDAO.getDemandInfos", demandIds);
	}

	public List<EdgeVo> getTargetsByDemand(KroutingVO kroutingVO) {
		return sqlSession.selectList("routingDAO.getTargetsByDemand", kroutingVO);
	}
}