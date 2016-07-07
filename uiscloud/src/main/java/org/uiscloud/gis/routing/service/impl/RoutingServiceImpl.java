package org.uiscloud.gis.routing.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.uiscloud.gis.routing.service.AroutingVO;
import org.uiscloud.gis.routing.service.EdgeVo;
import org.uiscloud.gis.routing.service.KroutingVO;
import org.uiscloud.gis.routing.service.RoutingService;
import org.uiscloud.gis.routing.service.RoutingVO;
import org.uiscloud.gis.routing.web.TargetParam;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

import egovframework.rte.fdl.property.impl.EgovPropertyServiceImpl;

@Service
public class RoutingServiceImpl implements RoutingService {

	@Autowired
	private RoutingDAO routingDAO;

	@Resource(name = "propertiesService")
	private EgovPropertyServiceImpl propertiesService;

	@Override
	public List<RoutingVO> route(RoutingVO routingVO) throws Exception {
		return routingDAO.route(routingVO);
	}

	@Override
	public EdgeVo findNearestEdge(RoutingVO routingVO) throws Exception {
		return routingDAO.findNearestEdge(routingVO);
	}

	@Override
	public List<KroutingVO> kroute(KroutingVO routingVO) throws Exception {
		return routingDAO.kroute(routingVO);
	}

	@Override
	public List<AroutingVO> aroute(AroutingVO routingVO) throws Exception {
		// TODO Auto-generated method stub
		return routingDAO.aroute(routingVO);
	}

	@Override
	public String filterTargets(KroutingVO routingVO) throws Exception {
		return routingDAO.filterTargets(routingVO);
	}

	@Override
	public String findTargets(TargetParam targetParam) throws Exception {
		return routingDAO.findTargets(targetParam);
	}

	@Override
	public Map<String, Object> findNearestEdge(double x, double y) throws Exception {
		RoutingVO routingVO = new RoutingVO();
		routingVO.setX(x);
		routingVO.setY(y);

		int buffer = propertiesService.getInt("buffer");
		routingVO.setBuffer(buffer);

		int id = -1;
		try {
			EdgeVo near = findNearestEdge(routingVO);
			if (near != null && near.getWellKnownText() != null) {
				GeometryFactory fac = new GeometryFactory();
				WKTReader wktReader = new WKTReader(fac);
				try {
					Geometry geom = wktReader.read(near.getWellKnownText());
					if (geom instanceof Point) {
						Point point = (Point) geom;
						x = point.getX();
						y = point.getY();
					} else {
						x = 0.0;
						y = 0.0;
					}
				} catch (ParseException e) {
					e.printStackTrace();
					x = 0.0;
					y = 0.0;
				}

				id = near.getId();

			} else {
				x = 0.0;
				y = 0.0;
				id = -1;
			}

		} catch (Exception e1) {
			e1.printStackTrace();
		}

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("id", id);
		result.put("x", x);
		result.put("y", y);

		return result;
	}

	@Override
	public String getLglWkt(KroutingVO routingVO) throws Exception {
		return routingDAO.getLglWkt(routingVO);
	}

	@Override
	public Map<String, Object> findNearestLine(double x, double y) throws Exception {
		RoutingVO routingVO = new RoutingVO();
		routingVO.setX(x);
		routingVO.setY(y);

		int buffer = propertiesService.getInt("buffer");
		routingVO.setBuffer(buffer);

		int gid = -1;
		String wkt = "";
		try {
			EdgeVo near = findNearestLine(routingVO);
			if (near != null && near.getWellKnownText() != null) {
				gid = near.getGid();
				wkt = near.getWellKnownText();
			} else {
				x = 0.0;
				y = 0.0;
				gid = -1;
			}

		} catch (Exception e1) {
			e1.printStackTrace();
		}

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("gid", gid);
		result.put("wkt", wkt);

		return result;
	}

	private EdgeVo findNearestLine(RoutingVO routingVO) {
		return routingDAO.findNearestLine(routingVO);
	}

	@Override
	public Map<String, EdgeVo> findSourceAndTarget(KroutingVO routingVO) throws Exception {
		Map<String, EdgeVo> result = new HashMap<String, EdgeVo>();

		// TODO
		int buffer = propertiesService.getInt("buffer");
		// buffer = 150;
		routingVO.setBuffer(buffer);

		/*
		 * 현재 vertex 정보를 가져온다.
		 */
		EdgeVo target = routingDAO.getTarget(routingVO.getTarget());
		result.put("target", target);

		routingVO.setTargetWkt(target.getWellKnownText());
		EdgeVo tpo = routingDAO.findNearestTpo(routingVO);
		if (tpo == null) {
			return null;
		}

		GeometryFactory fac = new GeometryFactory();
		WKTReader wktReader = new WKTReader(fac);
		try {
			Geometry geom = wktReader.read(tpo.getWellKnownText());
			if (geom instanceof Point) {
				Point point = (Point) geom;
				double x = point.getX();
				double y = point.getY();

				routingVO.setX(x);
				routingVO.setY(y);

				/*
				 * source
				 */
				EdgeVo source = routingDAO.findNearestEdge(routingVO);
				result.put("source", source);

				/*
				 * demand
				 */
				EdgeVo demand = routingDAO.findNearestDemand(routingVO);
				result.put("demand", demand);

			}

		} catch (ParseException e) {
			e.printStackTrace();
		}

		return result;
	}

	@Override
	public Map<String, EdgeVo> findTargetAndDemand(KroutingVO routingVO) throws Exception {
		Map<String, EdgeVo> result = new HashMap<String, EdgeVo>();

		/*
		 * 수요 반경을 버퍼로 준다.
		 */
		routingVO.setBuffer((int) routingVO.getBldgMeters());

		/*
		 * 현재 vertex 정보를 가져온다.
		 */
		EdgeVo target = routingDAO.getTarget(routingVO.getTarget());
		result.put("target", target);

		/*
		 * 현재 vertex를 기준으로 제일 가까운 수요를 찾는다.
		 */
		routingVO.setTargetWkt(target.getWellKnownText());
		EdgeVo demand = routingDAO.findNearestDemand(routingVO);
		result.put("demand", demand);

		return result;
	}

	@Override
	public List<Map<String, Object>> getDemandInfos(String demandIds) throws Exception {
		return routingDAO.getDemandInfos(demandIds);
	}

	@Override
	public List<EdgeVo> getTargetsByDemand(KroutingVO kroutingVO) throws Exception {
		return routingDAO.getTargetsByDemand(kroutingVO);
	}
}
