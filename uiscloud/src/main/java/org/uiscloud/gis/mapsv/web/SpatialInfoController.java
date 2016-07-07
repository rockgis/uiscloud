package org.uiscloud.gis.mapsv.web;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;
import org.uiscloud.gis.mapsv.service.SpatialInfoService;
import org.uiscloud.gis.mapsv.service.SpatialInfoVO;

@Controller
public class SpatialInfoController {

	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());
	
	@Resource(name = "spatialInfoService")
	private SpatialInfoService spatialInfoService;
	
	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;
	
	@RequestMapping(value = "/gis/mapsv/selectSpatialInfo")
	public View selectSpatialInfo(Model model, SpatialInfoVO spatialInfoVO) throws Exception {
		model.addAttribute("data", spatialInfoService.selectSpatialInfo(spatialInfoVO));
		return jacksonJsonView;
	}
	
	@RequestMapping(value = "/gis/mapsv/selectSpatialDetailInfo")
	public View selectSpatialDetailInfo(Model model, String params) throws Exception {
		model.addAttribute("tableInfo", spatialInfoService.selectSpatialMetaTable(null));
		model.addAttribute("data", spatialInfoService.selectSpatialDetailInfo(params));
		return jacksonJsonView;
	}
	
}
