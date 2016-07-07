package org.uiscloud.gis.mapInfo.web;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URLDecoder;
import java.util.Date;
import java.util.List;

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
import org.uiscloud.gis.mapInfo.service.RingSearchVO;
import org.uiscloud.gis.mapInfo.service.RingService;
import org.uiscloud.gis.mapInfo.service.RingVO;
import org.uiscloud.gis.mapsv.service.SaveMapService;

@Controller
public class RingController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());

	/** ringService */
	@Resource(name = "ringService")
	private RingService ringService;

	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	/** jsonConverterService */
	@Resource(name = "jsonConverterService")
	private JsonConverterService jsonConverterService;
	
	/** SaveMapService */
	@Resource(name="saveMapService")
	SaveMapService saveMapService;

	@RequestMapping(value = "/gis/ring/search")
	public View search(Model model, @ModelAttribute RingSearchVO vo, BindingResult bindingResult) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
				
		Integer total = 0;
		
		if(vo.getTotalCount() == null) {
			total = ringService.searchTotalCount(vo);
		} else {
			total = vo.getTotalCount();
		}
		
		List<RingVO> result = ringService.search(vo);
		
		model.addAttribute("total", total);
		model.addAttribute("rows", result);
		
		return jacksonJsonView;
	}
	
	/**
	 * 
	 * 검색 엑셀 다운로드
	 * 
     * @param
     * 		RingSearchVO
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 참고: http://stove99.tistory.com/20
	 * 
	 */
	@RequestMapping(value = "/gis/ring/searchDownloadExcel")
	public void searchDownloadExcel(Model model, @ModelAttribute RingSearchVO vo, BindingResult bindingResult, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(bindingResult.hasErrors()) {
			model.addAttribute("errorMessage", bindingResult.getAllErrors());
		}
		
		String jsonFieldString = request.getParameter("jsonFieldString");
		String jsonDataString = "";
		
		//jsonFieldString = jsonFieldString.replace("&quot;", "\"");
		
		//jsonFieldString = "[{\"field\":\"gid\", \"checkbox\": \"true\", \"width\":\"100\", \"halign\":\"center\", \"align\":\"left\", \"sortable\": \"false\"}, {\"field\":\"netNo\", \"title\":\"netNo\", \"width\":\"150\", \"halign\":\"center\", \"align\":\"left\", \"sortable\": \"false\"}, {\"field\":\"netNm\", \"title\":\"링명\", \"width\":\"180\", \"halign\":\"center\", \"align\":\"left\", \"sortable\": \"false\"}, {\"field\":\"netType\", \"title\":\"netType\", \"width\":\"120\", \"halign\":\"center\", \"align\":\"left\", \"sortable\": \"false\", \"hidden\": \"true\"}, {\"field\":\"caMgno\", \"title\":\"caMgno\", \"width\":\"200\", \"halign\":\"center\", \"align\":\"left\", \"sortable\": \"false\"}, {\"field\":\"sysClf\", \"title\":\"sysClf\", \"width\":\"120\", \"halign\":\"center\", \"align\":\"left\", \"sortable\": \"false\"}, {\"field\":\"ungrLoc\", \"title\":\"ungrLoc\", \"width\":\"100\", \"halign\":\"center\", \"align\":\"right\", \"sortable\": \"false\"}, {\"field\":\"gisCode\", \"title\":\"gisCode\", \"width\":\"200\", \"halign\":\"center\", \"align\":\"left\", \"sortable\": \"false\", \"hidden\": \"true\"}]";
		jsonFieldString = "[{\"field\":\"netTypeName\", \"title\":\"링종류\", \"width\":\"180\", \"halign\":\"center\", \"align\":\"left\", \"sortable\":\"true\"}, {\"field\":\"netNo\", \"title\":\"링번호\", \"width\":\"150\", \"halign\":\"center\", \"align\":\"left\", \"sortable\":\"true\"}, {\"field\":\"netNm\", \"title\":\"링명\", \"width\":\"180\", \"halign\":\"center\", \"align\":\"left\", \"sortable\":\"true\"}, {\"field\":\"countCable\", \"title\":\"참여 케이블 갯수\", \"width\":\"150\", \"halign\":\"center\", \"align\":\"right\", \"sortable\":\"true\"}, {\"field\":\"countTpo\", \"title\":\"참여 국소수\", \"width\":\"150\", \"halign\":\"center\", \"align\":\"right\", \"sortable\":\"true\"}, {\"field\":\"sumLengthSKTA\", \"title\":\"SKT 가공\", \"width\":\"150\", \"halign\":\"center\", \"align\":\"right\", \"sortable\":\"true\"}, {\"field\":\"sumLengthSKTD\", \"title\":\"SKT 지중\", \"width\":\"150\", \"halign\":\"center\", \"align\":\"right\", \"sortable\":\"true\"}, {\"field\":\"sumLengthSKBA\", \"title\":\"SKB 가공\", \"width\":\"150\", \"halign\":\"center\", \"align\":\"right\", \"sortable\":\"true\"}, {\"field\":\"sumLengthSKBD\", \"title\":\"SKB 지중\", \"width\":\"150\", \"halign\":\"center\", \"align\":\"right\", \"sortable\":\"true\"}, {\"field\":\"foo\", \"title\":\"코어링 추정(업데이트 예정)\", \"width\":\"200\", \"halign\":\"center\", \"align\":\"right\", \"sortable\":\"true\"}, {\"field\":\"bar\", \"title\":\"동일 전주 추정(업데이트 예정)\", \"width\":\"200\", \"halign\":\"center\", \"align\":\"right\", \"sortable\":\"true\"}]";
		
		ObjectMapper om = new ObjectMapper();
		
		List<RingVO> voList = ringService.searchForExcel(vo);
		
		jsonDataString = om.writeValueAsString(voList);
		
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

	@RequestMapping(value = "/gis/ring/detailPath")
	public String showDetailPath(Model model, @RequestParam String data) {
		String netNo = data;
		
		model.addAttribute("netNo", netNo);

		return "/gis/ring/detailPath";
	}

	@RequestMapping(value = "/gis/ring/selectDetailPath")
	public View selectDetailPath(Model model, @RequestParam String netNo) {
		model.addAttribute("path", ringService.selectDetailPath(netNo));

		return jacksonJsonView;
	}
}
