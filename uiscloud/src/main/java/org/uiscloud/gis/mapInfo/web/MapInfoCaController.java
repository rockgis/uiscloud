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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.JsonConverterService;
import org.uiscloud.gis.mapInfo.service.MapInfoCaSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoCaService;
import org.uiscloud.gis.mapInfo.service.MapInfoSearchVO;
import org.uiscloud.gis.mapInfo.service.MapInfoService;
import org.uiscloud.gis.mapInfo.service.MapInfoVO;
import org.uiscloud.gis.mapsv.service.SaveMapService;

@Controller
public class MapInfoCaController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** mapInfoService */
	@Resource(name = "mapInfoCaService")
	private MapInfoCaService mapInfoCaService;

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
	
	public MapInfoCaService getMapInfoCaService() {
		return mapInfoCaService;
	}

	public void setMapInfoCaService(
			MapInfoCaService mapInfoCaService) {
		this.mapInfoCaService = mapInfoCaService;
	}
	
	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
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
	@RequestMapping(value = "/gis/mapInfoCa/search")
	public View search(Model model, @ModelAttribute MapInfoCaSearchVO vo, BindingResult bindingResult) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
				
		Integer total = 0;
		
		if(vo.getTotalCount() == null) {
			total = mapInfoCaService.searchTotalCount(vo);
		} else {
			total = vo.getTotalCount();
		}
		
		List<MapInfoVO> result = mapInfoCaService.search(vo);
		
		model.addAttribute("total", total);
		model.addAttribute("rows", result);
		
		return jacksonJsonView;
	}

	@RequestMapping(value = "/gis/mapInfoCa/searchDownloadExcel")
	public void searchDownloadExcel(Model model, @ModelAttribute MapInfoCaSearchVO vo, BindingResult bindingResult, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
		
		String jsonFieldString = request.getParameter("jsonFieldString");
		String jsonDataString = "";

		mapInfoCaService.searchTotalCount(vo);
		String tableName = vo.getTableName().toUpperCase();
		
		ObjectMapper om = new ObjectMapper();
		jsonFieldString = om.writeValueAsString(mapInfoService.selectSpatialMetaColumn(tableName));
		jsonDataString = om.writeValueAsString(mapInfoCaService.searchForExcelCable(vo));
		
		
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
	
	@RequestMapping(value = "/gis/mapInfoCa/searchGids")
	public View searchGids(Model model, @ModelAttribute MapInfoCaSearchVO vo, BindingResult bindingResult) throws Exception {
		vo.setTotalCount(Integer.MAX_VALUE);
		
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
				
		List<Map<String, Integer>> result = mapInfoCaService.searchGids(vo);
		
		model.addAttribute("rows", result);
		
		return jacksonJsonView;
	}
}