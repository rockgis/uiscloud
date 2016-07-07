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
<script type="text/javascript" src="/gis/js/com/properties.js"></script>
<script type="text/javascript" src="/gis/js/mapInfo/detailPath.js"></script>

<script>
/**********************************************************************
설명 :화면이 생성 되고 처음 실행되는 함수
파라메터 :
리턴값 :
***********************************************************************/
$(document).ready(function() {
	$.ajax({
		type: "POST",
		url: "/gis/mapInfoBookMark/BookmarkDetail",
		data: {
			  'headOffice': '${headOffice}'
			, 'creator': '${creator}'
			, 'title': '${title}'
		},
		dataType: "json",
		success : function(data) {
			dataArray = data;
	
			$('#dg').datagrid({
				fit: true, 
				data: dataArray,
				columns: [[
					  {field:'bookmark_master_id',title:'bookmark_master_id',width:30,align:'left', sortable: true, hidden: true}
					, {field:'headOffice',title:'본부',width:100,align:'left', sortable: true}
					, {field:'creator',title:'작성자',width:100,align:'left', sortable: true}
					, {field:'type',title:'입력구분',width:80,align:'left', sortable: true}
					, {field:'title',title:'명칭',width:300,align:'left', sortable: true}
					, {field:'name',title:'시설명',width:120,align:'left', sortable: true}
					, {field:'PNU',title:'수요건물 PNU',width:80,align:'left', sortable: true}
					, {field:'jibunBon',title:'수요건물 대번지',width:100,align:'right', sortable: true}
					, {field:'jibunBu',title:'수요건물 소번지',width:100,align:'right', sortable: true}
					, {field:'longD',title:'경도(도)',width:70,align:'right', sortable: true}
					, {field:'longM',title:'경도(분)',width:70,align:'right', sortable: true}
					, {field:'longS',title:'경도(초)',width:70,align:'right', sortable: true}
					, {field:'latD',title:'위도(도)',width:70,align:'right', sortable: true}
					, {field:'latM',title:'위도(분)',width:70,align:'right', sortable: true}
					, {field:'latS',title:'위도(초)',width:70,align:'right', sortable: true}
					, {field:'geom',title:'geometry',width:70,align:'right', sortable: true, hidden: true}
					, {field:'gid',title:'gid',width:70,align:'right', sortable: true, hidden: true}
				]],
		        singleSelect : true,
		        selectOnCheck : false,
		        checkOnSelect : false,
		        remoteSort:false,
		        autoRowHeight: false,
		        onClickRow: function(rowIndex, rowData) {
		        	detailPath.onClickRowMapInfo(rowIndex, rowData);        	
		        }
			});
		}
	});
	
	$('a').click(function(event) {
		$('#bb').dialog({
			title: '알림',
			
			buttons:[{
				text:'확인',
				handler:function() {


					//alert('${bookmarkMasterId}');
					/*
					var params = {
						masterId : '${bookmarkMasterId}'
					};
					
					$.get(
						"/gis/mapInfoBookMark/Bookmarkdelete",
						params,
						function(response) {
							//callback(response);
						},
						"json"
					);
					*/
					// 삭제를 위해 통신을 비동기화 해줌 : 삭제가 완전히 끝난후 메인페이지의 검색 기능을 실행하기 위해 비동기화
					$.ajaxSetup({ async:false });

					$.get(
				        "/gis/mapInfoBookMark/Bookmarkdelete",
				        {'masterId' : '${bookmarkMasterId}'},
				        function(jsonData){
				        	//alert("e");
				        },
				        "json"
				    );
					// 삭제를 위한 통신 후 ajax 설정을 동기화로 재변경
					$.ajaxSetup({ async:true });
						
					//document.frmMapInfoFacility.getElementById($("#frmMapInfoFacility .searchBookmark")).click();
					//$(document.opener).find($("#searchBookmark").click());
					//$(".searchBookmark").trigger("click");
					//$("#a_serGridToolbarTabsCloseAll").trigger("click");
					//$(opener.location).attr("href", "javascript:searchButton()");
					//$(document.opener).find($("#frmMapInfoFacility .searchBookmark").click());
					//opener.parent.searchBookmarkTest();
					//$(opener.document).find("#frmMapInfoFacility .searchBookmark").trigger('click');
					//$(opener.document).find(".searchBookmark").trigger("click");
					//document.getElementById(".searchBookmark").trigger('click');
					//$(opener.document).find(".searchBookmark").trigger("click");
					//opener.searchBookmarkTest();
					//$(opener.document).find(".searchBookmark").toggle();
					//$(document.opener).find($("#frmMapInfoFacility .searchBookmark").toggle());
					//opener.document.getElementById("#frmMapInfoFacility .searchBookmark").click();
					
					// 메인페이지의검색 기능 실행.  북마크 리스트 재조회
					opener.mapInfoBookmark.search();
					$('#bb').dialog('close');
					
					window.close();
				},
			},{
				text:'취소',
				handler:function() {
					$('#bb').dialog('close');
				}
			}]
		});
		
		/*
		$.get(
		        "/gis/mapInfoBookMark/Bookmarkdelete",
		        {'masterId' : '${bookmarkMasterId}'},
		        function(jsonData){
		        	alert("e");
		        },
		        "json"
		    );   
		*/
	});
});
</script>

</head>
<body>
    <div id="p" class="easyui-panel" title="북마크 상세"
    style="width:100%;height:100%;padding:10px;background:#fafafa;"
    data-options="fit:true,border:false">
    	<a href="#" class="listClear"><img src="/gis/images/btn/btn_erase_n.png" alt="지우기"/></a>
    	<table id="dg"></table>
    </div>
    
    <div id="bb">Upload한 제목명 및 Data를 일괄 삭제 하시겠습니까?</div>
    
    
</body>
</html>