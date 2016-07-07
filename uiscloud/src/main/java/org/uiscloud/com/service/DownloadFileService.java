/**
 * 
 * @Class Name  : FileDownloadService.java
 * @Description : 단일 파일 다운로드 서비스 인터페이스
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 10. 23.  김종민		최초생성
 * @	 2013. 10. 25.  최원석		KML 파일 다운로드 추가
 * 
 * @author 김종민
 * @since 2013. 10. 23.
 * @version 1.0
 * @see
 * 
 * 단일 파일 다운로드 Service Interface
 *
 */
package org.uiscloud.com.service;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface DownloadFileService {
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
	public abstract void downloadFile(String requestedFile, String userId, Double rotate,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception;
	
	
	/**
	 * 
	 * KML 파일 다운로드
	 * 
	 * @param kmlStr UTF-8 로 URLEncoding 된 KML 문자열
	 * @param response 응답 객체
	 * @throws IOException 
	 * @see SK BIES 시스템
	 */
	public void downloadKMLFile(String kmlStr, HttpServletResponse response) throws IOException;


	void downloadFile(String folderName, String downloadFileName,
			String originalFileName, HttpServletRequest request,
			HttpServletResponse response) throws Exception;
	
}