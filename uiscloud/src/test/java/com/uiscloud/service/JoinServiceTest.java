package com.uiscloud.service;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import com.uiscloud.service.domain.Member;
import com.uiscloud.service.repository.JoinRepository;
import com.uiscloud.service.service.JoinService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:/spring-context.xml")
@Transactional
public class JoinServiceTest {
	@Resource	
	private JoinService joinService;
	
	@Resource	
	private JoinRepository joinRepository;
	
	@Test
	public void 기존_회원_없는_경우() {
		boolean tf = joinService.isNewMember("noUser@uiscloud.com");
		
		assertThat(tf, is(true));
	}
	
	@Test
	public void 기존_회원_있는_경우() {
		Member member = new Member("member@uiscloud.com", "a1b2C3D4!@");
		
		joinRepository.save(member);
		
		boolean tf = joinService.isNewMember(member.getUserId());
		
		assertThat(tf, is(false));
	}
}
