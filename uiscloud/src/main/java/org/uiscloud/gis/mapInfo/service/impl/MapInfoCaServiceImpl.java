package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapInfo.service.MapInfoCaSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoCaService;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcCaVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.impl.LayerTreeDAO;
import org.uiscloud.gis.mapsv.service.impl.SpatialInfoDAO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("mapInfoCaService")
public class MapInfoCaServiceImpl extends AbstractServiceImpl implements MapInfoCaService {
	/** mapInfoCaDAO */
    @Resource(name="mapInfoCaDAO")
    private MapInfoCaDAO mapInfoCaDAO;
  
	/** layerTreeDAO */
    @Resource(name="layerTreeDAO")
    private LayerTreeDAO layerTreeDAO;
    
	/** spatialInfoDAO */
	@Resource(name="spatialInfoDAO")
	private SpatialInfoDAO spatialInfoDAO;
    
	@Override
	public List<MapInfoVO> search(MapInfoCaSearchVO mapInfoCaSearchVO) {
		List<MapInfoVO> result = mapInfoCaDAO.search(mapInfoCaSearchVO);
		return result;
	}

	@Override
	public Integer searchTotalCount(MapInfoCaSearchVO mapInfoCaSearchVO) {
		Integer total = 0;
		
		total = mapInfoCaDAO.searchTotalCount(mapInfoCaSearchVO);
		
		mapInfoCaSearchVO.setTotalCount(total);
		
		return total;
	}

	@Override
	public List<GotcCaVO> searchForExcelCable(MapInfoCaSearchVO vo) {
		List<GotcCaVO> result = mapInfoCaDAO.searchForExcelCable(vo);
		return result;	
	}

	@Override
	public List<Map<String, Integer>> searchGids(MapInfoCaSearchVO vo) {		
		return mapInfoCaDAO.searchGids(vo);
	}
}