<!-- 
	파일명 : basicMapF.jsp
	설  명 : 교육1 - 기본 지도 띄우기
	
	수정일           		수정자     		 수정내용
	----------    	--------    --------------------------------------------------
	2015.04.01	   	이경찬		 최초생성
-->
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
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
    .map{
    	height: 400px;
		width: 100%;
    }
    </style>
	<title>UISCLOUD - 기본 지도 띄우기</title>
</head>
<body>
	<div id="map" class="map"></div>
	<div id="content" class="content">
	<p>
		기본지도 띄우기 예제 입니다.<br/>MapQuest를 이용한 Tile Layer를 Map객체에 추가,<br/> 초기화면 위치 및 Zoom Level 설정 View를 Map객체에 적용<br/><br/>
		// Map 객체 생성 <br/>
		var map = new ol.Map({<br/>
		&nbsp;&nbsp;&nbsp;target: 'map', // 지도를 보여줄 DIV 엘리먼트의 ID값<br/>
		&nbsp;&nbsp;&nbsp;layers: [<br/>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;new ol.layer.Tile({<br/>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// MapQuest 위성지도 호출<br/>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;source: new ol.source.MapQuest({layer: 'sat'})<br/>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;})<br/>
		&nbsp;&nbsp;&nbsp;],<br/>
		&nbsp;&nbsp;&nbsp;view: new ol.View({<br/>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// MapQuest 위성지도에 맞게 좌표 전환하여 초기화면 위치 설정(중심점좌표, Zoom Level)<br/>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),<br/>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;zoom: 4<br/>
		&nbsp;&nbsp;&nbsp;})<br/>
		});
	</p>
	
	</div>

    <script src="/lib/v3.2.0/resources/jquery.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="/webjars/openlayers/3.2.0/ol.js"></script>
	<script type="text/javascript">
		$(document).ready(function() {
			// Map 객체 생성
			var map = new ol.Map({
				target: 'map', // 지도를 보여줄 DIV 엘리먼트의 ID값
			    layers: [
			      new ol.layer.Tile({
			    	// MapQuest 위성지도 호출
			        source: new ol.source.MapQuest({layer: 'sat'})
			      })
			    ],
			    view: new ol.View({
			      // MapQuest 위성지도에 맞게 좌표 전환하여 초기화면 위치 설정(중심점좌표, Zoom Level)
			      center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
			      zoom: 4
			    })
			});
		});
	</script>
</body>
</html>