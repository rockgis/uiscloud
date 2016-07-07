package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapInfo.service.RingSearchVO;
import org.uiscloud.gis.mapInfo.service.RingVO;

/**
 * @author 김종민
 *
 */
@Repository("ringDAO")
public class RingDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
	
	public Integer searchTotalCount(RingSearchVO vo) {
		return sqlSession.selectOne("ringDAO.searchTotalCount", vo);
	}
	
	public List<RingVO> search(RingSearchVO vo) {
		return sqlSession.selectList("ringDAO.search", vo);
	}
	
	public List<RingVO> searchForExcel(RingSearchVO vo) {
		return sqlSession.selectList("ringDAO.searchForExcel", vo);
	}

	public List<Map<String, String>> selectDetailPath(String netNo) {
		return sqlSession.selectList("ringDAO.selectDetailPath", netNo);
	}
}