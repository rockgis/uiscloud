package com.uiscloud.service;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.uiscloud.service.domain.Login;
import com.uiscloud.service.domain.Member;
import com.uiscloud.service.repository.LoginRepository;
import com.uiscloud.service.service.LoginService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:/spring-context.xml")
@Transactional
public class LoginServiceTest {
	@Resource	
	private LoginService loginService;
	
	@Resource	
	private LoginRepository loginRepository;
	
	Member member;
	
	@Before
	public void setUp() {
		Member member = new Member("customer", "customer", "고객", "010-1111-2222", 1997);
		
		loginRepository.save(member);
	}

	@Test
	public void 로그인_회원_정상정보() {
		Login login = new Login("customer", "customer");
		
		Member loginedMember = loginService.login(login);
		
		assertThat(loginedMember, is(notNullValue()));
		assertThat(loginedMember.getUserId(), is(login.getUserId()));
		assertThat(loginedMember.getPassword(), is(login.getPassword()));
	}

	@Test
	public void 로그인_회원_아이디_없는_경우() {
		Login login = new Login("customer2", "customer");

		Member loginedMember = loginService.login(login);
		
		assertThat(loginedMember, is(nullValue()));
	}

	@Test
	public void 로그인_회원_비밀번호가_틀린_경우() {
		Login login = new Login("customer", "customer2");

		Member loginedMember = loginService.login(login);
		
		assertThat(loginedMember, is(nullValue()));
	}
	
	@Test
	public void 로그인_회원정보를_입력하지_않은_경우() {
		Login login = new Login();

		Member loginedMember = loginService.login(login);
		
		assertThat(loginedMember, is(nullValue()));
	}
}
