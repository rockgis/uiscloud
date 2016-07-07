package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapInfo.service.MapInfoJpSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcJpVO;

/**
 * @author 김종민
 *
 */
@Repository("mapInfoJpDAO")
public class MapInfoJpDAO {
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
	public List<MapInfoVO> search(MapInfoJpSearchVO vo) {
		return sqlSession.selectList("mapInfoJpDAO.search", vo);
	}

	public Integer searchTotalCount(MapInfoJpSearchVO mapInfoJpSearchVO) {
		return (Integer)sqlSession.selectOne("mapInfoJpDAO.searchTotalCount", mapInfoJpSearchVO);
	}

	public List<GotcJpVO> searchForExcelJoinPoint(MapInfoJpSearchVO vo) {
		return sqlSession.selectList("mapInfoJpDAO.searchForExcelJoinPoint", vo);
	}
	
	public List<Map<String, Integer>> searchGids(MapInfoJpSearchVO vo) {
		return sqlSession.selectList("mapInfoJpDAO.searchGids", vo);
	}
}