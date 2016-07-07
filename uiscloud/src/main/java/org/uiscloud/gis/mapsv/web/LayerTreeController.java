/**
 * 
 * @Class Name  : LayerTreeController.java
 * @Description : LayerTreeController Class
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 10. 14.  김종민		최초생성
 * 
 * @author 김종민
 * @since 2013. 10. 14.
 * @version 1.0
 * @see
 * 
 * 지도 레이어 트리 관리 Spring @MVC Controller
 *
 */
package org.uiscloud.gis.mapsv.web;

import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.uiscloud.gis.mapsv.service.LayerTreeService;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;

@Controller
public class LayerTreeController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** layerTreeService */
	@Resource(name = "layerTreeService")
	private LayerTreeService layerTreeService;

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	public LayerTreeService getLayerTreeService() {
		return layerTreeService;
	}

	public void setLayerTreeService(
			LayerTreeService layerTreeService) {
		this.layerTreeService = layerTreeService;
	}

	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
	}

	/**
	 * 
	 * 지도 레이어 트리 전체 조회 기능
	 * 
	 * @return jacksonJsonView
	 * @throws Exception
	 * 
	 */
	@RequestMapping(value = "/gis/selectLayerTreeList")
	public View selectLayerTreeList(Model model) throws Exception {
		model.addAttribute("layerList", layerTreeService.searchAll());
		return jacksonJsonView;
	}

	/**
	 * 
	 * PARENT_PK 기반 하위 레이어 트리 조회 기능
	 * 
	 * @param int parentPk
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/selectLayerChildTreeList")
	public View selectLayerChildTreeList(Model model,
			@RequestParam(required = false, defaultValue = "0") int parentPk)
			throws Exception {
		List<LayerTreeVO> list = layerTreeService
				.searchChildsByParentPk(parentPk);

		model.addAttribute("layerList", list);

		return jacksonJsonView;
	}
	
	
	/**
	 * 
	 * 지도 레이어 트리 전체 조회 기능
	 * 
	 * @return jacksonJsonView
	 * @throws Exception
	 * 
	 */
	@RequestMapping(value = "/gis/selectLayerTreeListU")
	public View selectLayerTreeListU(Model model) throws Exception {
		model.addAttribute("layerList", layerTreeService.searchAllU());
		return jacksonJsonView;
	}

	/**
	 * 
	 * PARENT_PK 기반 하위 레이어 트리 조회 기능
	 * 
	 * @param int parentPk
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/selectLayerChildTreeListU")
	public View selectLayerChildTreeListU(Model model,
			@RequestParam(required = false, defaultValue = "0") int parentPk)
			throws Exception {
		List<LayerTreeVO> list = layerTreeService
				.searchChildsByParentPk(parentPk);

		model.addAttribute("layerList", list);

		return jacksonJsonView;
	}
}