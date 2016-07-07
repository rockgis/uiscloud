package org.uiscloud.gis.mapInfo.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.mapsv.service.GotcTpoVO;

public interface MapInfoTpoService {
	public List<MapInfoVO> search(MapInfoTpoSearchVO vo);

	public Integer searchTotalCount(MapInfoTpoSearchVO vo);

	public List<GotcTpoVO> searchForExcelTPO(MapInfoTpoSearchVO vo);

	public List<Map<String, String>> findTpoInfo(String unqMgno);
	
	public List<Map<String, Integer>> searchGids(MapInfoTpoSearchVO vo);
}