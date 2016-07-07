package org.uiscloud.admin.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;
import org.uiscloud.admin.service.UserAdminVO;

@Repository("userAdminDAO")
public class UserAdminDAO {
	@Resource(name="sqlSessionTemplate")
	private SqlSessionTemplate sqlSession;
    
	public List<UserAdminVO> select(UserAdminVO userAdminVO) {
		return sqlSession.selectList("userAdminDAO.select", userAdminVO);
	}

	public int insert(UserAdminVO userAdminVO) {
		return sqlSession.insert("userAdminDAO.insert", userAdminVO);
	}

	public int update(UserAdminVO userAdminVO) {
		return sqlSession.update("userAdminDAO.update", userAdminVO);
	}

	public int delete(UserAdminVO userAdminVO) {
		return sqlSession.delete("userAdminDAO.delete", userAdminVO);
	}
}