package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapInfo.service.MapInfoMhSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcMhVO;

/**
 * @author 김종민
 *
 */
@Repository("mapInfoMhDAO")
public class MapInfoMhDAO {
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
	public List<MapInfoVO> search(MapInfoMhSearchVO vo) {
		return sqlSession.selectList("mapInfoMhDAO.search", vo);
	}

	public Integer searchTotalCount(MapInfoMhSearchVO mapInfoMhSearchVO) {
		return (Integer)sqlSession.selectOne("mapInfoMhDAO.searchTotalCount", mapInfoMhSearchVO);
	}

	public List<GotcMhVO> searchForExcelManHole(MapInfoMhSearchVO vo) {
		return sqlSession.selectList("mapInfoMhDAO.searchForExcelManHole", vo);
	}
	
	public List<Map<String, Integer>> searchGids(MapInfoMhSearchVO vo) {
		return sqlSession.selectList("mapInfoMhDAO.searchGids", vo);
	}
}