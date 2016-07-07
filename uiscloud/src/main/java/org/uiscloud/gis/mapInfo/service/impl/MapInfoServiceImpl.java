package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.mapInfo.service.FacilityVO;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoService;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapInfo.service.SearchFacilityByUnqMgnoVO;
import org.uiscloud.gis.mapInfo.service.SpbdBuldVO;
import org.uiscloud.gis.mapInfo.service.SpbdEntrcVO;
import org.uiscloud.gis.mapInfo.service.SpotCntcVO;
import org.uiscloud.gis.mapInfo.service.impl.MapInfoDAO;
import org.uiscloud.gis.mapsv.service.GotcCaVO;
import org.uiscloud.gis.mapsv.service.GotcCdVO;
import org.uiscloud.gis.mapsv.service.GotcJpVO;
import org.uiscloud.gis.mapsv.service.GotcMhVO;
import org.uiscloud.gis.mapsv.service.GotcTpoVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.SpatialMetaInfoVO;
import org.uiscloud.gis.mapsv.service.impl.LayerTreeDAO;
import org.uiscloud.gis.mapsv.service.impl.SpatialInfoDAO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("mapInfoService")
public class MapInfoServiceImpl extends AbstractServiceImpl implements MapInfoService {
	/** mapInfoDAO */
    @Resource(name="mapInfoDAO")
    private MapInfoDAO mapInfoDAO;
  
	/** layerTreeDAO */
    @Resource(name="layerTreeDAO")
    private LayerTreeDAO layerTreeDAO;
    
	/** spatialInfoDAO */
	@Resource(name="spatialInfoDAO")
	private SpatialInfoDAO spatialInfoDAO;
    
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
	@Override
	public List<LayerTreeVO> selectAllFacilityKind() throws Exception {
		return layerTreeDAO.selectAllFacilityKind();
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
	@Override
	public List<LayerTreeVO> selectFacilityKindBySearchRequiredFieldsTypes(Integer searchRequiredFieldsTypes) throws Exception {
		return layerTreeDAO.selectFacilityKindBySearchRequiredFieldsTypes(searchRequiredFieldsTypes);
	}
	
    /**
     * 
     * 고유관리번호 검색 기능
     *
     * @param
     * 		layerTreePk // 시설물종류(레이어 트리 PK)
     * 		unqMgno //시설물관리번호
     * @return 
     * 		List<FacilityVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */
	@Override
	public List<FacilityVO> selectUnqMgno(String tableName, String unqMgno) {
		SearchFacilityByUnqMgnoVO searchFacilityByUnqMgnoVO = new SearchFacilityByUnqMgnoVO(
				  unqMgno
				, tableName);
		
		List<FacilityVO> result = mapInfoDAO.selectUnqMgno(searchFacilityByUnqMgnoVO);
		return result;
	}

	@Override
	public Integer searchTotalCount(MapInfoSearchVO mapInfoSearchVO) {
		Integer total = 0;
		
		total = mapInfoDAO.searchTotalCount(mapInfoSearchVO);
		
		mapInfoSearchVO.setTotalCount(total);
		
		return total;
	}

	@Override
	public List<MapInfoVO> search(MapInfoSearchVO mapInfoSearchVO) {
		String tableName = mapInfoSearchVO.getTableName();
		List<MapInfoVO> result = null;
		if(tableName.equals("tl_scco_ctprvn_11000")){
			result = mapInfoDAO.searchSido(mapInfoSearchVO);
		}
		else if(tableName.equals("tl_scco_sig_11000")){
			result = mapInfoDAO.searchSig(mapInfoSearchVO);
		}
		else if(tableName.equals("tl_scco_emd_11000")){
			result = mapInfoDAO.searchEmd(mapInfoSearchVO);
		}
		
		return result;
	}

	@Override
	public String getTableName(Integer layerTreePk) {
		return layerTreeDAO.getTableName(layerTreePk);
	}

	@Override
	public List<GotcCaVO> searchForExcelCable(MapInfoSearchVO vo) {
		List<GotcCaVO> result = mapInfoDAO.searchForExcelCable(vo);
		return result;	
	}

	@Override
	public List<GotcCdVO> searchForExcelCableDuct(MapInfoSearchVO vo) {
		List<GotcCdVO> result = mapInfoDAO.searchForExcelCableDuct(vo);
		return result;	
	}

	@Override
	public List<GotcJpVO> searchForExcelJoinPoint(MapInfoSearchVO vo) {
		List<GotcJpVO> result = mapInfoDAO.searchForExcelJoinPoint(vo);
		return result;	
	}

	@Override
	public List<GotcMhVO> searchForExcelManHole(MapInfoSearchVO vo) {
		List<GotcMhVO> result = mapInfoDAO.searchForExcelManHole(vo);
		return result;	
	}

	@Override
	public List<GotcTpoVO> searchForExcelTPO(MapInfoSearchVO vo) {
		List<GotcTpoVO> result = mapInfoDAO.searchForExcelTPO(vo);
		return result;	
	}

	@Override
	public List<SpatialMetaInfoVO> selectSpatialMetaColumn(String tableName) {
		return mapInfoDAO.selectSpatialMetaColumn(tableName);
	}

	@Override
	public List<Map<String, Integer>> searchGids(MapInfoSearchVO vo) {		
		return mapInfoDAO.searchGids(vo);
	}

	@Override
	public int insertSpbdEntrc(SpbdEntrcVO spbdEntrcVO) throws Exception {
		return mapInfoDAO.insertSpbdEntrc(spbdEntrcVO);
	}
	
	@Override
	public int insertSpotCntc(SpotCntcVO spotCntcVO) throws Exception {
		return mapInfoDAO.insertSpotCntc(spotCntcVO);
	}

	@Override
	public int insertSpbdBuld(SpbdBuldVO spbdBuldVO) throws Exception {
		return mapInfoDAO.insertSpbdBuld(spbdBuldVO);
	}

	@Override
	public int updateSpbdEntrc(SpbdEntrcVO spbdEntrcVO) {
		return mapInfoDAO.updateSpbdEntrc(spbdEntrcVO);
	}

	@Override
	public int updateSpotCntc(SpotCntcVO spotCntcVO) {
		return mapInfoDAO.updateSpotCntc(spotCntcVO);
	}

	@Override
	public int updateSpbdBuld(SpbdBuldVO spbdBuldVO) {
		return mapInfoDAO.updateSpbdBuld(spbdBuldVO);
	}

	@Override
	public int deleteSpbdEntrc(SpbdEntrcVO spbdEntrcVO) {
		return mapInfoDAO.deleteSpbdEntrc(spbdEntrcVO);
	}

	@Override
	public int deleteSpotCntc(SpotCntcVO spotCntcVO) {
		return mapInfoDAO.deleteSpotCntc(spotCntcVO);
	}

	@Override
	public int deleteSpbdBuld(SpbdBuldVO spbdBuldVO) {
		return mapInfoDAO.deleteSpbdBuld(spbdBuldVO);
	}
}