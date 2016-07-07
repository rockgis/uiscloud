package org.uiscloud.gis.pgRouting.web;

import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;
import org.uiscloud.gis.pgRouting.service.NetworkVO;
import org.uiscloud.gis.pgRouting.service.PgRoutingService;
import org.uiscloud.gis.pgRouting.service.StandardInformationVO;

@Controller
public class PgRoutingController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** pgRouting */
	@Resource(name = "pgRoutingService")
	private PgRoutingService pgRoutingService;

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	public PgRoutingService getPgRoutingService() {
		return pgRoutingService;
	}

	public void setPgRoutingService(
			PgRoutingService pgRoutingService) {
		this.pgRoutingService = pgRoutingService;
	}

	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
	}
	
	/**
	 * 
	 * Network 전체 조회 기능
	 * 
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/pgRouting/selectAllNetwork")
	public View selectAllNetwork(Model model) throws Exception {
		List<NetworkVO> result = pgRoutingService.selectAllNetwork();
		model.addAttribute("result", result);
		return jacksonJsonView;
	}
	
	/**
	 * 
	 * 기준정보 전체 조회 기능
	 * 
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/pgRouting/selectAllStandardInformation")
	public View selectAllStandardInformation(Model model) throws Exception {
		List<StandardInformationVO> result = pgRoutingService.selectAllStandardInformation();
		model.addAttribute("result", result);
		return jacksonJsonView;
	}
}
