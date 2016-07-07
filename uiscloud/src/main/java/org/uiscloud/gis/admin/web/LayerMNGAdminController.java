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
import org.uiscloud.gis.admin.service.LayerMNGAdminService;
import org.uiscloud.gis.admin.service.LayerMNGAdminVO;

/**
 * Handles requests for the application home page.
 */
@Controller
public class LayerMNGAdminController {
	
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log logger = LogFactory.getLog(this.getClass());
	
	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;
	
	/** layerMNGAdminService */
	@Resource(name = "layerMNGAdminService")
	private LayerMNGAdminService layerMNGAdminService;
	
	/**
	 * 메인화면 
	 * @param model 모델 객체
	 * @return 테스트 페이지 jsp 주소
	 */
	@RequestMapping({"/admin/layermng"})
	public String gisMain(final Model model, Authentication auth ,final HttpServletRequest request) {	
		
		logger.info("Welcome checkAuth! Authentication is {}.");
		
		model.addAttribute("auth", auth );
		
		
		return "/admin/layer";	
	}
	
	@RequestMapping(value = "/admin/layer/select", method=RequestMethod.POST)
	public View select(LayerMNGAdminVO layerMNGAdminVO, Model model) throws Exception {
		List<LayerMNGAdminVO> result = layerMNGAdminService.select(layerMNGAdminVO);
		
		model.addAttribute("result", result);
		
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/admin/layer/insert", method=RequestMethod.POST)
	public View insert(LayerMNGAdminVO layerMNGAdminVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = layerMNGAdminService.insert(layerMNGAdminVO);
			model.addAttribute("rows", rows);
		}
		
		int rows = layerMNGAdminService.insert(layerMNGAdminVO);
		model.addAttribute("rows", rows);
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/admin/layer/update", method=RequestMethod.POST)
	public View update(LayerMNGAdminVO layerMNGAdminVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = layerMNGAdminService.update(layerMNGAdminVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/admin/layer/delete", method=RequestMethod.POST)
	public View delete(LayerMNGAdminVO layerMNGAdminVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = layerMNGAdminService.delete(layerMNGAdminVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
}
