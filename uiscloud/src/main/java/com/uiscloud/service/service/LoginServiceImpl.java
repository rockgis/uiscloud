package com.uiscloud.service.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.uiscloud.service.domain.Login;
import com.uiscloud.service.domain.Member;
import com.uiscloud.service.repository.LoginRepository;

@Service("loginService")
public class LoginServiceImpl implements LoginService {
	@Resource	
	private LoginRepository loginRepository;
	
	@Override
	public Member login(Login login) {
		if(login == null || login.getUserId() == null) {
			return null;
		}
		
		Member loginMember = loginRepository.findOne(login.getUserId());
		
		if(loginMember != null && loginMember.getPassword().equals(login.getPassword())) {
			return loginMember;			
		}
		
		return null;
	}
}