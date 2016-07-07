package org.uiscloud.gis.interactiveUi.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.interactiveUi.service.InteractiveVO;
import org.uiscloud.gis.mapInfo.service.MapInfoCaSearchVO;

@Repository("interactiveDAO")
public class InteractiveDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
    

	/**
	 * 
	 * 지도정보 검색 기능
	 * 
     * @param
     * 		InteractiveSearchVO // InteractiveVO
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	public List<InteractiveVO> searchNodes(MapInfoCaSearchVO vo) {
		List<InteractiveVO> result = sqlSession.selectList("interactiveDAO.searchNodes", vo);
		return result;
	}
	
	public List<InteractiveVO> searchLinks(MapInfoCaSearchVO vo) {
		List<InteractiveVO> result = sqlSession.selectList("interactiveDAO.searchLinks", vo);
		return result;
	}
	

}