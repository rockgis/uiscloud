package com.uiscloud.service.controller;

import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ProxyController {

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
	@RequestMapping(value="/proxy.do")
	   public void proxyPost(HttpServletRequest request, HttpServletResponse res) throws Exception {
	      String urlStr = "http://211.58.18.254:8180/sktbigis/wfs";
	      //String urlStr = URLDecoder.decode(request.getParameter("url"), "UTF-8");
	      //String params = URLDecoder.decode(request.getParameter("params"),"UTF-8");
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
	 * 프록시 서버 (크로스 도메인 문제 회피) - Post 방식
	 * @param request	요청
	 * @param response 응답
	 * @throws Exception
	 */
	@RequestMapping(value="/proxyUrl.do")
	   public void proxyUrl(HttpServletRequest request, HttpServletResponse res) throws Exception {
	      String urlStr = URLDecoder.decode(request.getParameter("url"), "UTF-8");
	      //String params = URLDecoder.decode(request.getParameter("params"),"UTF-8");
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
	/*@RequestMapping(value="/proxy.do", method=RequestMethod.GET)
	public void proxyGet(HttpServletRequest request, HttpServletResponse res) throws Exception {
		//String urlStr = "http://211.58.18.254:8180/sktbigis/wfs";
		String urlStr = request.getParameter("url");
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
	*/
}
