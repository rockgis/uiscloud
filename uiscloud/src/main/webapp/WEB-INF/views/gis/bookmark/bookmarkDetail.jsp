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

	$.ajax({
		type: "POST",
		url: "/gis/bookmark/BookmarkDetail",
		data: {
			  'headOffice': '${headOffice}'
			, 'creator': '${creator}'
			, 'title': '${title}'
		},
		dataType: "json",
		success : function(data) {
			dataArray = data;
			console.log("1",data);
			$('#dg').datagrid({
				fit: true, 
				data: dataArray,
				columns: [[
					  {field:'bookmark_master_id',title:'bookmark_master_id',width:30,align:'left', sortable: true, hidden: true}
					, {field:'headOffice',title:'본부',width:100,align:'left', sortable: true}
					, {field:'creator',title:'작성자',width:100,align:'left', sortable: true}
					, {field:'type',title:'입력구분',width:80,align:'left', sortable: true}
					, {field:'title',title:'명칭',width:300,align:'left', sortable: true}
					, {field:'unqMgno',title:'상위국(unq_mgno)',width:120,align:'left', sortable: true}
					, {field:'higherName',title:'상위국',width:120,align:'left', sortable: true}
					, {field:'higherAddress',title:'상위국 주소',width:200,align:'left', sortable: true}
					, {field:'lowerPNU',title:'하위국 PNU',width:80,align:'left', sortable: true}
					, {field:'lowerAddress',title:'하위국 주소',width:200,align:'left', sortable: true}
					, {field:'jibunBon',title:'하위국 대번지',width:100,align:'right', sortable: true}
					, {field:'jibunBu',title:'하위국 소번지',width:100,align:'right', sortable: true}
					, {field:'longD',title:'경도(도)',width:70,align:'right', sortable: true}
					, {field:'longM',title:'경도(분)',width:70,align:'right', sortable: true}
					, {field:'longS',title:'경도(초)',width:70,align:'right', sortable: true}
					, {field:'latD',title:'위도(도)',width:70,align:'right', sortable: true}
					, {field:'latM',title:'위도(분)',width:70,align:'right', sortable: true}
					, {field:'latS',title:'위도(초)',width:70,align:'right', sortable: true}
					, {field:'higherGeom',title:'상위국 Geom',width:150,align:'right', sortable: true, hidden: true}
					, {field:'lowerGeom',title:'하위국 Geom',width:150,align:'right', sortable: true, hidden: true}
				]],
		        singleSelect : true,
		        selectOnCheck : false,
		        checkOnSelect : false,
		        remoteSort:false,
		        autoRowHeight: false
			});
		}
	});	
});
</script>

</head>
<body>
    <div id="p" class="easyui-panel" title="북마크 상세"
    style="width:100%;height:100%;padding:10px;background:#fafafa;"
    data-options="fit:true,border:false">
    	<table id="dg"></table>
    </div>
</body>
</html>