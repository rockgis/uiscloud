package org.uiscloud.gis.admin.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.gis.admin.service.LayerMNGAdminService;
import org.uiscloud.gis.admin.service.LayerMNGAdminVO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

@Service("layerMNGAdminService")
public class LayerMNGAdminServiceImpl extends AbstractServiceImpl implements LayerMNGAdminService {
	/** layerMNGAdminDAO */
    @Resource(name="layerMNGAdminDAO")
    private LayerMNGAdminDAO layerMNGAdminDAO;
  
	@Override
	public List<LayerMNGAdminVO> select(LayerMNGAdminVO layerMNGAdminVO) {
		return layerMNGAdminDAO.select(layerMNGAdminVO);
	}
    
	@Override
	public int insert(LayerMNGAdminVO layerMNGAdminVO) {
		return layerMNGAdminDAO.insert(layerMNGAdminVO);
	}
	
	@Override
	public int update(LayerMNGAdminVO layerMNGAdminVO) {
		return layerMNGAdminDAO.update(layerMNGAdminVO);
	}

	@Override
	public int delete(LayerMNGAdminVO layerMNGAdminVO) {
		return layerMNGAdminDAO.delete(layerMNGAdminVO);
	}

}