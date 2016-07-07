/**
 * 
 * @Class Name  : FileUploadServiceImpl.java
 * @Description : 다중 파일 업로드 서비스
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 10. 23.  김종민		최초생성
 * @   2013. 10. 30.  최원석		KML 파일 업로드 추가, 이미지파일일 경우 썸네일 추가. 이미지 크기 반환
 * 
 * @author 김종민
 * @since 2013. 10. 23.
 * @version 1.0
 * @see
 * 
 * 다중 파일 업로드 Service Impl
 *
 */
package org.uiscloud.com.service.impl;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.time.FastDateFormat;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.uiscloud.com.service.UploadFileService;

import com.ibm.icu.util.Calendar;

import egovframework.rte.fdl.cmmn.AbstractServiceImpl;
import egovframework.rte.fdl.property.EgovPropertyService;

@Service("uploadFileService")
public class UploadFileServiceImpl extends AbstractServiceImpl  implements UploadFileService {

    @Resource(name="messageSource")
    private MessageSource messageSource;
	
	@Resource(name = "propertiesService")
	private EgovPropertyService propertiesService; 
	
	@Override
	public void storeFile(String folderName, String fileName, BufferedImage bi) throws IOException {
		StringBuffer uploadPath = new StringBuffer();
		uploadPath.append(propertiesService.getString("attach.repository.path"));
		uploadPath.append(File.separator);
		uploadPath.append(folderName);
		
		File folder = new File(uploadPath.toString());
		
		if(!folder.exists()) {
			folder.mkdirs();
		}
		
		StringBuffer filePath = new StringBuffer();
		filePath.append(uploadPath.toString());
		filePath.append(File.separator);
		filePath.append(fileName);
		
		File file = new File(filePath.toString());
		ImageIO.write(bi, "png", file);
	}
	
	@Override
	public void storeFile(String folderName, String fileName, InputStream inputStream) throws IOException {
		StringBuffer uploadPath = new StringBuffer();
		uploadPath.append(propertiesService.getString("attach.repository.path"));
		uploadPath.append(File.separator);
		uploadPath.append(folderName);

		File folder = new File(uploadPath.toString());

		if (!folder.exists()) {
			folder.mkdirs();
		}

		StringBuffer filePath = new StringBuffer();
		filePath.append(uploadPath.toString());
		filePath.append(File.separator);
		filePath.append(fileName);

		File file = new File(filePath.toString());
		OutputStream outStream = new FileOutputStream(file);

		// 읽어들일 버퍼크기를 메모리에 생성
		byte[] buf = new byte[1024];
		int len = 0;
		// 끝까지 읽어들이면서 File 객체에 내용들을 쓴다
		while ((len = inputStream.read(buf)) > 0) {
			outStream.write(buf, 0, len);
		}
		// Stream 객체를 모두 닫는다.
		outStream.close();
		inputStream.close();
	}
	
	/**
	 * 파일을 업로드 한다.
	 * @param request
	 * @return List<String> 파일명리스트 
	 * @throws Exception
	 */
	public Map<String, String> uploadFile(String userId, MultipartHttpServletRequest request) throws Exception{
		final MultipartHttpServletRequest multiRequest = request;

		// extract files
		final Map<String, MultipartFile> files = multiRequest.getFileMap();
		
		// process files
		String userDir = System.getProperty("user.home");
		//String uploadLastPath = messageSource.getMessage("attach.repository.path", null, Locale.getDefault());
		
		if(userDir == null) userDir = "/sw/jeus";
		
		String uploadLastPath = propertiesService.getString("attach.repository.path");
		//String uploadLastPath = "/download/files/attach";
		
		String uploadPath = (userId == null || userId.equals("")) ? userDir + uploadLastPath: userDir + uploadLastPath + File.separator + userId;
		File saveFolder = new File(uploadPath);
		String fileName = null;
		Map<String, String> result = new HashMap<String, String>();
		// 디렉토리 생성
		boolean isDir = false;

		if (!saveFolder.exists() || saveFolder.isFile()) {
			saveFolder.mkdirs();
		}

		if (!isDir) {
			Iterator<Entry<String, MultipartFile>> itr = files.entrySet().iterator();
			MultipartFile file;
			String filePath;

			while (itr.hasNext()) {
				Entry<String, MultipartFile> entry = itr.next();
				file = entry.getValue();
				fileName = file.getOriginalFilename();
				
				if (!"".equals(fileName)) {	
					result.put("originalFileName", fileName);
					
					// 중복 파일 체크
					fileName = uniqueFilename(uploadPath, fileName);
					//Path Traversal
					fileName = fileName.replaceAll("/","").replaceAll("\\\\","").replaceAll("&","");
					// 파일 전송
					filePath = uploadPath + File.separator + fileName;			
					
					String extension = FilenameUtils.getExtension(filePath);
					File transferFile = new File(filePath); 
					file.transferTo(transferFile);
					
					if(extension.equalsIgnoreCase("jpg") || extension.equalsIgnoreCase("png") || extension.equalsIgnoreCase("jpeg") || extension.equalsIgnoreCase("gif") || extension.equalsIgnoreCase("tiff")) {
						BufferedImage bi = ImageIO.read(transferFile);
						
						int width = bi.getWidth();
						int height = bi.getHeight();
						
						String thumbnailName = FilenameUtils.getBaseName(filePath) +  "_Thumbnail." + extension;
						String thumbnailPath = uploadPath + File.separator + thumbnailName;

						BufferedImage thumbnailBi = null;
						if(width > 100 || height > 100) {
							thumbnailBi = resize(bi, 100, 100);	
						}
						else {
							thumbnailBi = bi;
						}
						ImageIO.write(thumbnailBi, extension, new File(thumbnailPath));
						FastDateFormat fastDateFormat = FastDateFormat.getInstance("yyyy/MM/dd HH:mm:ss", Locale.getDefault());
						long lastModified = transferFile.lastModified();
						result.put("fileSize", String.valueOf(transferFile.length()));
						result.put("lastModified", String.valueOf(lastModified));
						result.put("datetime", fastDateFormat.format(lastModified));
						result.put("width", String.valueOf(width));
						result.put("height", String.valueOf(height));
						result.put("thumbnailName", thumbnailName);
					}
					result.put("finishFileName", fileName);
				}
			}
		}
		
		return result;
	}
	
	
	/**
	 * 지도화면 이미지를 업로드 한다.
	 * @param userId 	사용자아이디
	 * @param bi		지도화면이미지
	 * @return			저장된이미지정보객체
	 * @throws Exception
	 */
	public Map<String, String> uploadScreenCapture(String userId, BufferedImage bi) throws Exception{
		// process files
		String userDir = System.getProperty("user.home");
		//String uploadLastPath = messageSource.getMessage("attach.repository.path", null, Locale.getDefault());
		
		if(userDir == null) userDir = "/sw/jeus";
		
		String uploadLastPath = propertiesService.getString("attach.repository.path");
		//String uploadLastPath = "/download/files/attach";
		
		String uploadPath = (userId == null || userId.equals("")) ? userDir + uploadLastPath: userDir + uploadLastPath + "/" + userId;
		File saveFolder = new File(uploadPath);
		String fileName = null;
		Map<String, String> result = new HashMap<String, String>();
		// 디렉토리 생성
		boolean isDir = false;

		if (!saveFolder.exists() || saveFolder.isFile()) {
			saveFolder.mkdirs();
		}

		if (!isDir) {
			String filePath;
			fileName = String.valueOf(Calendar.getInstance().getTimeInMillis()) + ".png";
			if (!"".equals(fileName)) {	
				result.put("originalFileName", fileName);
				
				// 중복 파일 체크
				fileName = uniqueFilename(uploadPath, fileName);
				
				//Path Traveral 
				fileName = fileName.replaceAll("/", "").replaceAll("\\\\", "").replaceAll("&", "");
				
				// 파일 전송
				filePath = uploadPath + File.separator + fileName;			
				
				String extension = FilenameUtils.getExtension(filePath);
				File transferFile = new File(filePath); 
				ImageIO.write(bi, "png", transferFile);
				
				int width = bi.getWidth();
				int height = bi.getHeight();
				
				String thumbnailName = FilenameUtils.getBaseName(filePath) +  "_Thumbnail." + extension;
				String thumbnailPath = uploadPath + File.separator + thumbnailName;

				BufferedImage thumbnailBi = null;
				if(width > 100 || height > 100) {
					thumbnailBi = resize(bi, 100, 100);	
				}
				else {
					thumbnailBi = bi;
				}
				ImageIO.write(thumbnailBi, extension, new File(thumbnailPath));
				FastDateFormat fastDateFormat = FastDateFormat.getInstance("yyyy/MM/dd HH:mm:ss", Locale.getDefault());
				long lastModified = transferFile.lastModified();
				result.put("fileSize", String.valueOf(transferFile.length()));
				result.put("lastModified", String.valueOf(lastModified));
				result.put("datetime", fastDateFormat.format(lastModified));
				result.put("width", String.valueOf(width));
				result.put("height", String.valueOf(height));
				result.put("thumbnailName", thumbnailName);
				result.put("finishFileName", fileName);
			}
		}
		
		return result;
	}

	/**
	 * 기 저장된 파일 중 같은 이름의 파일 있는 경우 순번을 붙여서 중복되지 않는 파일명을 만들어 반환
	 * @param uploadPath
	 * @param uploadFileName
	 * @return String 
	 * @throws
	 */
	private String uniqueFilename(String uploadPath, String uploadFileName) {
		String newUploadFileName = uploadFileName;
		int pos = 1;
		int count = 0;
				
		File file;
		String filePath;
		
		if(newUploadFileName != null ){
			//Path Traveral 처리
			newUploadFileName = newUploadFileName.replaceAll("/", "").replaceAll("\\\\", "").replaceAll("&", "");
		}
		
		int dotIndex = newUploadFileName.lastIndexOf(".");
		String len;		

		String fileName;
		String fileExt = newUploadFileName.substring(dotIndex + 1, newUploadFileName.length());
		
		while(true) {
			filePath = uploadPath + File.separator + newUploadFileName;
			file = new File(filePath);
		
			if(!file.exists()) {
				break;
			}
			
			dotIndex = newUploadFileName.lastIndexOf(".");
			fileName = newUploadFileName.substring(0, dotIndex);
			len = fileName.substring(fileName.length() - pos);
			
			try {
				count = Integer.parseInt(len);
				fileName = fileName.substring(0, fileName.length() - pos);
				//System.out.println(fileName);
			} catch(NumberFormatException ex) {
				count = 0;
			}
			
			count++;
			
			fileName = fileName + count;
			newUploadFileName = fileName + "." + fileExt;
			pos = String.valueOf(count).length();
		}
		
		return newUploadFileName;
	}
	
	/**
	 * 이미지 크기 조절 (썸네일 이미지 생성 시 사용)
	 * @param image 이미지객체
	 * @param width 너비
	 * @param height 높이
	 * @return 변환된 이미지 객체
	 */
	private BufferedImage resize(BufferedImage image, int width, int height) { 
		int type = image.getType() == 0? BufferedImage.TYPE_INT_ARGB : image.getType();
		BufferedImage resizedImage = new BufferedImage(width, height, type);
		Graphics2D g = resizedImage.createGraphics();
		g.setComposite(AlphaComposite.Src);

		g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, 
		RenderingHints.VALUE_INTERPOLATION_BILINEAR);


		g.setRenderingHint(RenderingHints.KEY_RENDERING, 
		RenderingHints.VALUE_RENDER_QUALITY);


		g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, 
		RenderingHints.VALUE_ANTIALIAS_ON);


		g.drawImage(image, 0, 0, width, height, null);
		g.dispose();
		
		return resizedImage; 
	}
	
	/**
	 * KML 파일을 업로드한다.
	 * @param userId 사용자 아이디
	 * @param request 파일 업로드 요청 객체
	 * @throws IOException 
	 */
	@Override
	public void uploadKMLFile(MultipartHttpServletRequest request, HttpServletResponse response) throws IOException {
		final MultipartHttpServletRequest multiRequest = request;
		final Map<String, MultipartFile> files = multiRequest.getFileMap();
		if(files.size() > 0) {
			OutputStream ios = null;
			try {
				Iterator<Entry<String, MultipartFile>> itr = files.entrySet().iterator();
				Entry<String, MultipartFile> entry = itr.next();
				MultipartFile file = entry.getValue();
				response.setContentType("text/xml");
				ios = response.getOutputStream();
				IOUtils.copy(file.getInputStream(), ios);
				response.flushBuffer();
			} catch (IOException e) {
				sendErrorMessage(response, "<h2>KML file can not be uploaded.<br></h2>");
			}
			finally {
				if(ios != null) {
					ios.close();	
				}
			}
		}
		else {
			sendErrorMessage(response, "<h2>KML file can not be uploaded.<br></h2>");
		}
	}
	
	/**
	 * 파일 업로드 실패시 에러 페이지 출력
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

	@Override
	public void deleteFile(String folderName, String fileName) throws IOException {
		StringBuffer uploadPath = new StringBuffer();
		uploadPath.append(propertiesService.getString("attach.repository.path"));
		uploadPath.append(File.separator);
		uploadPath.append(folderName);

		File folder = new File(uploadPath.toString());

		if (!folder.exists()) {
			return;
		}

		StringBuffer filePath = new StringBuffer();
		filePath.append(uploadPath.toString());
		filePath.append(File.separator);
		filePath.append(fileName);

		File file = new File(filePath.toString());
		
		file.delete();
	}
	
//	public static void main(String[] args) {
//		String uploadPath = "C:\\Users\\NPIMSKJM\\download\\files\\attach\\rockgis";
//		
//		UploadFileServiceImpl fileUploadServiceImpl = new UploadFileServiceImpl();
//		
//		System.out.println(uploadPath);
//		System.out.println(fileUploadServiceImpl.uniqueFilename(uploadPath, "svn.txt"));
//		System.out.println(fileUploadServiceImpl.uniqueFilename(uploadPath, "abc.txt"));
//	}
}