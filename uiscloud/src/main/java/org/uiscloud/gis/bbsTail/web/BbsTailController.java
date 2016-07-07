package org.uiscloud.gis.bbsTail.web;

import java.net.URLEncoder;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.uiscloud.gis.bbs.service.BbsDefaultVO;
import org.uiscloud.gis.bbsTail.service.BbsTailService;
import org.uiscloud.gis.bbsTail.service.BbsTailVO;

/**
 * @Class Name : BbsTailController.java
 * @Description : BbsTail Controller class
 * @Modification Information
 * 
 * @author 김종민
 * @since 2014.03.05
 * @version 1.0
 * @see Copyright (C) All right reserved.
 */

@Controller
@SessionAttributes(types = BbsTailVO.class)
public class BbsTailController {
	@Resource(name = "bbsTailService")
	private BbsTailService bbsTailService;

	@RequestMapping(value = "/gis/bbsTail/addBbsTail")
	public String addBbsTail(BbsTailVO bbsTailVO,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			BindingResult bindingResult, ModelMap model, SessionStatus status,
			HttpServletRequest request, HttpSession session) throws Exception {

		bbsTailService.insertBbsTail(bbsTailVO);
		status.setComplete();

		String errMsg = "bbsTailInsertSuccess";
		return "redirect:/gis/bbs/updateBbsView?bbsId="
				+ bbsTailVO.getBbsVO().getBbsId() + "&searchKeyword="
				+ URLEncoder.encode(searchVO.getSearchKeyword(), "UTF-8") + "&searchCondition="
				+ searchVO.getSearchCondition() + "&pageIndex="
				+ searchVO.getPageIndex() + "&errMsg=" + errMsg;
		// return bbsController.updateBbsView(bbsTailVO.getBbsId(), searchVO,
		// (Model)model, request, session);
	}

	@RequestMapping(value = "/gis/bbsTail/selectBbsTail")
	public @ModelAttribute("bbsTailVO")
	BbsTailVO selectBbsTail(BbsTailVO bbsTailVO,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO) throws Exception {
		return bbsTailService.selectBbsTail(bbsTailVO);
	}

	@RequestMapping(value = "/gis/bbsTail/updateBbsTail")
	public String updateBbsTail(BbsTailVO bbsTailVO,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			SessionStatus status, ModelMap model, HttpServletRequest request,
			HttpSession session) throws Exception {
		String errMsg = "";
		
		BbsTailVO oldVO = bbsTailService.selectBbsTail(bbsTailVO);

		if (oldVO.getPwd().equals(bbsTailVO.getPwd())) {
			bbsTailService.updateBbsTail(bbsTailVO);
			errMsg = "bbsTailUpdateSuccess";
			// status.setComplete();
			// return bbsController.updateBbsView(bbsTailVO.getBbsId(),
			// searchVO, (Model)model, request);
			// return "redirect:/gis/bbsTail/BbsTailList?bbsId=" +
			// bbsTailVO.getBbsVO().getBbsId();
		} else {
			// model.addAttribute(selectBbsTail(oldVO, searchVO));
			errMsg = "bbsTailUpdateFail";
			// return "/gis/bbs/BbsUpdate";
		}

		String URL = "redirect:/gis/bbs/updateBbsView?bbsId="
				+ bbsTailVO.getBbsVO().getBbsId() + "&searchKeyword="
				+ URLEncoder.encode(searchVO.getSearchKeyword(), "UTF-8") + "&searchCondition="
				+ searchVO.getSearchCondition() + "&pageIndex="
				+ searchVO.getPageIndex() + "&errMsg=" + errMsg;
		
		return URL;
		
		// return bbsController.updateBbsView(bbsTailVO.getBbsId(), searchVO,
		// (Model)model, request, session);
	}

	@RequestMapping(value = "/gis/bbsTail/deleteBbsTail")
	public String deleteBbsTail(BbsTailVO bbsTailVO,
			@ModelAttribute("searchVO") BbsDefaultVO searchVO,
			SessionStatus status, ModelMap model, HttpServletRequest request,
			HttpSession session) throws Exception {
		String errMsg = "";

		BbsTailVO oldVO = bbsTailService.selectBbsTail(bbsTailVO);

		if (oldVO.getPwd().equals(bbsTailVO.getPwd())) {
			bbsTailService.deleteBbsTail(bbsTailVO);
			errMsg = "bbsTailDeleteSucess";
			// status.setComplete();
			// return bbsController.updateBbsView(bbsTailVO.getBbsId(),
			// searchVO, (Model)model, request);
			// return "redirect:/gis/bbsTail/BbsTailList?bbsId=" +
			// bbsTailVO.getBbsVO().getBbsId();
		} else {
			errMsg = "bbsTailDeleteFail";
			// return "/gis/bbs/BbsUpdate";
		}

		return "redirect:/gis/bbs/updateBbsView?bbsId="
				+ bbsTailVO.getBbsVO().getBbsId() + "&searchKeyword="
				+ URLEncoder.encode(searchVO.getSearchKeyword(), "UTF-8") + "&searchCondition="
				+ searchVO.getSearchCondition() + "&pageIndex="
				+ searchVO.getPageIndex() + "&errMsg=" + errMsg;
		// return bbsController.updateBbsView(bbsTailVO.getBbsId(), searchVO,
		// (Model)model, request, session);
	}
}