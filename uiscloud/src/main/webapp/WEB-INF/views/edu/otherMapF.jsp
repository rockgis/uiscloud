<!-- 
	파일명 : otherMapF.jsp
	설  명 : 교육2 - OpenLayers 3 기본 제공 지도 띄우기
	
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
	<title>UISCLOUD - OpenLayers 3 기본 제공 지도 띄우기</title>
</head>
<body>
	<div id="buttonDiv">
		<button id="mapquest">Map Quest</button>
		<button id="stamen">Stamen</button>
		<button id="osm">OpenStreetMap</button>
		<!-- <button id="bing">Bing Maps</button>
		<button id="daum">DaumMap</button>
		<button id="naver">NaverMap</button>
		<button id="google">GoogleMap</button>
		<button id="vworld">VworldMap</button> -->
	</div>
	<div id="map" class="map"></div>
	<div id="content" class="content">
	</div>

    <script src="/lib/v3.2.0/resources/jquery.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="/webjars/openlayers/3.2.0/ol.js"></script>
	<script type="text/javascript">
		var map;
		var mqLayer = new ol.layer.Tile({
    		// MapQuest 위성지도
        	source: new ol.source.MapQuest({layer: 'sat'})
      	});
		var stWaterColorLayer = new ol.layer.Tile({
	      source: new ol.source.Stamen({
		        layer: 'watercolor'
		      })
	    });
		var stLabelLayer = new ol.layer.Tile({
	      source: new ol.source.Stamen({
		        layer: 'terrain-labels'
		      })
	    });
		var bingLayer = new ol.layer.Tile({
		    visible: false,
		    preload: Infinity,
		    source: new ol.source.BingMaps({
		      key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
		      imagerySet: 'Road' // 5가지 종류 존재
	    	  /* var styles = [
	                'Road',
 	                'Aerial',
 	                'AerialWithLabels',
 	                'collinsBart',
 	                'ordnanceSurvey'
 	              ]; */
		      // use maxZoom 19 to see stretched tiles instead of the BingMaps
		      // "no photos at this zoom level" tiles
		      // maxZoom: 19
			})
		});
		var osmLayer = new ol.layer.Tile({
		      source: new ol.source.OSM()
	    });
		/* var naverLayer = new ol.layer.Tile({
		      source: new ol.source.NAVER()
	    }); */
		
		$(document).ready(function() {
			// Map 객체 생성
			map = new ol.Map({
				target: 'map', // 지도를 보여줄 DIV 엘리먼트의 ID값
				layers : [],
			    view: new ol.View({
			      // MapQuest 위성지도에 맞게 좌표 전환하여 초기화면 위치 설정(중심점좌표, Zoom Level)
			      center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
			      zoom: 4
			    })
			});
			
			map.addLayer(mqLayer);
			
			var str = "<p>현재 보고 계신 지도는 Map Quest에서 제공하는 Tile형태의 위성지도 입니다.</p>";
			$('#content').html(str);
		});
		
		$('#mapquest').click(function(){
			var view = new ol.View({
		      // MapQuest 위성지도에 맞게 좌표 전환하여 초기화면 위치 설정(중심점좌표, Zoom Level)
		      center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
		      zoom: 4
		    });
			map.getLayers().clear();
			map.addLayer(mqLayer);
			map.setView(view);
			
			var str = "<p>현재 보고 계신 지도는 Map Quest에서 제공하는 Tile형태의 위성지도 입니다.</p>";
			$('#content').html(str);
		});
		
		$('#stamen').click(function(){
			var view = new ol.View({
		    	center: ol.proj.transform(
			        [-122.416667, 37.783333], 'EPSG:4326', 'EPSG:3857'),
			    zoom: 15
		 	});
			
			map.getLayers().clear();
			map.addLayer(stWaterColorLayer);
			map.addLayer(stLabelLayer);
			map.setView(view);
			
			var str = "<p>현재 보고 계신 지도는 Stamen에서 제공하는 Tile형태의 지도 입니다.</p>";
			$('#content').html(str);
		});
		
		$('#osm').click(function(){
			var view = new ol.View({
			    center: [0, 0],
			    zoom: 2
			  });
			
			map.getLayers().clear();
			map.addLayer(osmLayer);
			map.setView(view);
			
			var str = "<p>현재 보고 계신 지도는 OpenStreetMap에서 제공하는 Tile형태의 지도 입니다.</p>";
			$('#content').html(str);
		});
		
		/* $('#naver').click(function(){
			var view = new ol.View({
				center: ol.proj.transform(
				        [-122.416667, 37.783333], 'EPSG:4326', 'EPSG:5179'),
				    zoom: 14
			  });
			
			map.getLayers().clear();
			map.addLayer(naverLayer);
			map.setView(view);
			
			var str = "<p>현재 보고 계신 지도는 Naver에서 제공하는 Tile형태의 지도 입니다.</p>";
			$('#content').html(str);
		}); */
		
		/* $('#bing').click(function(){
			var view = new ol.View({
			  center: [-6655.5402445057125, 6709968.258934638],
			  zoom: 13
			});
			map.getLayers().clear();
			map.addLayer(bingLayer);
			map.setView(view);
			
			var str = "<p>현재 보고 계신 지도는 Bing에서 제공하는 Tile형태의 지도 입니다.</p>";
			$('#content').html(str);
		}); 
		
		$('#daum').click(function(){
			var view = new ol.View({
			    center: [0, 0],
			    zoom: 2
			  });
			
			map.getLayers().clear();
			map.addLayer(osmLayer);
			map.setView(view);
			
			var str = "<p>현재 보고 계신 지도는 Daum에서 제공하는 Tile형태의 지도 입니다.</p>";
			$('#content').html(str);
		});
		
		$('#vworld').click(function(){
			var view = new ol.View({
			    center: [0, 0],
			    zoom: 2
			  });
			
			map.getLayers().clear();
			map.addLayer(osmLayer);
			map.setView(view);
			
			var str = "<p>현재 보고 계신 지도는 Vworld에서 제공하는 Tile형태의 지도 입니다.</p>";
			$('#content').html(str);
		});
		
		$('#google').click(function(){
			var view = new ol.View({
			    center: [0, 0],
			    zoom: 2
			  });
			
			map.getLayers().clear();
			map.addLayer(osmLayer);
			map.setView(view);
			
			var str = "<p>현재 보고 계신 지도는 Google에서 제공하는 Tile형태의 지도 입니다.</p>";
			$('#content').html(str);
		}); */
	</script>
</body>
</html>