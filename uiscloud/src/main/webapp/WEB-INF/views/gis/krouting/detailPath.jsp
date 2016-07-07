<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>다중경로 상세</title>
<meta charset="utf-8">
<!-- ValidationBox ToolTip 을 위해 필요 -->
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/bootstrap/easyui.css">
<!-- 실제 사용 테마 -->
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/cupertino/easyui.css">
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/icon.css">
<link rel="stylesheet" type="text/css" href="/gis/lib/openlayers/theme/default/style.css">
	
<!-- jquery & easy ui -->
<script type="text/javascript" src="/gis/lib/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="/gis/js/com/util.js"></script>
<script type="text/javascript" src="/gis/js/kRouting/detailPath.js"></script>

<script>
/**********************************************************************
설명 :화면이 생성 되고 처음 실행되는 함수
파라메터 :
리턴값 :
***********************************************************************/
$(document).ready(function() {
	var dataArray = ${path};
	
	$('#dg').datagrid({
		data: dataArray,
		columns: [[
			  {field:'seq',title:'순번',width:30,align:'right', sortable: true}
			, {field:'caMgno',title:'시설물관리번호',width:100,align:'right', sortable: true}
			, {field:'sysClf',title:'자산소유구분',width:80,align:'right', sortable: true}
			, {field:'coreCnt',title:'코아수',width:50,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'compLen',title:'포설거리',width:60,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'ungrLoc',title:'매설위치',width:60,align:'right', sortable: true, formatter: gfnFormatNumber}
			, {field:'useCoreC',title:'사용코아수',width:80,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'conCoreCount',title:'접속코어수',width:80,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'useCoreP',title:'코아사용률',width:80,align:'right', sortable: true, sorter: gfnNumberSorter}
			, {field:'netClf',title:'망종류',width:60,align:'right', sortable: true}
			, {field:'cnstMgno',title:'공사관리번호',width:100,align:'right', sortable: true}
			, {field:'sido',title:'주소',width:200,align:'right', sortable: true}
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
});
</script>

</head>
<body>
    <div id="p" class="easyui-panel" title="다중경로 상세"
    style="width:100%;height:100%;padding:10px;background:#fafafa;"
    data-options="fit:true,border:false">
    	<table id="dg"></table>
    </div>
</body>
</html>