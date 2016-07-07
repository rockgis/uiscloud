package org.uiscloud.gis.mapsv.service;

import java.util.List;
import java.util.Map;

public interface SpatialInfoService {
	public Map<String, Map<String, Object>> selectSpatialInfo(SpatialInfoVO spatialInfoVO); 
	public List<Map<String, Object>> selectSpatialDetailInfo(String params);
	public List<SpatialMetaInfoVO> selectSpatialMetaTable(SpatialMetaInfoVO spatialMetaInfoVO);
}
