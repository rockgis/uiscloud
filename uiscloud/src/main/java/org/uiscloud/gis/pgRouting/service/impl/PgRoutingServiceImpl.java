package org.uiscloud.gis.pgRouting.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.pgRouting.service.NetworkVO;
import org.uiscloud.gis.pgRouting.service.PgRoutingService;
import org.uiscloud.gis.pgRouting.service.StandardInformationVO;
import org.uiscloud.gis.pgRouting.service.impl.PgRoutingDAO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("pgRoutingService")
public class PgRoutingServiceImpl extends AbstractServiceImpl implements PgRoutingService {
	/** pgRoutingDAO */
    @Resource(name="pgRoutingDAO")
    private PgRoutingDAO pgRoutingDAO;
	
    /**
     * 
     * Network 전체 조회 기능
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
	public List<NetworkVO> selectAllNetwork() {
		List<NetworkVO> result = pgRoutingDAO.selectAllNetwork();;
		return result;
	}
	
    /**
     * 
     * 기준정보 전체 조회 기능
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
	public List<StandardInformationVO> selectAllStandardInformation() {
		List<StandardInformationVO> result = pgRoutingDAO.selectAllStandardInformation();;
		return result;
	}
}
