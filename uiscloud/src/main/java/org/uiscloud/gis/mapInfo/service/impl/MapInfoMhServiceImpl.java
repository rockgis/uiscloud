package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapInfo.service.MapInfoMhSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoMhService;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcMhVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.impl.LayerTreeDAO;
import org.uiscloud.gis.mapsv.service.impl.SpatialInfoDAO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("mapInfoMhService")
public class MapInfoMhServiceImpl extends AbstractServiceImpl implements MapInfoMhService {
	/** mapInfoMhDAO */
    @Resource(name="mapInfoMhDAO")
    private MapInfoMhDAO mapInfoMhDAO;
  
	/** layerTreeDAO */
    @Resource(name="layerTreeDAO")
    private LayerTreeDAO layerTreeDAO;
    
	/** spatialInfoDAO */
	@Resource(name="spatialInfoDAO")
	private SpatialInfoDAO spatialInfoDAO;
    
	@Override
	public List<MapInfoVO> search(MapInfoMhSearchVO mapInfoMhSearchVO) {
		List<MapInfoVO> result = mapInfoMhDAO.search(mapInfoMhSearchVO);
		return result;
	}

	@Override
	public Integer searchTotalCount(MapInfoMhSearchVO mapInfoMhSearchVO) {
		Integer total = 0;
		
		total = mapInfoMhDAO.searchTotalCount(mapInfoMhSearchVO);
		
		mapInfoMhSearchVO.setTotalCount(total);
		
		return total;
	}

	@Override
	public List<GotcMhVO> searchForExcelManHole(MapInfoMhSearchVO vo) {
		List<GotcMhVO> result = mapInfoMhDAO.searchForExcelManHole(vo);
		return result;	
	}

	@Override
	public List<Map<String, Integer>> searchGids(MapInfoMhSearchVO vo) {		
		return mapInfoMhDAO.searchGids(vo);
	}
}