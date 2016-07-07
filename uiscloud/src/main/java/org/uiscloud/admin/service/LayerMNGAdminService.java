package org.uiscloud.admin.service;

import java.util.List;

public interface LayerMNGAdminService {
	public int insert(LayerMNGAdminVO layerMNGAdminVO);

	public int update(LayerMNGAdminVO layerMNGAdminVO);

	public int delete(LayerMNGAdminVO layerMNGAdminVO);

	List<LayerMNGAdminVO> select(LayerMNGAdminVO layerMNGAdminVO);

}