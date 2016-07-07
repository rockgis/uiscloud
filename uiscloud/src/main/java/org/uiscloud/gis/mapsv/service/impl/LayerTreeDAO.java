/**
 * 
 * @Class Name  : LayerTreeDAO.java
 * @Description : LayerTreeDAO Class
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 10. 14.  김종민		최초생성
 * @   2013. 10. 25.  김종민		PARENT_PK 기반 하위 레이어 트리 조회 추가
 * 
 * @author 김종민
 * @since 2013. 10. 25.
 * @version 1.1
 * @see
 * 
 * 지도 레이어 트리 관리 Data Access Object
 *
 */
package org.uiscloud.gis.mapsv.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;

/**
 * @author NPIMSKJM
 *
 */
@Repository("layerTreeDAO")
public class LayerTreeDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
	
    /**
     * 
     * 지도 레이어 트리 전체 조회 기능
     *
     * @param
     * 		
     * @return 
     * 		List<LayerTreeVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	public List<LayerTreeVO> selectAll() throws Exception {
		return sqlSession.selectList("layerTreeDAO.selectAll", null);
	}
	
	 /**
     * 
     * 지도 레이어 트리 전체 조회 기능
     *
     * @param
     * 		
     * @return 
     * 		List<LayerTreeVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	public List<LayerTreeVO> selectAllU() throws Exception {
		return sqlSession.selectList("layerTreeDAO.selectAllU", null);
	}
	
    /**
     * 
     * 시설물 종류 전체 조회 기능
     *
     * @param
     * 		
     * @return 
     * 		List<LayerTreeVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */
	public List<LayerTreeVO> selectAllFacilityKind() {
		return sqlSession.selectList("layerTreeDAO.selectAllFacilityKind", null);
	}
	
    /**
     * 
     * 부모명을 포함한 레이어 트리 중 Bitwise And 연산에서 0 보다 큰 결과 전체 조회
     *
     * @param
     * 		Integer searchRequiredFieldsTypes
     * @return 
     * 		List<LayerTreeVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */
	public List<LayerTreeVO> selectFacilityKindBySearchRequiredFieldsTypes(Integer searchRequiredFieldsTypes) {
		return sqlSession.selectList("layerTreeDAO.selectFacilityKindBySearchRequiredFieldsTypes", searchRequiredFieldsTypes);
	}

    /**
    * 
    * PARENT_PK 기반 하위 레이어 트리 조회 기능
    *
    * @param
    * 		int parentPk
    * @return 
    * 		List<LayerTreeVO>
    * @throws Exception
    * @see SK BIES 시스템
    *
    */		
	public List<LayerTreeVO> searchChildsByParentPk(int parentPk) {
		LayerTreeVO vo = new LayerTreeVO();	
		vo.setParentPk(parentPk);
		
		return sqlSession.selectList("layerTreeDAO.searchChildsByParentPk", vo);
	}

    /**
     * 
     * 지도 레이어 트리 단건 조회 기능
     *
     * @param
     * 		int layerTreePk
     * @return 
     * 		LayerTreeVO vo
     * @see SK BIES 시스템
     *
     */
	public LayerTreeVO retrieve(int layerTreePk) {
		return sqlSession.selectOne("layerTreeDAO.selectByPk", layerTreePk);
	}

    /**
     * 
     * 지도 레이어 트리 단건 삽입
     *
     * @param
     * 		LayerTreeVO vo
     * @return 
     * 		int layerTreePk
     * @see SK BIES 시스템
     *
     */
	public int regist(LayerTreeVO vo) {
		int layerTreePk = sqlSession.insert("layerTreeDAO.insert", vo);
		vo.setLayerTreePk(layerTreePk);
		return layerTreePk;
	}

    /**
     * 
     * 지도 레이어 트리 단건 수정
     *
     * @param
     * 		LayerTreeVO vo
     * @return 
     * 		int 영향받은 row 카운트
     * @see SK BIES 시스템
     *
     */
	public int modify(LayerTreeVO vo) {
		return sqlSession.update("layerTreeDAO.update", vo);
	}

    /**
     * 
     * 지도 레이어 트리 단건 삭제
     *
     * @param
     * 		int layerTreePk
     * @return 
     * 		int 영향받은 row 카운트
     * @see SK BIES 시스템
     *
     */
	public int remove(int layerTreePk) {		
		return sqlSession.delete("layerTreeDAO.delete", layerTreePk);
	}

    /**
     * 
     * 테이블명 가져오기
     *
     * @param
     * 		int layerTreePk
     * @return 
     * 		String 테이블명
     * @see SK BIES 시스템
     *
     */
	public String getTableName(Integer layerTreePk) {
		return sqlSession.selectOne("layerTreeDAO.getTableName", layerTreePk);
	}
}