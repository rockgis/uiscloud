package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapInfo.service.MapInfoCdSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcCdVO;

/**
 * @author 김종민
 *
 */
@Repository("mapInfoCdDAO")
public class MapInfoCdDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
    

	/**
	 * 
	 * 지도정보 검색 기능
	 * 
     * @param
     * 		MapInfoSearchVO // MapInfoSearchVO
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	public List<MapInfoVO> search(MapInfoCdSearchVO vo) {
		return sqlSession.selectList("mapInfoCdDAO.search", vo);
	}

	public Integer searchTotalCount(MapInfoCdSearchVO mapInfoCdSearchVO) {
		return (Integer)sqlSession.selectOne("mapInfoCdDAO.searchTotalCount", mapInfoCdSearchVO);
	}

	public List<GotcCdVO> searchForExcelCableDuct(MapInfoCdSearchVO vo) {
		return sqlSession.selectList("mapInfoCdDAO.searchForExcelCableDuct", vo);
	}
	
	public List<Map<String, Integer>> searchGids(MapInfoCdSearchVO vo) {
		return sqlSession.selectList("mapInfoCdDAO.searchGids", vo);
	}
}