package org.uiscloud.gis.mapsv.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.gis.mapsv.service.EteLinkVO;
import org.uiscloud.gis.mapsv.service.GotcCaVO;
import org.uiscloud.gis.mapsv.service.GotcCdVO;
import org.uiscloud.gis.mapsv.service.GotcJpVO;
import org.uiscloud.gis.mapsv.service.GotcMhVO;
import org.uiscloud.gis.mapsv.service.GotcTpoVO;
import org.uiscloud.gis.mapsv.service.SpatialInfoVO;
import org.uiscloud.gis.mapsv.service.SpatialMetaInfoVO;
import org.uiscloud.gis.mapsv.service.TlSpbdBuld11000VO;

@Repository("spatialInfoDAO")
public class SpatialInfoDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
	
	public List<SpatialMetaInfoVO> selectSpatialMetaTable(SpatialMetaInfoVO spatialMetaInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectSpatialMetaTable", spatialMetaInfoVO);
	}
	
	public List<SpatialMetaInfoVO> selectSpatialMetaColumn(String tableName) {
		return sqlSession.selectList("spatialInfoDAO.selectSpatialMetaColumn", tableName);
	}
	
	public List<GotcCaVO> selectGotcCa(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectGotcCa", spatialInfoVO);
	}
	
	public List<GotcCdVO> selectGotcCd(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectGotcCd", spatialInfoVO);
	}
	
	public List<GotcJpVO> selectGotcJp(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectGotcJp", spatialInfoVO);
	}
	
	public List<GotcMhVO> selectGotcMh(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectGotcMh", spatialInfoVO);
	}
	
	public List<GotcTpoVO> selectGotcTpo(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectGotcTpo", spatialInfoVO);
	}
	
	public List<GotcTpoVO> selectSktRingMap(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectSktRingMap", spatialInfoVO);
	}
	
	public List<EteLinkVO> selectEteLink(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectEteLink", spatialInfoVO);
	}
	
	public List<EteLinkVO> selectEteLinkDetail(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectEteLinkDetail", spatialInfoVO);
	}

	public List<TlSpbdBuld11000VO> selectTlSpbdBuld11000(SpatialInfoVO spatialInfoVO) {
		return sqlSession.selectList("spatialInfoDAO.selectTlSpbdBuld11000", spatialInfoVO);
	}
}