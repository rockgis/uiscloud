/**
 * 
 * @Class Name  : JsonConverterService.java
 * @Description : JSON 을 Excel 로 변환
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
 * JSON to Excel Convert Service
 *
 */
package org.uiscloud.com.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

public interface JsonConverterService {
	/**
	 * 
	 * 업로드된 json 형태의 String 을 excel 로 변환 후 반환
	 * 
	 * @param 
	 * 		String jsonFieldString 엑셀 헤더 정보
	 * 		String jsonDataString 엑셀 자료 정보
	 * @return HSSFWorkbook
	 * @throws IOException, JsonParseException, JsonMappingException
	 * @see SK BIES 시스템
	 * 
	 */		
	public HSSFWorkbook json2excel(String jsonFieldString, String jsonDataString)
			throws IOException, JsonParseException, JsonMappingException;
	
	/**
	 * 
	 * 업로드된 json 형태의 String 과 캡쳐된 화면 이미지를 excel 로 변환 후 반환
	 * 
	 * @param 
	 * 		String jsonFieldString 엑셀 헤더 정보
	 * 		String jsonDataString 엑셀 자료 정보
	 * 		BufferedImage img 이미지 정보
	 * @return HSSFWorkbook
	 * @throws IOException, JsonParseException, JsonMappingException
	 * @see SK BIES 시스템
	 * 
	 */		
	public HSSFWorkbook json2excelWithImage(String jsonFieldString, String jsonDataString, ByteArrayOutputStream imgOutputStream, int imgMaxCol, int imgMaxRow)
			throws IOException, JsonParseException, JsonMappingException;
	
	public HSSFWorkbook json2excelWithImage(String jsonFieldString, String jsonDataString, String title, String newLineFieldString, String newLineDataString, ByteArrayOutputStream imgOutputStream, int imgMaxCol, int imgMaxRow)
			throws IOException, JsonParseException, JsonMappingException;

	public HSSFWorkbook json2excelWithImage(String jsonFieldString, String jsonDataString, String jsonStatisticsFieldString, String jsonStatisticsDataString, String title, String newLineFieldString, String newLineDataString, ByteArrayOutputStream imgOutputStream, int imgMaxCol, int imgMaxRow)
			throws IOException, JsonParseException, JsonMappingException;
	

	public HSSFSheet json2excelSheetWithImage(HSSFWorkbook workbook,  String sheetName, String jsonFieldString, String jsonDataString, ByteArrayOutputStream imgOutputStream, int imgMaxCol, int imgMaxRow)
			throws IOException, JsonParseException, JsonMappingException;
	
	
	public List<Map<String, Object>> json2listMapStringObject(String jsonString)
			throws IOException, JsonParseException, JsonMappingException;
	
	public List<Map<String, String>> json2listMapStringString(String jsonString)
			throws IOException, JsonParseException, JsonMappingException;
}