package org.uiscloud.gis.mapInfo.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapInfo.service.FacilityVO;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapInfo.service.SearchFacilityByUnqMgnoVO;
import org.uiscloud.gis.mapInfo.service.SpbdBuldVO;
import org.uiscloud.gis.mapInfo.service.SpbdEntrcVO;
import org.uiscloud.gis.mapInfo.service.SpotCntcVO;
import org.uiscloud.gis.mapsv.service.GotcCaVO;
import org.uiscloud.gis.mapsv.service.GotcCdVO;
import org.uiscloud.gis.mapsv.service.GotcJpVO;
import org.uiscloud.gis.mapsv.service.GotcMhVO;
import org.uiscloud.gis.mapsv.service.GotcTpoVO;
import org.uiscloud.gis.mapsv.service.SpatialMetaInfoVO;

/**
 * @author 김종민
 *
 */
@Repository("mapInfoDAO")
public class MapInfoDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
    
    /**
     * 
     * 고유관리번호 검색
     *
     * @param
     * 		
     * @return 
     * 		List<FacilityVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */
	public List<FacilityVO> selectUnqMgno(SearchFacilityByUnqMgnoVO vo) {
		return sqlSession.selectList("mapInfoDAO.selectUnqMgno", vo);
	}

	public Integer searchTotalCount(MapInfoSearchVO mapInfoSearchVO) {
		return (Integer)sqlSession.selectOne("mapInfoDAO.searchTotalCount", mapInfoSearchVO);
	}

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
	public List<MapInfoVO> search(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.search", vo);
	}

	public List<GotcCaVO> searchForExcelCable(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchForExcelCable", vo);
	}

	public List<GotcCdVO> searchForExcelCableDuct(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchForExcelCableDuct", vo);
	}

	public List<GotcJpVO> searchForExcelJoinPoint(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchForExcelJoinPoint", vo);
	}

	public List<GotcMhVO> searchForExcelManHole(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchForExcelManHole", vo);
	}

	public List<GotcTpoVO> searchForExcelTPO(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchForExcelTPO", vo);
	}

	public List<SpatialMetaInfoVO> selectSpatialMetaColumn(String tableName) {
		return sqlSession.selectList("mapInfoDAO.selectSpatialMetaColumn", tableName);
	}
	
	public List<Map<String, Integer>> searchGids(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchGids", vo);
	}

	public List<MapInfoVO> searchSido(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchSido", vo);
	}

	public List<MapInfoVO> searchSig(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchSig", vo);
	}

	public List<MapInfoVO> searchEmd(MapInfoSearchVO vo) {
		return sqlSession.selectList("mapInfoDAO.searchEmd", vo);
	}

	public int insertSpbdEntrc(SpbdEntrcVO spbdEntrcVO) {
		return sqlSession.insert("mapInfoDAO.insertSpbdEntrc", spbdEntrcVO);
	}

	public int insertSpotCntc(SpotCntcVO spotCntcVO) {
		return sqlSession.insert("mapInfoDAO.insertSpotCntc", spotCntcVO);
	}

	public int insertSpbdBuld(SpbdBuldVO spbdBuldVO) {
		return sqlSession.insert("mapInfoDAO.insertSpbdBuld", spbdBuldVO);
	}

	public int updateSpbdEntrc(SpbdEntrcVO spbdEntrcVO) {
		return sqlSession.update("mapInfoDAO.updateSpbdEntrc", spbdEntrcVO);
	}

	public int updateSpotCntc(SpotCntcVO spotCntcVO) {
		return sqlSession.update("mapInfoDAO.updateSpotCntc", spotCntcVO);
	}

	public int updateSpbdBuld(SpbdBuldVO spbdBuldVO) {
		return sqlSession.update("mapInfoDAO.updateSpbdBuld", spbdBuldVO);
	}

	public int deleteSpbdEntrc(SpbdEntrcVO spbdEntrcVO) {
		return sqlSession.delete("mapInfoDAO.deleteSpbdEntrc", spbdEntrcVO);
	}

	public int deleteSpotCntc(SpotCntcVO spotCntcVO) {
		return sqlSession.delete("mapInfoDAO.deleteSpotCntc", spotCntcVO);
	}

	public int deleteSpbdBuld(SpbdBuldVO spbdBuldVO) {
		return sqlSession.delete("mapInfoDAO.deleteSpbdBuld", spbdBuldVO);
	}
}