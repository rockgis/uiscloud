
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
	<div id="div_layout" class="easyui-layout" style="width:100%;height:800px;">
        <div  id="div_north" title="접속정보 도구" data-options="region:'north'" style="height:220px">
        	<div id="tabJpManage" class="easyui-tabs" style="width:100%; height:100%;">
        		<input type="hidden" id="jpMgno"/>
				<div title="광코어 접속편집" id="opticalFiberManage"  class="tabHeader">
					<table class="table">
						<tbody>
							<tr>
								<th class="manageTableHeader" style="width: 2%"></th>
								<th class="manageTableHeader" style="width: 10%">접속함체</th>
								<th class="manageTableHeader" style="width: 26%">접속 케이블</th>
								<th class="manageTableHeader" style="width: 10%">선번1</th>
								<th class="manageTableHeader" style="width: 10%">선번2</th>
								<th class="manageTableHeader" style="width: 2%"></th>
								<th class="manageTableHeader" style="width: 20%">임시 연결 케이블</th>
								<th class="manageTableHeader" style="width: 10%">선번1</th>
								<th class="manageTableHeader" style="width: 10%">선번2</th>
							</tr>
							<tr>
								<td><input type="checkbox" class="chkJp1"/></td>
								<td><select class="easyui-combobox jp1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpCable1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpInput1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpOutput1" style="width: 100%" ></select></td>
								<td><input type="checkbox" class="chkTempJpCable1" /></td>
								<td><select class="easyui-combobox tempJpCable1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpTempInput1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpTempOutput1" style="width: 100%" ></select></td>
							</tr>
							<tr>
								<td><input type="checkbox" class="chkJp2"/></td>
								<td><select class="easyui-combobox jp2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpCable2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpInput2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpOutput2" style="width: 100%" ></select></td>
								<td><input type="checkbox" class="chkTempJpCable2" /></td>
								<td><select class="easyui-combobox tempJpCable2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpTempInput2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpTempOutput2" style="width: 100%" ></select></td>
							</tr>
							<tr>
								<td></td>
								<th class="manageTableHeader">비고</th>
								<td colspan="7"><input  class="easyui-textbox etc" style="width:100%;"/></td>
							</tr>
							<tr>
	        					<td colspan="9">
		        					<a href="#" class="easyui-linkbutton" >단말처리</a>   
		        					<a href="#" class="easyui-linkbutton" >FDF선번보기</a>
		        					<a href="#" class="easyui-linkbutton" >케이블 삭제</a> 
		        					<a href="#" class="easyui-linkbutton" >화면적용</a>     
		        					<a href="#" class="easyui-linkbutton" >적용취소</a>     
		        					<a href="#" class="easyui-linkbutton" >모두지우기</a>  
		        					<a href="#" class="easyui-linkbutton" >서버저장</a>     
		        					<a href="#" class="easyui-linkbutton" >임대차보기</a>
		        				</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div title="접속함체 편집" id="jpManage" class="tabHeader">
				    <div class="easyui-datagrid gridJpManage" style="height:150px;"></div>
				</div>
				<div title="접속정보 목록" id="jpConnList"  class="tabHeader">
				    <div class="easyui-datagrid gridJpConnList" style="height:150px;"></div>
				</div>
				<div title="분기소자 편집" id="branchingComponentManage" class="tabHeader">
					<table class="table">
						<tbody>
							<tr>
								<th class="manageTableHeader" style="width: 2%"></th>
								<th class="manageTableHeader" style="width: 10%">접속함체</th>
								<th class="manageTableHeader" style="width: 26%">접속 케이블</th>
								<th class="manageTableHeader" style="width: 10%">선번1</th>
								<th class="manageTableHeader" style="width: 10%">선번2</th>
								<th class="manageTableHeader" style="width: 2%"></th>
								<th class="manageTableHeader" style="width: 20%">임시 연결 케이블</th>
								<th class="manageTableHeader" style="width: 10%">선번1</th>
								<th class="manageTableHeader" style="width: 10%">선번2</th>
							</tr>
							<tr>
								<td><input type="checkbox" class="chkJp1"/></td>
								<td><select class="easyui-combobox jp1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpCable1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpInput1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpOutput1" style="width: 100%" ></select></td>
								<td><input type="checkbox" class="chkTempJpCable1" /></td>
								<td><select class="easyui-combobox tempJpCable1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpTempInput1" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpTempOutput1" style="width: 100%" ></select></td>
							</tr>
							<tr>
								<td><input type="checkbox" class="chkJp2"/></td>
								<td><select class="easyui-combobox jp2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpCable2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpInput2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpOutput2" style="width: 100%" ></select></td>
								<td><input type="checkbox" class="chkTempJpCable2" /></td>
								<td><select class="easyui-combobox tempJpCable2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpTempInput2" style="width: 100%" ></select></td>
								<td><select class="easyui-combobox jpTempOutput2" style="width: 100%" ></select></td>
							</tr>
							<tr>
								<td></td>
								<th class="manageTableHeader">비고</th>
								<td colspan="7"><input  class="easyui-textbox etc" style="width:100%;"/></td>
							</tr>
							<tr>
	        					<td colspan="9">
		        					<a href="#" class="easyui-linkbutton" >단말처리</a>   
		        					<a href="#" class="easyui-linkbutton" >FDF선번보기</a>
		        					<a href="#" class="easyui-linkbutton" >케이블 삭제</a> 
		        					<a href="#" class="easyui-linkbutton" >화면적용</a>     
		        					<a href="#" class="easyui-linkbutton" >적용취소</a>     
		        					<a href="#" class="easyui-linkbutton" >모두지우기</a>  
		        					<a href="#" class="easyui-linkbutton" >서버저장</a>     
		        					<a href="#" class="easyui-linkbutton" >임대차보기</a>
		        				</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
        </div>
        <div  id="div_south" data-options="region:'south'" style="height:580px;">
			<div id="tabJpManageDetail" class="easyui-tabs"style="height:578px;">
				<div title="접속상세도(가입자망)" class="tabHeader" style="height:100%;">
   					<div   id="canvasDetailJp"  style="width:100%; height:100%; "></div>
				</div>
				<div title="함체별 링정보" class="tabHeader">
				    tab2
				</div>
				<div title="접속상세도(휘더망)"  class="tabHeader">
				        tab3
				</div>
				<div title="코어사용내역"  class="tabHeader">
				        tab3
				</div>
			</div>
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
	
	
	
    <script src="/titan/lib/draw2d/examples/code_snippets/io_json_extend/LabeledEnd.js"> </script>
	
	
	<!-- script -->
	<script type="text/javascript" src="/titan/js/jpManage/opticalFiberManage.js"></script>
	<script type="text/javascript" src="/titan/js/jpManage/branchingComponentManage.js"></script>
	<script type="text/javascript" src="/titan/js/jpManage/jpManage.js"></script>
	<script type="text/javascript" src="/titan/js/jpManage/jpConnList.js"></script>
	<script type="text/javascript" src="/titan/js/jpManage/detailJp.js"></script>
	
	<script>
		$(document).ready(function() {
			detailJpCanvas = drawCanvas.init("canvasDetailJp");
			
			opticalFiberManage.init(); 		//광코어 접속편집
			branchingComponentManage.init(); 		//분기소자 편집
			jpManage.init() //접속함체 편집
			jpConnList.init(); //접속연결정보
			detailJp.init(); //접속상세도(가입자망)
		});
	</script>
<!-- 	
<script type="text/javascript">

$(window).load(function () {

     // Create the paint area. The id in the constructor must be
     // an existing DIV 
	 //var canvas = new draw2d.Canvas("detailJp");
	

/* 
    var box = new draw2d.shape.basic.Rectangle({
		id : "box1"
		, width:1820, height:480
		, x:10, y:30
        , radius: 5
		,bgColor : {red:255, green:255, blue:255} 
	});
	box.add(new draw2d.shape.basic.Label({text:"BOX1"}), new draw2d.layout.locator.TopLocator(box));
	canvas.add(box);
	
	
	 var input = new draw2d.shape.basic.Rectangle({id : "input", width:40, height:430});
	 canvas.add( input, 40,60);
	 input.createPort("output", null, "output1");
	 input.createPort("output", null, "output2");
	 
	
	 var output = new draw2d.shape.basic.Rectangle({id : "output", width:40, height:430});
	 canvas.add( output, 1750,60);
	 output.createPort("input", null, "input1");
	 output.createPort("input", null, "input2");
	
	 */
});

</script>
	 -->
</body>
</html>