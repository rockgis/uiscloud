package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapInfo.service.RingSearchVO;
import org.uiscloud.gis.mapInfo.service.RingService;
import org.uiscloud.gis.mapInfo.service.RingVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.impl.LayerTreeDAO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("ringService")
public class RingServiceImpl extends AbstractServiceImpl implements RingService {
	/** ringDAO */
    @Resource(name="ringDAO")
    private RingDAO ringDAO;
    
  	/** layerTreeDAO */
    @Resource(name="layerTreeDAO")
    private LayerTreeDAO layerTreeDAO;
    
    @Override
	public Integer searchTotalCount(RingSearchVO vo) {
		Integer total = 0;
		
		LayerTreeVO layerTreeVO = layerTreeDAO.retrieve(vo.getLayerTreePk());
		
		vo.setConditionField(layerTreeVO.getConditionField());
		vo.setCondition(layerTreeVO.getCondition());
		vo.setLayerName(layerTreeVO.getLayerName());	
		
		total = ringDAO.searchTotalCount(vo);
		
		vo.setTotalCount(total);
    	
    	return total;
    }
    
	@Override
	public List<RingVO> search(RingSearchVO vo) {
		LayerTreeVO layerTreeVO = layerTreeDAO.retrieve(vo.getLayerTreePk());

		vo.setConditionField(layerTreeVO.getConditionField());
		vo.setCondition(layerTreeVO.getCondition());
		vo.setLayerName(layerTreeVO.getLayerName());
		
		return ringDAO.search(vo);
	}
    
	@Override
	public List<RingVO> searchForExcel(RingSearchVO vo) {
		LayerTreeVO layerTreeVO = layerTreeDAO.retrieve(vo.getLayerTreePk());

		vo.setConditionField(layerTreeVO.getConditionField());
		vo.setCondition(layerTreeVO.getCondition());
		vo.setLayerName(layerTreeVO.getLayerName());
		
		return ringDAO.searchForExcel(vo);
		
	}

	@Override
	public List<Map<String, String>> selectDetailPath(String netNo) {
		return ringDAO.selectDetailPath(netNo);
	}
}