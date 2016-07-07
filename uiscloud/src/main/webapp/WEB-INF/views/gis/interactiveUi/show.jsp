<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
	<!-- ValidationBox ToolTip 을 위해 필요 -->
	<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/bootstrap/easyui.css">
	<!-- 실제 사용 테마 -->
	<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/cupertino/easyui.css">
	<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="/gis/lib/openlayers/theme/default/style.css">
	<link rel="stylesheet" type="text/css" href="/gis/css/gisMain.css">
	<link rel="stylesheet" type="text/css" href="/gis/css/css.css">
	<!-- jquery & easy ui -->
	<script type="text/javascript" src="/gis/lib/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="/gis/lib/mColorPicker/mColorPicker.js"></script>
	<script type="text/javascript" src="/gis/lib/json2/json2.js"></script>
	<script type="text/javascript" src="/gis/lib/jsts/javascript.util.js"></script>
	<script type="text/javascript" src="/gis/lib/d3/d3.js"></script>
</head>
<body style="margin:0; padding:0;">
    <div class="easyui-layout" data-options="fit: true">
        <div data-options="region:'west',split:true" title="InteractiveUI" style="width:300px;">
        	<div id="div_interactiveUi_search" class="div_ser" title="Interactive">
				<form name="frmInteractiveUi" id="frmInteractiveUi" onsubmit="return false;">
					<div class="searchForm">								
						<ul>
							<li><span class="span_tit required_filter">검색 구분</span><span
								class="span_content">
								<span class="span_2_layout"><input type="radio" name="searchType" value="addt" checked />지역</span>
								<span class="span_2_layout"><input type="radio" name="searchType" value="bbox" />영역</span></span></li>
							<li class="li_addt"><span class="span_tit use_core_grade_required_filter">시도</span><span
								class="span_content"><input
									class="sidoComboBox easyui-combobox" style="width: 190px" /></span></li>
							<li class="li_addt"><span class="span_tit use_core_grade_required_filter">시군구</span><span
								class="span_content"><input
									class="sggComboBox easyui-combobox" style="width: 190px" /></span></li>
							<li class="li_addt"><span class="span_tit use_core_grade_required_filter">읍면동(리)</span><span
								class="span_content"><input
									class="emdComboBox easyui-combobox" style="width: 190px" /></span></li>
							<li class="hide li_bbox"><span class="span_tit required_filter">영역지정</span><span
								class="span_content"><a href="#" class="bbox"><img src="/gis/images/btn/btn_draw_n.png" alt="영역지정"/></a></span></li>
							<li><span class="span_tit facility_required_filter">시설명</span><span
								class="span_content"><input
									class="fctsNm inputText" style="ime-mode: active;" /></span></li>
							<li><span class="span_tit">고유관리번호</span><span
								class="span_content"><input
									class="unqMgno inputText" style="ime-mode: active;" /></span></li>
							<li><span class="span_tit">NITS공사번호</span><span
								class="span_content"><input
									class="cnstMgno inputText" style="ime-mode: active;" /></span></li>
							<li><span class="span_tit">자산소유구분</span><span class="span_content"><span class="span_2_layout"><input
									type="checkbox" name="sysClf"
									value="SK" />SK</span>
								<span class="span_2_layout"><input 
									type="checkbox" name="sysClf"
									value="HT" />HT</span><br>
								<span class="span_2_layout"><input 
									type="checkbox" name="sysClf"
									value="TN" />TN</span>
								<span class="span_2_layout"><input 
									type="checkbox" name="sysClf"
									value="H" />H</span><br>
								<span class="span_2_layout"><input 
									type="checkbox" name="sysClf"
									value="null" />n/a</span></li>		
							<li><span class="span_tit">광케이블 구분</span><span class="span_content"><span><input
									type="checkbox" name="gisCode"
									value="CA001" />T_광케이블가공</span><br>
								<span><input 
									type="checkbox" name="gisCode"
									value="CA002" />T_광케이블지중</span><br>
								<span><input 
									type="checkbox" name="gisCode"
									value="CA003" />T_광케이블FTTH</span><br>
								<span><input 
									type="checkbox" name="gisCode"
									value="CA004" />T_광케이블임차</span><br>
								<span><input 
									type="checkbox" name="gisCode"
									value="CA005" />B_광케이블가공</span><br>
								<span><input 
									type="checkbox" name="gisCode"
									value="CA005" />B_광케이블지중</span><br>
								<span><input 
									type="checkbox" name="gisCode"
									value="CA005" />B_광케이블FTTH</span><br>
								<span><input 
									type="checkbox" name="gisCode"
									value="CA006" />B_광케이블임차</span></li>
							<li><span class="span_tit">매설위치</span><span class="span_content"><input 
									type="checkbox" name="ungrLoc"
									value="A" />가공
								<input 
									type="checkbox" name="ungrLoc"
									value="D" />지중
								<input 
									type="checkbox" name="ungrLoc"
									value="F" />FTTH
								<br>
								<input 
									type="checkbox" name="ungrLoc"
									value="B" />임차
								<input 
									type="checkbox" name="ungrLoc"
									value="C" />난연
								<input
									type="checkbox" name="ungrLoc"
									value="null" />n/a</span></li>
							<li><span class="span_tit">포설거리</span><span
								class="span_content"><input
									class="compLenMin" style="width: 45px" /> 이상 ~ <input
									class="compLenMax" style="width: 45px" /> 이하</span></li>
							<li><span class="span_tit">지도거리</span><span
								class="span_content"><input
									class="gisLenMin" style="width: 45px" /> 이상 ~ <input
									class="gisLenMax" style="width: 45px" /> 이하</span></li>
							<li><span class="span_tit">코아수</span><span
								class="span_content"><input
									class="coreCntMin" style="width: 45px" /> 이상 ~ <input
									class="coreCntMax" style="width: 45px" /> 이하</span></li>
							<li><span class="span_tit">사용코아수</span><span
								class="span_content"><input
									class="useCoreCntMin" style="width: 45px" /> 이상 ~ <input
									class="useCoreCntMax" style="width: 45px" /> 이하</span></li>
							<li><span class="span_tit">접속코아수</span><span
								class="span_content"><input
									class="connCoreCntMin" style="width: 45px" /> 이상 ~ <input
									class="connCoreCntMax" style="width: 45px" /> 이하</span></li>
							<li><span class="span_tit">설치일자<input type="checkbox" name="compDtCheckBox" class="compDtCheckBox"></span><span
								class="span_content"><input
									class="compDtStartDate easyui-datebox" style="width: 90px;"
									data-options="formatter: gfnEasyUiDateFormatter, parser: gfnEasyUiDateParser" /></span>~<span
								class="span_content"><input
									class="compDtFinishDate easyui-datebox" style="width: 90px;"
									data-options="formatter: gfnEasyUiDateFormatter, parser: gfnEasyUiDateParser" /></span>
							</li>
							<li><span class="span_tit">작업지시번호</span><span
								class="span_content"><input
									class="workDocNo" style="width: 180px" /></span></li>
							<li><span class="span_tit">케이블제조번호</span><span
								class="span_content"><input
									class="caMnftNo" style="width: 180px" /></span></li>
							<li><span class="span_tit">망 분류</span><span class="span_content"><input 
									type="checkbox" name="netClf"
									value="0" />가입자망
								<input 
									type="checkbox" name="netClf"
									value="1" />기간망
								<input 
									type="checkbox" name="netClf"
									value="2" />간선망
								<br>
								<input 
									type="checkbox" name="netClf"
									value="3" />기타
								<input 
									type="checkbox" name="netClf"
									value="4" />지장이설
								<input
									type="checkbox" name="netClf"
									value="null" />n/a</span></li>
							<li><span class="span_tit">서비스구분</span><span class="span_content"><input 
									type="checkbox" name="serviceType"
									value="skt_bbring" /> SKT 기간망 링
								<br>
								<input 
									type="checkbox" name="serviceType"
									value="skt_ctring" /> SKT 중심국 링
								<br>
								<input 
									type="checkbox" name="serviceType"
									value="skt_bsring" /> SKT 기지국 링
								<br>
								<input 
									type="checkbox" name="serviceType"
									value="skt_rfptp" /> SKT 중계기 P2P
								<br>
								<input 
									type="checkbox" name="serviceType"
									value="skt_etc" /> SKT 기타
								<br>
								<input 
									type="checkbox" name="serviceType"
									value="skb_ring" /> SKB 링</span></li>
							<li><span class="span_tit">코아수용률</span><span class="span_content"><input 
									type="checkbox" name="useCoreGrade"
									value="0" /> 40% 미만
								<br>
								<input 
									type="checkbox" name="useCoreGrade"
									value="1" /> 40% 이상 ~ 60% 미만
								<br>
								<input 
									type="checkbox" name="useCoreGrade"
									value="2" /> 60% 이상 ~ 80% 미만
								<br>
								<input 
									type="checkbox" name="useCoreGrade"
									value="3" /> 80% 이상 ~ 90% 미만
								<br>
								<input 
									type="checkbox" name="useCoreGrade"
									value="4" /> 90% 초과</span></li>
							<li><span class="span_tit">잔여코아수</span><span
								class="span_content"><input
									class="coreRemainingCntMin" style="width: 45px" /> 이상 ~ <input
									class="coreRemainingCntMax" style="width: 45px" /> 이하</span></li>																		
							<li class="textAlignRight_MarginTopRight20"><a href="#"
								class="reset"><img src="/gis/images/btn/btn_reset_n.png" alt="초기화"/></a> <a href="#"
								class="search"><img src="/gis/images/btn/btn_search_n.png" alt="검색"/></a></li>
						</ul>
					</div>
					<div class="help">
						<dl>
							<dt>노드</dt>
							<dd style="color: #FF0000;"><div style="display: inline-block; background: #FF0000; width: 14px; height: 14px; border-radius: 7px;">&nbsp;</div> T_전송실</dd>
							<dd style="color: #FF00FF;"><div style="display: inline-block; background: #FF00FF; width: 10px; height: 10px; border-radius: 5px;">&nbsp;</div> T_중심국_국사</dd>
							<dd style="color: #FF9900;"><div style="display: inline-block; background: #FF9900; width: 6px; height: 6px; border-radius: 6px;">&nbsp;</div> T_국소</dd>
							<dd style="color: #0000FF;"><div style="display: inline-block; background: #0000FF; width: 6px; height: 6px; border-radius: 6px;">&nbsp;</div> B_국사</dd>
							<dd style="color: #00FF00;"><div style="display: inline-block; background: #00FF00; width: 6px; height: 6px; border-radius: 6px;">&nbsp;</div> T_기지국</dd>
							<dd style="color: #00FF00;"><div style="display: inline-block; background: #00FF00; width: 6px; height: 6px; border-radius: 6px;">&nbsp;</div> B_광가입자국</dd>
							<dd style="color: #000000;"><div style="display: inline-block; background: #000000; width: 6x; height: 6px; border-radius: 6px;">&nbsp;</div> 접속함체</dd>
							<dt>라인</dt>
							<dd style="color: #CD1039;">SK</dd>
							<dd style="color: #1E90FF;">HT</dd>
							<dd style="color: #D2691E;">기타</dd>
							<dt>라인 굵기</dt>
							<dd style="font-weight: normal;">코어수용룔 80% 미만 가는 선</dd>
							<dd style="font-weight: bolder;">코어수용룔 80% 이상 굵은 선</dd>
						</dl>
					</div>
				</form>
			</div>
       	</div>
		<div id = "div_Main" data-options="region:'center'"></div>
	</div>
	<script type="text/javascript" src="/gis/js/com/util.js"></script>
	<script type="text/javascript" src="/gis/js/interactiveUi/interactiveUi.js"></script>
	<script>
		$(document).ready(function() {
			interactiveUi.init(); 		// Interactive UI / D3 - /gis/js/interactiveUi/interactiveUi.js
		});
	</script>
</body>
</html>