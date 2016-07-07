package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapInfo.service.MapInfoCdSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoCdService;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcCdVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.impl.LayerTreeDAO;
import org.uiscloud.gis.mapsv.service.impl.SpatialInfoDAO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("mapInfoCdService")
public class MapInfoCdServiceImpl extends AbstractServiceImpl implements MapInfoCdService {
	/** mapInfoCdDAO */
    @Resource(name="mapInfoCdDAO")
    private MapInfoCdDAO mapInfoCdDAO;
  
	/** layerTreeDAO */
    @Resource(name="layerTreeDAO")
    private LayerTreeDAO layerTreeDAO;
    
	/** spatialInfoDAO */
	@Resource(name="spatialInfoDAO")
	private SpatialInfoDAO spatialInfoDAO;
    
	@Override
	public List<MapInfoVO> search(MapInfoCdSearchVO mapInfoCdSearchVO) {
		List<MapInfoVO> result = mapInfoCdDAO.search(mapInfoCdSearchVO);
		return result;
	}

	@Override
	public Integer searchTotalCount(MapInfoCdSearchVO mapInfoCdSearchVO) {
		Integer total = 0;
		
		total = mapInfoCdDAO.searchTotalCount(mapInfoCdSearchVO);
		
		mapInfoCdSearchVO.setTotalCount(total);
		
		return total;
	}

	@Override
	public List<GotcCdVO> searchForExcelCableDuct(MapInfoCdSearchVO vo) {
		List<GotcCdVO> result = mapInfoCdDAO.searchForExcelCableDuct(vo);
		return result;	
	}

	@Override
	public List<Map<String, Integer>> searchGids(MapInfoCdSearchVO vo) {		
		return mapInfoCdDAO.searchGids(vo);
	}
}