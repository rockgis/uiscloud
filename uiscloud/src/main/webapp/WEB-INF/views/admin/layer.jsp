<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="initial-scale=1, maximum-scale=1">


<link rel="stylesheet" href="/jui/lib/jui/css/ui.min.css"/>
<link id="ui_theme" rel="stylesheet" href="/jui/lib/jui/css/ui-jennifer.min.css"/>
<link rel="stylesheet" href="/jui/lib/jui/css/grid.min.css"/>
<link id="grid_theme" rel="stylesheet" href="/jui/lib/jui/css/grid-jennifer.min.css"/>
<script src="/jui/lib/jquery-1.8.0.min.js"></script>
<script src="/jui/lib/jui/js/core.min.js"></script>
<script src="/jui/lib/jui/js/ui.min.js"></script>
<script src="/jui/lib/jui/js/grid.min.js"></script>
<script src="/jui/lib/jui/js/chart.min.js"></script>
<link href="http://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
<link href="/jui/admintool/index.css" rel="stylesheet" type="text/css" />
<link id="index_theme" href="/jui/admintool/index-jennifer.css" rel="stylesheet" type="text/css" />

</head>
<body class="jui">

<div class="header">
  <div class="logo">
    <span id="span_logo"><a href="/"><img id="imgLogo" src="/geolib/images/main/img_logo.png" alt="titan Logo" /></a></span>
  </div>
  <div class="toolbar">
    
    <span style="float:right">
      관리자 페이지 <i class="icon-check"></i>
    </span>
  </div>
</div>

<div class="container">
  <div class="menu">
    <div class="vmenu ">
      <a href="/" ><i class="icon-menu"></i> Main</a>
      <a href="/admin"><i class="icon-monitoring"></i> Dashboard</a>
      <a><i class="icon-realtime"></i> Realtime</a>
      <a><i class="icon-profile"></i> Analysis</a>
      <a><i class="icon-chart"></i> Statistics</a>
      <a><i class="icon-document"></i> Document</a>
      <a href="/admin/layermng" class="active"><i class="icon-gear"></i> LayerMNG</a>
      <a href="/admin/user"><i class="icon-user"></i> User</a>
    </div>
  </div>
  <div class="content">
    <div class="content-list">
      <div class="dashboard-first">
        <div class="col col-3">
          <div class="card">
            <div class="title">Today's visitors</div>
            <div class="value">3,352</div>
          </div>
        </div>
        <div class="col col-3">
          <div class="card">
            <div class="title">Time of operation of call</div>
            <div class="value">2,364,806</div>
          </div>
        </div>
        <div class="col col-3">
          <div class="card">
            <div class="title">Time of operation Number of EVENT</div>
            <div class="value">15,610</div>
          </div>
        </div>
        <div class="col col-3">
          <div class="card">
            <div class="title">Peak Time</div>
            <div class="value">10:00 ~ 11:00</div>
          </div>
        </div>
      </div>

      <div class="panel dashed">
        <div class="body">
          <h2 class="title">Layer 관리</h2>

          <div class="view">

            <!-- <P>
            스타일 및 ui작업은 여기 참조 : http://uiplay.jui.io/?p=paging_2
             </P> -->
            <button class="btn small" onclick="insert()">
			    <!-- <i class="icon-play"></i> --> 
				추가
			</button>
			<button class="btn small" onclick="update()">
			    <!-- <i class="icon-play"></i> --> 
				수정
			</button>
			<button class="btn small" onclick="deleteLayer()">
			    <!-- <i class="icon-play"></i> --> 
				삭제
			</button>
			<table class="table classic hover">
				<thead>
					<tr>
						<th>pk</th>
						<th>한글명</th>
						<th>레이어명</th>
						<th>심볼라이저</th>
						<th>테이블명</th>
						<th>GIS구분필드</th>
						<th>GIS심벌코드</th>
						<th>사용여부</th>
						<th>트리부모pk</th>
						<th>트리순서</th>
						<th>트리깊이</th>
						<th>최소표시레벨</th>
						<th>트리열림여부</th>
						<th>트리체크여부</th>
						<th>검색유형BitWise</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><input type="text" id="layerTreePk" disabled="disabled" style="width:100%;"/></td>
						<td><input type="text" id="korName" style="width:100%;"/></td>
						<td><input type="text" id="layerName" style="width:100%;"/></td>
						<td><input type="text" id="symbolizer" style="width:100%;"/></td>
						<td><input type="text" id="tableName" style="width:100%;"/></td>
						<td><input type="text" id="conditionField" style="width:100%;"/></td>
						<td><input type="text" id="condition" style="width:100%;"/></td>
						<td><input type="text" id="used" style="width:100%;"/></td>
						<td><input type="text" id="parentPk" style="width:100%;"/></td>
						<td><input type="text" id="treeOrder" style="width:100%;"/></td>
						<td><input type="text" id="treeDepth" style="width:100%;"/></td>
						<td><input type="text" id="displayLevel" style="width:100%;"/></td>
						<td><input type="text" id="opened" style="width:100%;"/></td>
						<td><input type="text" id="checked" style="width:100%;"/></td>
						<td><input type="text" id="searchRequiredFieldsType" style="width:100%;"/></td>
					</tr>
				</tbody>
			</table>
			<div id="paging_2_xtable" class="xtable" style="margin-top: 7px;">
			    <table class="table classic">
			        <thead>
			        <tr>
			            <th>pk</th>
						<th>한글명</th>
						<th>레이어명</th>
						<th>심볼라이저</th>
						<th>테이블명</th>
						<th>GIS구분필드</th>
						<th>GIS심벌코드</th>
						<th>사용여부</th>
						<th>트리부모pk</th>
						<th>트리순서</th>
						<th>트리깊이</th>
						<th>최소표시레벨</th>
						<th>트리열림여부</th>
						<th>트리체크여부</th>
						<th>검색유형BitWise</th>
			        </tr>
			        </thead>
			        <tbody></tbody>
			    </table>
			</div>
			
			<div id="paging_2" class="paging" style="margin-top: 3px;">
			    <a href="#" class="prev">Previous</a>
			    <div class="list"></div>
			    <a href="#" class="next">Next</a>
			</div>
			
			<script id="tpl_row" type="text/template">
   			 <tr>
      		  <td><!= layerTreePk !></td>
     		  <td><!= korName !></td>
   		      <td><!= layerName !></td>
   		      <td><!= symbolizer !></td>
   		      <td><!= tableName !></td>
   		      <td><!= conditionField !></td>
   		      <td><!= condition !></td>
   		      <td><!= used !></td>
   		      <td><!= parentPk !></td>
   		      <td><!= treeOrder !></td>
   		      <td><!= treeDepth !></td>
   		      <td><!= displayLevel !></td>
   		      <td><!= opened !></td>
   		      <td><!= checked !></td>
   		      <td><!= searchRequiredFieldsType !></td>
    		</tr>
			</script>
			
			<script id="tpl_none" type="text/template">
    		<tr>
    		    <td colspan="15" class="none" align="center">Data does not exist.</td>
    		</tr>
			</script>
			
			<script id="tpl_pages" type="text/template">
 			   <! for(var i = 0; i < pages.length; i++) { !>
 			   <a href="#" class="page"><!= pages[i] !></a>
 		 	  <! } !>
			</script>
              

          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>
<script>

jui.ready([ "ui.paging", "grid.xtable" ], function(paging, xtable) {
    paging_2 = paging("#paging_2", {
        pageCount: 100,
        event: {
            page: function(pNo) {
                paging_2_xtable.page(pNo);
            }
        },
        tpl: {
            pages: $("#tpl_pages").html()
        }
    });

    paging_2_xtable = xtable("#paging_2_xtable", {
        fields: [ "layerTreePk", "korName", "layerName",
                  "symbolizer", "tableName", "conditionField",
                  "condition", "used", "parentPk", "treeOrder",
                  "treeDepth", "displayLevel", "opened",
                  "checked" ,"searchRequiredFieldsType"],
        resize: true,
        sort: true,
        sortLoading: true,
        buffer: "s-page",
        bufferCount: 100,
        event: {
            sortend: function(data, e) {
                paging_2.first();
            },
            click : function(row, e){
            	var data = row.data;
            	$('#layerTreePk').val(data.layerTreePk);
            	$('#korName').val(data.korName);
            	$('#layerName').val(data.layerName);
            	$('#symbolizer').val(data.symbolizer);
            	$('#tableName').val(data.tableName);
            	$('#conditionField').val(data.conditionField);
            	$('#condition').val(data.condition);
            	$('#used').val(data.used);
            	$('#parentPk').val(data.parentPk);
            	$('#treeOrder').val(data.treeOrder);
            	$('#treeDepth').val(data.treeDepth);
            	$('#displayLevel').val(data.displayLevel);
            	$('#opened').val(data.opened);
            	$('#checked').val(data.checked);
            	$('#searchRequiredFieldsType').val(data.searchRequiredFieldsType);
            }
        },
        tpl: {
            row: $("#tpl_row").html(),
            none: $("#tpl_none").html()
        }
    });

    paging_2_submit = function() {
        var result = [];

        for(var i = 0; i < 1000000; i++) {
            result.push({ name: "Alvin" + i, age: Math.floor(Math.random() * 100) + 1, location: "LA" });
        }

        paging_2_xtable.update(result);
        paging_2_xtable.resize();
        paging_2.reload(paging_2_xtable.count());
    }
});


function changeTheme(theme) {
  $("#ui_theme").attr("href", "/jui/lib/jui/css/ui-" + theme + ".min.css");
  $("#grid_theme").attr("href", "/jui/lib/jui/css/grid-" + theme + ".min.css");
  $("#index_theme").attr("href", "/jui/admintool/index-" + theme + ".css");

  for(var i = 0, len = chart_list.length; i < len; i++) {

    if (chart_list[i].setTheme) {
      chart_list[i].setTheme(theme);
    } else {
      chart_list[i].chart.setTheme(theme);
    }
  }
}

$(document).ready(function(){
	// 사용자 리스트 불러오기
	selectLayerList();
});

function selectLayerList(){
	var params = {};
	$.post(
        "/admin/layer/select",
        params,
        function(response){
        	var result = response.result;
			if(result.length > 0){
				paging_2_xtable.update(result);
	            paging_2_xtable.resize();
	            paging_2.reload(paging_2_xtable.count());	
			}
        },
        "json"
    );
}

function insert(){
	var params = {
			korName : $('#korName').val(),
			layerName : $('#layerName').val(),
			symbolizer : $('#symbolizer').val(),
			tableName : $('#tableName').val(),
			conditionField : $('#conditionField').val(),
			condition : $('#condition').val(),
			used : $('#used').val(),
			parentPk : $('#parentPk').val(),
			treeOrder : $('#treeOrder').val(),
			treeDepth : $('#treeDepth').val(),
			displayLevel : $('#displayLevel').val(),
			opened : $('#opened').val(),
			checked : $('#checked').val(),
			searchRequiredFieldsType: $('#searchRequiredFieldsType').val()
	};
	
	$.post(
        "/admin/layer/insert",
        params,
        function(response){
			if(response.rows > 0){
				selectLayerList();
				initInsertInput();
			}
			else{
				alert("추가 실패");
			}
        },
        "json"
    );
}

function update(){
	var params = {
		layerTreePk : $('#layerTreePk').val(),
		korName : $('#korName').val(),
		layerName : $('#layerName').val(),
		symbolizer : $('#symbolizer').val(),
		tableName : $('#tableName').val(),
		conditionField : $('#conditionField').val(),
		condition : $('#condition').val(),
		used : $('#used').val(),
		parentPk : $('#parentPk').val(),
		treeOrder : $('#treeOrder').val(),
		treeDepth : $('#treeDepth').val(),
		displayLevel : $('#displayLevel').val(),
		opened : $('#opened').val(),
		checked : $('#checked').val(),
		searchRequiredFieldsType: $('#searchRequiredFieldsType').val()
	};
	
	$.post(
        "/admin/layer/update",
        params,
        function(response){
			if(response.rows > 0){
				selectLayerList();
				initInsertInput();
			}
			else{
				alert("수정 실패");
			}
        },
        "json"
    );
}

function deleteLayer(){
	var params = {
			layerTreePk : $('#layerTreePk').val()
	};
	
	$.post(
        "/admin/layer/delete",
        params,
        function(response){
			if(response.rows > 0){
				selectLayerList();
				initInsertInput();
			}
			else{
				alert("삭제 실패");
			}
        },
        "json"
    );
}

function initInsertInput(){
	$('#layerTreePk').val('');
	$('#korName').val('');
	$('#layerName').val('');
	$('#symbolizer').val('');
	$('#tableName').val('');
	$('#conditionField').val('');
	$('#condition').val('');
	$('#used').val('');
	$('#parentPk').val('');
	$('#treeOrder').val('');
	$('#treeDepth').val('');
	$('#displayLevel').val('');
	$('#opened').val('');
	$('#checked').val('');
	$('#searchRequiredFieldsType').val('');
}

</script>
</body>
</html>
