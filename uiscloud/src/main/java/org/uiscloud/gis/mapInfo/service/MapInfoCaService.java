package org.uiscloud.gis.mapInfo.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.mapsv.service.GotcCaVO;

public interface MapInfoCaService {
	
	public List<MapInfoVO> search(MapInfoCaSearchVO vo);

	public Integer searchTotalCount(MapInfoCaSearchVO vo);
	
	public List<GotcCaVO> searchForExcelCable(MapInfoCaSearchVO vo);
	
	public List<Map<String, Integer>> searchGids(MapInfoCaSearchVO vo);
}