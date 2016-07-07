/**
 * @Class Name : ExcelConverterServiceImpl.java
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
 package org.uiscloud.com.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.uiscloud.com.service.ExcelConverterService;

@Service("excelConverterService")
public class ExcelConverterServiceImpl implements ExcelConverterService {
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
	public List<List<String>> excel2ListInList(String fileFullPath, Integer sheetNumber) throws Exception {
		File file = new File(fileFullPath);
		FileInputStream fis = new FileInputStream(file);		

		int dotIndex = fileFullPath.lastIndexOf(".");
		String fileExt = fileFullPath.substring(dotIndex + 1, fileFullPath.length());		
		List<List<String>> listInList = excel2ListInList(fis, fileExt, sheetNumber);
		
		return listInList;
	}
	
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
	public List<List<String>> excel2ListInList(InputStream is, String fileExt, Integer sheetNumber) throws Exception {
		List<List<String>> listInList = null;

		if ("xls".equals(fileExt)) {
			listInList = xls2ListInList(is, sheetNumber);
		} else if ("xlsx".equals(fileExt)) {
			listInList = xlsx2ListInList(is, sheetNumber);
		} else {
			throw new Exception("엑셀 파일이 아닙니다.");
		}
		
		return listInList;
	}
	
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
	public List<Properties> excel2PropertiesInList(InputStream is, String fileExt, Integer sheetNumber) throws Exception {
		List<Properties> jsonList = null;

		if ("xls".equals(fileExt)) {
			jsonList = xls2PropertiesInList(is, sheetNumber);
		} else if ("xlsx".equals(fileExt)) {
			jsonList = xlsx2PropertiesInList(is, sheetNumber);
		} else {
			throw new Exception("엑셀 파일이 아닙니다.");
		}
		
		return jsonList;		
	}
	
	/**
	 * 
	 * InputStream 을 Excel 2003 이하 버전(xls)으로 생성 후에 List<List<String>> 변환
	 * 
	 * @param InputStream is
	 * @param Integer sheetNumber - 변환할 sheet number
	 * @return List<List<String>>
	 * @throws IOException
	 * @see SK BIES 시스템
	 * 
	 */	
	public List<List<String>> xls2ListInList(InputStream fis, Integer sheetNumber) throws IOException {
		// xls 파일 읽기***************************************************
		HSSFWorkbook workBook = new HSSFWorkbook(fis);
		HSSFSheet sheet = null;
		HSSFRow row = null;
		HSSFCell cell = null;
		// ************************************************************************

		int rows = 0;
		int cells = 0;

		sheet = workBook.getSheetAt(sheetNumber);
		rows = sheet.getPhysicalNumberOfRows() > sheet.getLastRowNum() ? 
					sheet.getPhysicalNumberOfRows() : sheet.getLastRowNum();

		List<List<String>> listInList = new ArrayList<List<String>>();

		for (int r = 0; r < rows; r++) {
			row = sheet.getRow(r);

			List<String> list = new ArrayList<String>();

			if (row == null) {
				for(int c = 0; c < cells; c++) {
					list.add("");
				}
			} else {
				cells = row.getPhysicalNumberOfCells() > row.getLastCellNum() ? 
							row.getPhysicalNumberOfCells() : row.getLastCellNum();

				for (int c = 0; c < cells; c++) {
					cell = row.getCell(c);
					String cellValue = "";
					// System.out.println("row:" + r + "==cells:" + c);

					if (cell != null) {
						switch (cell.getCellType()) {
						case 0:
							cellValue = String.valueOf(Double.valueOf(cell.getNumericCellValue()).longValue());
							// System.out.println(cell.getNumericCellValue());
							break;
						case 1:
							cellValue = cell.getStringCellValue();
							// System.out.println(cell.getStringCellValue());
							break;
						case Cell.CELL_TYPE_FORMULA:
							cellValue = cell.getCellFormula();
							// System.out.println(cell.getCellFormula());
							break;
						default:
							cellValue = "";
							// System.out.println("");
						}
					}

					list.add(cellValue);
				}// cell
			}

			listInList.add(list);
		}// row

		return listInList;
	}

	/**
	 * 
	 * InputStream 을 Excel 2007 이상 버전(xlsx)으로 생성 후에 지정한 시트를 List<List<String>> 변환
	 * 
	 * @param InputStream is
	 * @param Integer sheetNumber - 변환할 sheet number
	 * @return List<List<String>>
	 * @throws IOException
	 * @see SK BIES 시스템
	 * 
	 */		
	public List<List<String>> xlsx2ListInList(InputStream fis, Integer sheetNumber) throws IOException {
		// *********************************************** xlsx 파일 읽기
		XSSFWorkbook workBook = new XSSFWorkbook(fis);
		XSSFSheet sheet = null;
		XSSFRow row = null;
		XSSFCell cell = null;
		// ****************************************************************

		int rows = 0;
		int cells = 0;

		sheet = workBook.getSheetAt(sheetNumber);
		rows = sheet.getPhysicalNumberOfRows() > sheet.getLastRowNum() ? 
						sheet.getPhysicalNumberOfRows() : sheet.getLastRowNum();

		List<List<String>> listInList = new ArrayList<List<String>>();

		for (int r = 0; r < rows; r++) {
			row = sheet.getRow(r);

			List<String> list = new ArrayList<String>();

			if (row == null) {
				for(int c = 0; c < cells; c++) {
					list.add("");
				}
			} else {
				cells = row.getPhysicalNumberOfCells() > row.getLastCellNum() ? 
							row.getPhysicalNumberOfCells() : row.getLastCellNum();

				for (int c = 0; c < cells; c++) {
					cell = row.getCell(c);
					String cellValue = "";
					// System.out.println("row:" + r + "==cells:" + c);

					if (cell != null) {
						switch (cell.getCellType()) {
						case 0:
							cellValue = String.valueOf(Double.valueOf(cell.getNumericCellValue()).longValue());
							// System.out.println(cell.getNumericCellValue());
							break;
						case 1:
							cellValue = cell.getStringCellValue();
							// System.out.println(cell.getStringCellValue());
							break;
						case Cell.CELL_TYPE_FORMULA:
							cellValue = cell.getCellFormula();
							// System.out.println(cell.getCellFormula());
							break;
						default:
							cellValue = "";
							// System.out.println("");
						}
					}

					list.add(cellValue);
				}// cell
			}

			listInList.add(list);
		}// row

		return listInList;
	}

	/**
	 * 
	 * InputStream 을 Excel 2003 이하 버전(xls)으로 생성 후에 지정한 시트를 List<Properties> 변환
	 * 
	 * @param InputStream is
	 * @param Integer sheetNumber - 변환할 sheet number
	 * @return List<Properties>
	 * @throws IOException
	 * @see SK BIES 시스템
	 * 
	 */		
	public List<Properties> xls2PropertiesInList(InputStream fis, Integer sheetNumber) throws IOException {
		// xls 파일 읽기***************************************************
		HSSFWorkbook workBook = new HSSFWorkbook(fis);
		HSSFSheet sheet = null;
		HSSFRow row = null;
		HSSFCell cell = null;
		// ************************************************************************

		int rows = 0;
		int cells = 0;

		sheet = workBook.getSheetAt(sheetNumber);
		rows = sheet.getPhysicalNumberOfRows() > sheet.getLastRowNum() ? 
					sheet.getPhysicalNumberOfRows() : sheet.getLastRowNum();

		List<Properties> propertiesInList = new ArrayList<Properties>();
		
		List<String> headList = new ArrayList<String>();
		
		row = sheet.getRow(0);

		if (row == null) {
			for(int c = 0; c < cells; c++) {
				headList.add("");
			}
		} else {
			cells = row.getPhysicalNumberOfCells() > row.getLastCellNum() ? 
						row.getPhysicalNumberOfCells() : row.getLastCellNum();

			for (int c = 0; c < cells; c++) {
				cell = row.getCell(c);
				String cellValue = "";
				// System.out.println("row:" + r + "==cells:" + c);

				if (cell != null) {
					switch (cell.getCellType()) {
					case 0:
						cellValue = String.valueOf(Double.valueOf(cell.getNumericCellValue()).longValue());
						// System.out.println(cell.getNumericCellValue());
						break;
					case 1:
						cellValue = cell.getStringCellValue();
						// System.out.println(cell.getStringCellValue());
						break;
					case Cell.CELL_TYPE_FORMULA:
						cellValue = cell.getCellFormula();
						// System.out.println(cell.getCellFormula());
						break;
					default:
						cellValue = "";
						// System.out.println("");
					}
				}

				headList.add(cellValue);
			}// cell
		}

		for (int r = 1; r < rows; r++) {
			row = sheet.getRow(r);

			Properties columns = new Properties();

			if (row == null) {
				for(int c = 0; c < cells; c++) {
					columns.put(headList.get(c), "");
				}
			} else {
				cells = row.getPhysicalNumberOfCells() > row.getLastCellNum() ? 
							row.getPhysicalNumberOfCells() : row.getLastCellNum();

				for (int c = 0; c < cells; c++) {
					cell = row.getCell(c);
					String cellValue = "";
					// System.out.println("row:" + r + "==cells:" + c);

					if (cell != null) {
						switch (cell.getCellType()) {
						case 0:
							cellValue = String.valueOf(Double.valueOf(cell.getNumericCellValue()).longValue());
							// System.out.println(cell.getNumericCellValue());
							break;
						case 1:
							cellValue = cell.getStringCellValue();
							// System.out.println(cell.getStringCellValue());
							break;
						case Cell.CELL_TYPE_FORMULA:
							cellValue = cell.getCellFormula();
							// System.out.println(cell.getCellFormula());
							break;
						default:
							cellValue = "";
							// System.out.println("");
						}
					}

					columns.put(headList.get(c), cellValue);
				}// cell
			}

			propertiesInList.add(columns);
		}// row

		return propertiesInList;
	}

	/**
	 * 
	 * InputStream 을 Excel 2007 이상 버전(xlsx)으로 생성 후에 지정한 시트를 List<Properties> 변환
	 * 
	 * @param InputStream is
	 * @param Integer sheetNumber - 변환할 sheet number
	 * @return List<Properties>
	 * @throws IOException
	 * @see SK BIES 시스템
	 * 
	 */	
	public List<Properties> xlsx2PropertiesInList(InputStream fis, Integer sheetNumber) throws IOException {
		// *********************************************** xlsx 파일 읽기
		XSSFWorkbook workBook = new XSSFWorkbook(fis);
		XSSFSheet sheet = null;
		XSSFRow row = null;
		XSSFCell cell = null;
		// ****************************************************************

		int rows = 0;
		int cells = 0;

		sheet = workBook.getSheetAt(sheetNumber);
		rows = sheet.getPhysicalNumberOfRows() > sheet.getLastRowNum() ? 
					sheet.getPhysicalNumberOfRows() : sheet.getLastRowNum();

		List<Properties> propertiesInList = new ArrayList<Properties>();
		
		List<String> headList = new ArrayList<String>();
		
		row = sheet.getRow(0);

		if (row == null) {
			for(int c = 0; c < cells; c++) {
				headList.add("");
			}
		} else {
			cells = row.getPhysicalNumberOfCells() > row.getLastCellNum() ? 
						row.getPhysicalNumberOfCells() : row.getLastCellNum();

			for (int c = 0; c < cells; c++) {
				cell = row.getCell(c);
				String cellValue = "";
				// System.out.println("row:" + r + "==cells:" + c);

				if (cell != null) {
					switch (cell.getCellType()) {
					case 0:
						cellValue = String.valueOf(Double.valueOf(cell.getNumericCellValue()).longValue());
						// System.out.println(cell.getNumericCellValue());
						break;
					case 1:
						cellValue = cell.getStringCellValue();
						// System.out.println(cell.getStringCellValue());
						break;
					case Cell.CELL_TYPE_FORMULA:
						cellValue = cell.getCellFormula();
						// System.out.println(cell.getCellFormula());
						break;
					default:
						cellValue = "";
						// System.out.println("");
					}
				}

				headList.add(cellValue);
			}// cell
		}

		for (int r = 1; r < rows; r++) {
			row = sheet.getRow(r);

			Properties columns = new Properties();

			if (row == null) {
				for(int c = 0; c < cells; c++) {
					columns.put(headList.get(c), "");
				}
			} else {
				cells = row.getPhysicalNumberOfCells() > row.getLastCellNum() ? 
							row.getPhysicalNumberOfCells() : row.getLastCellNum();

				for (int c = 0; c < cells; c++) {
					cell = row.getCell(c);
					String cellValue = "";
					// System.out.println("row:" + r + "==cells:" + c);

					if (cell != null) {
						switch (cell.getCellType()) {
						case 0:
							cellValue = String.valueOf(Double.valueOf(cell.getNumericCellValue()).longValue());
							// System.out.println(cell.getNumericCellValue());
							break;
						case 1:
							cellValue = cell.getStringCellValue();
							// System.out.println(cell.getStringCellValue());
							break;
						case Cell.CELL_TYPE_FORMULA:
							cellValue = cell.getCellFormula();
							// System.out.println(cell.getCellFormula());
							break;
						default:
							cellValue = "";
							// System.out.println("");
						}
					}

					columns.put(headList.get(c), cellValue);
				}// cell
			}

			propertiesInList.add(columns);
		}// row

		return propertiesInList;
	}

	@Override
	public HSSFWorkbook makeExcel(List<Map<String, String>> headers, List<Object> data)
			throws Exception {
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFSheet sheet = workbook.createSheet("BIES");
		HSSFRow row = sheet.createRow(0);
		HSSFCell cell = null;
		HSSFCellStyle cellStyle = null;
		
		int idxRow = 0;
		int idxCell = 0;
		long size = data.size();
		
		List<String> headerFields = new ArrayList<String>();
		
		// fieldMapInList 에서 Excel Header 정보 추출
		for(Map<String, String> header: headers) {
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

		// dataMapInList 에서 Excel Value 정보 추출
		for(idxRow = 0; idxRow < size; idxRow++) {
			row = sheet.createRow(idxRow + 1);
			
			idxCell = 0;
			
			for(String field : headerFields) {
				// style 객체가 각 cell 별로 별도 필요
				// 아니면 공유가 일어남
				cellStyle = workbook.createCellStyle();
				
				cellStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
				cellStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
				cellStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
				cellStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
				
//				for(Map<String, String> header: data) {
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
			    //cell.setCellValue(dataMapInList.get(idxRow).get(field));
				cell.setCellValue(data.get(idxRow).toString());
				cell.setCellStyle(cellStyle);
				
				idxCell++;
				
				//System.out.println(field + " : " + dataMapInList.get(idxRow).get(field));
			}
		}
		
		return workbook;
	}
}