package org.uiscloud.gis.interactiveUi.web;

import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.JsonConverterService;
import org.uiscloud.gis.interactiveUi.service.InteractiveService;
import org.uiscloud.gis.interactiveUi.service.InteractiveVO;
import org.uiscloud.gis.mapInfo.service.MapInfoCaSearchVO;

@Controller
public class InteractiveUiController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** investmentInfo */
	@Resource(name = "InteractiveService")
	private InteractiveService interactiveService;

	/** jsonConverterService */
	@Resource(name = "jsonConverterService")
	private JsonConverterService jsonConverterService;

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	@RequestMapping(value = "/gis/interactiveUi/show")
	public String show(Model model) throws Exception {
		//List<String> result = interactiveUiService.selectBusinessPurpose();

		
		//model.addAttribute("result", result);
		
		return "/gis/interactiveUi/show";
	}	
	

	
	/**
	 * 
	 * 검색 기능
	 * 
     * @param
     * 		InteractiveSearchVO // InteractiveSearchVO
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/interactiveUi/search")
	public View search(Model model, @ModelAttribute MapInfoCaSearchVO vo, BindingResult bindingResult) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
				

		List<InteractiveVO> nodes = interactiveService.searchNodes(vo);
		List<InteractiveVO> links = interactiveService.searchLinks(vo);

		model.addAttribute("nodes", nodes);
		model.addAttribute("links", links);
		
		return jacksonJsonView;
	}
	
	
}
