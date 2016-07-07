<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib prefix="validator" uri="http://www.springmodules.org/tags/commons-validator"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<%
	/**
	 * @Class Name : BbsRegister.jsp
	 * @Description : Bbs Register 화면
	 * @Modification Information
	 * 
	 * @author 김종민
	 * @since 2014.03.05
	 * @version 1.0
	 * @see
	 *  
	 * Copyright (C) All right reserved.
	 */
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>헬프데스크 등록 <c:if test="${ROLE_ADMIN}"> - 관리자 모드</c:if></title>
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/bootstrap/easyui.css">
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/cupertino/easyui.css">
<link rel="stylesheet" type="text/css" href="<c:url value='/gis/css/bootstrap/bootstrap.css'/>" />
<link rel="stylesheet" type="text/css" href="<c:url value='/gis/css/bootstrap/bootstrap-responsive.css'/>" />
<script type="text/javascript" src="<c:url value='/gis/js/bbs/common.js'/>"></script>
<script type="text/javascript" src="/gis/lib/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<c:url value='/gis/js/bbs/ajaxUtil.js'/>"></script>
<script type="text/javascript" src="<c:url value='/gis/js/bbs/tools.js'/>"></script>
<script type="text/javascript" src="<c:url value='/gis/js/com/util.js'/>"></script>
<script type="text/javascript" src="<c:url value='/gis/js/bbs/emailingCertService.js'/>"></script>
<script type="text/javaScript" defer="defer">
<!--
	$(document).ready(
		function() {
			<c:if test="${not empty errMsg}">
			alert("${errMsg}");
			</c:if>
		
		$('#addFile').click(function() {
		    var fileIndex = $('#fileList ul').children().length;

		    if(fileIndex >= 5){
		    	alert("첨부파일은 최대 5개입니다.");
		    	return;
		    }
		    $('#fileList').append(
		            '<ul style=list-style-type:none;><li>'+
		            '   <input type="file" name="files['+ fileIndex +']" />'+
		            '</ul></li>');
		});
	});
	/* 글 목록 화면 function */
	function fn_egov_selectList() {
		document.getElementById("detailForm").action = "<c:url value='/gis/bbs/Bbs'/>";
		document.getElementById("detailForm").submit();
	}

	/* 글 등록 function */
	function fn_egov_save() {
		frm = document.getElementById("detailForm");
		
		/* TODO Validation기능 보완 */
		frm.title.value = $.trim(frm.title.value);
		if (frm.title.value == undefined || frm.title.value == "") {
			alert("제목을 입력하시기 바랍니다.");
			return;
		}
		frm.content.value = $.trim(frm.content.value);
		if (frm.content.value == undefined || frm.content.value == "") {
			alert("내용을 입력하시기 바랍니다.");
			return;
		}
		var count = getStringBytes(frm.content.value);
		if (count > 4000) {
			alert("내용은 최대 4000Byte를 넘을 수 없습니다.");
			return;
		}
		frm.creator.value = $.trim(frm.creator.value);
		if (frm.creator.value == undefined || frm.creator.value == "") {
			alert("작성자 성명을 입력하시기 바랍니다.");
			return;
		}
		frm.pwd.value = $.trim(frm.pwd.value);
		if (frm.pwd.value == undefined || frm.creator.value == "") {
			alert("비밀번호를 입력하시기 바랍니다.");
			return;
		}
		
		frm.action = '<c:url value="/gis/bbs/addBbs" />';
		frm.submit();
	}
// -->
</script>
</head>
<body>
<div class="row" style="margin: 30px;">
	<div class="row-fluid">
		<!-- 타이틀 -->
		<c:if test="${searchVO.bbsType ne 'N'}"><div class="span12 alert alert-success">Q&amp;A - 등록</div></c:if>
		<c:if test="${searchVO.bbsType eq 'N'}"><div class="span12 alert alert-success">공지사항 - 등록</div></c:if>
	</div>
	<form:form commandName="bbsVO" name="detailForm" id="detailForm" class="form-horizontal" enctype="multipart/form-data">
		<div class="control-group">
			<label class="control-label" for="title">제목</label>
			<div class="controls"><input name="title" class="input-block-level" style="ime-mode: active;" maxlength="100" placeholder="제목" /></div>
		</div>
		<c:if test="${searchVO.bbsType eq 'N'}">
		<div class="control-group">
			<label class="control-label" for="title">공지일</label>
			<div class="controls"><input class="startDate easyui-datebox" name="startDate" style="width: 90px;" data-options="formatter: gfnEasyUiDateFormatter, parser: gfnEasyUiDateParser" />~
			<input class="endDate easyui-datebox" style="width: 90px;" name="endDate" data-options="formatter: gfnEasyUiDateFormatter, parser: gfnEasyUiDateParser" /></div>
		</div>			
		</c:if>
		<div class="control-group">
			<label class="control-label" for="title">내용</label>
			<div class="controls"><textarea name="content" class="input-block-level" style="ime-mode: active;" id="content"
							cols="10" rows="10" placeholder="내용"></textarea></div>
		</div>
		<div class="control-group">
			<label class="control-label" for="creator">파일</label>
			<div class="controls">
				<input id="addFile" type="button" value="Add File" />
				<div id="fileList"></div>
			</div>
		</div>
		<div class="control-group">
			<label class="control-label" for="creator">작성자</label>
			<div class="controls"><input name="creator" class="input-block-level" style="ime-mode: active;" maxlength="10" placeholder="작성자" /></div>
		</div>
		<div class="control-group">
			<label class="control-label" for="pwd">비밀번호</label>
			<div class="controls"><input name="pwd" class="input-block-level" style="ime-mode: active;" type="password" maxlength="10" placeholder="비밀번호" /></div>
		</div>
		<div class="row-fluid">
			<div class="span12 text-right">
				<a href="#" onclick="fn_egov_save();"><img src="/gis/images/bbs/btn_enter.png" alt="등록" /></a>
				<a href="#" onclick="fn_egov_selectList('<c:out value='${ssbbsType}'/>');"><img src="/gis/images/bbs/btn_list.png" alt="목록" /></a>
			</div>
		</div>
		<!-- 검색조건 유지 -->
		<input type="hidden" name="searchCondition"
			value="<c:out value='${searchVO.searchCondition}'/>" />
		<input type="hidden" name="searchKeyword"
			value="<c:out value='${searchVO.searchKeyword}'/>" />
		<input type="hidden" name="pageIndex"
			value="<c:out value='${searchVO.pageIndex}'/>" />
		<input type="hidden" name="bbsType"
			value="<c:out value='${searchVO.bbsType}'/>" />
	</form:form>
</div>
</body>
</html>