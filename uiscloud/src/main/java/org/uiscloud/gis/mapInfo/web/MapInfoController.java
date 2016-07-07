package org.uiscloud.gis.mapInfo.web;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URLDecoder;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.JsonConverterService;
import org.uiscloud.gis.mapInfo.service.FacilityVO;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoService;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapInfo.service.SpbdBuldVO;
import org.uiscloud.gis.mapInfo.service.SpbdEntrcVO;
import org.uiscloud.gis.mapInfo.service.SpotCntcVO;
import org.uiscloud.gis.mapsv.service.LayerTreeVO;
import org.uiscloud.gis.mapsv.service.SaveMapService;

@Controller
public class MapInfoController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** mapInfoService */
	@Resource(name = "mapInfoService")
	private MapInfoService mapInfoService;

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	/** jsonConverterService */
	@Resource(name = "jsonConverterService")
	private JsonConverterService jsonConverterService;
	
	/** SaveMapService */
	@Resource(name="saveMapService")
	SaveMapService saveMapService;
	
	public MapInfoService getMapInfoService() {
		return mapInfoService;
	}

	public void setMapInfoService(
			MapInfoService mapInfoService) {
		this.mapInfoService = mapInfoService;
	}

	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
	}
	
	/**
	 * 
	 * 시설물 종류 전체 조회 기능
	 * 
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/mapInfo/selectAllFacilityKind")
	public View selectFacilityKind(Model model) throws Exception {
		List<LayerTreeVO> result = mapInfoService.selectAllFacilityKind();
		
		model.addAttribute("result", result);
		
		return jacksonJsonView;
	}
	
	/**
	 * 
	 * 부모명을 포함한 레이어 트리 중 Bitwise And 연산에서 0 보다 큰 결과 전체 조회
	 * 
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/mapInfo/selectFacilityKindBySearchRequiredFieldsTypes")
	public View selectFacilityKindBySearchRequiredFieldsTypes(Model model, @RequestParam Integer searchRequiredFieldsTypes) throws Exception {
		List<LayerTreeVO> result = mapInfoService.selectFacilityKindBySearchRequiredFieldsTypes(searchRequiredFieldsTypes);
		
		model.addAttribute("result", result);
		
		return jacksonJsonView;
	}

	/**
	 * 
	 * 고유관리번호 검색 기능
	 * 
     * @param
     * 		layerTreePk // 시설물종류(레이어 트리 PK)
     * 		unqMgno //시설물관리번호
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/mapInfo/selectUnqMgno")
	public View selectUnqMgno(Model model, @RequestParam String tableName, @RequestParam String unqMgno) throws Exception {
		List<FacilityVO> result = mapInfoService.selectUnqMgno(tableName, unqMgno);
		
		model.addAttribute("total", result.size());
		model.addAttribute("rows", result);
		
		return jacksonJsonView;
	}

	/**
	 * 
	 * 지도정보 검색 기능
	 * 
     * @param
     * 		MapInfoSearchVO // MapInfoSearchVO
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/mapInfo/search")
	public View search(Model model, @ModelAttribute MapInfoSearchVO vo, BindingResult bindingResult) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
				
		Integer total = 0;
		
		if(vo.getTotalCount() == null) {
			total = mapInfoService.searchTotalCount(vo);
		} else {
			total = vo.getTotalCount();
		}
		
		List<MapInfoVO> result = mapInfoService.search(vo);
		
		model.addAttribute("total", total);
		model.addAttribute("rows", result);
		
		return jacksonJsonView;
	}

	/**
	 * 
	 * 지도정보 검색 엑셀 다운로드 기능
	 * 
     * @param
     * 		MapInfoSearchVO // MapInfoSearchVO
	 * @return Excel 파일
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	@RequestMapping(value = "/gis/mapInfo/searchDownloadExcel")
	public void searchDownloadExcel(Model model, @ModelAttribute MapInfoSearchVO vo, BindingResult bindingResult, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
		
		String jsonFieldString = request.getParameter("jsonFieldString");
		String jsonDataString = "";
		
		mapInfoService.searchTotalCount(vo);
		String tableName = vo.getTableName().toUpperCase();

		ObjectMapper om = new ObjectMapper();
		
		jsonFieldString = om.writeValueAsString(mapInfoService.selectSpatialMetaColumn(tableName));
		
		// 광케이블
		if("GOTC_CA".equals(tableName)) {
			//TODO
			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelCable(vo));
		} 
		// 관로
		else if("GOTC_CD".equals(tableName)) {
			//jsonFieldString = "[{\"field\":\"gid\", \"title\":\"일련번호\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"unqMgno\",\"title\":\"고유관리번호\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"fctsNm\",\"title\":\"시설명\", \"width\":100, \"halign\":\"center\", \"align\":\"right\"}, {\"field\":\"cnstMgno\",\"title\":\"공사번호\", \"width\":60, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lglNm\",\"title\":\"법정동명\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"gisNm\",\"title\":\"GIS분류\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"compLen\",\"title\":\"준공거리\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"digMthd\", \"title\":\"굴착방법\", \"width\":150, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lqtMt\",\"title\":\"관로규격\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"sysClf\",\"title\":\"소유구분\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}]";
			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelCableDuct(vo));
		} 
		// 접속함체
		else if("GOTC_JP".equals(tableName)) {
			//jsonFieldString = "[{\"field\":\"gid\", \"title\":\"일련번호\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"unqMgno\",\"title\":\"고유관리번호\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"fctsNm\",\"title\":\"시설명\", \"width\":100, \"halign\":\"center\", \"align\":\"right\"}, {\"field\":\"cnstMgno\",\"title\":\"공사번호\", \"width\":60, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lglNm\",\"title\":\"법정동명\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"gisNm\",\"title\":\"GIS분류\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"jpClf\",\"title\":\"설치위치\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"sysClf\",\"title\":\"소유구분\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}]";
			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelJoinPoint(vo));
		} 
		// 맨홀
		else if("GOTC_MH".equals(tableName)) {
			//jsonFieldString = "[{\"field\":\"gid\", \"title\":\"일련번호\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"unqMgno\",\"title\":\"고유관리번호\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"fctsNm\",\"title\":\"시설명\", \"width\":100, \"halign\":\"center\", \"align\":\"right\"}, {\"field\":\"cnstMgno\",\"title\":\"공사번호\", \"width\":60, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lglNm\",\"title\":\"법정동명\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"gisNm\",\"title\":\"GIS분류\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"mhStd\",\"title\":\"맨홀규격\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"sysClf\",\"title\":\"소유구분\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}]";
			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelManHole(vo));
		} 
		// 국소
		else if("GOTC_TPO".equals(tableName)) {
			//jsonFieldString = "[{\"field\":\"gid\", \"title\":\"일련번호\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"unqMgno\",\"title\":\"고유관리번호\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"fctsNm\",\"title\":\"시설명\", \"width\":100, \"halign\":\"center\", \"align\":\"right\"}, {\"field\":\"cnstMgno\",\"title\":\"공사번호\", \"width\":60, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lglNm\",\"title\":\"법정동명\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"gisNm\",\"title\":\"GIS분류\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"addr\",\"title\":\"주소\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"clientCd\",\"title\":\"국소유형\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}]";
			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelTPO(vo));
		}		

		// Start: 이미지 생성		
		String data = request.getParameter("data");
		
		/*
		 * 시큐어코딩점검보고서(2차)에 의한 코드 리팩토링
		 * 
		 * 널이 될 수 있는 레퍼런스(Reference)는 참조하기 전에 널 값인지를 검사하여 안전한 경우에만 사용한다
		 */
		data = (data == null)? "" : data;
		
		ByteArrayOutputStream imgOutputStream = new ByteArrayOutputStream();
		
		try {
			data = URLDecoder.decode(data, "UTF-8");
			String contextPath = request.getRequestURL().substring(0, request.getRequestURL().indexOf(request.getRequestURI()));
			BufferedImage bi = saveMapService.createImages(data, contextPath);
			ImageIO.write(bi, "png", imgOutputStream);
			
			HSSFWorkbook excel = jsonConverterService.json2excelWithImage(jsonFieldString, jsonDataString, imgOutputStream, 9, 30);
			
			String fileName = "BIES" + (new Date()).getTime() + ".xls";
			
			if(request.getHeader("User-Agent").indexOf("MSIE 5.5") > -1) {
				response.setHeader("Content-Disposition",  "filename=" + fileName + ";");
			} else {
				response.setContentType("application/vnd.ms-excel");
				response.setHeader("Content-Disposition",  "attachment;filename=" + fileName + ";");
			}
			
			excel.write(response.getOutputStream());		
			
			response.getOutputStream().flush();
			response.getOutputStream().close();	
		} catch (Exception e1) {
			log.error("Error File Download");			
		}
		finally {
			if(imgOutputStream != null) {
				imgOutputStream.close();	
			}
		}		
		// Finish: 이미지 생성
	}
	
	@RequestMapping(value = "/gis/mapInfo/searchGids")
	public View searchGids(Model model, @ModelAttribute MapInfoSearchVO vo, BindingResult bindingResult) throws Exception {
		vo.setTotalCount(Integer.MAX_VALUE);
		
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
				
		List<Map<String, Integer>> result = mapInfoService.searchGids(vo);
		
		model.addAttribute("rows", result);
		
		return jacksonJsonView;
	}
	
//	@RequestMapping(value = "/gis/mapInfo/searchDownloadExcel")
//	public void searchDownloadExcel(Model model, @ModelAttribute MapInfoSearchVO vo, BindingResult bindingResult, HttpServletRequest request, HttpServletResponse response) throws Exception {
//		if(bindingResult.hasErrors()) {
//			model.addAttribute("errorMessage", bindingResult.getAllErrors());
//		}
//		
//		String jsonFieldString = request.getParameter("jsonFieldString");
//		String jsonDataString = "";
//		
//		mapInfoService.searchTotalCount(vo.getLayerTreePk(), vo);
//		String tableName = vo.getTableName().toUpperCase();
//
//		ObjectMapper om = new ObjectMapper();
//		
//		jsonFieldString = om.writeValueAsString(mapInfoService.selectSpatialMetaColumn(tableName));
//		
//		// 광케이블
//		if("GOTC_CA".equals(tableName)) {
//			//TODO
//			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelCable(vo));
//		} 
//		// 관로
//		else if("GOTC_CD".equals(tableName)) {
//			//jsonFieldString = "[{\"field\":\"gid\", \"title\":\"일련번호\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"unqMgno\",\"title\":\"고유관리번호\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"fctsNm\",\"title\":\"시설명\", \"width\":100, \"halign\":\"center\", \"align\":\"right\"}, {\"field\":\"cnstMgno\",\"title\":\"공사번호\", \"width\":60, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lglNm\",\"title\":\"법정동명\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"gisNm\",\"title\":\"GIS분류\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"compLen\",\"title\":\"준공거리\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"digMthd\", \"title\":\"굴착방법\", \"width\":150, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lqtMt\",\"title\":\"관로규격\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"sysClf\",\"title\":\"소유구분\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}]";
//			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelCableDuct(vo));
//		} 
//		// 접속함체
//		else if("GOTC_JP".equals(tableName)) {
//			//jsonFieldString = "[{\"field\":\"gid\", \"title\":\"일련번호\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"unqMgno\",\"title\":\"고유관리번호\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"fctsNm\",\"title\":\"시설명\", \"width\":100, \"halign\":\"center\", \"align\":\"right\"}, {\"field\":\"cnstMgno\",\"title\":\"공사번호\", \"width\":60, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lglNm\",\"title\":\"법정동명\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"gisNm\",\"title\":\"GIS분류\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"jpClf\",\"title\":\"설치위치\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"sysClf\",\"title\":\"소유구분\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}]";
//			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelJoinPoint(vo));
//		} 
//		// 맨홀
//		else if("GOTC_MH".equals(tableName)) {
//			//jsonFieldString = "[{\"field\":\"gid\", \"title\":\"일련번호\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"unqMgno\",\"title\":\"고유관리번호\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"fctsNm\",\"title\":\"시설명\", \"width\":100, \"halign\":\"center\", \"align\":\"right\"}, {\"field\":\"cnstMgno\",\"title\":\"공사번호\", \"width\":60, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lglNm\",\"title\":\"법정동명\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"gisNm\",\"title\":\"GIS분류\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"mhStd\",\"title\":\"맨홀규격\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"sysClf\",\"title\":\"소유구분\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}]";
//			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelManHole(vo));
//		} 
//		// 국소
//		else if("GOTC_TPO".equals(tableName)) {
//			//jsonFieldString = "[{\"field\":\"gid\", \"title\":\"일련번호\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"unqMgno\",\"title\":\"고유관리번호\", \"width\":300, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"fctsNm\",\"title\":\"시설명\", \"width\":100, \"halign\":\"center\", \"align\":\"right\"}, {\"field\":\"cnstMgno\",\"title\":\"공사번호\", \"width\":60, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"lglNm\",\"title\":\"법정동명\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"gisNm\",\"title\":\"GIS분류\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"addr\",\"title\":\"주소\", \"width\":120, \"halign\":\"center\", \"align\":\"left\"}, {\"field\":\"clientCd\",\"title\":\"국소유형\", \"width\":200, \"halign\":\"center\", \"align\":\"left\"}]";
//			jsonDataString = om.writeValueAsString(mapInfoService.searchForExcelTPO(vo));
//		}
//		
//		HSSFWorkbook excel = jsonConverterService.json2excel(jsonFieldString, jsonDataString);
//		
//		String fileName = "BIES" + (new Date()).getTime() + ".xls";
//		
//		if(request.getHeader("User-Agent").indexOf("MSIE 5.5") > -1) {
//			response.setHeader("Content-Disposition",  "filename=" + fileName + ";");
//		} else {
//			response.setContentType("application/vnd.ms-excel");
//			response.setHeader("Content-Disposition",  "attachment;filename=" + fileName + ";");
//		}
//		
//		excel.write(response.getOutputStream());		
//		
//		response.getOutputStream().flush();
//		response.getOutputStream().close();	
//	}
	
	@RequestMapping(value="/gis/mapInfo/spbdEntrc/insert", method=RequestMethod.POST)
	public View insertSpbdEntrc(SpbdEntrcVO spbdEntrcVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.insertSpbdEntrc(spbdEntrcVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/gis/mapInfo/spotCntc/insert", method=RequestMethod.POST)
	public View insertSpotCntc(SpotCntcVO spotCntcVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.insertSpotCntc(spotCntcVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/gis/mapInfo/spbdBuld/insert", method=RequestMethod.POST)
	public View insertSpbdBuld(SpbdBuldVO spbdBuldVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.insertSpbdBuld(spbdBuldVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/gis/mapInfo/spbdEntrc/update", method=RequestMethod.POST)
	public View updateSpbdEntrc(SpbdEntrcVO spbdEntrcVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.updateSpbdEntrc(spbdEntrcVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/gis/mapInfo/spotCntc/update", method=RequestMethod.POST)
	public View updateSpotCntc(SpotCntcVO spotCntcVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.updateSpotCntc(spotCntcVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/gis/mapInfo/spbdBuld/update", method=RequestMethod.POST)
	public View updateSpbdBuld(SpbdBuldVO spbdBuldVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.updateSpbdBuld(spbdBuldVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/gis/mapInfo/spbdEntrc/delete", method=RequestMethod.POST)
	public View deleteSpbdEntrc(SpbdEntrcVO spbdEntrcVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.deleteSpbdEntrc(spbdEntrcVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/gis/mapInfo/spotCntc/delete", method=RequestMethod.POST)
	public View deleteSpotCntc(SpotCntcVO spotCntcVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.deleteSpotCntc(spotCntcVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
	
	@RequestMapping(value="/gis/mapInfo/spbdBuld/delete", method=RequestMethod.POST)
	public View deleteSpbdBuld(SpbdBuldVO spbdBuldVO, BindingResult bindingResult, Model model) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("rows", -1);
		}
		else {
			int rows = mapInfoService.deleteSpbdBuld(spbdBuldVO);
			model.addAttribute("rows", rows);
		}
		return jacksonJsonView;
	}
}