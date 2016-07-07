<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib prefix="validator"
	uri="http://www.springmodules.org/tags/commons-validator"%>
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
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>헬프데스크 읽기/수정</title>
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/bootstrap/easyui.css">
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/cupertino/easyui.css">
<link rel="stylesheet" type="text/css" href="<c:url value='/gis/css/bootstrap/bootstrap.css'/>" />
<link rel="stylesheet" type="text/css" href="<c:url value='/gis/css/bootstrap/bootstrap-responsive.css'/>" />
<script type="text/javascript"	src="<c:url value='/gis/js/bbs/common.js'/>"></script>
<script type="text/javascript" src="/gis/lib/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript"	src="<c:url value='/gis/js/bbs/ajaxUtil.js'/>"></script>
<script type="text/javascript"	src="<c:url value='/gis/js/bbs/tools.js'/>"></script>
<script type="text/javascript" src="<c:url value='/gis/js/com/util.js'/>"></script>
<script type="text/javascript"	src="<c:url value='/gis/js/bbs/emailingCertService.js'/>"></script>
<script src="<c:url value='/gis/js/bbs/attachFile.js'/>"></script>
<script type="text/javaScript" defer="defer">
	$(document).ready(function() {
		var fileList = 0;
		if('${fileVO.size()}' != ''){
			fileList = eval('${fileVO.size()}');
		}
		
		<c:if test="${not empty errMsg}">
		alert("${errMsg}");
		</c:if>
		
       if((parseInt(window.document.body.offsetHeight) - parseInt(window.document.body.clientHeight)) > 20 ) {
            window.document.body.scroll = "auto";
        }
       $('#addFile').click(function() {
		    var fileIndex = $('#fileList ul').children().length;
			
		    if((fileIndex + fileList) >= 5){
		    	alert("첨부파일은 최대 5개입니다.");
		    	return;
		    }
		    $('#fileList').append(
		            '<ul style=list-style-type:none;><li>'+
		            '   <input type="file" name="files['+ fileIndex +']" />'+
		            '</ul></li>');
		});
       
       $('#downfile').click(function() {
		    var file = $("#attachfileList option:selected").val();
		    if(typeof file =='undefined'){
		    	alert("다운로드 하실 파일을 선택해 주시기 바랍니다.");
		    	return;
		    }
			console.log(file);
		    
		});
	});

	/* 글 목록 화면 function */
	function fn_egov_selectList() {
		document.getElementById("updateForm").action = "<c:url value='/gis/bbs/Bbs'/>";
		document.getElementById("updateForm").submit();
	}

	/* 글 수정 function */
	function fn_egov_save() {
		frm = document.getElementById("updateForm");

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
		
		frm.action = '<c:url value="/gis/bbs/updateBbs" />';
		frm.submit();
	}

	/* 글 삭제 function */
	function fn_egov_delete() {
		frm = document.getElementById("updateForm");

		frm.action = '<c:url value="/gis/bbs/deleteBbs" />';
		frm.submit();
	}

	/* 댓글 등록 function */
	function fn_bbstail_save() {
		frm = document.getElementById("bbsTailDetailWriteForm");

		/* TODO Validation기능 보완 */
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
		if (frm.pwd.value == undefined || frm.pwd.value == "") {
			alert("비밀번호를 입력하시기 바랍니다.");
			return;
		}

		frm.action = "<c:url value='/gis/bbsTail/addBbsTail'/>";
		frm.submit();
	}

	/* 댓글 수정 function */
	function fn_bbstail_update(frmName) {
		frm = document.getElementById(frmName);

		/* TODO Validation기능 보완 */
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
		frm.pwd.value = $.trim(frm.pwd.value);
		if (frm.pwd.value == undefined || frm.pwd.value == "") {
			alert("비밀번호를 입력하시기 바랍니다.");
			return;
		}

		frm.action = "<c:url value='/gis/bbsTail/updateBbsTail'/>";
		frm.submit();
	}

	/* 댓글 삭제 function */
	function fn_bbstail_delete(frmName) {
		frm = document.getElementById("updateForm");
		
		frm.pwd.value = $.trim(frm.pwd.value);
		if (frm.pwd.value == undefined || frm.pwd.value == "") {
			alert("비밀번호를 입력하시기 바랍니다.");
			return;
		}

		frm.action = "<c:url value='/gis/bbsTail/deleteBbsTail'/>";
		frm.submit();
	}

	function doDownload(fileId) {
		var frm = document.forms.download;
		frm.fileId.value = fileId;
		frm.submit();
	}
	
	function fn_egov_download(fileSeq) {
		document.getElementById("fileForm").fileSeq.value = fileSeq;
		document.getElementById("fileForm").action = "<c:url value='/gis/bbs/downloadfile'/>";
		document.getElementById("fileForm").submit();
	}
	function fn_egov_deleteFile(fileSeq) {
		
		document.getElementById("fileForm").pwd.value = $.trim(document.getElementById("updateForm").pwd.value);
		document.getElementById("fileForm").fileSeq.value = fileSeq;
		document.getElementById("fileForm").action = "<c:url value='/gis/bbs/deletefile'/>";
		document.getElementById("fileForm").submit();
	}
</script>
</head>
<body>
<div class="row" style="margin: 30px;">
	<div class="row-fluid">
		<!-- 타이틀 -->
		<c:if test="${bbsVO.bbsType ne 'N'}"><div class="span12 alert alert-success">Q&amp;A - 수정</div></c:if>
		<c:if test="${bbsVO.bbsType eq 'N'}"><div class="span12 alert alert-success">공지사항 - 수정</div></c:if>
		<!-- <div class="span12 alert alert-success">Q&amp;A - 수정</div> -->
	</div>
	<form:form commandName="bbsVO" name="fileForm" id="fileForm">
	<input type="hidden" name="fileSeq"
			value="" />
	<input type="hidden" name="pwd"
			value="" />
	</form:form>
	<form:form commandName="bbsVO" name="updateForm" id="updateForm" class="form-horizontal"  enctype="multipart/form-data">
		<!-- 검색조건 유지 -->
		<input type="hidden" name="secret" value="N" />
		<input type="hidden" name="searchCondition"
			value="<c:out value='${searchVO.searchCondition}'/>" />
		<input type="hidden" name="searchKeyword"
			value="<c:out value='${searchVO.searchKeyword}'/>" />
		<input type="hidden" name="pageIndex"
			value="<c:out value='${searchVO.pageIndex}'/>" />
		<input type="hidden" name="bbsId"
			value="<c:out value='${bbsVO.bbsId}'/>" />		
		<input type="hidden" name="bbsType"
			value="<c:out value='${bbsVO.bbsType}'/>" />	
		<div class="control-group">
			<label class="control-label" for="title">제목</label>
			<div class="controls"><input name="title" class="input-block-level" style="ime-mode: active;" maxlength="100" placeholder="제목" value="<c:out value="${bbsVO.title}" />" /></div>
		</div>
		<c:if test="${bbsVO.bbsType eq 'N'}">
		<div class="control-group">
			<label class="control-label" for="title">공지일</label>
			<div class="controls"><input class="startDate easyui-datebox" name="startDate" value="<c:out value="${bbsVO.startDate}" />" style="width: 90px;" data-options="formatter: gfnEasyUiDateFormatter, parser: gfnEasyUiDateParser" />~
			<input class="endDate easyui-datebox" style="width: 90px;" name="endDate" value="<c:out value="${bbsVO.endDate}" />" data-options="formatter: gfnEasyUiDateFormatter, parser: gfnEasyUiDateParser" /></div>
		</div>			
		</c:if>
		<div class="control-group">
			<label class="control-label" for="content">내용</label>
			<div class="controls"><textarea name="content" class="input-block-level" style="ime-mode: active;" id="content"
							cols="10" rows="10" placeholder="내용"><c:out
							value="${bbsVO.content}" /></textarea></div>
		</div>	
		<div class="control-group">
			<label class="control-label" for="content">첨부파일</label>
			<c:forEach var="file" items="${fileVO}" varStatus="attachLoop">		
				<div class="controls">				
            		<a href="#" onclick="javascript:fn_egov_download(<c:out value="${file.fileSeq}"/>)"><c:out value='${file.fileName}'/></a>
            	
            		<a href="#" onclick="javascript:fn_egov_deleteFile(<c:out value="${file.fileSeq}"/>)"><img alt="파일삭제" src="/gis/images/btn/close.png"></a>
            		
				</div>
			</c:forEach>	
			<div class="controls">
				<input id="addFile" type="button" value="Add File" />
				<div id="fileList"></div>
			</div>
		</div>	
		<div class="control-group">
			<div class="controls controls-row">
				<label class="span1" for="createDatetime">작성일</label>
				<input class="span2 " name="createDatetime" value="<c:out
						value="${bbsVO.createDatetime}" />" disabled />
				<label class="span1" for="creator">작성자</label>
				<input class="span2" name="creator" style="ime-mode: active;" value="<c:out
						value="${bbsVO.creator}" />" disabled />
				<label class="span1" for="pwd">비밀번호</label>
				<input class="span2" name="pwd" style="ime-mode: active;" type="password" maxlength="10" placeholder="비밀번호" />
			</div>
		</div>
		<div class="row-fluid">
			<div class="span12 text-right">
				<a href="#" onclick="fn_egov_save();"><img src="/gis/images/bbs/btn_modify.png" alt="수정" /></a>
				<a href="#" onclick="fn_egov_delete();"><img src="/gis/images/bbs/btn_delete.png" alt="삭제" /></a>
				<a href="#" onclick="fn_egov_selectList();"><img src="/gis/images/bbs/btn_list.png" alt="목록" /></a>
			</div>
		</div>
	</form:form>
	<div class="row-fluid">
		<!-- 타이틀 -->
		<c:if test="${bbsVO.bbsType ne 'N'}"><div class="span12 alert alert-success">Q&amp;A - 댓글 리스트 (${bbsVO.tailCount})</div></c:if>
		<c:if test="${bbsVO.bbsType eq 'N'}"><div class="span12 alert alert-success">공지사항 - 댓글 리스트 (${bbsVO.tailCount})</div></c:if>
		<!-- <div class="span12 alert alert-success">Q&amp;A - 댓글 리스트 (${bbsVO.tailCount})</div> -->
	</div>
	<c:set var="idx" value="1" />
	<c:forEach var="bbsTailVO" items="${bbsVO.bbsTailVOs}" varStatus="status">
		<form:form commandName="bbsTailVO" name="bbsTailEditForm${idx}"
			id="bbsTailEditForm${idx}" class="form-horizontal">
			<!-- 검색조건 유지 -->
			<input type="hidden" name="searchCondition"
				value="<c:out value='${searchVO.searchCondition}'/>" />
			<input type="hidden" name="searchKeyword"
				value="<c:out value='${searchVO.searchKeyword}'/>" />
			<input type="hidden" name="pageIndex"
				value="<c:out value='${searchVO.pageIndex}'/>" />
			<input type="hidden" name="bbsId" value="${bbsVO.bbsId}" />
			<input type="hidden" name="bbsTailId"
				value="${bbsTailVO.bbsTailId}" />
			<div class="control-group">
				<label class="control-label" for="title">댓글</label>
				<div class="controls"><textarea name="content" class="input-block-level" style="ime-mode: active;"
						cols="10" rows="5" placeholder="내용"><c:out
							value="${bbsTailVO.content}" /></textarea></div>
			</div>
			<div class="control-group">
				<div class="controls controls-row">
					<label class="span1" for="createDatetime">작성일</label>
					<input class="span2 " name="createDatetime" value="<c:out
							value="${bbsTailVO.createDatetime}" />" disabled />
					<label class="span1" for="creator">작성자</label>
					<input class="span2" name="creator" style="ime-mode: active;" value="<c:out
							value="${bbsTailVO.creator}" />" disabled />
					<label class="span1" for="pwd">비밀번호</label>
					<input class="span2" name="pwd" style="ime-mode: active;" type="password" maxlength="10" placeholder="비밀번호" />
				</div>
			</div>
			<div class="row-fluid">
				<div class="span12 text-right">
					<a href="#" onclick="fn_bbstail_update('bbsTailEditForm${idx}');"><img src="/gis/images/bbs/btn_modify.png" alt="수정" /></a>
					<a href="#" onclick="fn_bbstail_delete('bbsTailEditForm${idx}');"><img src="/gis/images/bbs/btn_delete.png" alt="삭제" /></a>
				</div>
			</div>
		</form:form>
		<c:set var="idx" value="${idx + 1}" />
	</c:forEach>
	<div class="row-fluid">
		<!-- 타이틀 -->
		<c:if test="${bbsVO.bbsType ne 'N'}"><div class="span12 alert alert-success">Q&amp;A - 댓글 등록</div></c:if>
		<c:if test="${bbsVO.bbsType eq 'N'}"><div class="span12 alert alert-success">공지사항 - 댓글 등록</div></c:if>
		<!--<div class="span12 alert alert-success">Q&amp;A - 댓글 등록</div>-->
	</div>
	<form:form commandName="bbsTailVO" name="bbsTailDetailWriteForm"
			id="bbsTailDetailWriteForm" class="form-horizontal">
		<!-- 검색조건 유지 -->
		<input type="hidden" name="searchCondition"
			value="<c:out value='${searchVO.searchCondition}'/>" />
		<input type="hidden" name="searchKeyword"
			value="<c:out value='${searchVO.searchKeyword}'/>" />
		<input type="hidden" name="pageIndex"
			value="<c:out value='${searchVO.pageIndex}'/>" />
		<input type="hidden" name="bbsId" value="${bbsVO.bbsId}" />
		<div class="control-group">
			<label class="control-label" for="title">댓글</label>
			<div class="controls"><textarea name="content" class="input-block-level" style="ime-mode: active;" id="content"
						cols="10" rows="5" placeholder="댓글"></textarea></div>
		</div>
		<div class="control-group">
			<div class="controls controls-row">
				<label class="span1 offset3" for="creator">작성자</label>
				<input class="span2" name="creator" style="ime-mode: active;" maxlength="10" placeholder="작성자" />
				<label class="span1" for="pwd">비밀번호</label>
				<input class="span2" name="pwd" style="ime-mode: active;" type="password" maxlength="10" placeholder="비밀번호" />
			</div>
		</div>
		<div class="row-fluid">
			<div class="span12 text-right">
				<a href="#" onclick="fn_bbstail_save();"><img src="/gis/images/bbs/btn_enter.png" alt="등록" /></a>
			</div>
		</div>
	</form:form>
</div>
</body>
</html>