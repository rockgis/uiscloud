/**
 * 
 * @Class Name  : LayerTreeService.java
 * @Description : LayerTreeService Class
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
 * 지도 레이어 트리 관리 Service Interface
 *
 */
package org.uiscloud.gis.mapsv.service;

import java.util.List;

/**
 * @author NPIMSKJM
 *
 */
public interface LayerTreeService {
	public List<LayerTreeVO> searchAll() throws Exception;
	
	public List<LayerTreeVO> searchAllU() throws Exception;
	
	public List<LayerTreeVO> searchChildsByParentPk(int parentPk) throws Exception;

	public LayerTreeVO retrieve(int layerTreePk);

	public int regist(LayerTreeVO vo);

	public int modify(LayerTreeVO vo);

	public int remove(int layerTreePk);
}