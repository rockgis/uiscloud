package org.uiscloud.gis.interactiveUi.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.interactiveUi.service.InteractiveService;
import org.uiscloud.gis.interactiveUi.service.InteractiveVO;
import org.uiscloud.gis.mapInfo.service.MapInfoCaSearchVO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

/**
 * @author NPIMSKJM
 *
 */
@Service("InteractiveService")
public class InteractiveServiceImpl extends AbstractServiceImpl implements InteractiveService {
	/** mapInfoJpDAO */
    @Resource(name="interactiveDAO")
    private InteractiveDAO interactiveDAO;
    

	@Override
	public List<InteractiveVO> searchNodes(MapInfoCaSearchVO vo) {
		List<InteractiveVO> result = interactiveDAO.searchNodes(vo);
		return result;
	}
	@Override
	public List<InteractiveVO> searchLinks(MapInfoCaSearchVO vo) {
		List<InteractiveVO> result = interactiveDAO.searchLinks(vo);
		return result;
	}

}