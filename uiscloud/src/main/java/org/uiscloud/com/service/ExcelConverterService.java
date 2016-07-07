/**
 * @Class Name : ExcelConverterService.java
 * @Description : 엑셀변환관리.  Service Class
 * @Modification Information 
 * @ 
 * @ 수정일 수정자 수정내용 @ 
 * @ ------------- ------------------------------------- 
 * @ 2013. 11. 17. 김종민 최초 생성
 * 
 * @author 김종민
 * @since 2013. 11. 17.
 * @version 1.0
 * @see SK BIES 시스템
 * 
 */
package org.uiscloud.com.service;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public interface ExcelConverterService {
	/**
	 * 
	 * Excel 파일 전체 경로를 받아서 List<List<String>> 변환
	 * 
	 * @param String fileFullPath
	 * @param Integer sheetNumber - 변환할 sheet number
	 * @return List<List<String>>
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */		
	public List<List<String>> excel2ListInList(String fileFullPath, Integer sheetNumber) throws Exception;
	
	/**
	 * 
	 * InputStream 을 Excel 로 생성 후에 List<List<String>> 변환
	 * 
	 * @param InputStream is
	 * @param String fileExt 파일 확장자
	 * @param Integer sheetNumber - 변환할 sheet number
	 * @return List<List<String>>
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */	
	public List<List<String>> excel2ListInList(InputStream is, String fileExt, Integer sheetNumber) throws Exception;
	
	/**
	 * 
	 * InputStream 을 Excel 로 생성 후에 List<Properties> 변환
	 * 
	 * @param InputStream is
	 * @param String fileExt 파일 확장자
	 * @param Integer sheetNumber - 변환할 sheet number
	 * @return List<Properties>
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	public List<Properties> excel2PropertiesInList(InputStream is, String fileExt, Integer sheetNumber) throws Exception;
	
	/**
	 * 
	 * 헤더 정보와 데이타를 받아 Excel 로 생성 변환
	 * 
	 * @param List<Map<String, String>> header
	 * @param List data
	 * @return List<Properties>
	 * @throws Exception
	 * @see SK BIES 시스템
	 * 
	 */
	public HSSFWorkbook makeExcel(List<Map<String, String>> headers, List<Object> data) throws Exception;	
}	