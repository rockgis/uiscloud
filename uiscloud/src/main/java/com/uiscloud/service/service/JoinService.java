package com.uiscloud.service.service;

import com.uiscloud.service.domain.Login;
import com.uiscloud.service.domain.Member;

public interface JoinService {

	public abstract Member join(Member member);

	public abstract Member join(Login login);

	boolean isNewMember(String userId);
	
	boolean isNewMember(Login login);
	
	boolean isNewMember(Member member);

}