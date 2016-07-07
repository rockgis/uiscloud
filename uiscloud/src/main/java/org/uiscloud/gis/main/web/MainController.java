/**
 * 
 * @Class Name  : MainController.java
 * @Description : MainController Class
 * @Modification Information  
 * @
 * @   수정일          수정자        수정내용
 * @ -------------  ----------  ---------------------------
 * @  2013. 09. 24.	윤중근		최초 생성
 * 		2013. 11. 26.	최원석		파일 위치 변경 및 업무단과 연계를 위한 준비 작업
 * 
 * @author 윤중근      
 * @since 2013. 09. 24.
 * @version 1.0
 * @see
 * 
 *
 */

package org.uiscloud.gis.main.web;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.security.core.Authentication;

@Controller
public class MainController {
	
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log logger = LogFactory.getLog(this.getClass());
	
	/**
	 * 메인화면 
	 * @param model 모델 객체
	 * @return 테스트 페이지 jsp 주소
	 */
	@RequestMapping({"/gis/gisMain", "/gis"})
	public String gisMain(final Model model, Authentication auth ,final HttpServletRequest request) {	
		
		logger.info("Welcome checkAuth! Authentication is {}.");
		
		model.addAttribute("auth", auth );
		
		
		return "/gis/gisMainF";	
	}
	
	
	@RequestMapping({"/gis/gisMainK"})
	public String gisMain_u(final Model model, Authentication auth ,final HttpServletRequest request) {	
		
		logger.info("Welcome checkAuth! Authentication is {}.");
		
		model.addAttribute("auth", auth );
		
		
		return "/gis/gisMainK";	
	}
	
	
	@RequestMapping({"/main", "/"})
	public String Main(final Model model, Authentication auth ,final HttpServletRequest request) {	
		
		logger.info("Welcome checkAuth! Authentication is {}.");
		
		model.addAttribute("auth", auth );
		
		
		return "/gis/Main";	
	}
	
	@RequestMapping({"/gis/main_n"})
	public String gisMain_n(final Model model, Authentication auth ,final HttpServletRequest request) {	
		
		logger.info("Welcome checkAuth! Authentication is {}.");
		
		model.addAttribute("auth", auth );
		
		
		return "/geolib/gisMainF";	
	}

/*
	*//**
	 * 연계 테스트를 하기 위한 테스트 페이지
	 * @return 테스트 페이지 jsp 주소
	 *//*
	@RequestMapping(value = "/gis/gisMainTest")
	public String gisMain() {
		return "/gis/gisMainTestF";
	}*/
	
}