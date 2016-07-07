/**
 * 
 * @Class Name  : JsonConverterServiceImpl.java
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
 * JSON to Excel Convert Service Impl
 *
 */
package org.uiscloud.com.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;


import org.uiscloud.com.service.JsonConverterService;
import org.apache.poi.ss.usermodel.CreationHelper;

@SuppressWarnings("deprecation")
@Service("jsonConverterService")
public class JsonConverterServiceImpl implements JsonConverterService {
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
			throws IOException, JsonParseException, JsonMappingException {
        // Field Header 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, String>> fieldMapInList = json2listMapStringString(jsonFieldString);
		// Excel Data 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, Object>> dataMapInList = json2listMapStringObject(jsonDataString);
		
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet("BIES");

		List<String> headerFields = 
				makeExcelTableHeder(fieldMapInList, workbook, sheet, 0);
		
		makeExcelTableBody(dataMapInList, workbook, sheet, headerFields, 1);
		
		return workbook;
	}

	@Override
	public HSSFWorkbook json2excelWithImage(String jsonFieldString,
			String jsonDataString, ByteArrayOutputStream imgOutputStream, int imgMaxCol, int imgMaxRow) throws IOException,
			JsonParseException, JsonMappingException {
        // Field Header 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, String>> fieldMapInList = json2listMapStringString(jsonFieldString);
		// Excel Data 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, Object>> dataMapInList = json2listMapStringObject(jsonDataString);
		
		int idxRowForHeader = imgMaxRow;

		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet("BIES");
	
		insertImageIntoExcel(imgOutputStream, imgMaxCol, idxRowForHeader, workbook, sheet);

		List<String> headerFields = makeExcelTableHeder(fieldMapInList, workbook, sheet, imgMaxRow);

		makeExcelTableBody(dataMapInList, workbook, sheet, headerFields, imgMaxRow + 1);
		
		return workbook;
	}

	@Override
	public HSSFWorkbook json2excelWithImage(String jsonFieldString,
			String jsonDataString, String title, String newLineFieldString, String newLineDataString, ByteArrayOutputStream imgOutputStream, int imgMaxCol, int imgMaxRow) throws IOException,
			JsonParseException, JsonMappingException {
		
		HSSFWorkbook workbook = json2excelWithImage(jsonFieldString,
				jsonDataString, imgOutputStream, imgMaxCol, imgMaxRow);		
		
		int idxRow = 0;
		int idxCell = 0;
		int newLinesRowStart = 0;

		HSSFSheet sheet = workbook.getSheet("BIES");
		idxRow = sheet.getLastRowNum();
		HSSFRow row = null;
		HSSFCell cell = null;
		
		// Field Header 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, String>> newLineTilesMapInList = json2listMapStringString(newLineFieldString);
		// Excel Data 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, Object>> newLinesMapInList = json2listMapStringObject(newLineDataString);
		
		newLinesRowStart = idxRow + 3;

		row = sheet.createRow(newLinesRowStart);

		cell = row.createCell(idxCell);
		cell.setCellValue(title);
		sheet.addMergedRegion(new CellRangeAddress(newLinesRowStart, newLinesRowStart, 0, newLineTilesMapInList.size() - 1));
		
		newLinesRowStart++;
		
		List<String> headerFields = makeExcelTableHeder(newLineTilesMapInList, workbook, sheet, newLinesRowStart);

		makeExcelTableBody(newLinesMapInList, workbook, sheet, headerFields, newLinesRowStart + 1);
		
		return workbook;
	}

	@Override
	public HSSFWorkbook json2excelWithImage(String jsonFieldString,
			String jsonDataString, String jsonStatisticsFieldString, String jsonStatisticsDataString, String title, String newLineFieldString, String newLineDataString, ByteArrayOutputStream imgOutputStream, int imgMaxCol, int imgMaxRow) throws IOException,
			JsonParseException, JsonMappingException {
		
		HSSFWorkbook workbook = json2excelWithImage(jsonFieldString,
				jsonDataString, imgOutputStream, imgMaxCol, imgMaxRow);		
		
		int idxRow = 0;
		int idxCell = 0;
		int newLinesRowStart = 0;

		HSSFSheet sheet = workbook.getSheet("BIES");
		idxRow = sheet.getLastRowNum();
		HSSFRow row = null;
		HSSFCell cell = null;
		
		// Field Header 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, String>> statisticsTilesMapInList = json2listMapStringString(jsonStatisticsFieldString);
		// Excel Data 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, Object>> statisticsLinesMapInList = json2listMapStringObject(jsonStatisticsDataString);
		
		newLinesRowStart = idxRow + 3;

		row = sheet.createRow(newLinesRowStart);

		cell = row.createCell(idxCell);
//		cell.setCellValue(title);
		sheet.addMergedRegion(new CellRangeAddress(newLinesRowStart, newLinesRowStart, 0, statisticsTilesMapInList.size() - 1));
		
		newLinesRowStart++;
		
		List<String> headerFields = makeExcelTableHeder(statisticsTilesMapInList, workbook, sheet, newLinesRowStart);

		makeExcelTableBody(statisticsLinesMapInList, workbook, sheet, headerFields, newLinesRowStart + 1);

		idxRow = sheet.getLastRowNum();
		row = null;
		cell = null;		
		
		// Field Header 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, String>> newLineTilesMapInList = json2listMapStringString(newLineFieldString);
		// Excel Data 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		List<Map<String, Object>> newLinesMapInList = json2listMapStringObject(newLineDataString);
		
		newLinesRowStart = idxRow + 3;

		row = sheet.createRow(newLinesRowStart);

		cell = row.createCell(idxCell);
		cell.setCellValue(title);
		sheet.addMergedRegion(new CellRangeAddress(newLinesRowStart, newLinesRowStart, 0, newLineTilesMapInList.size() - 1));
		
		newLinesRowStart++;
		
		headerFields = makeExcelTableHeder(newLineTilesMapInList, workbook, sheet, newLinesRowStart);

		makeExcelTableBody(newLinesMapInList, workbook, sheet, headerFields, newLinesRowStart + 1);
		
		return workbook;
	}
	
	public List<Map<String, String>> json2listMapStringString(String jsonString)
			throws IOException, JsonParseException, JsonMappingException {
        jsonString = decodeURIJsonString(jsonString);
        
        // Field Header 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		@SuppressWarnings("unchecked")
		List<Map<String, String>> mapInList = new ObjectMapper().readValue(jsonString, List.class);
		
		return mapInList;
	}

	public List<Map<String, Object>> json2listMapStringObject(String jsonString)
			throws IOException, JsonParseException, JsonMappingException {
        jsonString = decodeURIJsonString(jsonString);
        
        // Field Header 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
		@SuppressWarnings("unchecked")
		List<Map<String, Object>> mapInList = new ObjectMapper().readValue(jsonString, List.class);
		
		return mapInList;
	}
	
	private List<String> makeExcelTableHeder(
			List<Map<String, String>> fieldMapInList, HSSFWorkbook workbook,
			HSSFSheet sheet, Integer startRow) {
		HSSFRow row = sheet.createRow(startRow);
		HSSFCell cell;
		HSSFCellStyle cellStyle;
		
		int idxCell = 0;
		
		List<String> headerFields = new ArrayList<String>();
		
		// fieldMapInList 에서 Excel Header 정보 추출
		for(Map<String, String> header: fieldMapInList) {
			// style 객체가 각 cell 별로 별도 필요
			// 아니면 공유가 일어남
			cellStyle = workbook.createCellStyle();
			
			cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
			cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
			cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);

			cellStyle.setFillForegroundColor(HSSFColor.GREY_25_PERCENT.index);
			cellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);

			if(header.get("halign") == null) {
				cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			} else {
				if("right".equals(header.get("halign").toLowerCase())) {
					cellStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
				} else if("center".equals(header.get("halign").toLowerCase())) {
					cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
				} else if("left".equals(header.get("halign").toLowerCase())) {
					cellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
				}
			}
			
			cell = row.createCell(idxCell);			
			cell.setCellType(HSSFCell.CELL_TYPE_STRING );
			cell.setCellStyle(cellStyle);
			cell.setCellValue(header.get("title"));
		
			Object objWidth = header.get("width");
			sheet.setColumnWidth(idxCell, Integer.parseInt(objWidth.toString()) * 50);			
//			sheet.autoSizeColumn(idxCell);

			idxCell++;
			
			headerFields.add(header.get("field"));
		}
		return headerFields;
	}

	private void makeExcelTableBody(
			List<Map<String, Object>> dataMapInList,
			HSSFWorkbook workbook, 
			HSSFSheet sheet,
			List<String> headerFields,
			Integer startRow) {
		HSSFRow row;
		HSSFCell cell;
		HSSFCellStyle cellStyle;
		
		long size;
		int idxRow;
		int idxCell;
		
		cellStyle = workbook.createCellStyle();
		cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
		
		size = dataMapInList.size();
		
		// dataMapInList 에서 Excel Value 정보 추출
		for(idxRow = 0; idxRow < size; idxRow++) {
			row = sheet.createRow(startRow + idxRow);
			
			idxCell = 0;
			
			for(String field : headerFields) {
				// style 객체가 각 cell 별로 별도 필요
				// 아니면 공유가 일어남
//				cellStyle = workbook.createCellStyle();
//				
//				cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
//				cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
//				cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
//				cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
//				
//				for(Map<String, String> header: fieldMapInList) {
//					if(field == header.get("field")) {
//						if("right".equals(header.get("align").toLowerCase())) {
//							cellStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
//						} else if("center".equals(header.get("align").toLowerCase())) {
//							cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
//						} else if("left".equals(header.get("align").toLowerCase())) {
//							cellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
//						} else {
//							cellStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
//						}
//						
//						break;
//					}
//				}
				
				cell = row.createCell(idxCell);
				
				cell.setCellValue(dataMapInList.get(idxRow).get(field) == null ? "": dataMapInList.get(idxRow).get(field).toString());
				cell.setCellStyle(cellStyle);
				
				idxCell++;
				
				//System.out.println(field + " : " + dataMapInList.get(idxRow).get(field));
			}
		}
	}

	private void insertImageIntoExcel(ByteArrayOutputStream imgOutputStream,
			int imgMaxCol, int idxRowForHeader, HSSFWorkbook workbook,
			HSSFSheet sheet) {
		
		int pictureIndex = workbook.addPicture(imgOutputStream.toByteArray(), HSSFWorkbook.PICTURE_TYPE_PNG);
		
        HSSFPatriarch patriarch = sheet.createDrawingPatriarch();

        CreationHelper helper = workbook.getCreationHelper();

		ClientAnchor anchor = helper.createClientAnchor();
		//set top-left corner for the image
		anchor.setRow1(0);
		anchor.setCol1(0);
		anchor.setRow2(idxRowForHeader - 1);
		anchor.setCol2(imgMaxCol);
		    
		anchor.setAnchorType(ClientAnchor.MOVE_DONT_RESIZE);
		patriarch.createPicture(anchor, pictureIndex); // 삽입할 이미지
//        patriarch.createPicture(anchor, pictureIndex).resize(); // 삽입할 이미지
	}
	
	private String decodeURIJsonString(String jsonString) {
		// 쌍 따움표를 제한다.
	    jsonString = jsonString.replaceAll("&#38;quot;", "\"");
        // 괄호를 바꾼다.
        jsonString = jsonString.replaceAll("&#38;&#38;#35;40;", "(");
        jsonString = jsonString.replaceAll("&#38;&#38;#35;41;", ")");
        
		return jsonString;
	}

	@Override
	public HSSFSheet json2excelSheetWithImage(HSSFWorkbook workbook, String sheetName, String jsonFieldString,
			String jsonDataString, ByteArrayOutputStream imgOutputStream,int imgMaxCol, int imgMaxRow) throws IOException,
			JsonParseException, JsonMappingException {
		// Field Header 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
				List<Map<String, String>> fieldMapInList = json2listMapStringString(jsonFieldString);
				// Excel Data 정보를 json 문자열을 List<Map<String header, String value>> 형태로 변환
				List<Map<String, Object>> dataMapInList = json2listMapStringObject(jsonDataString);
				
				int idxRowForHeader = imgMaxRow;

				HSSFSheet sheet = workbook.createSheet(sheetName);
			
				insertImageIntoExcel(imgOutputStream, imgMaxCol, idxRowForHeader, workbook, sheet);

				List<String> headerFields = makeExcelTableHeder(fieldMapInList, workbook, sheet, imgMaxRow);

				makeExcelTableBody(dataMapInList, workbook, sheet, headerFields, imgMaxRow + 1);
				
				return sheet;
	}
	
	
	
	
	
//	public static void main(String[] args) throws JsonParseException, JsonMappingException, IOException {
//		String jsonFieldString = "[{\"field\":\"assetsNo\",\"title\":\"자산번호\",\"width\":120,\"align\":\"left\"},{\"field\":\"areaName\",\"title\":\"주소\",\"width\":180,\"align\":\"left\"},{\"field\":\"regstrQy\",\"title\":\"대장면적\",\"width\":60,\"align\":\"right\"},{\"field\":\"regstrAmount\",\"title\":\"대장가액\",\"width\":60,\"align\":\"right\"},{\"field\":\"acqsDe\",\"title\":\"취득시기\",\"width\":60,\"align\":\"left\"},{\"field\":\"prprtySeName\",\"title\":\"재산구분\",\"width\":100,\"align\":\"left\"},{\"field\":\"jrsdName\",\"title\":\"소관(회계/계정)\",\"width\":100,\"align\":\"left\"},{\"field\":\"onlnGrfcName\",\"title\":\"일선관서\",\"width\":100,\"align\":\"left\"},{\"field\":\"assetsName\",\"title\":\"자산명\",\"width\":100,\"align\":\"left\"},{\"field\":\"assetsGroupNo\",\"title\":\"자산그룹명\",\"width\":80,\"align\":\"left\"},{\"field\":\"bogLndcgrName\",\"title\":\"공부지목\",\"width\":60,\"align\":\"left\"},{\"field\":\"sttusLndcgrName\",\"title\":\"현황지목\",\"width\":60,\"align\":\"left\"},{\"field\":\"pblonsipAt\",\"title\":\"공유\",\"width\":30,\"align\":\"center\"},{\"field\":\"useAccdtName\",\"title\":\"사용실태\",\"width\":60,\"align\":\"left\"},{\"field\":\"prposAreaName\",\"title\":\"용도지역\",\"width\":80,\"align\":\"left\"},{\"field\":\"prposAreaSeName\",\"title\":\"용도지구\",\"width\":80,\"align\":\"left\"},{\"field\":\"ctyPlanFcltyName\",\"title\":\"도시계획시설\",\"width\":80,\"align\":\"left\"},{\"field\":\"lglCdNo\",\"title\":\"토지코드\",\"width\":100,\"align\":\"left\"}]";
//		String jsonDataString = "[{\"bogLndcgrCode\":null,\"blglndcgrName\":null,\"sttusLndcgrCode\":null,\"sttusLndcgrName\":\"대\",\"pblonsipAt\":\"Y\",\"useAccdtCode\":null,\"useAccdtName\":\"청사\",\"prposAreaCode\":null,\"prposAreaName\":\"일반주거지역\",\"prposAreaDetailCode\":null,\"prposAreaDetailName\":null,\"prposAreaSeCode\":null,\"propsAreaSeName\":null,\"ctyPlanFcltyCode\":null,\"ctyPlanFcltyName\":\"공용의청사\",\"isBsg\":null,\"isDB\":null,\"paamt\":null,\"lglCdNo\":\"2729011100102300000\",\"jrsdCode\":null,\"assetsNo\":\"200214010103112060\",\"roadCode\":null,\"locplcNmRn\":null,\"buldNo\":null,\"areaName\":\"대구광역시 달서구 용산동 230\",\"regstrQy\":\"9,723㎡\",\"regstrQyName\":null,\"regstrAmount\":null,\"regstrAmountName\":\"10,500,300,000원\",\"acqsDe\":null,\"acqsDeName\":\"2002년11월15일\",\"prprtySeCode\":null,\"prprtySeName\":\"행정재산(공용)\",\"jrsdName\":\"대법원\",\"accnutCode\":null,\"accnutName\":null,\"acntCode\":null,\"acntName\":null,\"onlnGrfcCode\":null,\"onlnGrfcName\":\"서부지원 재산관리관\",\"assetsName\":\"서부지원신청사부지\",\"assetsGroupNo\":null,\"assetsGroupName\":null},{\"bogLndcgrCode\":null,\"blglndcgrName\":null,\"sttusLndcgrCode\":null,\"sttusLndcgrName\":\"대\",\"pblonsipAt\":\"Y\",\"useAccdtCode\":null,\"useAccdtName\":\"청사\",\"prposAreaCode\":null,\"prposAreaName\":\"일반주거지역\",\"prposAreaDetailCode\":null,\"prposAreaDetailName\":null,\"prposAreaSeCode\":null,\"propsAreaSeName\":null,\"ctyPlanFcltyCode\":null,\"ctyPlanFcltyName\":\"공용의청사\",\"isBsg\":null,\"isDB\":null,\"paamt\":null,\"lglCdNo\":\"2729011100102300000\",\"jrsdCode\":null,\"assetsNo\":\"02141601A000000001\",\"roadCode\":null,\"locplcNmRn\":null,\"buldNo\":null,\"areaName\":\"대구광역시 달서구 용산동 230\",\"regstrQy\":\"19,446㎡\",\"regstrQyName\":null,\"regstrAmount\":null,\"regstrAmountName\":\"21,001,140,000원\",\"acqsDe\":null,\"acqsDeName\":\"2003년01월02일\",\"prprtySeCode\":null,\"prprtySeName\":\"행정재산(공용)\",\"jrsdName\":\"법무부\",\"accnutCode\":null,\"accnutName\":null,\"acntCode\":null,\"acntName\":null,\"onlnGrfcCode\":null,\"onlnGrfcName\":\"서부지청 재산관리관\",\"assetsName\":\"대구광역시 달서구 용산동 230-32\",\"assetsGroupNo\":null,\"assetsGroupName\":null}]";
//		
//		HSSFWorkbook workbook = new JsonConverterServiceImpl().json2excel(jsonFieldString, jsonDataString);
//		
//		System.out.println(workbook);
//	}
}
