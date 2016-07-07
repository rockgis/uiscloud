package org.uiscloud.admin.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.uiscloud.admin.service.UserAdminService;
import org.uiscloud.admin.service.UserAdminVO;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;

@Service("userAdminService")
public class UserAdminServiceImpl extends AbstractServiceImpl implements UserAdminService {
	/** userAdminDAO */
    @Resource(name="userAdminDAO")
    private UserAdminDAO userAdminDAO;
  
	@Override
	public List<UserAdminVO> select(UserAdminVO userAdminVO) {
		return userAdminDAO.select(userAdminVO);
	}
    
	@Override
	public int insert(UserAdminVO userAdminVO) {
		return userAdminDAO.insert(userAdminVO);
	}
	
	@Override
	public int update(UserAdminVO userAdminVO) {
		return userAdminDAO.update(userAdminVO);
	}

	@Override
	public int delete(UserAdminVO userAdminVO) {
		return userAdminDAO.delete(userAdminVO);
	}

}