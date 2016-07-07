package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoTpoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.GotcTpoVO;

/**
 * @author 김종민
 *
 */
@Repository("mapInfoTpoDAO")
public class MapInfoTpoDAO {
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
	public List<MapInfoVO> search(MapInfoTpoSearchVO vo) {
		return sqlSession.selectList("mapInfoTpoDAO.search", vo);
	}

	public Integer searchTotalCount(MapInfoTpoSearchVO mapInfoTpoSearchVO) {
		return (Integer)sqlSession.selectOne("mapInfoTpoDAO.searchTotalCount", mapInfoTpoSearchVO);
	}

	public List<GotcTpoVO> searchForExcelTPO(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoTpoDAO.searchForExcelTPO", vo);
	}
	
	public List<Map<String, String>> findTpoInfo(String unqMgno) {
		return sqlSession.selectList("mapInfoTpoDAO.findTpoInfo", unqMgno);
	}
	
	public List<Map<String, Integer>> searchGids(MapInfoTpoSearchVO vo) {
		return sqlSession.selectList("mapInfoTpoDAO.searchGids", vo);
	}
}