package org.uiscloud.gis.mapInfo.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.mapsv.service.GotcJpVO;

public interface MapInfoJpService {
	
	public List<MapInfoVO> search(MapInfoJpSearchVO vo);

	public Integer searchTotalCount(MapInfoJpSearchVO vo);

	public List<GotcJpVO> searchForExcelJoinPoint(MapInfoJpSearchVO vo);
	
	public List<Map<String, Integer>> searchGids(MapInfoJpSearchVO vo);
}