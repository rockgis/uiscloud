package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository("buildingDAO")
public class BuildingDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
	
	/**
	 * 
	 * 주소 - 시도 검색
	 *
	 * @param PnuVO
	 *            pnuVO
	 * @return List<PnuVO>
	 * @throws Exception
	 * @see SK BIES 시스템
	 *
	 */
	public List<Map<String, String>> selectSido() {
		return sqlSession.selectList("buildingDAO.selectSido");
	}

	/**
	 * 
	 * 주소 - 시군구 검색
	 *
	 * @param String
	 *            pnu 시도 Pnu
	 * @return List<PnuVO>
	 * @throws Exception
	 * @see SK BIES 시스템
	 *
	 */
	public List<Map<String, String>> selectSggBySidoPnu(String pnu) {
		return sqlSession.selectList("buildingDAO.selectSggBySidoPnu", pnu);
	}

	public List<Map<String, String>> selectEmdlBySggPnu(String pnu) {
		return sqlSession.selectList("buildingDAO.selectEmdlBySggPnu", pnu);
	}

	public List<Map<String, String>> selectBuilding(Map<String, Object> searchConditionMap) {
		return sqlSession.selectList("buildingDAO.selectBuilding", searchConditionMap);
	}
}