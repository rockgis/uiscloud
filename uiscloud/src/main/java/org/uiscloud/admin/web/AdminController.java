package org.uiscloud.admin.web;


import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Handles requests for the application home page.
 */
@Controller
public class AdminController {
	
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log logger = LogFactory.getLog(this.getClass());
	
	/**
	 * 메인화면 
	 * @param model 모델 객체
	 * @return 테스트 페이지 jsp 주소
	 */
	@RequestMapping({"/admin"})
	public String gisMain(final Model model, Authentication auth ,final HttpServletRequest request) {	
		
		logger.info("Welcome checkAuth! Authentication is {}.");
		
		model.addAttribute("auth", auth );
		
		
		return "/admin/index";	
	}
	
}
