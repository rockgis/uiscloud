package org.uiscloud.admin.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.admin.service.LayerMNGAdminVO;

@Repository("layerMNGAdminDAO")
public class LayerMNGAdminDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
    
	public List<LayerMNGAdminVO> select(LayerMNGAdminVO layerMNGAdminVO) {
		return sqlSession.selectList("layerMNGAdminDAO.select", layerMNGAdminVO);
	}

	public int insert(LayerMNGAdminVO layerMNGAdminVO) {
		return sqlSession.insert("layerMNGAdminDAO.insert", layerMNGAdminVO);
	}

	public int update(LayerMNGAdminVO layerMNGAdminVO) {
		return sqlSession.update("layerMNGAdminDAO.update", layerMNGAdminVO);
	}

	public int delete(LayerMNGAdminVO layerMNGAdminVO) {
		return sqlSession.delete("layerMNGAdminDAO.delete", layerMNGAdminVO);
	}
}