package org.uiscloud.gis.mapInfo.service;

import java.util.List;
import java.util.Map;

public interface BuildingService {
	/**
	 * 
	 * 주소 - 시도 검색
	 *
	 * @param
	 * 		String category : 시도 - sido, 시군구 - sgg, 읍면동/리 - emdri
	 * 		String pnu 
	 * @return 
	 * 		List<PnuVO>
	 * @throws Exception
	 * @see SK BIES 시스템
	 *
	 */	
	public List<Map<String, String>> selectSido();

    /**
     * 
     * 주소 - 시군구 검색
     *
     * @param
     * 		String pnu 시도 Pnu
     * @return 
     * 		List<PnuVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	public List<Map<String, String>> selectSggBySidoPnu(String pnu);

	public List<Map<String, String>> selectEmdlBySggPnu(String pnu);
	
	public List<Map<String, String>> selectBuilding(Map<String, Object> searchConditionMap);	
}