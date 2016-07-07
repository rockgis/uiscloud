package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapInfo.service.MapInfoJpSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoTpoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoTpoService;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcTpoVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.impl.LayerTreeDAO;
import org.uiscloud.gis.mapsv.service.impl.SpatialInfoDAO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("mapInfoTpoService")
public class MapInfoTpoServiceImpl extends AbstractServiceImpl implements MapInfoTpoService {
	/** mapInfoTpoDAO */
    @Resource(name="mapInfoTpoDAO")
    private MapInfoTpoDAO mapInfoTpoDAO;
  
	/** layerTreeDAO */
    @Resource(name="layerTreeDAO")
    private LayerTreeDAO layerTreeDAO;
    
	/** spatialInfoDAO */
	@Resource(name="spatialInfoDAO")
	private SpatialInfoDAO spatialInfoDAO;
    
	@Override
	public List<MapInfoVO> search(MapInfoTpoSearchVO mapInfoTpoSearchVO) {
		List<MapInfoVO> result = mapInfoTpoDAO.search(mapInfoTpoSearchVO);
		return result;
	}

	@Override
	public Integer searchTotalCount(MapInfoTpoSearchVO mapInfoTpoSearchVO) {
		Integer total = 0;
		
		total = mapInfoTpoDAO.searchTotalCount(mapInfoTpoSearchVO);
		
		mapInfoTpoSearchVO.setTotalCount(total);
		
		return total;
	}

	@Override
	public List<GotcTpoVO> searchForExcelTPO(MapInfoTpoSearchVO vo) {
		List<GotcTpoVO> result = mapInfoTpoDAO.searchForExcelTPO(vo);
		return result;	
	}

	@Override
	public List<Map<String, String>> findTpoInfo(String unqMgno) {
		return mapInfoTpoDAO.findTpoInfo(unqMgno);
	}

	@Override
	public List<Map<String, Integer>> searchGids(MapInfoTpoSearchVO vo) {		
		return mapInfoTpoDAO.searchGids(vo);
	}
}