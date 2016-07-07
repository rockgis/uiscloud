<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<!DOCTYPE html>
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
      <a href="/admin"> <i class="icon-monitoring"></i> Dashboard</a>
      <a><i class="icon-realtime"></i> Realtime</a>
      <a><i class="icon-profile"></i> Analysis</a>
      <a><i class="icon-chart"></i> Statistics</a>
      <a><i class="icon-document"></i> Document</a>
      <a href="/admin/layermng"><i class="icon-gear"></i> LayerMNG</a>
      <a href="/admin/user" class="active"><i class="icon-user"></i> User</a>
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
          <h2 class="title">사용자 관리</h2>

          <div class="view">

            <button class="btn small" onclick="insert()">
			    <!-- <i class="icon-play"></i> --> 
				추가
			</button>
			<button class="btn small" onclick="update()">
			    <!-- <i class="icon-play"></i> --> 
				수정
			</button>
			<button class="btn small" onclick="deleteUser()">
			    <!-- <i class="icon-play"></i> --> 
				삭제
			</button>
			<table class="table classic hover">
				<thead>
					<tr>
						<th>번호</th>
						<th>아이디</th>
						<th>이름</th>
						<th>권한</th>
						<th>권한명</th>
						<th>지역</th>
						<th>이메일</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><input type="text" id="cntId" disabled="disabled" style="width:100%;"/></td>
						<td><input type="text" id="userId" style="width:100%;"/></td>
						<td><input type="text" id="userName" style="width:100%;"/></td>
						<td>
							<select type="text" id="userRole" style="width:100%;">
								<!-- <option value="1">1</option> -->
								<option value="2">2</option>
								<!-- <option value="3">3</option>
								<option value="4">4</option> -->
							</select>
						</td>
						<td><input type="text" id="roleName" value="ROLE_USER" disabled="disabled" style="width:100%;"/></td>
						<td>
							<select type="text" id="userRegion" style="width:100%;">
								<option value="1">1</option>
								<!-- <option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option> -->
							</select>
						</td>
						<td><input type="text" id="email" style="width:100%;"/></td>
					</tr>
				</tbody>
			</table>
			<div id="paging_2_xtable" class="xtable" style="margin-top: 7px;">
			    <table class="table classic">
			        <thead>
			        <tr>
			            <th>번호</th>
			            <th>아이디</th>
			            <th>이름</th>
			            <th>권한</th>
			            <th>지역</th>
			            <th>이메일</th>
			            <th>사용여부</th>
			            <th>생성일자</th>
			            <th>권한명</th>
			            <th>agt_cd</th>
			            <th>부서</th>
			            <th>dept_type</th>
			            <th>그룹</th>
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
      		  <td><!= cntId !></td>
     		  <td><!= userId !></td>
				<td><!= userName !></td>				
				<td><!= userRole !></td>
				<td><!= userRegion !></td>
				
				<td><!= email !></td>
				<td><!= status !></td>
				<td><!= createDatetime !></td>
				<td><!= roleName !></td>
				<td><!= agtCd !></td>
				<td><!= dept !></td>
				<td><!= deptType !></td>
				<td><!= grpId !></td>
    		</tr>
			</script>
			
			<script id="tpl_none" type="text/template">
    		<tr>
    		    <td colspan="12" class="none" align="center">Data does not exist.</td>
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
        fields: [ "cntId", "userId", "userName", "userRole", "userRegion", 
                  "email", "status", "createDatetime", "roleName", "agtCd",
                  "dept", "deptType", "grpId" ],
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
            	$('#cntId').val(data.cntId);
            	$('#userId').val(data.userId);
            	$('#userName').val(data.userName);
            	$('#email').val(data.email);
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
	selectUserList();
});

function selectUserList(){
	var params = {};
	$.post(
        "/admin/user/select",
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
		userId : $('#userId').val(),
		userName : $('#userName').val(),
		userRole : $('#userRole').val(),
		userRegion : $('#userRegion').val(),
		roleName : $('#roleName').val(),
		email : $('#email').val(),
		status : 1
	};
	
	$.post(
        "/admin/user/insert",
        params,
        function(response){
			if(response.rows > 0){
				selectUserList();
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
		cntId : $('#cntId').val(),
		userId : $('#userId').val(),
		userName : $('#userName').val(),
		email : $('#email').val()
	};
	
	$.post(
        "/admin/user/update",
        params,
        function(response){
			if(response.rows > 0){
				selectUserList();
				initInsertInput();
			}
			else{
				alert("수정 실패");
			}
        },
        "json"
    );
}

function deleteUser(){
	var params = {
		cntId : $('#cntId').val()
	};
	
	$.post(
        "/admin/user/delete",
        params,
        function(response){
			if(response.rows > 0){
				selectUserList();
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
	$('#cntId').val('');
	$('#userId').val('');
	$('#userName').val('');
	$('#email').val('');
}

</script>
</body>
</html>
