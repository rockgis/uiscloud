package com.uiscloud.controller;

import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import java.util.Locale;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.uiscloud.service.controller.LoginController;
import com.uiscloud.service.domain.Login;
import com.uiscloud.service.domain.Member;
import com.uiscloud.service.service.LoginService;

public class LoginControllerTest {
	private LoginController controller;
		
	private LoginService service;
//	private MessageSource messageSource;
	private ReloadableResourceBundleMessageSource messageSource;
	
    @Before 
    public void setUp() {
    	controller = new LoginController();
    	
    	service = org.mockito.Mockito.mock(LoginService.class);
    	
    	controller.setLoginService(service);
    	    	
//    	messageSource = controller.getMessageSource();
    	
    	messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames("classpath:/messages/message", "classpath:/messages/error");
        messageSource.setUseCodeAsDefaultMessage(true);
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(0);
        
        controller.setMessageSource(messageSource);
    }
    
    @After
    public void tearDown() {
    	reset(service); // Mockito Mock 초기화
    }

	@Test
	public void 로그인_GET_테스트() throws Exception {
    	MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    	    	
    	mockMvc.perform(get("/login"))
    		.andExpect(status().isOk());    	
		
		//verify(service, times(0)).login(Matchers.<Login>any());
	}

	@Test
	public void 로그인_POST_정상회원_테스트() throws Exception {		
		Login login = new Login();
		login.setUserId("customer@naver.cin");
		login.setPassword("customerZ12#");
		
		when(service.login(login)).thenReturn(new Member());
		
		MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		
		mockMvc.perform(post("/login").param("userId", "customer@naver.cin").param("password", "customerZ12#"))
				//.andExpect(status().isMovedTemporarily())
				.andExpect(status().isFound())
				.andExpect(redirectedUrl("/"));
		
		//verify(service, times(1)).login(login);
	}

	@Test
	public void 로그인_POST_비정상회원_테스트_idpw_불량() throws Exception {
		MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		
		mockMvc.perform(post("/login").param("userId", "customer2").param("password", "customer2"))
				.andExpect(status().isOk())
				.andExpect(view().name("/login/LoginF"));
		
		//verify(service, times(1)).login(Matchers.<Login>any());
	}

	@Test
	public void 로그인_POST_존재하지_않는_회원_테스트() throws Exception {
		MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		
		mockMvc.perform(post("/login").param("userId", "customer@naver.com").param("password", "customerZ12#"))
				.andExpect(status().isOk())
				.andExpect(model().attribute("message", messageSource.getMessage("error.notExistMember", null, Locale.getDefault())))
				.andExpect(view().name("/login/LoginF"));
		
		//verify(service, times(1)).login(Matchers.<Login>any());
	}
	
	
}