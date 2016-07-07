/**
 * 
 * @Class Name  : ProxyController.java
 * @Description : ProxyController Class
 * @Modification Information  
 * @
 * @   수정일			수정자			수정내용
 * @ -------------  ----------  ---------------------------
 * @   2013. 10. 15.  최원석		최초생성
 * 
 * @author 최원석
 * @since 2013. 10. 21.
 * @version 1.0
 * @see
 * 
 * ProxyPage Spring @MVC Controller
 *
 */
package org.uiscloud.com.web;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.Map;
import java.util.Map.Entry;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import egovframework.rte.fdl.property.EgovPropertyService;

@Controller
public class ProxyController {

	/** Log 클래스의 인스턴스를 받아온다. */
	protected Log log = LogFactory.getLog(this.getClass());
	
	@Resource(name="messageSource")
    private MessageSource messageSource;
	
	@Resource(name = "propertiesService")
	private EgovPropertyService propertiesService; 
	
	
	public String getLocaleString(String value) throws UnsupportedEncodingException {
		byte[] b;
		b = value.getBytes("8859_1");
		final CharsetDecoder decoder = Charset.forName("UTF-8").newDecoder();
		try {
			final CharBuffer r = decoder.decode(ByteBuffer.wrap(b));
			return r.toString();
		} catch (final CharacterCodingException e) {
			return new String(b, "EUC-KR");
		}
	}
	
	/**
	 * 프록시 서버 (크로스 도메인 문제 회피) - Post 방식
	 * @param request	요청
	 * @param response 응답
	 * @throws Exception
	 */
	@RequestMapping(value="/gis/proxy", method=RequestMethod.POST)
	public void proxyPost(HttpServletRequest request, HttpServletResponse res) throws Exception {
        
		String urlStr = propertiesService.getString("gis.gisserverWFS");
		
		log.debug("urlStr POST  ======= "+urlStr);
		
		URL url = new URL(urlStr);
		URLConnection connection = url.openConnection();
		HttpURLConnection huc = (HttpURLConnection)connection;
		huc.setRequestMethod("POST");
		huc.setDoOutput(true);
		huc.setDoInput(true);
		huc.setUseCaches(false);
		huc.setDefaultUseCaches(false);
		huc.setRequestProperty("Content-Type", "text/xml;charset=utf-8");
		
		IOUtils.copy(request.getInputStream(), huc.getOutputStream());

		res.reset();
		res.setContentType(huc.getContentType());
		
		OutputStream ios = res.getOutputStream();
		
		IOUtils.copy(huc.getInputStream(), ios);
		ios.close();
	}
	
	/**
	 * 프록시 서버 (크로스 도메인 문제 회피) - Get 방식
	 * @param request	요청
	 * @param response 응답
	 * @throws Exception
	 */
	
	@RequestMapping(value="/gis/proxy", method=RequestMethod.GET)
	public void proxyGet(HttpServletRequest request, HttpServletResponse res) throws Exception {
		//String urlStr = "http://1.246.219.206:8082/geoserver/sngis/ows?";
		
		String urlStr = propertiesService.getString("gis.gisserverWFS");
		
		request.setCharacterEncoding("UTF-8");
		
		StringBuffer params = new StringBuffer();
		for(Object param : request.getParameterMap().entrySet()) {
			@SuppressWarnings("unchecked")
			Map.Entry<String, String[]> entry = (Entry<String, String[]>) param;
			
			if(entry.getKey().indexOf('=') >= 0)
			{
				params.append(getLocaleString(entry.getKey()));
			}
			else {
				params.append(entry.getKey());
				params.append("=");
				
				String[] values = entry.getValue();
				if(values.length > 0) {
					if (request.getCharacterEncoding() == null)
						params.append(URLEncoder.encode(getLocaleString(values[0]), "UTF-8"));
					else
						params.append(URLEncoder.encode(values[0], "UTF-8"));
				}
				params.append("&");
			}
		}
		if(params.length() > 0 && params.substring(params.length()-1).equals("&"))
			params.deleteCharAt(params.length()-1);
		
		URL url = new URL(urlStr+params);
				
		URLConnection connection = url.openConnection();
		HttpURLConnection huc = (HttpURLConnection)connection;
		huc.setRequestMethod("GET");
		huc.setDoOutput(true);
		huc.setDoInput(true);
		huc.setUseCaches(false);
		huc.setDefaultUseCaches(false);
		
		res.reset();
		res.setContentType(huc.getContentType());
		
		OutputStream ios = res.getOutputStream();
		IOUtils.copy(huc.getInputStream(), ios);
		ios.close();
	}
	
	
	
	/*
	@RequestMapping(value="/gis/proxy", method=RequestMethod.POST)
	public void proxyPost(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String urlStr 		= propertiesService.getString("gis.gisserverWFS");
		
		log.debug("urlStr POST  ======= "+urlStr);
		
		String params = IOUtils.toString(request.getInputStream(), "UTF-8");
		URL url = new URL(urlStr);
		URLConnection connection = url.openConnection();
		HttpURLConnection huc = (HttpURLConnection)connection;
		huc.setRequestMethod("POST");
		huc.setDoOutput(true);
		huc.setDoInput(true);
		huc.setUseCaches(false);
		huc.setDefaultUseCaches(false);
		
		IOUtils.copy(IOUtils.toInputStream(params, "UTF-8"), huc.getOutputStream());

		response.reset();
		response.setContentType(huc.getContentType());
		
		OutputStream ios = response.getOutputStream();
		
		IOUtils.copy(huc.getInputStream(), ios);
		ios.close();
	}
	
	
	@RequestMapping(value="/gis/proxy", method=RequestMethod.GET)
	public void proxyGet(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String urlStr 		= propertiesService.getString("gis.gisserver");
		
		log.debug("urlStr get  ======= "+urlStr);
		
		log.debug("SKN BIES 20140103: " + urlStr);
		
		StringBuffer params = new StringBuffer();
		for(Object param : request.getParameterMap().entrySet()) {
			@SuppressWarnings("unchecked")
			Entry<String, String[]> entry = (Entry<String, String[]>) param;
			
			if(entry.getKey().indexOf('=') >= 0)
			{
				params.append(entry.getKey());
			}
			else if(entry.getKey().equals("urlStr")) {
				String[] values = entry.getValue();
				if(values.length > 0) {
					urlStr = values[0];
				}
			}
			else {
				params.append(entry.getKey());
				params.append("=");
				
				String[] values = entry.getValue();
				if(values.length > 0) {
					params.append(values[0]);
				}
				params.append("&");
			}
		}
		if(params.length() > 0 && params.substring(params.length()-1).equals("&")) {
			params.deleteCharAt(params.length()-1);
		}
		
		log.debug("URL(Get) : " + urlStr + params.toString());
		
		URL url = new URL(urlStr + params.toString());
		URLConnection connection = url.openConnection();
		HttpURLConnection huc = (HttpURLConnection)connection;
		huc.setRequestMethod("GET");
		huc.setDoOutput(true);
		huc.setDoInput(true);
		huc.setUseCaches(false);
		huc.setDefaultUseCaches(false);
		response.reset();
		response.setContentType(huc.getContentType());
		OutputStream ios = response.getOutputStream();
		IOUtils.copy(huc.getInputStream(), ios);
		ios.close();
	}
	*/
	
}
