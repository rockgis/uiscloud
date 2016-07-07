<!-- 
	파일명 : gisMainF.jsp
	설  명 : 개별 GIS 메인 페이지
	
	수정일           수정자      수정내용
	----------      --------    --------------------------------------------------
	2014.01.22	김종민		최초생성
	2014.05.20	김종민		2차 개발 대응 시작
	2014.09.10  rockgis     spring security 적용 
 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>UISCLOUD CLIENT</title>
<!-- ValidationBox ToolTip 을 위해 필요 -->
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/bootstrap/easyui.css">
<!-- 실제 사용 테마 -->
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/cupertino/easyui.css">
<link rel="stylesheet" type="text/css" href="/gis/lib/jquery/easyui/themes/icon.css">
<link rel="stylesheet" type="text/css" href="/gis/lib/openlayers/theme/default/style.css">
<link rel="stylesheet" type="text/css" href="/gis/css/map.css">
<link rel="stylesheet" type="text/css" href="/gis/css/gisMain.css">
<link rel="stylesheet" type="text/css" href="/gis/css/css.css">
<link rel="stylesheet" type="text/css" href="/gis/css/layertree.css">
<link rel="stylesheet" type="text/css" href="/gis/css/menu.css">
</head>
<body>
	<!-- 로딩바 -->
	<div id="loadingBar">
		<div>
			<img src="/gis/images/search/ajax-loader.gif" style="width: 70px; height: 70px;">
		</div>
	</div>

	<div id="div_layout" class="easyui-layout" data-options="fit: true">
		<!-- 상단 시스템 메뉴 -->
		<div id="div_north" data-options="region:'north'">
			<span id="span_logo"><a href="/"><img id="imgLogo" src="/geolib/images/main/img_logo.png" alt="titan Logo" /></a></span>
			<!--  ul id="ul_menu">
				<li><a href="#" id="a_menu_mapInfo"><img src="/gis/images/main_menu/map_info_n.png" class="toggle" alt="지도정보" /></a></li>
				<li><a href="#" id="a_menu_pgRouting"><img src="/gis/images/main_menu/single_route_n.png" class="toggle" alt="Network 검색" /></a></li>				
				<li><a href="#" id="a_menu_bbs"><img src="/gis/images/main_menu/qna_n.png" class="toggle" alt="Q&A" /></a></li>
				<!--<li><a href="#" id="a_menu_notice"><img src="/gis/images/main_menu/qna_n.png" class="toggle" alt="공지사항" /></a></li>--
				<li><a href="/j_spring_security_logout" id="a_menu_logout"><img src="/gis/images/main_menu/logout_n.png" class="toggle" alt="로그아웃" /></a></li>
			</ul>-->
			
			<div id="sse50">
			  <div id="sses50">
			    <ul>
			      <li><a href="#" id="a_menu_mapInfo">지도정보</a></li>
			      <li><a href="#" id="a_menu_pgRouting">Network 검색</a></li>
			      <li><a href="/j_spring_security_logout" id="a_menu_logout">로그 아웃</a></li>
			                <li><a class="end">&nbsp;</a></li>
			    </ul>
			  </div>
			</div>					
		</div>

		<!-- 왼쪽: 배경도&주제도&검색 메뉴 -->
		<div id="div_west" title="메뉴별 검색" data-options="region:'west'">
		<!--  권한 확인 <sec:authentication property="principal"/>  -->
		
			<div id="div_view" class="easyui-accordion" data-options="fit: true">
				<div id="div_layer_menu" title="배경 지도" data-options="collapsed:false,collapsible:false" style="padding: 10px;">
					<a 
						id="a_layer_base" href="#" class="a_layer_set layer_on"><img class="toggle" src="/gis/images/mapsv/layer/btn_bass_a.png" alt="기본도" /></a><a 
						id="a_layer_DaumHybrid" href="#" class="a_layer_set"><img class="toggle" src="/gis/images/mapsv/layer/btn_buld_n.png" alt="건물명칭" /></a><a 
						id="a_layer_DaumSatellite" href="#" class="a_layer_set"><img class="toggle" src="/gis/images/mapsv/layer/btn_air_n.png" alt="항공사진(스카이뷰)" />
					</a>
				</div>	
				<div id="div_mapInfo" title="지도정보" data-options="selected:true">
					<div id="div_mapInfo_menu">
						<div id="div_mapInfo_layer" title="레이어">
							<ul id="ul_layer_tree"></ul>
						</div>
						<div id="div_mapInfo_search" class="div_ser" title="검색">
							<form name="frmMapInfoFacility" id="frmMapInfoFacility" onsubmit="return false;">
								<div class="searchForm">								
									<ul>
																						
										<li class="mapRequire"><span class="span_tit use_core_grade_required_filter">시도</span><span
											class="span_content"><input
												class="sidoComboBox easyui-combobox" style="width: 190px" /></span></li>
										<li class="mapRequire"><span class="span_tit use_core_grade_required_filter">시군구</span><span
											class="span_content"><input
												class="sggComboBox easyui-combobox" style="width: 190px" /></span></li>
										<li class="mapRequire"><span class="span_tit use_core_grade_required_filter">읍면동(리)</span><span
											class="span_content"><input
												class="emdComboBox easyui-combobox" style="width: 190px" /></span></li>
									
											<li class="textAlignRight_MarginTopRight20"><a href="#"
												class="reset"><img src="/gis/images/btn/btn_reset_n.png" alt="초기화"/></a> <a href="#"
												class="search"><img src="/gis/images/btn/btn_search_n.png" alt="검색"/></a></li>
											<li class="textAlignRight_MarginTopRight20"><a href="#" class="a_menu_sld"><img src="/gis/images/btn/btn_sld_n.png" alt="동적결과표시"/></a></li>
										</ul>
								</div>

							</form>
						</div>							
							
						
					
						
					</div>
				</div>


				<div id="div_pgRouting" title="단일경로 검색">
					<div id="div_pgRouting_menu">						
						<div id="div_pgRouting_search" title="단일경로 검색">
							<form name="frmPgRouting" id="frmPgRouting" onsubmit="return false;">							
								<div class="searchForm">
									<ul>
										<li>
											<span class="span_tit" style="float: left;">경로선택조건</span>
											<span class="span_content" style="float: left;">
												<input type="radio" name="byCost" value="1" checked="checked" />거리<br>
												<input type="radio" name="byCost" value="2" />비용<br>
												<input type="radio" name="byCost" value="3" />시간
											</span>
										</li>
										<li><span class="span_content" style="float: left;">
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											<a href="#" class="initPointAll easyui-linkbutton">초기화</a>
											<!-- a href="#" class="initPoint"><img src="/gis/images/btn/btn_erase_n.png" alt="지우기" /></a>-->
											<a href="#" class="startPoint easyui-linkbutton">시작점</a>
											<a href="#" class="finishPoint easyui-linkbutton">종료점</a>
											</span>
										</li>
										<li class="textAlignRight_MarginTopRight20" style="clear: left;">
										<a href="#" class="bboxPoint easyui-linkbutton">범위 한정 </a> 
										</li>	
												
										<li class="textAlignRight_MarginTopRight20" style="clear: left;">
										<a href="#" class="analyze"><img src="/gis/images/btn/btn_analisys_n.png" alt="분석" /></a>
										</li>
									</ul>
								</div>
							</form>
						</div>					
					</div>
				</div>

				<div id="div_kRouting" title="다중경로 검색">
					<div id="div_kRouting_menu">
						<div id="div_kRouting_search" title="다중 경로 검색">
							<form name="frmKRouting" id="frmKRouting" onsubmit="return false;">
								<div class="searchForm">
									<ul>
										
										<li>
											<span class="span_tit" style="float: left;">경로선택조건</span>
											<span class="span_content" style="float: left;">
												<input type="radio" name="byCost" value="1" />거리<br>
												<input type="radio" name="byCost" value="2" checked="checked"/>비용<br>
												<input type="radio" name="byCost" value="3" />시간
											</span>
										</li>
										<li><span class="span_tit" style="float: left;">BBOX 영역설정
										</span><span class="span_content" style="float: left;"><input
												type="radio" name="bufferArea"
												value="3" checked="checked" />3km<br><input
												type="radio" name="bufferArea"
												value="4" /><input
												type="text" name="bufferAreaTxt" class="bufferAreaTxt inputText" style="width: 30px;"
												value="" /> km<br>
												<a href="#" class="bboxPoint"><img src="/gis/images/btn/btn_bbox_download_n.png" alt="BBOX" /></a>
												</span>
										</li>
										
										<li><span class="span_tit" style="float: left;">경로 조건 선택</span><span
											class="span_content" style="float: left;">
											<a href="#" class="initPointAll"><img src="/gis/images/btn/btn_reset_n.png" alt="초기화" /></a>
											<a href="#" class="initPoint"><img src="/gis/images/btn/btn_erase_n.png" alt="지우기" /></a>
											<a href="#" class="startPoint"><img src="/gis/images/btn/btn_start_point_n.png" alt="시작점" /></a>
											<a href="#" class="finishPoint"><img src="/gis/images/btn/btn_finish_point_n.png" alt="종료점" /></a> 
											 </span></li>	
											
											
											
										<li class="textAlignRight_MarginTopRight20" style="clear: left;"><a
											href="#" class="analyze"><img src="/gis/images/btn/btn_analisys_n.png" alt="분석" /></a>
										<a href="#" class="a_menu_sld"><img src="/gis/images/btn/btn_sld_n.png" alt="동적결과표시"/></a></li>
									</ul>
								</div>
							</form>
						</div>
					</div>
				</div>
			
			</div>
		</div>

		<!-- 오른쪽 속성 보기 / 범례 창 -->
		<div id="div_east" title="정보보기 " style="overflow-x: hidden" data-options="region:'east', split:true">
			<!-- <div id="div_property_search" title="국소 검색">
				<label>국소 검색</label>
				<input type="text" id="searchAddress"> 
			</div>-->
			<div id="div_detail_view" class="overflowXhidden">
				<div title="상세속성">
					<table id="table_info"></table>
				</div>
			</div>
		</div>

		<!-- 하단 검색 결과 창 -->
		<div id="div_south" title="검색결과"
			data-options="region:'south', split:true, tools:'#div_serGridToolbar'">
			<!-- 하위 검색결과 목록 창 -->
			<div id="div_bottom_tab">
			</div>
			<div id="div_serGridToolbar">
				<nobr>						
					<a href="#" id="a_serGridToolbarTabsCloseAll" title="검색결과 일괄닫기"
						style="font-size: 9pt; display: inline; color: #000080">[모두닫기]</a>
				</nobr>
			</div>
		</div>

		<!-- 가운데 지도 창 -->
		<div id="div_center" data-options="region:'center'" >
				<div id="div_map"></div>
				<ul id="ul_map_tool">
					<li><a id="btn_zoomIn" href="#"> <img
							src="/gis/images/menu/btn_zoom_in_n.png" class="toggle" alt="확대" title="확대" />
					</a></li>
					<li><a id="btn_zoomOut" href="#"> <img
							src="/gis/images/menu/btn_zoom_out_n.png" class="toggle" alt="축소" title="축소" />
					</a></li>
					<li><a id="btn_pan" href="#"> <img
							src="/gis/images/menu/btn_pan_a.png" class="toggle" alt="이동/선택" title="이동/선택" />
					</a></li>
					<li><a id="btn_news_hide" href="#"> <img
							src="/gis/images/menu/btn_full_map_n.png" alt="지도 전체 화면으로 보기" title="지도 전체 화면으로 보기" />
					</a></li>
					<li><a id="btn_fullExtent" href="#"> <img
							src="/gis/images/menu/btn_full_extent_n.png" alt="한반도 전체 보기" title="한반도 전체 보기" />
					</a></li>
					<li><a id="btn_prev" href="#"> <img
							src="/gis/images/menu/btn_prev_n.png" alt="이전 화면" title="이전 화면" />
					</a></li>
					<li><a id="btn_next" href="#"> <img
							src="/gis/images/menu/btn_next_n.png" alt="다음 화면" title="다음 화면" />
					</a></li>
					<li><a id="btn_dist" href="#"> <img
							src="/gis/images/menu/btn_dist_n.png" class="toggle" alt="거리 측정" title="거리 측정" />
					</a></li>
					<li><a id="btn_area" href="#"> <img
							src="/gis/images/menu/btn_area_n.png" class="toggle" alt="면적 측정" title="면적 측정" />
					</a></li>
					<li><a id="btn_refresh" href="#"> <img
							src="/gis/images/menu/btn_refresh_n.png" alt="초기화" title="초기화" />
					</a></li>
					<!-- 
					<li><a id="btn_info" href="#"> <img
							src="/gis/images/menu/btn_buffer_selection_info_n.png" class="toggle"
							alt="단일 선택 정보 보기" title="단일 선택 정보 보기" />
					</a></li>
					<li onmouseover=""><a id="btn_poly" href="#"> <img
							src="/gis/images/menu/btn_poligon_selection_info_n.png" class="toggle"
							alt="다각형 선택 정보 보기" title="다각형 선택 정보 보기" />							
					</a></li>					
					<li><a id="btn_capture" href="#"> <img
							src="/gis/images/menu/btn_capture_n.png" alt="지도 이미지 다운로드" title="지도 이미지 다운로드" />
					</a></li> -->
				</ul>
				<!-- 지도 레벨 툴바 -->
				<div id="tooltip">
					<span></span>
				</div>
			</div>
	</div>
	
	<!-- 동적지도 설정 -->	
	<div id="dynamicSldWindow">
		<div id="dynamicTabs" class="easyui-tabs">
			<div id="divPointTab" class="div_dynamic" title="점">
				<div>
					<span class="span_tit">도형종류 </span>
					<span class="span_content">
						<select class="pointStyle easyui-combobox">
							<option value="circle">원</option>
							<option value="square">사각형</option>
							<option value="star">별</option>
							<option value="x">X</option>
							<option value="cross">십자가</option>
							<option value="triangle">삼각형</option>
						</select>
					</span>
				</div>
				<div>
					<span class="span_tit">크기</span>
					<span class="span_content"><input type="text" class="pointSize" /></span>
				</div>
				<div>
					<span class="span_tit">선색상</span>
					<span class="span_content"><input type="color" class="lineColor" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="lineSize" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="lineStyle easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="lineOpac sldOpac" /></div>
				<div>
					<span class="span_tit">면색상</span>
					<span class="span_content"><input type="color" class="polyColor" hex="true" /></span>
				</div>
				<div><span class="span_tit">면투명도</span></div>
				<div class="div_opacity" ><input class="polyOpac sldOpac" /></div>
			</div>
			<div id="divLineTab" class="div_dynamic" title="선">
				<div>
					<span class="span_tit">선색상(가공)</span>
					<span class="span_content"><input type="color" class="lineColor" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="lineSize" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="lineStyle easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="lineOpac sldOpac" /></div>
				
				<div>
					<span class="span_tit">선색상(지중)</span>
					<span class="span_content"><input type="color" class="lineColor_D" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="lineSize_D" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="lineStyle_D easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="lineOpac_D sldOpac" /></div>
			</div>
			<!-- <div id="divRoutingLineSKTTab" class="div_dynamic" title="경로검색 SKT">
				<div>
					<span class="span_tit">선색상(가공)</span>
					<span class="span_content"><input type="color" class="line_ca01Color" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="line_ca01Size" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="line_ca01Style easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="line_ca01Opac sldOpac" /></div>
				
				<div>
					<span class="span_tit">선색상(지중)</span>
					<span class="span_content"><input type="color" class="line_ca02Color" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="line_ca02Size" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="line_ca02tyle easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="line_ca02Opac sldOpac" /></div>
				<div>
					<span class="span_tit">선색상(FTTH)</span>
					<span class="span_content"><input type="color" class="line_ca03Color" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="line_ca03Size" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="line_ca03Style easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="line_ca03Opac sldOpac" /></div>
				<div>
					<span class="span_tit">선색상(임차)</span>
					<span class="span_content"><input type="color" class="line_ca04Color" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="line_ca04Size" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="line_ca04Style easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="line_ca04Opac sldOpac" /></div>
			</div>
			<div id="divRoutingLineSKBTab" class="div_dynamic" title="경로검색 SKB">
				<div>
					<span class="span_tit">선색상(가공)</span>
					<span class="span_content"><input type="color" class="line_ca05Color" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="line_ca05Size" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="line_ca05Style easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="lineOpac sldOpac" /></div>
				
				<div>
					<span class="span_tit">선색상(지중)</span>
					<span class="span_content"><input type="color" class="line_ca06Color" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="line_ca06Size" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="line_ca06Style easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="line_ca06Opac sldOpac" /></div>
				<div>
					<span class="span_tit">선색상(FTTH)</span>
					<span class="span_content"><input type="color" class="line_ca07Color" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="line_ca07Size" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="line_ca07Style easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="line_ca07Opac sldOpac" /></div>
				<div>
					<span class="span_tit">선색상(임차)</span>
					<span class="span_content"><input type="color" class="line_ca08Color" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="line_ca08Size" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="line_ca08Style easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="line_ca08Opac sldOpac" /></div>
				
			</div>-->
			<!-- <div id="divPolygonTab" class="div_dynamic" title="면">
				<div>
					<span class="span_tit">선색상</span>
					<span class="span_content"><input type="color" class="lineColor" hex="true" /></span>
				</div>
				<div>
					<span class="span_tit">선굵기</span>
					<span class="span_content"><input type="text" class="lineSize" /></span>
				</div>
				<div>
					<span class="span_tit">선스타일</span>
					<span class="span_content">
						<select class="lineStyle easyui-combobox">
							<option value="solid">solid</option>
							<option value="dot">dot</option>
							<option value="dash">dash</option>
						</select>
					</span>
				</div>
				<div><span class="span_tit">선투명도</span></div>
				<div class="div_opacity" ><input class="lineOpac sldOpac" /></div>
				<div>
					<span class="span_tit">면색상</span>
					<span class="span_content"><input type="color" class="polyColor" hex="true" /></span>
				</div>
				<div><span class="span_tit">면투명도</span></div>
				<div class="div_opacity" ><input class="polyOpac sldOpac" /></div>
			</div> -->
		</div>	
		<!-- <div class="div_dynamic" style="text-align:center;" >
			<button id="sldSubmit">스타일적용</button>
		</div> -->
		<div class="div_dynamic" >
			<span class="span_tit">표시여부</span>
			<span class="span_content"><input type="checkbox" id="chkShowSld" checked="checked" /></span>
		</div>
	</div>
	<!-- 곶지 사항 팝업 -->
	<div id="noticeWindow" class="easyui-window" title="공지사항" data-options="modal:true,closed:true" style="width:600px;height:240px;padding:0px;display:none;">
		<p style="padding-left:10px;">공지 사항</p>
		<div id="noticeContent"></div>
		<div style="padding-left:10px;valign:middle"><input type="checkbox" id="noDisplay">다시 열지 않기</div>
	</div>	
	<!-- 화면저장 & 경로 검색 엑셀 다운로드 -->
	<form name="frm_file_download" id="frm_file_download" method="post">
		<!-- 화면저장 -->
		<input type="hidden" id="hid_data" name="data" value="">
		
		<!-- 단일 & 다중 경로 검색 엑셀 다운로드 -->
		<input type="hidden" id="jsonFieldString" name="jsonFieldString" value="">
		<input type="hidden" id="jsonDataString" name="jsonDataString" value="">
		<input type="hidden" id="jsonNewLineDataString" name="jsonNewLineDataString" value="">
		
		<!-- 다중 경로 검색 엑셀 다운로드 -->
		<input type="hidden" id="jsonStatisticsFieldString" name="jsonStatisticsFieldString" value="">
		<input type="hidden" id="jsonStatisticsDataString" name="jsonStatisticsDataString" value="">
	</form>
	
	<!-- 팝업창으로 K-다익스트라 세부 경로 보여주기 창 -->
	<form name="frm_detailPath" id="frm_detailPath" method="post" action="/gis/krouting/detailPath" target="winDetailPath">
		<input type="hidden" id="hid_detail" name="data" value="">
	</form>
	
	<!-- 팝업창으로 K-다익스트라 세부 경로 보여주기 창 -->
	<form name="frm_bookmark" id="frm_bookmark" method="post" action="/gis/bookmark/detail" target="winBookmark">
		<input type="hidden" name="headOffice" value="">
		<input type="hidden" name="creator" value="">
		<input type="hidden" name="title" value="">
		<input type="hidden" name="bookmarkMasterId" value="">
	</form>
	
	<form name="frm_mapInfobookmark" id="frm_mapInfobookmark" method="post" action="/gis/mapInfoBookMark/detail" target="winBookmark">
		<input type="hidden" name="headOffice" value="">
		<input type="hidden" name="creator" value="">
		<input type="hidden"   name="title" value="">
		<input type="hidden" name="bookmarkMasterId" value="">
	</form>
	
	<!-- 팝업창으로 K-다익스트라 세부 경로 보여주기 창 -->
	<form name="frm_bookmark_error_detail" id="frm_bookmark_error_detail" method="post" action="/gis/bookmark/errorDetail" target="winBookmarkErrorDetail">
		<input type="hidden" name="excelErrorMessage" value="">
		<input type="hidden" name="excel" value="">
	</form>
	
	<form name="frm_mapInfobookmark_error_detail" id="frm_mapInfobookmark_error_detail" method="post" action="/gis/mapInfoBookMark/errorDetail" target="winBookmarkErrorDetail">
		<input type="hidden" name="excelErrorMessage" value="">
		<input type="hidden" name="excel" value="">
	</form>
	
	<!-- jquery & easy ui -->
	<script type="text/javascript" src="/gis/lib/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="/gis/lib/jquery/easyui/jquery.easyui.min.js"></script>
	
	<script type="text/javascript" src="/gis/lib/mColorPicker/mColorPicker.js"></script>
	<script type="text/javascript" src="/gis/lib/json2/json2.js"></script>

	<!--  ajax file upload -->
	<script type="text/javascript" src="/gis/lib/ajaxupload/ajaxupload.js"></script>

	<!-- openlayers & custom -->
	<script type="text/javascript" src="/gis/lib/openlayers/OpenLayers-min.js"></script>
	<script type="text/javascript" src="/gis/js/mapsv/openLayersCustom.js"></script>
	
	<!-- jsts -->
	<script type="text/javascript" src="/gis/lib/jsts/javascript.util.js"></script>
	<script type="text/javascript" src="/gis/lib/jsts/jsts.js"></script>
	
	<!-- 지도 JS -->
	<!--
	<script type="text/javascript" src="/gis/js/bies-map-min.js"></script>
	-->
	
	<!-- BIES JS -->
	<!--
	<script type="text/javascript" src="/gis/js/bies-min.js"></script>
	-->

	<!-- 다음 레이어  -->
	<script type="text/javascript" src="/gis/js/Daum/OpenLayers.Layer.DaumHybrid.js"></script>
	<script type="text/javascript" src="/gis/js/Daum/OpenLayers.Layer.DaumPhysical.js"></script>
	<script type="text/javascript" src="/gis/js/Daum/OpenLayers.Layer.DaumSatellite.js"></script>
	<script type="text/javascript" src="/gis/js/Daum/OpenLayers.Layer.DaumStreet.js"></script>

	<!-- gis 공용 -->
	<script type="text/javascript" src="/gis/js/com/util.js"></script>
	<script type="text/javascript" src="/gis/js/com/map.js"></script>
	<script type="text/javascript" src="/gis/js/com/message.js"></script>
	<script type="text/javascript" src="/gis/js/com/properties.js"></script>
	<script type="text/javascript" src="/gis/js/com/datagrid.js"></script>

	<!-- gis system -->
	<script type="text/javascript" src="/gis/js/gisMain.js"></script>
	<script type="text/javascript" src="/gis/js/map/mainMap.js"></script>
	
	<!-- 레이어정보 -->
	<script type="text/javascript" src="/gis/js/mapInfo/layerTree.js"></script>
	<!-- 시설물 검색 -->
	<script type="text/javascript" src="/gis/js/mapInfo/mapInfo.js"></script>
	<script type="text/javascript" src="/gis/js/mapInfo/dynamicSld.js"></script>
	<script type="text/javascript" src="/gis/js/mapInfo/mapInfoBookmark.js"></script>
	<script type="text/javascript" src="/gis/js/mapInfo/mapInfoSearch.js"></script>

	
	<!-- 최단경로 검색 / 기설루트 검색 -->
	<script type="text/javascript">
		var gurobiUser = "admin";
	</script>
	<script type="text/javascript" src="/gis/js/pgRouting/kpgRoutingSearch.js"></script>

	<script type="text/javascript" src="/gis/js/jsts/javascript.util.js"></script>
  	<script type="text/javascript" src="/gis/js/jsts/jsts.js"></script>

	<!-- 속성조회  -->
	<script type="text/javascript" src="/gis/js/mapsv/spatialInfo.js"></script>
	
	<!-- interativeUi -->
	<script type="text/javascript" src="/gis/js/interactiveUi/interactive.js"></script>
	
	<!-- 동적 시스템 구성 -->
	<script type="text/javascript" src="/gis/js/handler/commonHandler.js"></script>
	<script type="text/javascript" src="/gis/js/handler/baseHandler.js"></script>
		
</body>
</html>