/**
 * 
 * @Class Name  : DownloadFileServiceImpl.java
 * @Description : 단일 파일 다운로드 서비스
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
 * 단일 파일 다운로드 Service Impl
 *
 */
package org.uiscloud.com.service.impl;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URLDecoder;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.uiscloud.com.service.DownloadFileService;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;

@Service("downloadFileService")
public class DownloadFileServiceImpl extends AbstractServiceImpl implements DownloadFileService {
	@Resource(name="messageSource")
    private MessageSource messageSource;
	
	@Resource(name = "propertiesService")
	private EgovPropertyService propertiesService; 
	
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
	@Override
	public void downloadFile(String requestedFile, String userId, Double rotate, HttpServletRequest request, HttpServletResponse response) throws Exception {
		ServletContext servletContext = request.getSession().getServletContext();
		String userDir = System.getProperty("user.home");
		//String uploadPath = messageSource.getMessage("attach.repository.path", null, Locale.getDefault());
		
		if(userDir == null) userDir = "/sw/jeus";

		String uploadPath = propertiesService.getString("attachrepository.path");
		//String uploadPath = "/download/files/attach";
		
		String fileFullPath = (userId == null || userId.equals("")) ? userDir + uploadPath: userDir + uploadPath + "/" + userId;
		
		File uFile = new File(fileFullPath, requestedFile);
		int fSize = (int) uFile.length();
 
		if (fSize > 0) {
			String mimetype = servletContext.getMimeType(requestedFile);
			response.setContentType(mimetype);
			
			OutputStream os = response.getOutputStream();
			if(rotate == 0) {
			    if (requestedFile.toLowerCase().endsWith(".pdf")) {
                    // 브라우져 내에 바로 보이게 한다.
                    response.setContentType(mimetype);
                    response.setHeader("Content-Disposition", "inline; filename=\"" + requestedFile + "\"");
                } else if(mimetype == null || mimetype.indexOf("image") == -1) {
					mimetype = "application/x-msdownload";
					response.setHeader("Content-Disposition", "attachment; filename=\"" + requestedFile + "\"");
				}
				response.setBufferSize(fSize);
				response.setContentLength(fSize);
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(uFile));
				FileCopyUtils.copy(in, os);
				in.close();
			}
			else {
				BufferedImage image = ImageIO.read(uFile);
				if(image != null) {
					BufferedImage bi = rotateImage(image, rotate);
					ImageIO.write(bi, "png", os);
				}	
			}
			os.flush();
			os.close();
		} else {
			sendErrorMessage(response, "<h2>Could not get file name:<br>" + requestedFile + "</h2>");
		}
	}
	
	/**
	 * 
	 * NITS EngSheet Detail 관련 파일 다운로드
	 * 
	 * @param folderName
	 * @param fileName
	 * @param response 응답
	 * @return void (Response 에 직접 작업)
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */	
	@Override
	public void downloadFile(String folderName, String requestedFileName, String originalFileName, HttpServletRequest request, HttpServletResponse response) throws Exception {
		ServletContext servletContext = request.getSession().getServletContext();

		StringBuffer filePath = new StringBuffer();
		filePath.append(propertiesService.getString("attach.repository.path"));
		filePath.append(File.separator);
		filePath.append(folderName);
		filePath.append(File.separator);
		filePath.append(originalFileName);

		File file = new File(filePath.toString());
		int fSize = (int) file.length();
 
		if (fSize > 0) {
			String mimetype = servletContext.getMimeType(originalFileName);
			response.setContentType(mimetype);
			
			OutputStream os = response.getOutputStream();
			
		    if (originalFileName.toLowerCase().endsWith(".pdf")) {
                // 브라우져 내에 바로 보이게 한다.
                response.setContentType(mimetype);
                response.setHeader("Content-Disposition", "inline; filename=\"" + requestedFileName + "\"");
            } else if(mimetype == null || mimetype.indexOf("image") == -1) {
				mimetype = "application/x-msdownload";
				response.setHeader("Content-Disposition", "attachment; filename=\"" + requestedFileName + "\"");
			}
			response.setBufferSize(fSize);
			response.setContentLength(fSize);
			BufferedInputStream in = new BufferedInputStream(new FileInputStream(file));
			FileCopyUtils.copy(in, os);
			in.close();
			
			os.flush();
			os.close();
		} else {
			sendErrorMessage(response, "<h2>Could not get file name:<br>" + originalFileName + "</h2>");
		}
	}

	/*
	 * (non-Javadoc)
	 * @see com.sk.bies.com.service.FileDownloadService#downloadKMLFile(java.lang.String, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	public void downloadKMLFile(String kmlStr, HttpServletResponse response) throws IOException {
		response.setContentType("text/xml");
		response.setHeader("Content-Disposition", "attachment; filename=npims.kml");
		OutputStream ios = null;
		try {
			ios = response.getOutputStream();
			IOUtils.write(URLDecoder.decode(kmlStr, "UTF-8"), ios);
			response.flushBuffer();
		} catch (IOException e) {
			sendErrorMessage(response, "<h2>KML file can not be downloaded.<br></h2>");
		}
		finally {
			if(ios != null) {
				ios.close();	
			}
		}
	}
	
	/**
	 * 파일 다운로드 실패시 에러 페이지 출력
	 * @param response 응답객체
	 * @param message 에러메세지
	 * @throws IOException
	 * @see SK BIES 시스템
	 */
	private void sendErrorMessage(HttpServletResponse response, String message) throws IOException {
		//setContentType을 프로젝트 환경에 맞추어 변경
		response.setContentType("text/html");
		PrintWriter printwriter = response.getWriter();
		
		printwriter.println("<html>");
		printwriter.println("<br><br><br>" + message);
		printwriter.println("<br><br><br><center><h3><a href='javascript: history.go(-1)'>Back</a></h3></center>");
		printwriter.println("<br><br><br>&copy; webAccess");
		printwriter.println("</html>");
		printwriter.flush();
		printwriter.close();
	}
	
	/**
	 * 이미지 회전
	 * 
	 * @param image 원본 이미지
	 * @param rotate 회전 이미지
	 * @return 회전 이미지
	 * @see SK BIES 시스템
	 */
	private BufferedImage rotateImage(BufferedImage image, Double rotate) {
		BufferedImage bi = new BufferedImage(image.getWidth()*2, image.getHeight()*2, BufferedImage.TYPE_INT_ARGB);
		Graphics2D g = (Graphics2D) bi.getGraphics();
		RenderingHints hints = new RenderingHints(null);  
		hints.put(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);  
		hints.put(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);  
		hints.put(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);  
		g.setRenderingHints(hints);  
		g.setTransform(new AffineTransform());
		g.translate(image.getWidth()/2, image.getHeight()/2);
		g.rotate(Math.toRadians(rotate), image.getWidth()/2, image.getHeight()/2);
		g.drawImage(image, 0, 0, image.getWidth(), image.getHeight(), null);
		g.dispose();
		return bi;
	}
}