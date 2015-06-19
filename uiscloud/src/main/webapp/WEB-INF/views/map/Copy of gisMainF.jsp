<!-- 
	파일명 : gisMainF.jsp
	설  명 : GIS 메인 페이지
	
	수정일           수정자      수정내용
	----------    --------    --------------------------------------------------
	2015.02.05	   이래훈		   최초생성

 -->
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>GIS Main Page</title>
<!-- ValidationBox ToolTip 을 위해 필요 -->
<link rel="stylesheet" type="text/css" href="/lib/jquery/easyui/themes/bootstrap/easyui.css">
<!-- 실제 사용 테마 -->
<link rel="stylesheet" type="text/css" href="/lib/jquery/easyui/themes/cupertino/easyui.css">
<link rel="stylesheet" type="text/css" href="/lib/jquery/easyui/themes/icon.css">

<link rel="stylesheet" type="text/css" href="/mapapi/css/openlayers/ol.css">

<link rel="stylesheet" type="text/css" href="/mapapi/css/map.css">
<link rel="stylesheet" type="text/css" href="/mapapi/css/gisMain.css">
<link rel="stylesheet" type="text/css" href="/mapapi/css/css.css">
<link rel="stylesheet" type="text/css" href="/mapapi/css/layertree.css">

</head>
<body>
	<!-- 로딩바 
	<div id="loadingBar">
		<div>
			<img src="/mapapi/images/search/ajax-loader.gif" style="width: 70px; height: 70px;">
		</div>
	</div>
-->


	      
	     


	<div id="div_layout" class="easyui-layout" data-options="fit: true">
		<!-- 상단 시스템 메뉴 -->
		<div id="div_north" data-options="region:'north'">
			여기는 상단 메뉴
		</div>

		<!-- 왼쪽: 기능 메뉴 -->
		<div id="div_west" title="메뉴별 검색" data-options="region:'west'">
		<!--  권한 확인 <sec:authentication property="principal"/>  -->
		
			<div id="div_view" class="easyui-accordion" data-options="fit: true">
				<div id="div_layer_menu" title="배경 지도" data-options="collapsed:false,collapsible:false" style="padding: 10px;">
					<a 
						id="a_layer_base" href="#" class="a_layer_set layer_on"><img class="toggle" src="/mapapi/images/mapsv/layer/btn_bass_a.png" alt="기본도" /></a><a 
						id="a_layer_DaumHybrid" href="#" class="a_layer_set"><img class="toggle" src="/mapapi/images/mapsv/layer/btn_buld_n.png" alt="건물명칭" /></a><a 
						id="a_layer_DaumSatellite" href="#" class="a_layer_set"><img class="toggle" src="/mapapi/images/mapsv/layer/btn_air_n.png" alt="항공사진(스카이뷰)" />
					</a>
				</div>	
				<div id="div_mapInfo" title="지도정보" data-options="selected:true">
					<div id="div_mapInfo_menu">
						<div id="div_mapInfo_layer" title="레이어">
							<ul id="ul_layer_tree"></ul>
						</div>
					</div>	
				</div>
		  
		  <select id="layer-select">
            <option value="Aerial">Aerial</option>
            <option value="AerialWithLabels" selected>Aerial with labels</option>
            <option value="Road">Road</option>
            <option value="collinsBart">Collins Bart</option>
            <option value="ordnanceSurvey">Ordnance Survey</option>
          </select>
				
			</div>
		</div>

		<!-- 오른쪽 속성 보기 / 범례 창 -->
		<div id="div_east" title="정보보기 " style="overflow-x: hidden" data-options="region:'east', split:true">
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
		<div id="div_center" data-options="region:'center'">
				
              <div id="div_map"></div>
          
          
				<ul id="ul_map_tool">
					<li><a id="btn_zoomIn" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_zoom_in_n.png" class="toggle" alt="확대" title="확대" />
					</a></li>
					<li><a id="btn_zoomOut" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_zoom_out_n.png" class="toggle" alt="축소" title="축소" />
					</a></li>
					<li><a id="btn_pan" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_pan_a.png" class="toggle" alt="이동/선택" title="이동/선택" />
					</a></li>
					<li><a id="btn_news_hide" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_full_map_n.png" alt="지도 전체 화면으로 보기" title="지도 전체 화면으로 보기" />
					</a></li>
					<li><a id="btn_fullExtent" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_full_extent_n.png" alt="한반도 전체 보기" title="한반도 전체 보기" />
					</a></li>
					<li><a id="btn_prev" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_prev_n.png" alt="이전 화면" title="이전 화면" />
					</a></li>
					<li><a id="btn_next" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_next_n.png" alt="다음 화면" title="다음 화면" />
					</a></li>
					<li><a id="btn_dist" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_dist_n.png" class="toggle" alt="거리 측정" title="거리 측정" />
					</a></li>
					<li><a id="btn_area" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_area_n.png" class="toggle" alt="면적 측정" title="면적 측정" />
					</a></li>
					<li><a id="btn_refresh" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_refresh_n.png" alt="초기화" title="초기화" />
					</a></li>
					<li><a id="btn_info" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_buffer_selection_info_n.png" class="toggle"
							alt="단일 선택 정보 보기" title="단일 선택 정보 보기" />
					</a></li>
					<li><a id="btn_poly" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_poligon_selection_info_n.png" class="toggle"
							alt="다각형 선택 정보 보기" title="다각형 선택 정보 보기" />
					</a></li>
					<li><a id="btn_capture" href="#"> <img
							src="/mapapi/images/mapsv/btn/btn_capture_n.png" alt="지도 이미지 다운로드" title="지도 이미지 다운로드" />
					</a></li>
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
			</div>
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
		
	
	
	<!-- jquery & easy ui -->
	<script type="text/javascript" src="/lib/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="/lib/jquery/easyui/jquery.easyui.min.js"></script>
	
	
	<script type="text/javascript" src="/lib/json2/json2.js"></script>

	<!--  ajax file upload -->
	<script type="text/javascript" src="/lib/ajaxupload/ajaxupload.js"></script>
	
	<!-- openlayers -->
	<script type="text/javascript" src="/mapapi/lib/openlayers/ol.js"></script>
	
	<!-- Map 초기화 -->
	 <script src="/mapapi/resources/example-behaviour.js" type="text/javascript"></script>
	<script type="text/javascript" src="/mapapi/js/map/map_init.js"></script>

	<!-- openlayers & custom 
	<script type="text/javascript" src="/lib/mColorPicker/mColorPicker.js"></script>
	
	
	<script type="text/javascript" src="/bies/lib/openlayers/OpenLayers-min.js"></script>
	<script type="text/javascript" src="/bies/js/mapsv/openLayersCustom.js"></script>
	
	<!-- jsts 
	<script type="text/javascript" src="/bies/lib/jsts/javascript.util.js"></script>
	<script type="text/javascript" src="/bies/lib/jsts/jsts.js"></script>
	
	<!-- 지도 JS -->
	<!--
	<script type="text/javascript" src="/bies/js/bies-map-min.js"></script>
	-->
	
	<!-- BIES JS -->
	<!--
	<script type="text/javascript" src="/bies/js/bies-min.js"></script>
	-->

	<!-- 다음 레이어  
	<script type="text/javascript" src="/bies/js/Daum/OpenLayers.Layer.DaumHybrid.js"></script>
	<script type="text/javascript" src="/bies/js/Daum/OpenLayers.Layer.DaumPhysical.js"></script>
	<script type="text/javascript" src="/bies/js/Daum/OpenLayers.Layer.DaumSatellite.js"></script>
	<script type="text/javascript" src="/bies/js/Daum/OpenLayers.Layer.DaumStreet.js"></script>

	<!-- gis 공용
	<script type="text/javascript" src="/bies/js/com/util.js"></script>
	<script type="text/javascript" src="/bies/js/com/map.js"></script>
	<script type="text/javascript" src="/bies/js/com/message.js"></script>
	<script type="text/javascript" src="/bies/js/com/properties.js"></script>
	<script type="text/javascript" src="/bies/js/com/datagrid.js"></script>

	<!-- gis system 
	<script type="text/javascript" src="/bies/js/gisMain.js"></script>
	<script type="text/javascript" src="/bies/js/map/mainMap.js"></script>
	
	<!-- 레이어정보 
	<script type="text/javascript" src="/bies/js/mapInfo/layerTree.js"></script>
	<!-- 시설물 검색 
	<script type="text/javascript" src="/bies/js/mapInfo/mapInfo.js"></script>


	<!-- 속성조회  
	<script type="text/javascript" src="/bies/js/mapsv/spatialInfo.js"></script>
	
	<!-- interativeUi
	<script type="text/javascript" src="/bies/js/interactiveUi/interactive.js"></script>
	
	<!-- 동적 시스템 구성 
	<script type="text/javascript" src="/bies/js/handler/commonHandler.js"></script>
	<script type="text/javascript" src="/bies/js/handler/baseHandler.js"></script>
	-->
		
</body>
</html>