package org.uiscloud.gis.mapInfo.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.uiscloud.gis.mapInfo.service.BuildingService;

@Controller
public class BuildingController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** buildingService */
	@Resource(name = "buildingService")
	private BuildingService buildingService;

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	public BuildingService getBuildingService() {
		return buildingService;
	}

	public void setBuildingService(BuildingService buildingService) {
		this.buildingService = buildingService;
	}

	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
	}

    /**
     * 
     * 주소 - 시도 검색
     *
     * @param
     * 		
     * @return 
     * 		List<PnuVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@RequestMapping(value = "/gis/building/selectSido")
	public View selectSido(Model model) throws Exception {
		List<Map<String, String>> map = buildingService.selectSido();

		model.addAttribute("result", map);

		return jacksonJsonView;
	}
	

    /**
     * 
     * 주소 - 시군구 검색
     *
     * @param
     * 		String pnu 시도 Pnu 2 자리
     * @return 
     * 		List<PnuVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@RequestMapping(value = "/gis/building/selectSggBySidoPnu")
	public View selectSggBySidoPnu(Model model, @RequestParam String pnu) throws Exception {
		List<Map<String, String>> map = buildingService.selectSggBySidoPnu(pnu);

		model.addAttribute("result", map);

		return jacksonJsonView;
	}
	

    /**
     * 
     * 주소 - 읍면동리 검색
     *
     * @param
     * 		String pnu 시군구 Pnu 5 자리
     * @return 
     * 		List<PnuVO>
     * @throws Exception
     * @see SK BIES 시스템
     *
     */	
	@RequestMapping(value = "/gis/building/selectEmdlBySggPnu")
	public View selectEmdlBySggPnu(Model model, @RequestParam String pnu) throws Exception {
		List<Map<String, String>> map = buildingService.selectEmdlBySggPnu(pnu);

		model.addAttribute("result", map);

		return jacksonJsonView;
	}
	
//	@RequestMapping(value = "/gis/building/selectBuilding")
//	public View selectBuilding(Model model, String pnu, String jibunBon, String bdName, String bdGroups, String bdTypes, @RequestParam(required=false) Integer floorMax, String floorMaxOverUnder) throws Exception {
//		// sidoPnu=41&sggPnu=41370&emdlPnu=4137012400&pnu=4137012400&jibunBon=&bdName=&bdGroups=&bdTypes=&floorMax=&floorMaxOverUnder=over
////		Map<String, String> searchConditionMap = getQueryMap(request.getQueryString());
//		Map<String, Object> searchConditionMap = new HashMap<String, Object>();
//		
//		searchConditionMap.put("pnu", pnu);
//		searchConditionMap.put("jibunBon", jibunBon);
//		searchConditionMap.put("bdName", bdName);
//		searchConditionMap.put("bdGroups", bdGroups);
//		searchConditionMap.put("bdTypes", bdTypes);
//		searchConditionMap.put("floorMax", floorMax);
//		searchConditionMap.put("floorMaxOverUnder", floorMaxOverUnder);
//		
//		List<Map<String, String>> result = buildingService.selectBuilding(searchConditionMap);
//
//		model.addAttribute("total", result.size());
//		model.addAttribute("rows", result);
//
//		return jacksonJsonView;
//	}
	
	
	
	@RequestMapping(value = "/gis/building/selectBuilding")
	public View selectBuilding(Model model, @RequestParam Map<String, Object> searchConditionMap) throws Exception {
		String tmp;
		
		tmp = (String) searchConditionMap.get("bdGroups");
		
		if (tmp != null && tmp.trim().length() > 0) {
			String[] bdGroupsArr = tmp.split(",");
			searchConditionMap.put("bdGroups", bdGroupsArr);
		}
		
		tmp = (String) searchConditionMap.get("bdTypes");
		
		if (tmp != null && tmp.trim().length() > 0) {
			String[] bdTypesArr = tmp.split(",");
			searchConditionMap.put("bdTypes", bdTypesArr);
		}
		
		List<Map<String, String>> result = buildingService.selectBuilding(searchConditionMap);

		model.addAttribute("total", result.size());
		model.addAttribute("rows", result);

		return jacksonJsonView;
	}
}