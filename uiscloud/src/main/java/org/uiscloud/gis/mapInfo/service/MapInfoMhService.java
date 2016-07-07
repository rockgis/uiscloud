package org.uiscloud.gis.mapInfo.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.mapsv.service.GotcMhVO;

public interface MapInfoMhService {
	public List<MapInfoVO> search(MapInfoMhSearchVO vo);

	public Integer searchTotalCount(MapInfoMhSearchVO vo);
	
	public List<GotcMhVO> searchForExcelManHole(MapInfoMhSearchVO vo);
	
	public List<Map<String, Integer>> searchGids(MapInfoMhSearchVO vo);
}