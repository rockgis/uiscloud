<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>링 경로 상세</title>
<meta charset="utf-8">
<!-- ValidationBox ToolTip 을 위해 필요 -->
<link rel="stylesheet" type="text/css" href="/titan/lib/jquery/easyui/themes/bootstrap/easyui.css">
<!-- 실제 사용 테마 -->
<link rel="stylesheet" type="text/css" href="/titan/lib/jquery/easyui/themes/cupertino/easyui.css">
<link rel="stylesheet" type="text/css" href="/titan/lib/jquery/easyui/themes/icon.css">
<link rel="stylesheet" type="text/css" href="/titan/lib/openlayers/theme/default/style.css">
	
<!-- jquery & easy ui -->
<script type="text/javascript" src="/titan/lib/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="/titan/lib/jquery/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="/titan/js/com/util.js"></script>
<script type="text/javascript" src="/titan/js/mapInfo/detailPath.js"></script>

<script>
/**********************************************************************
설명 :화면이 생성 되고 처음 실행되는 함수
파라메터 :
리턴값 :
***********************************************************************/
$(document).ready(function() {
	var dataArray = JSON.parse(JSON.stringify('${path}'));	

	$.ajax({
		type: "POST",
		url: "/titan/ring/selectDetailPath",
		data: {
			  'netNo': '${netNo}'
		},
		dataType: "json",
		success : function(data) {
			dataArray = data.path;
			
			$('#dg').datagrid({
				data: dataArray,
				columns:[[
						  {field:'seq', title:'순번', width:30, align:'right', sortable: true}
							, {field:'frFctsMgno', title:'시작노드코드', width:100, align:'left', sortable: true}
							, {field:'frFctsNm', title:'시작노드이름', width:150, align:'left', sortable: true}
							, {field:'toFctsMgno', title:'종료노드코드', width:100, align:'left', sortable: true}
							, {field:'toFctsNm', title:'종료노드이름', width:150, align:'left', sortable: true}
							, {field:'unqMgno', title:'고유관리번호', width:200, align:'right', sortable: true}
							, {field:'coreCnt', title:'코어내역(코어수)', width:100, align:'right', sortable: true}
							, {field:'compLen', title:'포설 길이', width:50, align:'right', sortable: true}
							, {field:'pathYN', title:'패치여부', width:50, align:'left', sortable: true}
							, {field:'sysClf', title:'사업자구분', width:100, align:'left', sortable: true}
							, {field:'ungrLocName', title:'가공지중구분', width:100, align:'left', sortable: true}
						]],
		        singleSelect : true,
		        selectOnCheck : false,
		        checkOnSelect : false,
		        remoteSort:false,
		        autoRowHeight: false,
		        onClickRow: function(rowIndex, rowData) {
		        	detailPath.onClickRow(rowIndex, rowData);        	
		        }
			});
		}
		
	});	
	$('#p').panel({
		tools:[{
	        iconCls:'icon-excel',
	        handler:function(){
	        	
	        	var url = "/titan/ring/selectDetailPathDownloadExcel";
				url += '?netNo=${netNo}';	
				
				$("#hid_data").val(encodeURIComponent(opener.saveMap.getXML()));
				$("#frm_file_download").attr("action", url);
				$("#frm_file_download").submit();
	        }
	    }]
	});
	
});
</script>

</head>
<body>
    <div id="p" class="easyui-panel" title="링 경로 상세"
    style="width:100%;height:100%;padding:10px;background:#fafafa;"
    data-options="fit:true,border:false">
    	<table id="dg"></table>
    </div>
</body>

<form name="frm_file_download" id="frm_file_download" method="post">
	<!-- 화면저장 -->
	<input type="hidden" id="hid_data" name="data" value="">
	
	<!-- 단일 & 다중 경로 검색 엑셀 다운로드 -->
	<input type="hidden" id="jsonFieldString" name="jsonFieldString" value="">
	<input type="hidden" id="jsonDataString" name="jsonDataString" value="">
	<input type="hidden" id="jsonNewLineDataString" name="jsonNewLineDataString" value="">
	
	<!-- 다중 경로 검색 엑셀 다운로드 -->
	<input type="hidden" id="jsonStatisticsFieldString" name="jsonStatisticsFieldString" value="">
	<input type="hidden" id="jsonStatisticsDataString" name="jsonStatisticsDataString" value="">
</form>
</html>