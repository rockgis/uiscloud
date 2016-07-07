package org.uiscloud.gis.mapInfo.service;

import java.util.List;
import java.util.Map;

public interface RingService {
	public Integer searchTotalCount(RingSearchVO vo);
	
	public List<RingVO> search(RingSearchVO vo);
	
	public List<RingVO> searchForExcel(RingSearchVO vo);

	public List<Map<String, String>> selectDetailPath(String netNo);
}