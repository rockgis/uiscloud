package com.uiscloud.service.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonConvertor {
	private static ObjectMapper objectMapper;
	
	static {
		objectMapper = new ObjectMapper();
	}
	
	/*
	 * <? extends Object>를 JSON String 으로 변환
	 */
	public static String getJsonFromObject(Object obj) {
		String jsonString = null;
		
		try {
			jsonString = objectMapper.writeValueAsString(obj);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		
		return jsonString;
	}
}