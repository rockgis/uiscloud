package com.uiscloud.service.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.uiscloud.service.domain.Login;
import com.uiscloud.service.domain.Member;
import com.uiscloud.service.repository.JoinRepository;

@Service("joinService")
public class JoinServiceImpl implements JoinService {
	@Resource	
	private JoinRepository joinRepository;

	@Override
	public Member join(Member member) {
		Member savedMember = joinRepository.save(member);
		
		return savedMember;
	}

	@Override
	public Member join(Login login) {
		Member member = new Member(login.getUserId(), login.getPassword());
		
		return this.join(member);
	}
	
	@Override
	public boolean isNewMember(String userId) {
		Member member = joinRepository.findOne(userId);
		
		if(member == null) {
			return true;
		}
		
		return false;
	}

	@Override
	public boolean isNewMember(Login login) {
		return this.isNewMember(login.getUserId());
	}

	@Override
	public boolean isNewMember(Member member) {
		return this.isNewMember(member.getUserId());
	}
}