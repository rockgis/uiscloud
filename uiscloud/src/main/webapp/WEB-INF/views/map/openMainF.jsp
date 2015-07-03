<!-- 
	파일명 : openMainF.jsp
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
    <link rel="stylesheet" type="text/css" href="/mapapi/css/openlayers/ol.css">
    
    <link rel="stylesheet" href="/lib/v3.2.0/resources/bootstrap/css/bootstrap.min.css" type="text/css">
  
    <link rel="stylesheet" href="/lib/v3.2.0/resources/bootstrap/css/bootstrap-responsive.min.css" type="text/css">
    
    <link rel="stylesheet" href="/mapapi/css/layout.css" type="text/css">
    
     <style>
   
   #ul_map_tool { position: absolute; top: 70px; right: 70px; z-index: 999; }
   #ul_map_tool li { float:left; margin-left:5px; }
   
   
      .tooltip {
        position: relative;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        color: white;
        padding: 4px 8px;
        opacity: 0.7;
        white-space: nowrap;
      }
      .tooltip-measure {
        opacity: 1;
        font-weight: bold;
      }
      .tooltip-static {
        background-color: #ffcc33;
        color: black;
        border: 1px solid white;
      }
      .tooltip-measure:before,
      .tooltip-static:before {
        border-top: 6px solid rgba(0, 0, 0, 0.5);
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
        content: "";
        position: absolute;
        bottom: -6px;
        margin-left: -7px;
        left: 50%;
      }
      .tooltip-static:before {
        border-top-color: #ffcc33;
      }
      
      .map:-moz-full-screen {
        height: 100%;
      }
      .map:-webkit-full-screen {
        height: 100%;
      }
      .map:-ms-fullscreen {
        height: 100%;
      }
      .map:full-screen {
        height: 100%;
      }
      .ol-rotate {
        top: 3em;
      }
      
    </style>
    
    
    
    <title>UISCLOUD Map Example</title>
  </head>
  <body>

    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
      </div>
    </div>

    <div class="container-fluid">

      <div class="row-fluid">
        <div class="span12">
          <div id="div_map" class="map"></div>
          
          
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
				</ul>
        </div>
        
        
         <div id="layertree" class="span6">
          <h5>Click on layer nodes below to change their properties.</h5>
              <ul>
                <li><span>OpenAerial layer</span>
                  <fieldset id="layer0">
                    <label class="checkbox" for="visible0">
                      <input id="visible0" class="visible" type="checkbox"/>visibility
                    </label>
                    <label>opacity</label>
                    <input class="opacity" type="range" min="0" max="1" step="0.01"/>
                    <label>hue</label>
                    <input class="hue" type="range" min="-3.141592653589793" max="3.141592653589793" step="0.01"/>
                    <label>saturation</label>
                    <input class="saturation" type="range" min="0" max="5" step="0.01"/>
                    <label>contrast</label>
                    <input class="contrast" type="range" min="0" max="2" step="0.01"/>
                    <label>brightness</label>
                    <input class="brightness" type="range" min="-1" max="1" step="0.01"/>
                  </fieldset>
                </li>
                <li><span>Layer group</span>
                  <fieldset id="layer1">
                    <label class="checkbox" for="visible1">
                      <input id="visible1" class="visible" type="checkbox"/>visibility
                    </label>
                    <label>opacity</label>
                    <input class="opacity" type="range" min="0" max="1" step="0.01"/>
                    <label>hue</label>
                    <input class="hue" type="range" min="-3.141592653589793" max="3.141592653589793" step="0.01"/>
                    <label>saturation</label>
                    <input class="saturation" type="range" min="0" max="5" step="0.01"/>
                    <label>contrast</label>
                    <input class="contrast" type="range" min="0" max="2" step="0.01"/>
                    <label>brightness</label>
                    <input class="brightness" type="range" min="-1" max="1" step="0.01"/>
                  </fieldset>
                  <ul>
                    <li><span>Food insecurity layer</span>
                      <fieldset id="layer10">
                        <label class="checkbox" for="visible10">
                          <input id="visible10" class="visible" type="checkbox"/>visibility
                        </label>
                        <label>opacity</label>
                        <input class="opacity" type="range" min="0" max="1" step="0.01"/>
                        <label>hue</label>
                        <input class="hue" type="range" min="-3.141592653589793" max="3.141592653589793" step="0.01"/>
                        <label>saturation</label>
                        <input class="saturation" type="range" min="0" max="5" step="0.01"/>
                        <label>contrast</label>
                        <input class="contrast" type="range" min="0" max="2" step="0.01"/>
                        <label>brightness</label>
                        <input class="brightness" type="range" min="-1" max="1" step="0.01"/>
                      </fieldset>
                    </li>
                    <li><span>World borders layer</span>
                      <fieldset id="layer11">
                        <label class="checkbox" for="visible11">
                          <input id="visible11" class="visible" type="checkbox"/>visibility
                        </label>
                        <label>opacity</label>
                        <input class="opacity" type="range" min="0" max="1" step="0.01"/>
                        <label>hue</label>
                        <input class="hue" type="range" min="-3.141592653589793" max="3.141592653589793" step="0.01"/>
                        <label>saturation</label>
                        <input class="saturation" type="range" min="0" max="5" step="0.01"/>
                        <label>contrast</label>
                        <input class="contrast" type="range" min="0" max="2" step="0.01"/>
                        <label>brightness</label>
                        <input class="brightness" type="range" min="-1" max="1" step="0.01"/>
                      </fieldset>
                    </li>
                  </ul>
                </li>
              </ul>

      </div>
      
      </div>

    </div>

    <script src="/lib/v3.2.0/resources/jquery.min.js" type="text/javascript"></script>
    
    
    <script type="text/javascript" src="/webjars/openlayers/3.2.0/ol.js"></script>
	
	<!-- Map 초기화 -->
	<script src="/webjars/proj4js/2.2.1/proj4.js" type="text/javascript"></script>
	
	<!-- 좌표걔 확인 http://epsg.io/ -->
	<script src="/mapapi/js/proj4js/5181.js" type="text/javascript"></script>
	<script src="/lib/v3.2.0/resources/example-behaviour.js" type="text/javascript"></script>
	
	
	<script type="text/javascript" src="/mapapi/js/map/map_init.js"></script>

  </body>
</html>
	
    

  </body>
</html>
