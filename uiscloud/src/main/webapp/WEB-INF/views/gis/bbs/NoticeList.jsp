<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="ui" uri="http://egovframework.gov/ctl/ui"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<script type="text/javaScript" defer="defer">
function fnSearchNotice() {
	var frm = document.forms.noticeForm;
	//var tab = $('#bbsTab').tabs('getSelected');  // get selected panel
	//tab.panel('refresh', '/gis/bbs/BbsList');
	
	frm.pageIndex.value = 1;
	frm.submit();
	
}


function fnResetNotice() {
	window.location = "<c:url value='/gis/bbs/Bbs'/>";
}
</script>
<body>
<form:form commandName="bbsVO" name="noticeForm" id="noticeForm" method="post" class="form-search">
<input type="hidden" name="bbsId" />
<!-- 검색조건 유지 -->
<input type="hidden" name="pageIndex"
	value="<c:out value='${searchVO.pageIndex}'/>" />
<input type="hidden" name="bbsType"
	value="N" />
<div class="row-fluid">
	<!-- <div class="span12 alert alert-success">Q&amp;A - 리스트</div> -->
	<div class="text-right" style="padding-top:10px;">
		<label for="searchCondition">검색영역</label>
		<select name="searchCondition" id="searchCondition" class="select">
			<option value="0"<c:if test="${searchVO.searchCondition == 0}"> selected</c:if>>제목</option>
			<option value="1"<c:if test="${searchVO.searchCondition == 1}"> selected</c:if>>내용</option>
			<option value="2"<c:if test="${searchVO.searchCondition == 2}"> selected</c:if>>작성자</option>
		</select> 
		<label for="searchKeyword">검색어</label>
		<input type="text" name="searchKeyword" id="searchKeyword" class="input-medium search-query" style="ime-mode: active;" value="${searchVO.searchKeyword}" placeholder="검색어" />
		<a href="#" onclick="fnSearchNotice();"><img src="/gis/images/bbs/btn_search.png" alt="검색" /></a>
		<a href="#" onclick="fnResetNotice();"><img src="/gis/images/bbs/btn_reset.png" alt="초기화" /></a>
	</div>
</div>
<div class="row-fluid" style="margin-top: 30px;">
	<div class="span12">
		<table class="table">
			<tr>
				<th class="span2" style="text-align: center;">번호</th>
				<th style="text-align: center;">제목</th>
				<th class="span2" style="text-align: center;">작성자</th>
				<th class="span2" style="text-align: center;">조회수</th>
				<th class="span2" style="text-align: center;">등록일</th>
			</tr>
			<c:forEach var="result" items="${resultList}" varStatus="status">
				<tr>
					<td style="text-align: center;"><c:out value="${result.cntId}" />&nbsp;</td>
					<td><a class="title"
						href="#" onclick="javascript:fn_egov_select(<c:out value="${result.cntId}"/>)">(<c:out value="${result.tailCount}" />)&nbsp;<c:out value="${result.title}" /></a></td>					
					<td><c:out value="${result.creator}" />&nbsp;</td>
					<td style="text-align: center;"><c:out value="${result.viewCount}" />&nbsp;</td>
					<td><c:out value="${result.createDatetime}" />&nbsp;</td>
				</tr>
			</c:forEach>
			<c:if test="${empty resultList}">
				<tr>
					<td style="text-align: center;" colspan="5">검색한 결과 목록이 존재하지 않습니다.</td>
				</tr>
			</c:if>
		</table>
	</div>
	<div class="row-fluid">
		<div id="paging" class="span6 offset5">
			<ui:pagination paginationInfo="${paginationInfo}" jsFunction="pageNavi" />
		</div>
		<div class="span1 text-right">
			<sec:authorize access="hasRole('ROLE_ADMIN')"><a href="#" onclick="fn_egov_addNotice();"><img src="/gis/images/bbs/btn_enter.png" alt="등록" /></a></sec:authorize>
		</div>
	</div>
</div>
</form:form>
</body>