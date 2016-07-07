package org.uiscloud.gis.mapInfo.service;

import java.util.List;
import java.util.Map;

import org.uiscloud.gis.mapInfo.service.FacilityVO;
import org.uiscloud.gis.mapsv.service.GotcCaVO;
import org.uiscloud.gis.mapsv.service.GotcCdVO;
import org.uiscloud.gis.mapsv.service.GotcJpVO;
import org.uiscloud.gis.mapsv.service.GotcMhVO;
import org.uiscloud.gis.mapsv.service.GotcTpoVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.SpatialMetaInfoVO;

public interface MapInfoService {
	public List<LayerTreeVO> selectAllFacilityKind() throws Exception;
	
	public List<LayerTreeVO> selectFacilityKindBySearchRequiredFieldsTypes(Integer searchRequiredFieldsTypes) throws Exception;
	
	public List<FacilityVO> selectUnqMgno(String tableName, String unqMgno);

	public List<MapInfoVO> search(MapInfoSearchVO vo);

	public Integer searchTotalCount(MapInfoSearchVO vo);

	public String getTableName(Integer layerTreePk);
	
	public List<SpatialMetaInfoVO> selectSpatialMetaColumn(String tableName);

	public List<GotcCaVO> searchForExcelCable(MapInfoSearchVO vo);

	public List<GotcCdVO> searchForExcelCableDuct(MapInfoSearchVO vo);

	public List<GotcJpVO> searchForExcelJoinPoint(MapInfoSearchVO vo);

	public List<GotcMhVO> searchForExcelManHole(MapInfoSearchVO vo);

	public List<GotcTpoVO> searchForExcelTPO(MapInfoSearchVO vo);
	
	public List<Map<String, Integer>> searchGids(MapInfoSearchVO vo);

	public int insertSpbdEntrc(SpbdEntrcVO spbdEntrcVO) throws Exception;

	public int insertSpotCntc(SpotCntcVO spotCntcVO) throws Exception;

	public int insertSpbdBuld(SpbdBuldVO spbdBuldVO) throws Exception;

	public int updateSpbdEntrc(SpbdEntrcVO spbdEntrcVO);

	public int updateSpotCntc(SpotCntcVO spotCntcVO);

	public int updateSpbdBuld(SpbdBuldVO spbdBuldVO);

	public int deleteSpbdEntrc(SpbdEntrcVO spbdEntrcVO);

	public int deleteSpotCntc(SpotCntcVO spotCntcVO);

	public int deleteSpbdBuld(SpbdBuldVO spbdBuldVO);
}