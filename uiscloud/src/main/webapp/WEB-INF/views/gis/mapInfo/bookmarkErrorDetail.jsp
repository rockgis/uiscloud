<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>북마크 상세</title>
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
	// 경도(도) 처럼 중간에 ( 나 ) 있는 경우 datagrid 컬럼 width 에 문제 발생
	dataArray = JSON.parse('${excel}'.replace(/\)/g, "").replace(/\(/g, "_"));

	$('#dg').datagrid({
		fit: true, 
		data: dataArray,
		columns: [[
		  	  {field:'본부명',title:'본부명',width:100,align:'left', sortable: true}
			, {field:'작성자',title:'작성자',width:100,align:'left', sortable: true}
			, {field:'오류',title:'오류',width:400,align:'left', sortable: true}  
			, {field:'입력구분',title:'입력구분',width:80,align:'left', sortable: true}
			, {field:'명칭',title:'명칭',width:300,align:'left', sortable: true}
			, {field:'국소unq_mgno',title:'국소unq_mgno',width:120,align:'left', sortable: true}
			, {field:'전주ke_mesh_no',title:'전주ke_mesh_no',width:120,align:'left', sortable: true}
			, {field:'시설물PNU',title:'시설물PNU',width:80,align:'left', sortable: true}
			, {field:'시설물대번지',title:'시설물대번지',width:100,align:'right', sortable: true}
			, {field:'시설물소번지',title:'시설물소번지',width:100,align:'right', sortable: true}
			, {field:'경도_도',title:'경도(도)',width:70,align:'right', sortable: true}
			, {field:'경도_분',title:'경도(분)',width:70,align:'right', sortable: true}
			, {field:'경도_초',title:'경도(초)',width:70,align:'right', sortable: true}
			, {field:'위도_도',title:'위도(도)',width:70,align:'right', sortable: true}
			, {field:'위도_분',title:'위도(분)',width:70,align:'right', sortable: true}
			, {field:'위도_초',title:'위도(초)',width:70,align:'right', sortable: true}		
		]],
        singleSelect : true,
        selectOnCheck : false,
        checkOnSelect : false,
        remoteSort:false,
        autoRowHeight: false
	});
	//alert('${excelErrorMessage}');
});
</script>

</head>
<body>
    <div id="p" class="easyui-panel" title="북마크 오류 상세"
    style="width:100%;height:100%;padding:10px;background:#fafafa;"
    data-options="fit:true,border:false">
    	<table id="dg"></table>
    </div>
</body>
</html>