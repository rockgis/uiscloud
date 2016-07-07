package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapInfo.service.MapInfoCaSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcCaVO;

/**
 * @author 김종민
 *
 */
@Repository("mapInfoCaDAO")
public class MapInfoCaDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
    

	/**
	 * 
	 * 지도정보 검색 기능
	 * 
     * @param
     * 		MapInfoCaSearchVO
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	public List<MapInfoVO> search(MapInfoCaSearchVO vo) {
		return sqlSession.selectList("mapInfoCaDAO.search", vo);
	}

	public Integer searchTotalCount(MapInfoCaSearchVO mapInfoCaSearchVO) {
		return (Integer)sqlSession.selectOne("mapInfoCaDAO.searchTotalCount", mapInfoCaSearchVO);
	}

	public List<GotcCaVO> searchForExcelCable(MapInfoCaSearchVO vo) {
		return sqlSession.selectList("mapInfoCaDAO.searchForExcelCable", vo);
	}
	
	public List<Map<String, Integer>> searchGids(MapInfoCaSearchVO vo) {
		return sqlSession.selectList("mapInfoCaDAO.searchGids", vo);
	}
}