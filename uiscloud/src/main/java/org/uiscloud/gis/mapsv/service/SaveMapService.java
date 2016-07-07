/**
 * 
 * @Class Name  : SaveMapService.java
 * @Description : 지도 화면 저장 이미지 생성
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
 * 지도 화면 저장 이미지 Service
 *
 */
package org.uiscloud.gis.mapsv.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import org.dom4j.DocumentException;

public interface SaveMapService {
	
	/**
	 * 지도 객체 이미지 생성
	 * @param xmlStr 지도 정보(XML)
	 * @param rootContext 서버주소 (http, ip, port)
	 * @return 지도 이미지 반환
	 * @throws DocumentException
	 * @throws IOException
	 */
	public BufferedImage createImages(String xmlStr, String rootContext)  throws DocumentException, IOException;
}
