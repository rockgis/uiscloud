package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapInfo.service.MapInfoJpSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoJpService;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcJpVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.impl.LayerTreeDAO;
import org.uiscloud.gis.mapsv.service.impl.SpatialInfoDAO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("mapInfoJpService")
public class MapInfoJpServiceImpl extends AbstractServiceImpl implements MapInfoJpService {
	/** mapInfoJpDAO */
    @Resource(name="mapInfoJpDAO")
    private MapInfoJpDAO mapInfoJpDAO;
  
	/** layerTreeDAO */
    @Resource(name="layerTreeDAO")
    private LayerTreeDAO layerTreeDAO;
    
	/** spatialInfoDAO */
	@Resource(name="spatialInfoDAO")
	private SpatialInfoDAO spatialInfoDAO;
    
	@Override
	public List<MapInfoVO> search(MapInfoJpSearchVO mapInfoJpSearchVO) {
		List<MapInfoVO> result = mapInfoJpDAO.search(mapInfoJpSearchVO);
		return result;
	}

	@Override
	public Integer searchTotalCount(MapInfoJpSearchVO mapInfoJpSearchVO) {
		Integer total = 0;
		
		total = mapInfoJpDAO.searchTotalCount(mapInfoJpSearchVO);
		
		mapInfoJpSearchVO.setTotalCount(total);
		
		return total;
	}

	@Override
	public List<GotcJpVO> searchForExcelJoinPoint(MapInfoJpSearchVO vo) {
		List<GotcJpVO> result = mapInfoJpDAO.searchForExcelJoinPoint(vo);
		return result;	
	}

	@Override
	public List<Map<String, Integer>> searchGids(MapInfoJpSearchVO vo) {		
		return mapInfoJpDAO.searchGids(vo);
	}
}