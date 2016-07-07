/**
 * @Class Name : ExcelConverterController.java
 * @Description : 엑셀변환관리 컨트롤러
 * @Modification Information 
 * @ 
 * @ 수정일 수정자 수정내용 @ 
 * @ ------------- ------------------------------------- 
 * @ 2013. 11. 17. 김종민 최초 생성
 * 
 * @author 김종민
 * @since 2013. 11. 17.
 * @version 1.0
 * @see SK BIES 시스템
 * 
 * 엑셀변환관리 Spring @MVC Controller
 */
package org.uiscloud.com.web;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.ExcelConverterService;

@Controller("excelConverterController")
public class ExcelConverterController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());
	
	/** ExcelConverterService */
	@Resource(name="excelConverterService")
	ExcelConverterService excelConverterService;
	
	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;

	public ExcelConverterService getExcel2JSONService() {
		return excelConverterService;
	}

	public void setExcel2JSONService(ExcelConverterService excelConverterService) {
		this.excelConverterService = excelConverterService;
	}

	public View getJacksonJsonView() {
		return jacksonJsonView;
	}

	public void setJacksonJsonView(View jacksonJsonView) {
		this.jacksonJsonView = jacksonJsonView;
	}
	
	/**
	 * 
	 * 업로드된 Excel 파일을 List<List<String> 변환후 JSON 으로 전송
	 * JSON으로 변환하면 Array<Array> 형태로 변환됨
	 * 
	 * @param MultipartHttpServletRequest request 요청
	 * @param Model model
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */	
	@RequestMapping(value="/gis/excel2ListInList", method=RequestMethod.POST)
	public View excel2ListInList(final MultipartHttpServletRequest request, Model model) throws Exception{
		final MultipartHttpServletRequest multiRequest = request;
		final Map<String, MultipartFile> files = multiRequest.getFileMap();
		Integer sheetNumber = 0;
		
		Iterator<Entry<String, MultipartFile>> itr = files.entrySet().iterator();		
		itr.hasNext();
		Entry<String, MultipartFile> entry = itr.next();
		MultipartFile file = entry.getValue();
		
		String fileName = file.getOriginalFilename();
		int dotIndex = fileName.lastIndexOf(".");
		String fileExt = fileName.substring(dotIndex + 1, fileName.length());

		List<List<String>> listInList = excelConverterService.excel2ListInList(file.getInputStream(), fileExt, sheetNumber);
		
		model.addAttribute("root", listInList);

		return jacksonJsonView;
	}
	
	/**
	 * 
	 * 업로드된 Excel 파일을 List<Properties> 변환후 JSON 으로 전송
	 * JSON으로 변환하면 Array<JSONObject> 형태로 변환됨
	 * 
	 * @param MultipartHttpServletRequest request 요청
	 * @param Model model
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */		
	@RequestMapping(value="/gis/excel2json", method=RequestMethod.POST)
	public View excel2json(final MultipartHttpServletRequest request, Model model) throws Exception{
		final MultipartHttpServletRequest multiRequest = request;
		final Map<String, MultipartFile> files = multiRequest.getFileMap();
		Integer sheetNumber = 0;
		
		Iterator<Entry<String, MultipartFile>> itr = files.entrySet().iterator();		
		itr.hasNext();
		Entry<String, MultipartFile> entry = itr.next();
		MultipartFile file = entry.getValue();
		
		String fileName = file.getOriginalFilename();
		int dotIndex = fileName.lastIndexOf(".");
		String fileExt = fileName.substring(dotIndex + 1, fileName.length());

		List<Properties> propertiesInList = excelConverterService.excel2PropertiesInList(file.getInputStream(), fileExt, sheetNumber);
		
		model.addAttribute("root", propertiesInList);

		return jacksonJsonView;
	}
}