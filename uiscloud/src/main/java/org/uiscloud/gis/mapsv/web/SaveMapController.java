/**
 * 
 * @Class Name  : SaveMapController.java
 * @Description : 지도 화면 저장 이미지
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 11. 21.  최원석		최초생성
 * 
 * @author 최원석
 * @since 2013. 11. 21.
 * @version 1.0
 * @see
 * 
 * 지도 화면 저장 이미지 Controller
 *
 */
package org.uiscloud.gis.mapsv.web;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Writer;
import java.net.URLDecoder;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.uiscloud.com.service.UploadFileService;
import org.uiscloud.gis.mapsv.service.SaveMapService;

import com.google.gson.JsonObject;

@Controller
public class SaveMapController {
	
	/** Logger */
	private Log log = LogFactory.getLog(this.getClass());

	/** SaveMapService */
	@Resource(name="saveMapService")
	SaveMapService saveMapService;
	
	/** FileUploadService */
	@Resource(name="uploadFileService")
	UploadFileService uploadFileService;
	
	/**
	 * 현재 지도 다운로드
	 * @param data 지도 정보(XML)
	 * @param request 요청 객체
	 * @param response 응답 객체
	 * @throws IOException
	 */
	@RequestMapping(value="/gis/saveMapDownload")
	public void saveMapDownload(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String data = request.getParameter("data");
		
		/*
		 * 시큐어코딩점검보고서(2차)에 의한 코드 리팩토링
		 * 
		 * 널이 될 수 있는 레퍼런스(Reference)는 참조하기 전에 널 값인지를 검사하여 안전한 경우에만 사용한다
		 */
		data = (data == null)? "" : data;
		
		OutputStream os = null;
		try {
			data = URLDecoder.decode(data, "UTF-8");
			String contextPath = request.getRequestURL().substring(0, request.getRequestURL().indexOf(request.getRequestURI()));
			BufferedImage bi = saveMapService.createImages(data, contextPath);
			response.setContentType("image/png");
			response.setHeader("Content-Disposition", "attachment; filename=bies.png");
			os = response.getOutputStream();
			ImageIO.write(bi, "png", os);
			response.flushBuffer();
		} catch (Exception e1) {
			log.error("Error File Download");
			Writer out = response.getWriter();
			out.write("error");
			out.close();
		}
		finally {
			if(os != null) {
				os.close();	
			}
		}
	}
	
	/**
	 * 현재 지도 서버 저장
	 * @param data 지도 정보(XML)
	 * @param userId 사용자아이디
	 * @param request 요청 객체
	 * @param response 응답 객체 
	 * @return
	 */
	@RequestMapping(value="/gis/saveMapScreen", method=RequestMethod.POST)
	@ResponseBody
	public String saveMapScreen(String data, String userId, HttpServletRequest request, HttpServletResponse response) {
		JsonObject jsonObject = new JsonObject();
		try {
			String decodeData = URLDecoder.decode(data, "UTF-8");
			String contextPath = request.getRequestURL().substring(0, request.getRequestURL().indexOf(request.getRequestURI()));
			BufferedImage bi = saveMapService.createImages(decodeData, contextPath);
			Map<String, String> fileMap = uploadFileService.uploadScreenCapture(userId, bi);
			 Set<Entry<String, String>> entrySet = fileMap.entrySet();
			 for(Entry<String, String> entry : entrySet) {
				 jsonObject.addProperty(entry.getKey(), entry.getValue());
			 }
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("Error Screen Capture");
		} 
		return jsonObject.toString();
	}
}
