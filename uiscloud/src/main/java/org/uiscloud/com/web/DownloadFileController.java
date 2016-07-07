/**
 * 
 * @Class Name  : FileDownloadController.java
 * @Description : 단일 파일 다운로드 컨트롤러
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 10. 23.  김종민		최초생성
 * @   2013. 10. 30.	  최원석		KML 파일 다운로드 추가
 * 
 * @author 김종민
 * @since 2013. 10. 23.
 * @version 1.0
 * @see
 * 
 * 단일 파일 다운로드 Spring @MVC Controller
 *
 */
package org.uiscloud.com.web;

import java.net.URLDecoder;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.uiscloud.com.service.DownloadFileService;

@Controller("fileDownloadController")
public class DownloadFileController {
	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());
	
	/** dsplPsbService */
	@Resource(name = "downloadFileService")
	private DownloadFileService downloadFileService;
	
	@Resource(name="messageSource")
    private MessageSource messageSource;
	
	
	/**
	 * 
	 * 파일 다운로드
	 * 
	 * @param requestedFile	다운로드 요청 파일명
	 * @param userId 사용자 ID
	 * @param response 응답
	 * @return void (Response 에 직접 작업)
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */	
	@RequestMapping(value="/gis/fileDownload")
	public void downloadFile(@RequestParam String requestedFile, @RequestParam(required=false, defaultValue="") String userId, @RequestParam(required=false, defaultValue="0") Double rotate, HttpServletRequest request, HttpServletResponse response) throws Exception {
		//downloadFileService.downloadFile(requestedFile, userId, rotate, request, response);
		downloadFileService.downloadFile(URLDecoder.decode(requestedFile, "UTF-8"), userId, rotate, request, response);
	}
	
	/**
	 * KML 파일 다운로드
	 * @param kmlData UTF-8 로 URLEncoding 된 KML 문자열 
	 * @param response 응답객체
	 * @throws Exception
	 * @see SK BIES 시스템
	 */
	@RequestMapping(value="/gis/KMLFileDownload")
	public void downloadKMLFile(@RequestParam String data, HttpServletResponse response) throws Exception {
		downloadFileService.downloadKMLFile(data, response);
	}
}	