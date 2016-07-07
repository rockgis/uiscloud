<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<%
	/**
	 * @Class Name : BbsList.jsp
	 * @Description : Bbs List 화면
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
<title>헬프데스크 목록 <c:if test="${ROLE_ADMIN}"> - 관리자 모드</c:if></title>
<link rel="stylesheet" type="text/css" href="<c:url value='/gis/css/bootstrap/bootstrap.css'/>" />
<link rel="stylesheet" type="text/css" href="<c:url value='/gis/css/bootstrap/bootstrap-responsive.css'/>" />
<link rel="stylesheet" type="text/css" href="<c:url value='/gis/css/bbs.css'/>" />
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/cupertino/easyui.css">
<script type="text/javascript" src="<c:url value='/gis/js/bbs/common.js'/>"></script>
<script type="text/javascript" src="/gis/lib/jquery/jquery-1.7.2.js"></script>
<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="<c:url value='/gis/js/bbs/ajaxUtil.js'/>"></script>
<script type="text/javascript" src="<c:url value='/gis/js/bbs/tools.js'/>"></script>
<script type="text/javascript" src="<c:url value='/gis/js/bbs/emailingCertService.js'/>"></script>
<script type="text/javaScript" defer="defer">
$( document ).ready(function() {	
	var type = '<c:out value="${searchVO.bbsType}"/>';
	if(type == 'N'){
		$("#bbsTab").tabs('select',1);
	}
	else{
		$("#bbsTab").tabs('select',0);
	}

});
<!--
var readBbsId = 0;
$(document).ready(function() {
	$('#w').window('close');
});

/* 글 수정 화면 function */
function fn_egov_select(bbsId) {
	readBbsId = bbsId;
	
	return read();
}

function read() {
	document.getElementById("listForm").bbsId.value = readBbsId;
	document.getElementById("listForm").action = "<c:url value='/gis/bbs/updateBbsView'/>";
	document.getElementById("listForm").submit();			
}

/* 글 등록 화면 function */
function fn_egov_addView() {
	document.getElementById("listForm").action = "<c:url value='/gis/bbs/addBbsView'/>";
	document.getElementById("listForm").submit();
}

/* 글 등록 화면 function */
function fn_egov_addNotice() {
	document.getElementById("noticeForm").action = "<c:url value='/gis/bbs/addBbsView'/>";
	document.getElementById("noticeForm").submit();
}

/* pagination 페이지 링크 function */
function fn_egov_link_page(pageNo) {
	document.getElementById("listForm").pageIndex.value = pageNo;
	document.getElementById("listForm").action = "<c:url value='/gis/bbs/BbsList'/>";
	document.getElementById("listForm").submit();
}

/* download function */
function fn_egov_download(bbsId) {
	document.getElementById("listForm").bbsId.value = bbsId;
	document.getElementById("listForm").action = "<c:url value='/gis/bbs/downloadfile'/>";
	document.getElementById("listForm").submit();
}



function fnReset() {
	window.location = "<c:url value='/gis/bbs/BbsList'/>";
}	

/* pagination 페이지 링크 function */
function pageNavi(pageNo){
	fn_egov_link_page(pageNo)
}

<c:if test="${not empty errMsg}">
alert("${errMsg}");
fnSearch();
</c:if>	
//-->
</script>
<style>
.panel-tool{
	 top: 1px;
}
</style>
</head>
<body>
<div id="bbsTab" class="easyui-tabs" style="margin: 10px;" >
<div title="Q & A" id="qa">
<c:import url="/gis/bbs/BbsList"></c:import>
</div>
<div title="공지사항" id="notice">
<c:import url="/gis/bbs/NoticeList"></c:import>
</div>
</div>