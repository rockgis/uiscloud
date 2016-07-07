/**
 * 
 * @Class Name  : LayerTreeServiceImpl.java
 * @Description : LayerTreeServiceImpl Class
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
 * 지도 레이어 트리 관리 Service Implement
 *
 */
package org.uiscloud.gis.mapsv.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapsv.service.LayerTreeService;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("layerTreeService")
public class LayerTreeServiceImpl extends AbstractServiceImpl implements LayerTreeService {
	/** layerTreeDAO */
    @Resource(name="layerTreeDAO")
    private LayerTreeDAO layerTreeDAO;

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
	@Override
	public List<LayerTreeVO> searchAll() throws Exception {
		return layerTreeDAO.selectAll();
	}
	
	@Override
	public List<LayerTreeVO> searchAllU() throws Exception {
		return layerTreeDAO.selectAllU();
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
	@Override
	public List<LayerTreeVO> searchChildsByParentPk(int parentPk)
			throws Exception {
		return layerTreeDAO.searchChildsByParentPk(parentPk);
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
	@Override
	public LayerTreeVO retrieve(int layerTreePk) {
		return layerTreeDAO.retrieve(layerTreePk);
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
	@Override
	public int regist(LayerTreeVO vo) {
		return layerTreeDAO.regist(vo);
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
	@Override
	public int modify(LayerTreeVO vo) {
		return layerTreeDAO.modify(vo);
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
	@Override
	public int remove(int layerTreePk) {
		return layerTreeDAO.remove(layerTreePk);
	}
}