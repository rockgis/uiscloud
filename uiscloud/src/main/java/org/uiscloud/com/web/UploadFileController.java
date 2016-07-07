/**
 * 
 * @Class Name  : FileUploadController.java
 * @Description : 다중 파일 업로드 컨트롤러
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 10. 23.  김종민		최초생성
 * @   2013. 10. 30.  최원석		KML 파일 업로드 추가, jacksonJsonView 와 ajaxupload 가 호환되지 않아 json string으로 반환하도록 수정
 * @   2013. 12. 03.  정봉화        파일 응답 json의 값을 한글을 위해 urlencode를 적용.
 * 
 * @author 김종민
 * @since 2013. 10. 23.
 * @version 1.0
 * @see
 * 
 * 다중 파일 업로드 Spring @MVC Controller
 *
 */
package org.uiscloud.com.web;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.View;
import org.uiscloud.com.service.UploadFileService;

import com.google.gson.JsonObject;

@Controller
public class UploadFileController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());
	
	/** FileUploadService */
	@Resource(name="uploadFileService")
	UploadFileService uploadFileService;
	
	/** jacksonJsonView */
	@Resource(name = "jacksonJsonView")
	private View jacksonJsonView;
	
	/**
	 * 
	 * 파일 업로드
	 * 
	 * @param requestedFile 업로드 요청 파일명
	 * @param request 요청
	 * @param response 응답
	 * @return jacksonJsonView
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */	
	@RequestMapping(value="/gis/fileUpload", method=RequestMethod.POST)
	@ResponseBody
	public String uploadFile(@RequestParam(required=false, defaultValue="") String userId, final MultipartHttpServletRequest request, Model model) throws Exception{
		//한글파일명을 사용하기위해서는 서버의 인코딩방식을 utf-8로 바꿔야합니다.
		Map<String, String> fileMap = uploadFileService.uploadFile(userId, request);
		JsonObject jsonObject = new JsonObject();
		 Set<Entry<String, String>> entrySet = fileMap.entrySet();
		 for(Entry<String, String> entry : entrySet) {
			 jsonObject.addProperty(entry.getKey(), URLEncoder.encode(entry.getValue(), "UTF-8"));
		 }
		return jsonObject.toString();
	}
	
	/**
	 * KML 파일을 업로드하고 내용(XML형태의 String)을 내려 보냄
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = "/gis/KMLFileUpload")
	public void uploadKMLFile(final MultipartHttpServletRequest request, HttpServletResponse response) throws IOException {
		uploadFileService.uploadKMLFile(request, response);
	}
}