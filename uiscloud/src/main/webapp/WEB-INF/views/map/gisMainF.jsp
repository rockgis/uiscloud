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
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
<title>GIS Main Page</title>
<!-- ValidationBox ToolTip 을 위해 필요 -->
<link rel='stylesheet' href='/webjars/bootstrap/3.3.2-1/css/bootstrap.min.css'>


<link rel="stylesheet" type="text/css" href="/lib/jquery/easyui/themes/bootstrap/easyui.css">
<!-- 실제 사용 테마 -->
<link rel="stylesheet" type="text/css" href="/lib/jquery/easyui/themes/cupertino/easyui.css">
<link rel="stylesheet" type="text/css" href="/lib/jquery/easyui/themes/icon.css">

<link rel="stylesheet" type="text/css" href="/resources/js/ol/css/ol.css">

<link rel="stylesheet" type="text/css" href="/mapapi/css/map.css">
<link rel="stylesheet" type="text/css" href="/mapapi/css/gisMain.css">
<link rel="stylesheet" type="text/css" href="/mapapi/css/css.css">
<link rel="stylesheet" type="text/css" href="/mapapi/css/layertree.css">

<link type="text/css" rel="stylesheet" href="/resources/css/jquery.treeview.css"></link>

<style type="text/css">
      .rotate-north {
        top: 65px;
        left: 10em;
      }
      .ol-touch .rotate-north {
        top: 80px;
      }
    </style>

</head>
<body>
	<!-- 로딩바 -->
	<div id="loadingBar">
		<div>
			<img src="/mapapi/images/search/ajax-loader.gif" style="width: 70px; height: 70px;">
		</div>
	</div>


	<div id="div_layout" class="easyui-layout" data-options="fit: true">
		<!-- 상단 시스템 메뉴 -->

		
		<div id="div_north" data-options="region:'north'">
			<span id="span_logo"><a href="#">UISCLOUD LOGO</a></span>
			
			<ul id="ul_menu">
				<li><a href="#" id="a_menu_mapInfo"><img src="/resources/images/main_menu/map_info_n.png" class="toggle" alt="지도정보" /></a></li>				
				<li><a href="#" id="a_menu_pgRouting"><img src="/resources/images/main_menu/single_route_n.png" class="toggle" alt="경로 검색" /></a></li>
			</ul>
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
							
							<div id="output"></div>
								<input class="legendText" type="text" id="txtBound" name="txtBound" style="width:100px;" value="" />
								<input class="legendText" type="text" id="txtlevel" name="txtlevel" style="width:100px;" value="" />
								<input class="legendText" type="text" id="txtcenter" name="txtcenter" style="width:100px;" value="" />
								<input class="legendText" type="hidden" id="tntxtBound" name="tntxtBound" style="width:100px;" value="" />
								<input class="legendText" type="hidden" id="tntxtlevel" name="tntxtlevel" style="width:100px;" value="" />
								<input class="legendText" type="hidden" id="tntxtcenter" name="tntxtcenter" style="width:100px;" value="" />
					        
					        <div id="map_toc" >
						         <table border="0" cellspacing="0" cellpadding="0">
									<tr>
										<td>
										<div id="TOCROOT"></div>
										<div style="overflow: auto; width: 240px; height: 100%;">
											<table>
												<tr>
													<td>
														<div id="TOC"></div>									
													</td>
												</tr>
											</table>
										</div>
										</td>
									</tr>
									<tr>
										<td height="30" align="center">
											<a href="javascript:toc.expandAll();"><img src="/resources/images/geonuris/expand_all_layers.png" border="0"></img></a>
											<a href="javascript:toc.collapseAll();"><img src="/resources/images/geonuris/collapse_all_layers.png" border="0"></img></a>
											<a href="javascript:toc.turnOnAll();"><img src="/resources/images/geonuris/turn_all_layers_on.png" border="0"></img></a>
											<a href="javascript:toc.turnOffAll();"><img src="/resources/images/geonuris/turn_all_layers_off.png" border="0"></img></a>
										</td>
									</tr>
								</table>
							</div>
						</div>
					</div>	
				</div>
				
				
				
				<div id="div_pgRouting" title="단일경로 검색">
					<div id="div_pgRouting_menu" style="background-color:#fff;">						

											<ul id="browser" class="filetree">
												<li><span class="folder">전북본부</span>
													<ul>
														<li><span class="folder">전북본부직할</span>
															<ul>
																<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','S503');">태평 변전소</a></span></li>
																<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2767');">동전주 변전소</a></span></li>
																<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2491');">남전주 변전소</a></span></li>
																<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2269');">전주 변전소</a></span></li>
																<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','SC02');">서곡 변전소</a></span></li>
																<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2677');">북전주 변전소</a></span></li>
																<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','D362');">봉동 변전소</a></span></li>
																<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2528');">남원 변전소</a></span></li>
															</ul>
														</li>
														<li><span class="folder">군산지사</span>
															<ul>
																<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','Z240');">어청도 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2255');">옥구 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','Z244');">개야도 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','Z246');">연도 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','Z243');">비안도 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','Z242');">장자도 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2674');">동군산 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2274');">서군산 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2742');">내초 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2766');">군산 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','Z248');">신시도 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','SC03');">군장 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2463');">군공 변전소</a></span></li>
																</ul>
															</ul>
														</li>
														<li><span class="folder">익산지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2741');">함열 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2825');">영등 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2252');">이리 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2609');">팔봉 변전소</a></span></li>
															</ul>
														</li>
														<li><span class="folder">무주지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2990');">무주 변전소</a></span></li>
															</ul>
														</li>
														<li><span class="folder">김제지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2440');">김제 변전소</a></span></li>
															</ul>
														</li>
														<li><span class="folder">진안지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2490');">금산 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','SC01');">진안 변전소</a></span></li>
															</ul>
														</li>
														<li><span class="folder">부안지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','Z870');">위도내연 발전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2728');">부안 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','D538');">상황등도 변전소</a></span></li>
															</ul>
														</li>
														<li><span class="folder">남원지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','3628430');">남원 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','7670034');">곡성 변전소</a></span></li>
															</ul>
														</li>	
														<li><span class="folder">고창지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','4903922');">홍농 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','4903748');">고창 변전소</a></span></li>
															</ul>
														</li>	
														<li><span class="folder">정읍지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','4392852');">정주 변전소</a></span></li>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','4392763');">정공 변전소</a></span></li>
															</ul>
														</li>	
														<li><span class="folder">임실지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','2924214');">임실 변전소</a></span></li>
															</ul>
														</li>	
														<li><span class="folder">장수지사</span>
															<ul>
																	<li><span class="file"><a href="#" onClick="javascript:onMoveInfoSc('NEXTG.JBOSUBST','SUBST_CD','94507339');">장수 변전소</a></span></li>
															</ul>
														</li>
													</ul>
												</li>	
											</ul>
											
									<!--지사/변전소 검색 END--> 
						
					</div>
				</div>
				
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
				
                <div id="div_map" ></div>
          
          
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
		
	
	
	<!-- jquery & easy ui -->
	
	<script src="/webjars/jquery/2.1.3/jquery.min.js" type="text/javascript"></script>
    <script src="/webjars/bootstrap/3.3.2-1/js/bootstrap.min.js" type="text/javascript"></script>
	<script type="text/javascript" src="/lib/jquery/easyui/jquery.easyui.min.js"></script>
	
	<script type="text/javascript" src="/lib/json2/json2.js"></script>
	
	<!-- openlayers -->
	<!-- <script type="text/javascript" src="/webjars/openlayers/3.5.0/ol.js"></script> -->
	<script type="text/javascript" src="/resources/js/ol/build/ol-debug.js"></script>
	
	<!-- Map 초기화 -->
	<script src="/webjars/proj4js/2.2.1/proj4.js" type="text/javascript"></script>
	
	<!-- 좌표계 확인 http://epsg.io/ -->
	<script src="/mapapi/js/proj4js/5181.js" type="text/javascript"></script>
	

	
	<!-- openlayers & custom -->
	<script type="text/javascript" src="/resources/js/olCustom/interaction/selectinteraction.js"></script>
 
	<!-- 다음 레이어  -->
	<script type="text/javascript" src="/resources/js/olCustom/tilegrid/daumtilegrid.js"></script>
	<script type="text/javascript" src="/resources/js/olCustom/source/daummapssource.js"></script>
	
	<!-- gis 공용 -->
	<script type="text/javascript" src="/resources/js/com/util.js"></script>
	<script type="text/javascript" src="/resources/js/com/map.js"></script>  
	<!-- 지도 관련 라이브러리  -->
	<script type="text/javascript" src="/resources/js/com/message.js"></script>
	<script type="text/javascript" src="/resources/js/com/properties.js"></script>
	<script type="text/javascript" src="/resources/js/com/datagrid.js"></script>

	<!-- gis system -->
	<script type="text/javascript" src="/resources/js/gisMain.js"></script>
	<script type="text/javascript" src="/resources/js/map/mainMap.js"></script>
	
	
	<!--속성조회  -->
	<script type="text/javascript" src="/resources/js/mapsv/spatialInfo.js"></script>
	
	<!-- 레이어정보 -->
<!--	<script type="text/javascript" src="/resources/js/mapsv/layerTree.js"></script>-->
	<!--동적 시스템 구성-->
	<script type="text/javascript" src="/resources/js/handler/commonHandler.js"></script>
	<script type="text/javascript" src="/resources/js/handler/baseHandler.js"></script>
	
	
</body>
</html>