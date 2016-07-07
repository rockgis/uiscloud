/**
 * 
 * @Class Name  : UploadFileService.java
 * @Description : 다중 파일 업로드 서비스 인터페이스
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
 * 다중 파일 업로드 Service Interface
 *
 */
package org.uiscloud.com.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.multipart.MultipartHttpServletRequest;

public interface UploadFileService {
	
	public abstract void storeFile(String folderName, String fileName, BufferedImage bi) throws IOException;

	public abstract void storeFile(String folderName, String fileName, InputStream inputStream) throws IOException;
	
	/**
	 * 파일을 업로드한다.
	 * @param request
	 * @return List<String>
	 * @throws Exception
	 */
	public abstract Map<String, String> uploadFile(String userId, MultipartHttpServletRequest request) throws Exception;
	
	/**
	 * KML 파일을 업로드한다.
	 * @param userId 사용자 아이디
	 * @param request 파일 업로드 요청 객체
	 * @throws IOException 
	 */
	public abstract void uploadKMLFile(MultipartHttpServletRequest request, HttpServletResponse response) throws IOException;
	
	/**
	 * 지도화면 이미지를 업로드 한다.
	 * @param userId 	사용자아이디
	 * @param bi		지도화면이미지
	 * @return			저장된이미지정보객체
	 * @throws Exception
	 */
	public abstract Map<String, String> uploadScreenCapture(String userId, BufferedImage bi) throws Exception;

	/**
	 * 파일을 디스크에서 삭제한다.
	 * @param folderName
	 * @param fileName
	 * @return void
	 * @throws IOException
	 */
	public abstract void deleteFile(String folderName, String fileName) throws IOException;
}