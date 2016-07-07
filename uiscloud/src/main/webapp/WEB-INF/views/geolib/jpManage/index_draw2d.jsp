
<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Titan</title>
	<!-- ValidationBox ToolTip 을 위해 필요 -->
<!-- 	<link rel="stylesheet" type="text/css" href="/titan/lib/bootstrap-3.3.5/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/titan/lib/jquery/easyui/themes/bootstrap/easyui.css">
 -->
    
    <link rel="stylesheet" type="text/css" href="http://www.jeasyui.com/easyui/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="/titan/lib/jquery/easyui/themes/cupertino/easyui.css">
    <link rel="stylesheet" type="text/css" href="http://www.jeasyui.com/easyui/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="http://www.jeasyui.com/easyui/themes/color.css">
    <link rel="stylesheet" type="text/css" href="http://www.jeasyui.com/easyui/demo/demo.css"> 
    
    <link type="text/css" rel="stylesheet" href="/titan/lib/draw2d/css/contextmenu.css" />
	
	<style>
        .manageTableHeader {
            text-align : center;
			padding-bottom : 10px;
        }
        
        .tabHeader{
        	padding:10px;
        }
    </style>
</head>
<body>
	<div id="div_layout" class="easyui-layout" style="width:100%;height:1080px;">
		
        <input type="hidden" id="jpMgno"/>
         <div data-options="region:'center',title:'접속 상세도'"> 	
	        <div style="width:100%; ">
	        	<button class="btn btn-info" id="zoomIn">확대</button>
	        	<button class="btn btn-info" id="zoomOut">축소</button>
	        	<button class="btn btn-info" id="zoomReset">1:1</button>
	        </div>
   			<div   id="canvasDetailJp"  style="width:100%; height:1000px; "></div>
		</div>
	
	</div>
	
	<!-- jquery & easy ui -->
    <script src="/titan/lib/draw2d/lib/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="/titan/lib/bootstrap-3.0.0/bootstrap.min.js"></script>
    <script type="text/javascript" src="/titan/lib/jquery-easyui-1.4.1/jquery.easyui.min.js"></script>
	<script type="text/javascript" src="/titan/lib/json2/json2.js"></script>
	
	
	<!-- draw2d -->
	

    <script src="/titan/lib/draw2d/lib/shifty.js"></script>
    <script src="/titan/lib/draw2d/lib/raphael.js"></script>
    <script src="/titan/lib/draw2d/lib/jquery.autoresize.js"></script>
    <script src="/titan/lib/draw2d/lib/jquery-touch_punch.js"></script>
    <script src="/titan/lib/draw2d/lib/jquery.contextmenu.js"></script>
    <script src="/titan/lib/draw2d/lib/rgbcolor.js"></script>
    <script src="/titan/lib/draw2d/lib/canvg.js"></script>
    <script src="/titan/lib/draw2d/lib/Class.js"></script>
    <script src="/titan/lib/draw2d/lib/pathfinding-browser.min.js"></script>
    <script src="/titan/lib/draw2d/src/draw2d.js"></script>
		
	<!-- script -->
	<script type="text/javascript" src="/titan/js/jpManage/comm.js"></script>
	<script type="text/javascript" src="/titan/js/jpManage/detailJp.js"></script>
	
	<script>
		$(document).ready(function() {
			detailJpCanvas = drawCanvas.init("canvasDetailJp");
			detailJp.init(); //접속상세도(가입자망)
		});
	</script>
</body>
</html>