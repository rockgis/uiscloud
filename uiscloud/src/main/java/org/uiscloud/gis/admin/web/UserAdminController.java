package org.uiscloud.gis.admin.web;


import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.View;
import org.uiscloud.gis.admin.service.UserAdminService;
import org.uiscloud.gis.admin.service.UserAdminVO;

/**
 * Handles requests for the application home page.
 */
@Controller
public class UserAdminController {
	
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log logger = LogFactory.getLog(this.getClass());
	
	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;
	
	/** userAdminService */
	@Resource(name = "userAdminService")
	private UserAdminService userAdminService;
	
	/**
	 * 메인화면 
	 * @param model 모델 객체
	 * @return 테스트 페이지 jsp 주소
	 */
	@RequestMapping({"/admin/user"})
	public String gisMain(final Model model, Authentication auth ,final HttpServletRequest request) {	
		
		logger.info("Welcome checkAuth! Authentication is {}.");
		
		model.addAttribute("auth", auth );
		
		
		return "/admin/user";	
	}
	
	@RequestMapping(value = "/admin/user/select", method=RequestMethod.POST)
	public View select(UserAdminVO userAdminVO, Model model) throws Exception {
		List<UserAdminVO> result = userAdminService.select(userAdminVO);
		
		model.addAttribute("result", result);
		
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/admin/user/insert", method=RequestMethod.POST)
	public View insert(UserAdminVO userAdminVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = userAdminService.insert(userAdminVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/admin/user/update", method=RequestMethod.POST)
	public View update(UserAdminVO userAdminVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = userAdminService.update(userAdminVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/admin/user/delete", method=RequestMethod.POST)
	public View delete(UserAdminVO userAdminVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = userAdminService.delete(userAdminVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
}
