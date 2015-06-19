package com.uiscloud.service.service;

import com.uiscloud.service.domain.Login;
import com.uiscloud.service.domain.Member;

public interface LoginService {

	public abstract Member login(Login login);

}