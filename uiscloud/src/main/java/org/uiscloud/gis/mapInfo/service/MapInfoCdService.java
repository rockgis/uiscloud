package org.uiscloud.gis.mapInfo.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.mapsv.service.GotcCdVO;

public interface MapInfoCdService {
	
	public List<MapInfoVO> search(MapInfoCdSearchVO vo);

	public Integer searchTotalCount(MapInfoCdSearchVO vo);
	
	public List<GotcCdVO> searchForExcelCableDuct(MapInfoCdSearchVO vo);
	
	public List<Map<String, Integer>> searchGids(MapInfoCdSearchVO vo);
}