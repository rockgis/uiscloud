<!-- 
	파일명 : gisMainDev.jsp
	설  명 : 개별 GIS 메인 페이지
	
	수정일           수정자      수정내용
	----------      --------    --------------------------------------------------
	2015.09.11	이경찬		최초생성
 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://www.springframework.org/security/tags" prefix="sec" %>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>UISCLOUD GeoLIB</title>
	
	<!-- ValidationBox ToolTip 을 위해 필요 -->
	<link rel="stylesheet" type="text/css" href="/geolib/lib/jquery/easyui/themes/bootstrap/easyui.css">
	<!-- 실제 사용 테마 -->
	<link rel="stylesheet" type="text/css" href="/geolib/lib/jquery/easyui/themes/cupertino/easyui.css">
	<link rel="stylesheet" type="text/css" href="/geolib/lib/jquery/easyui/themes/icon.css">
	<link rel="stylesheet" type="text/css" href="/geolib/lib/ol3_v3.15.1/ol.css">
	<!-- <link rel="stylesheet" type="text/css" href="/webjars/openlayers/3.15.1/ol.css"> -->
	
	<link rel="stylesheet" type="text/css" href="/geolib/lib/openlayers/theme/default/style.css">
	<link rel="stylesheet" type="text/css" href="/geolib/css/map.css">
	<link rel="stylesheet" type="text/css" href="/geolib/css/gisMain.css">
	<link rel="stylesheet" type="text/css" href="/geolib/css/css.css">
	<link rel="stylesheet" type="text/css" href="/geolib/css/layertree.css">
	
	<link rel="stylesheet" type="text/css" href="/gis/css/menu.css">
	
	<!-- 거리/면적 CSS -->
	<style>
        .ol3_measure_tooltip {
            position: relative;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 4px;
            color: white;
            padding: 4px 8px;
            opacity: 0.7;
            white-space: nowrap;
        }
        .ol3_measure_tooltip-measure {
            opacity: 1;
            font-weight: bold;
        }
        .ol3_measure_tooltip-static {
            background-color: #ffcc33;
            color: black;
            border: 1px solid white;
        }
        .ol3_measure_tooltip-measure:before, .tooltip-static:before {
            border-top: 6px solid rgba(0, 0, 0, 0.5);
            border-right: 6px solid transparent;
            border-left: 6px solid transparent;
            content: "";
            position: absolute;
            bottom: -6px;
            margin-left: -7px;
            left: 50%;
        }
        .ol3_measure_tooltip-static:before {
            border-top-color: #ffcc33;
        }
    </style>
</head>
<body>
	<!-- 로딩바 -->
	<div id="loadingBar">
		<div>
			<img src="/geolib/images/search/ajax-loader.gif" style="width: 70px; height: 70px;">
		</div>
	</div>

	<div id="div_layout" class="easyui-layout" data-options="fit: true">
		<!-- 상단 시스템 메뉴 -->
		<div id="div_north" data-options="region:'north'">
			<span id="span_logo"><a href="/"><img id="imgLogo" src="/geolib/images/main/img_logo.png" alt="titan Logo" /></a></span>
			<!-- ul id="ul_menu">
			<li style="width: 50px;"></li>
				<li><a href="#" id="a_menu_mapInfo"><img src="/geolib/images/main_menu/map_info_n.png" class="toggle" alt="지도정보" /></a></li>
				<li><a href="#" id="a_menu_routing"><img src="/geolib/images/main_menu/routing_n.png" class="toggle" alt="단일 결로" /></a></li>
				<li><a href="#" id="a_menu_routing"><img src="/geolib/images/main_menu/single_route_n.png" class="toggle" alt="최단 결로" /></a></li>
				<li><a href="#" id="a_menu_routing"><img src="/geolib/images/main_menu/multi_route_n.png" class="toggle" alt="다중 결로" /></a></li>
				
				<li><a href="#" id="a_menu_jpManage">접속 선번도</a></li>
				<%-- 
				<sec:authorize access="hasRole('ROLE_ADMIN')">
				   <li><a href="#" id="a_menu_admin"><img src="/geolib/images/main_menu/user_management_n.png" class="toggle" alt="회원관리" /></a></li>
				</sec:authorize> 
				<li><a href="/j_spring_security_logout" id="a_menu_logout"><img src="/geolib/images/main_menu/logout_n.png" class="toggle" alt="로그아웃" /></a></li> --%>
			</ul>-->
			
			<div id="sse50">
			  <div id="sses50">
			    <ul>
			      <li><a href="#" id="a_menu_mapInfo">지도정보</a></li>
			      <li><a href="#" id="a_menu_edit">편집기능</a></li>
			      <li><a href="#" id="a_menu_pgRouting">단일경로 </a></li>
			      <li><a href="#" id="a_menu_pgKRouting">최단경로</a></li>
			      <li><a href="#" id="a_menu_pgMRouting">다중경로</a></li>
			      <li><a href="/j_spring_security_logout" id="a_menu_logout">로그 아웃</a></li>
			                <li><a class="end">&nbsp;</a></li>
			    </ul>
			  </div>
			</div>			
		</div>

		<!-- 왼쪽: 배경도&주제도&검색 메뉴 -->
		<div id="div_west" title="기본 정보" data-options="region:'west'">
		<!--  권한 확인 <sec:authentication property="principal"/>  -->
			<div id="div_view" class="easyui-accordion" data-options="fit: true">
				<div id="div_mapInfo" title="지도정보" data-options="selected:true">
				    <div id="div_layer_menu" title="배경 지도" data-options="collapsed:false,collapsible:false" style="padding: 5px;">
						<a 
							id="a_layer_base" href="#" class="a_layer_set layer_on"><img class="toggle" src="/gis/images/mapsv/layer/btn_bass_a.png" alt="기본도" /></a><a 
							id="a_layer_hybrid" href="#" class="a_layer_set"><img class="toggle" src="/gis/images/mapsv/layer/btn_buld_n.png" alt="건물명칭" /></a><a 
							id="a_layer_satellite" href="#" class="a_layer_set"><img class="toggle" src="/gis/images/mapsv/layer/btn_air_n.png" alt="항공사진(스카이뷰)" />
						</a>
					   </div>
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
												<!-- <li class="textAlignRight_MarginTopRight20"><a href="#" class="a_menu_sld"><img src="/gis/images/btn/btn_sld_n.png" alt="동적결과표시"/></a></li> -->
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
											
											<li><span class="span_tit" style="float: left;">조건 선택</span><span
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
	
				<div id="div_kRouting" title="최단경로 검색">
						<div id="div_kRouting_menu">
							<div id="div_kRouting_search" title="최단 경로 검색">
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
											
											<li><span class="span_tit" style="float: left;">조건 선택</span><span
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
					
				<div id="div_mRouting" title="다중경로 검색">
					<div id="div_mRouting_menu">
						<div id="div_mRouting_search" title="다중 경로 검색">
							<form name="frmMRouting" id="frmMRouting" onsubmit="return false;">
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
										
										<li><span class="span_tit" style="float: left;">조건 선택</span><span
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
				<div title="상세속성" style="text-align: center;">
					<table id="table_info"></table>
					<a href="#" id="a_save_feature" class="add easyui-linkbutton" data-options="iconCls:'icon-save'" >등록</a>
					<a href="#" id="a_update_feature" class="update easyui-linkbutton" data-options="iconCls:'icon-save'" >수정</a>
					<a href="#" id="a_cancel_feature" class="update easyui-linkbutton" data-options="iconCls:'icon-remove'" >취소</a>
				</div>
			</div>
		</div>

		<!-- 하단 검색 결과 창 -->
		<div id="div_south" title="검색결과" data-options="region:'south', split:true, tools:'#div_serGridToolbar'">
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
<!-- 			<div data-options="region:'north',split:true,border:false" style="height:25px;padding:0px;margin:0px">
					<div class="search" id="searchTotal">
						<ul>
							<li style="height:25px"><span class="span_tit required_filter">시설물 종류</span>
								<span class="span_content"><input class="facilityKind easyui-combobox" style="width: 150px" /></span>
								<span class="span_tit required_filter">검색 조건</span>
								<span class="span_content"><input class="searchKind easyui-combobox" style="width: 150px" /></span>							
								<span class="span_content"><input class="searchValue inputText" style="width: 150px" /></span>	
								<span class="span_content insertDate"><input class="sinsertDate easyui-datebox" style="width: 90px;" data-options="formatter: gfnEasyUiDateFormatter, parser: gfnEasyUiDateParser" />~</span>
								<span class="span_content insertDate"><input class="einsertDate easyui-datebox" style="width: 90px;" data-options="formatter: gfnEasyUiDateFormatter, parser: gfnEasyUiDateParser" /></span>						
								<span class="span_tit required_filter pnuaddr">대번지</span>
								<span class="span_content pnuaddr"><input class="searchValue inputText" style="width: 50px" /></span>
								<span class="span_tit required_filter pnuaddr">소번지</span>
								<span class="span_content pnuaddr"><input class="searchValue inputText" style="width: 50px" /></span>							
								<a href="#" class="searchbtn"><img src="/geolib/images/btn/btn_search_n.png" alt="검색" style="height:24px;vertical-align:bottom;"/></a>
								<a href="#" class="resetbtn"><img src="/geolib/images/btn/btn_reset_n.png" alt="초기화" style="height:24px;vertical-align:bottom;"/></a>
								<a href="#" class="a_menu_sld"><img src="/geolib/images/btn/btn_sld_n.png" alt="동적결과표시" style="height:24px;vertical-align:bottom;"/></a>
							</li>						
						</ul>
					</div>
				</div> -->
				<div id="div_map"></div>
				<ul id="ul_map_tool">
					<li>
						<select id="selectBox_bgm">
							<option value="vworld" selected="selected">vworld</option>
							<option value="daum">daum</option>
							<option value="naver">naver</option>
						</select>
					</li>
					<li><button id="btn_editTool" style="height:30px;">편집도구</button></li>
					<li><button id="btn_drawTool" style="height:30px;">그리기도구</button></li>
					<li><a id="btn_zoomIn" href="#"> <img
							src="/geolib/images/menu/btn_zoom_in_n.png" class="toggle" alt="확대" title="확대" />
					</a></li>
					<li><a id="btn_zoomOut" href="#"> <img
							src="/geolib/images/menu/btn_zoom_out_n.png" class="toggle" alt="축소" title="축소" />
					</a></li>
					<li><a id="btn_pan" href="#"> <img
							src="/geolib/images/menu/btn_pan_a.png" class="toggle" alt="이동/선택" title="이동/선택" />
					</a></li>
					<li><a id="btn_news_hide" href="#"> <img
							src="/geolib/images/menu/btn_full_map_n.png" alt="지도 전체 화면으로 보기" title="지도 전체 화면으로 보기" />
					</a></li>
					<li><a id="btn_fullExtent" href="#"> <img
							src="/geolib/images/menu/btn_full_extent_n.png" alt="한반도 전체 보기" title="한반도 전체 보기" />
					</a></li>
					<li><a id="btn_prev" href="#"> <img
							src="/geolib/images/menu/btn_prev_n.png" alt="이전 화면" title="이전 화면" />
					</a></li>
					<li><a id="btn_next" href="#"> <img
							src="/geolib/images/menu/btn_next_n.png" alt="다음 화면" title="다음 화면" />
					</a></li>
					<li><a id="btn_dist" href="#"> <img
							src="/geolib/images/menu/btn_dist_n.png" class="toggle" alt="거리 측정" title="거리 측정" />
					</a></li>
					<li><a id="btn_area" href="#"> <img
							src="/geolib/images/menu/btn_area_n.png" class="toggle" alt="면적 측정" title="면적 측정" />
					</a></li>
					<li><a id="btn_refresh" href="#"> <img
							src="/geolib/images/menu/btn_refresh_n.png" alt="초기화" title="초기화" />
					</a></li>
					<li><a id="btn_info" href="#"> <img
							src="/geolib/images/menu/btn_buffer_selection_info_n.png" class="toggle"
							alt="단일 선택 정보 보기" title="단일 선택 정보 보기" />
					</a></li>
					<li onmouseover=""><a id="btn_poly" href="#"> <img
							src="/geolib/images/menu/btn_poligon_selection_info_n.png" class="toggle"
							alt="다각형 선택 정보 보기" title="다각형 선택 정보 보기" />							
					</a></li>					
					<li><a id="btn_capture" href="#"> <img
							src="/geolib/images/menu/btn_capture_n.png" alt="지도 이미지 다운로드" title="지도 이미지 다운로드" />
					</a></li>
				</ul>
				<ul id="ul_map_drawTool">
					<li><button id="btn_drawPoint" style="height:30px;">점그리기</button></li>
					<li><button id="btn_drawLine" style="height:30px;">선그리기</button></li>
					<li><button id="btn_drawPolygon" style="height:30px;">면그리기</button></li>
					<li><button id="btn_moveFeature" style="height:30px;">도형이동</button></li>
					<!-- <li><button id="btn_selectFeature" style="height:30px;">도형선택</button></li> -->
					<li><button id="btn_editFeature" style="height:30px;">도형편집</button></li>
					<li><button id="btn_removeFeature" style="height:30px;">도형삭제</button></li>
					
					<!-- <li><button id="btn_copyPoint" style="height:30px;">점 복사</button></li>
					<li><button id="btn_copyLine" style="height:30px;">선 복사</button></li>
					<li><button id="btn_copyPolygon" style="height:30px;">면 복사</button></li>
					
					<li><button id="btn_cloneFeature" style="height:30px;">도형연속입력</button></li>
					<li><button id="btn_moveGroupPoint" style="height:30px;">점 그룹이동</button></li>
					<li><button id="btn_divideLine" style="height:30px;">선 분리</button></li> -->
				</ul>
				<ul id="ul_map_editTool">
					<li>
						<select class="targetEditLyr">
							<option value="tl_spbd_entrc_11000" lyrType="point">출입구</option>
							<option value="tl_spot_cntc_11000" lyrType="line">연결선</option>
							<option value="tl_spbd_buld_11000" lyrType="polygon">건물</option>
							
						</select>
					</li>
					<li><button id="btn_insertFeature" style="height:30px;">도형추가</button></li>
					<li><button id="btn_updateFeature" style="height:30px;">도형편집</button></li>
					<li><button id="btn_moveFeature" style="height:30px;">도형이동</button></li>
					<li><button id="btn_deleteFeature" style="height:30px;">도형삭제</button></li>
					<li><button id="btn_copyFeature" style="height:30px;">도형복사</button></li>
					<li><button id="btn_divideFeature" style="height:30px;">선분할</button></li>
					<!-- <li><button id="btn_updatePosFeature" style="height:30px;">도형이동</button></li> -->
				</ul>
				<!-- 지도 레벨 툴바 -->
				<div id="tooltip" style="display:none;">
					<span></span>
				</div>
			</div>
	</div>
	
	<!-- 동적지도 설정 -->	
<!-- 	<div id="dynamicSldWindow">
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
		</div>	
		<div class="div_dynamic" >
			<span class="span_tit">표시여부</span>
			<span class="span_content"><input type="checkbox" id="chkShowSld" checked="checked" /></span>
		</div>
	</div>
	 -->
	<!-- 화면저장 & 경로 검색 엑셀 다운로드 -->
	<form name="frm_file_download" id="frm_file_download" method="post">
		<!-- 화면저장 -->
		<input type="hidden" id="hid_data" name="data" value="">
		
	</form>
	
	
	<!-- jquery & easy ui -->
	<script type="text/javascript" src="/webjars/jquery/2.2.3/jquery.min.js"></script>
	
	<script type="text/javascript" src="/geolib/lib/jquery/easyui/jquery.easyui.min.js"></script>
	
	<script type="text/javascript" src="/geolib/lib/json2/json2.js"></script>

	<!--  ajax file upload -->
	<script type="text/javascript" src="/geolib/lib/ajaxupload/ajaxupload.js"></script>
	
	<!-- proj4js -->
	<!-- <script type="text/javascript" src="/geolib/lib/proj4js/proj4js.js"></script> -->
	<script type="text/javascript" src="/webjars/proj4js/2.2.1/proj4.js"></script>

	<!-- ol3 & custom -->
	<!-- 
	   <script type="text/javascript" src="/webjars/openlayers/3.15.1/ol-deps.js"></script>
    <script type="text/javascript" src="/webjars/openlayers/3.15.1/ol.js"></script> 
	
	   
	-->
	
	<script type="text/javascript" src="/geolib/lib/ol3_v3.15.1/ol-debug.js"></script>
	
	<script type="text/javascript" src="/geolib/lib/ol3_custom/source/vworldsource.js"></script>
	<script type="text/javascript" src="/geolib/lib/ol3_custom/source/daumsource.js"></script>
	<script type="text/javascript" src="/geolib/lib/ol3_custom/source/naversource.js"></script>
	<script type="text/javascript" src="/geolib/lib/ol3_custom/format/wfsformat.js"></script>
	<script type="text/javascript" src="/geolib/lib/ol3_custom/service/wfsservice.js"></script>
	
	
	<!-- openlayers & custom -->
	<script type="text/javascript" src="/geolib/lib/openlayers/OpenLayers-min.js"></script>
	<script type="text/javascript" src="/geolib/js/mapsv/openLayersCustom.js"></script>
	
	<!-- jsts -->
	<script type="text/javascript" src="/geolib/lib/jsts/javascript.util.js"></script>
	<script type="text/javascript" src="/geolib/lib/jsts/jsts.js"></script>
	
	<!-- Vworld 레이어 -->
	
	<!-- gis 개발 -->
	<script type="text/javascript" src="/geolib/js/gisMain.js"></script>
	
	<!-- gis 공용 -->
	<script type="text/javascript" src="/geolib/js/com/util.js"></script>
	<script type="text/javascript" src="/geolib/js/com/map.js"></script>
	<!-- -->
	<script type="text/javascript" src="/geolib/js/com/message.js"></script>
	<script type="text/javascript" src="/geolib/js/com/datagrid.js"></script> 
	<script type="text/javascript" src="/geolib/js/com/properties.js"></script>
	
	<!-- gis system -->
	<script type="text/javascript" src="/geolib/js/map/mainMap.js"></script>
	
	<!-- 그리기 도구 -->
	<script type="text/javascript" src="/geolib/js/drawTool/drawTool.js"></script>
	
	<!-- 편집 도구 -->
	<script type="text/javascript" src="/geolib/js/editTool/editTool.js"></script>
	
	<!-- 거리/면적 측정 공통함수 -->
	<script type="text/javascript" src="/geolib/js/com/measure.js"></script>
	
	<!-- olCustom -->
	<script type="text/javascript" src="/geolib/js/olCustom/draganddropinteraction.js"></script>
	<script type="text/javascript" src="/geolib/js/olCustom/dragzoomininteraction.js"></script>
	<script type="text/javascript" src="/geolib/js/olCustom/dragzoomoutinteraction.js"></script>
	<script type="text/javascript" src="/geolib/js/olCustom/dragfeatureinteraction.js"></script>
	
	<!-- 레이어정보 -->
	<script type="text/javascript" src="/geolib/js/mapInfo/layerTree.js"></script>
	 
	<!-- 시설물 검색 	-->
	<script type="text/javascript" src="/geolib/js/mapInfo/mapInfo.js"></script>
	<script type="text/javascript" src="/geolib/js/mapInfo/dynamicSld.js"></script>
	<script type="text/javascript" src="/geolib/js/mapInfo/mapInfoSearch.js"></script>

	<!-- 링 검색 
	<script type="text/javascript" src="/geolib/js/mapInfo/ring.js"></script>
	-->
	<!-- 대번지 검색 
	<script type="text/javascript" src="/geolib/js/mapInfo/building.js"></script>
	-->
	<!-- 속성조회  -->
	<script type="text/javascript" src="/geolib/js/mapsv/spatialInfo.js"></script>
	
	<!-- K-다익스트라 검색 / 기설루트 검색 -->
	<script type="text/javascript" src="/gis/js/pgRouting/pgRoutingSearch.js"></script>
	<script type="text/javascript" src="/gis/js/kRouting/kRoutingSearch.js"></script>

	
	<!-- 동적 시스템 구성 -->	 
	<script type="text/javascript" src="/geolib/js/handler/commonHandler.js"></script>
	<script type="text/javascript" src="/geolib/js/handler/baseHandler.js"></script>
	
</body>
</html>