package com.uiscloud.service.controller;

import java.util.Locale;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.uiscloud.service.domain.Login;
import com.uiscloud.service.domain.Member;
import com.uiscloud.service.service.LoginService;
import com.uiscloud.service.util.JsonConvertor;

/**
 * Handles requests for the application home page.
 */
@Controller
public class LoginController {
	@Resource
	private LoginService loginService;
	
	@Resource
	private MessageSource messageSource;
		
	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	public LoginService getLoginService() {
		return loginService;
	}

	public void setLoginService(LoginService loginService) {
		this.loginService = loginService;
	}

	public MessageSource getMessageSource() {
		return messageSource;
	}

	public void setMessageSource(MessageSource messageSource) {
		this.messageSource = messageSource;
	}

	//로그인
	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String login(Locale locale, Model model) {
		model.addAttribute("login", new Login());
		return "/login/LoginF";
	}	

	//로그인
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public String login(Locale locale, Model model, HttpSession session, @Valid Login login, BindingResult result) {
		if(result.hasErrors()) {
			model.addAttribute("jsonLogin", JsonConvertor.getJsonFromObject(login));
			return "/login/LoginF";	
		}
		
		Member loginMember = loginService.login(login);
		
		if(loginMember == null) {
			model.addAttribute("jsonLogin", JsonConvertor.getJsonFromObject(login));
			model.addAttribute("message", messageSource.getMessage("error.notExistMember", null, locale));
			return "/login/LoginF";
		}
		
		session.setAttribute("userId", loginMember.getUserId());
		session.setAttribute("userName", loginMember.getUserName());
		
		return "redirect:/";
	}

}
