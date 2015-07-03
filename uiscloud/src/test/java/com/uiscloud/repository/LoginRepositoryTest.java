package com.uiscloud.repository;

import static org.junit.Assert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.nullValue;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.uiscloud.service.domain.Member;
import com.uiscloud.service.repository.LoginRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:/spring-context.xml")
@Transactional
public class LoginRepositoryTest {
	@Resource	
	private LoginRepository loginRepository;
	
	@Test
	public void 기존사용자_추출() {
		String userId = "expert@uisclud.com";
		String password = "a1B2#123";
		
		loginRepository.save(new Member(userId, password));
		
		Member member = loginRepository.findOne(userId);
	
		assertThat(member, is(notNullValue()));
		assertThat(member.getUserId(), is(userId));
		assertThat(member.getPassword(), is(password));
	}
	
	@Test
	public void 존재하지_않는_사용자_추출() {
		String userId = "expert@uisclud.com";
		
		Member member = loginRepository.findOne(userId);
	
		assertThat(member, is(nullValue()));
	}
	
	@Test
	public void Count() {
		String userId = "expert@uisclud.com";
		String password = "a1B2#123";
		
		Long count = loginRepository.count();
		
		assertThat(count, is(0L));
		
		loginRepository.save(new Member(userId, password));
		
		count = loginRepository.count();
	
		assertThat(count, is(1L));
	}
}
