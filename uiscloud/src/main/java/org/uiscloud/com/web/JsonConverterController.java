/**
 * 
 * @Class Name  : JsonConverterController.java
 * @Description : JSON 을 Excel 로 변환
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 10. 23.  김종민		최초생성
 * 
 * @author 김종민
 * @since 2013. 10. 23.
 * @version 1.0
 * @see
 * 
 * JSON to Excel Convert Spring @MVC Controller
 *
 */
package org.uiscloud.com.web;

import java.util.Date;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.uiscloud.com.service.JsonConverterService;

@Controller("jsonConverterController")
public class JsonConverterController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());
	
	@Resource(name="jsonConverterService")
	private JsonConverterService jsonConverterService;
	
	public JsonConverterService getJsonConverterService() {
		return jsonConverterService;
	}

	public void setJsonConverterService(JsonConverterService jsonConverterService) {
		this.jsonConverterService = jsonConverterService;
	}

	/**
	 * 
	 * 업로드된 json 형태의 String 을 excel 로 변환 후 reponse 의 outputStream 으로 전송
	 * 
	 * @param HttpServletRequest request
	 * @param HttpServletResponse response
	 * @return 
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */	
	@RequestMapping(value="/gis/json2excel", method=RequestMethod.POST)	
	public void json2excel(HttpServletRequest request, HttpServletResponse response) throws Exception{
		String jsonFieldString = request.getParameter("jsonFieldString"); 
		String jsonDataString = request.getParameter("jsonDataString");
		
		/*
		 * 시큐어코딩점검보고서(2차)에 의한 코드 리팩토링
		 * 
		 * 널이 될 수 있는 레퍼런스(Reference)는 참조하기 전에 널 값인지를 검사하여 안전한 경우에만 사용한다
		 */
		jsonFieldString = (jsonFieldString == null)? "" : jsonFieldString;
		jsonDataString = (jsonDataString == null)? "" : jsonDataString;
		
		jsonFieldString = jsonFieldString.replace("&quot;", "\"");
		jsonDataString = jsonDataString.replace("&quot;", "\"");
		HSSFWorkbook excel = jsonConverterService.json2excel(jsonFieldString, jsonDataString);
		
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
	}
}