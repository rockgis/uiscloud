"use strict";

function getkRoutingSearchDetailLength (value, row, index){
	return row.fc.features.length;
} 

function getkRoutingSearchDetailLastCaMgno(value, row, index){
	return row.fc.features[row.fc.features.length - 1].caMgno;
}

function getkRoutingSearchDetailLastAddress(value, row, index){
	return row.fc.features[row.fc.features.length - 1].sido;
}

// IE 8 오류로 console 사용 금지
var bookmarkRoutingSearch = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 투자비산출기준
	byICost: $("#bookmarkRouting :radio[name='byICost']"),
	
	// 혼합구분 
	sysClf: $("#bookmarkRouting :radio[name='sysClf']"),
	
	// 망구분
	// 망구분 - SKT기간망링
	sktBbring: $("#bookmarkRouting :checkbox[name='skt_bbring']"),
	
	// 망구분 - SKT중심국링
	sktCtring: $("#bookmarkRouting :checkbox[name='skt_ctring']"),
	
	// 망구분 - SKT기지국링
	sktBsring: $("#bookmarkRouting :checkbox[name='skt_bsring']"),
	
	// 망구분 - SKT중계기P2P
	sktRfptp: $("#bookmarkRouting :checkbox[name='skt_rfptp']"),
	
	// 망구분 - SKT기타
	sktEtc: $("#bookmarkRouting :checkbox[name='skt_etc']"),
	
	// 망구분 - SKB링
	skbRing: $("#bookmarkRouting :checkbox[name='skb_ring']"),
	
	// 한전배전
	gisCode: $("#bookmarkRouting :checkbox[name='gisCode']"),
	
	// cost 산출조건
	byCost: $("#bookmarkRouting :radio[name='byCost']"),

	// BBOX 영역설정
	bufferArea: $("#bookmarkRouting :radio[name='bufferArea']"),	
	bufferAreaTxt: $("#bookmarkRouting .bufferAreaTxt"),
	
	// 접속코어수
	conCoreCount: $("#bookmarkRouting .conCoreCount"),
	
	// 신설포설단가
	newPpPrice: $("#bookmarkRouting .newPpPrice"),

	// 용량조건(% 이하)
	capacity: $("#bookmarkRouting .capacity"),
	
	// 잔여코어용량(개수 이상)
	remainCapacity: $("#bookmarkRouting .remainCapacity"),
	
	// 접속점조건(개수 이상)
	// connectingPointCount: $("#frmKRouting .connectingPointCount"),
	
	// 매설위치 구분
	ungrLoc: $("#bookmarkRouting :checkbox[name='ungrLoc']"),
	
	// 코어용량(이상)
	coreCount: $("#bookmarkRouting .coreCount"),
	
	
	
	
	
	
	
	// 엑셀 다운로드용 테이블 헤더
	columList: null,
	
	// 엑셀 다운로드용 테이블 바디
	datas: null,
	
	// 검색 결과 데이터 그리드 클릭 및 더블 클릭을 위해 원본 저장
	originalDatas: null,
	
	
	source: [],
	
	targets: [],	
	
	targetMarkers: {},	
	
	arrMarkers : [],

	kRoutFeature : [],
	
	bboxFeature : "",
	//경유 점/선
	// stopOverPoints: [],
	
	// stopOverPointMarkers: {},
	
	// stopOverLines: [],
	
	//불경우 점/선
	nonStopOverPoints: [],
	
	nonStopOverPointMarkers: {},
	
	nonStopOverLines: [],
	
	bbox: "",
	
	demandMarkersLayerIndex: 88,
	
	markersLayerIndex: 89,
	
	// 시작점 버튼
	//startPointButton: $("#frmKRouting .startPoint"),
	// 종료점 버튼
	//finishPointButton: $("#frmKRouting .finishPoint"),
	// BBOX 버튼
	bboxPointButton: $("#bookmarkRouting .bboxPoint"),
	// 분석 버튼
	analyzeButton: $("#bookmarkRouting .analyze"),
	// 엑셀업로드 버튼
	routingExcelButton: $("#bookmarkRouting .routingExcel"),
	// 경유지 점 버튼
	// stopOverPointsButton: $("#frmKRouting .stopOverPoints"),
	// 불경유지 점 버튼
	nonStopOverPointsButton: $("#bookmarkRouting .nonStopOverPoints"),
	// 경유지 선 버튼
	// stopOverLinesButton: $("#frmKRouting .stopOverLines"),
	// 불경유지 선 버튼
	nonStopOverLinesButton: $("#bookmarkRouting .nonStopOverLines"),
	// 불경유지 영역 버튼
	nonStopOverAreaButton: $("#bookmarkRouting .nonStopOverArea"),
	//다각형 지우기
	bboxClearButton : $("#frmInvestmentInfo .bboxClear"),
	// 지우기 버튼
	initPointButton: $("#bookmarkRouting .initPoint"),
	// 초기화 버튼
	initPointAllButton: $("#bookmarkRouting .initPointAll"),
	
	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		
		that.initUi();
		that.initGis();
		that.bindEvents();
	},
	
	/**********************************************************************
	설명 : 화면 Ui 작업 jeasyui (validatebox, datagrid)
	파라메터 :
	리턴값 :
	***********************************************************************/
	initUi: function() {
		var that = this;
		
		// 숫자형 체크
		that.capacity.validatebox({
			validType : ["number"],
			tipPosition : "right"
		});
		that.remainCapacity.validatebox({
			validType : ["number"],
			tipPosition : "right"
		});
//		that.connectingPointCount.validatebox({
//			validType : ["number"],
//			tipPosition : "right"
//		});
		that.coreCount.validatebox({
			validType : ["number"],
			tipPosition : "right"
		});
	},
	initGis : function() {
		var that = this;
		
		that.layer = new BiesVector("kRoutingSearch");
		map.addLayer(that.layer);
		
		var control = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Polygon, { 
			id : "kRoutingSearch"
		});
		map.addControl(control);
		
		that.layer.events.on({
			"beforefeaturesadded" : function() {
				$("#btn_pan img").trigger("click");
				that.layer.removeAllFeatures();
			},
			"featureadded" : function(evt) {
				that.selectByNonStopArea(evt.feature);
			}
		});
	},
	/**********************************************************************
	설명 : 이벤트 바인딩
	파라메터 :
	리턴값 :
	***********************************************************************/
	bindEvents: function () {
		var that = this;
		
//		// 시작점
//		that.startPointButton.click(function() {
//			that.selectStart();
//		});
//		
//		// 끝점
//		that.finishPointButton.click(function() {
//			that.selectEnd();
//		});

		// 지우기
		that.initPointButton.click(function() {
			that.selectInitPoint();
		});
		// 초기화
		that.initPointAllButton.click(function() {
			that.selectInitPointAll();
		});
		// 경유 점
//		that.stopOverPointsButton.click(function() {
//			that.selectStopOverPoints();
//		});
		// 불경유 점
		that.nonStopOverPointsButton.click(function() {
			that.selectNonStopOverPoints();
		});

		// 경유 선
//		that.stopOverLinesButton.click(function() {
//			that.selectStopOverLines();
//		});
		// 불경유 선
		that.nonStopOverLinesButton.click(function() {
			that.selectNonStopOverLines();
		});
		
		// 불경유 영역
		that.nonStopOverAreaButton.click(function() {
			if(that.startPoint == [] ) {
				$.messager.alert("알림", "상위국이 선택되지 않았습니다.");
				return;
			}
			if(gfnGetLayer("kRoutingSearch") !== null){
				gfnGetLayer("kRoutingSearch").removeAllFeatures();
				that.stopOverPoints = [];
				that.nonStopOverLines = [];
			}
			gfnActiveControl(["kRoutingSearch"]);
		});
		
		//다각형 지우기
		that.bboxClearButton.click(function() {
			
			$("#a_serGridToolbarTabsCloseAll").trigger('click');
		});
		
		// BBOX
		that.bboxPointButton.click(function() {
			that.drawBbox();
		});
		
		// 검색
		that.analyzeButton.click(function() {
			that.analyze();
		});
		
		// 엑셀 업로드
		that.routingExcelButton.click(function() {
			that.routingExcel();
		});
	},
	
	/**********************************************************************
	설명 : 검색창 리셋
	파라메터 :
	리턴값 :
	***********************************************************************/
	reset: function() {
		var that = this;

		that.capacity.val("");
		that.remainCapacity.val("");
		// that.connectingPointCount.val("");
		
		that.source = "";
		that.targets = [];
		that.targetMarkers = {};

		// that.stopOverPoints = [];
		// that.stopOverPointMarkers = {};
		// that.StopOverLines = [];
		that.nonStopOverPoints = [];
		that.nonStopOverPointMarkers = {};
		that.nonStopOverLines = [];

		//that.selectStart();
	},
	
	clearBbox: function() {
		var bbox_layer = map.getLayer("bbox_layer");
		if(bbox_layer == null) {
			bbox_layer = new BiesVector("bbox_layer");
			bbox_layer.id = "bbox_layer";
			map.addLayer(bbox_layer);
		}
		bbox_layer.removeAllFeatures();
	},
	
	turnLayersOn: function() {
		// 라우팅정보 2 개 레이어 자동 On
		var node1 = $('#ul_layer_tree').tree('find', 51);
		if(!node1.checked) {
			$('#ul_layer_tree').tree('check', node1.target);
		}
		
		var node2 = $('#ul_layer_tree').tree('find', 52);
		if(!node2.checked) {
			$('#ul_layer_tree').tree('check', node2.target);
		}
		
		// 접속함체 레이어 자동 On
		var node3 = $('#ul_layer_tree').tree('find', 9);
		if(!node3.checked) {
			$('#ul_layer_tree').tree('check', node3.target);
		}
		
		var node4 = $('#ul_layer_tree').tree('find', 10);
		if(!node4.checked) {
			$('#ul_layer_tree').tree('check', node4.target);
		}
		
		var node5 = $('#ul_layer_tree').tree('find', 12);
		if(!node5.checked) {
			$('#ul_layer_tree').tree('check', node5.target);
		}
		
		var node6 = $('#ul_layer_tree').tree('find', 13);
		if(!node6.checked) {
			$('#ul_layer_tree').tree('check', node6.target);
		}
		
		var node7 = $('#ul_layer_tree').tree('find', 14);
		if(!node7.checked) {
			$('#ul_layer_tree').tree('check', node7.target);
		}
	},
	
	turnLayersOff: function() {
		// 라우팅정보 2 개 레이어 자동 Off
		var node1 = $('#ul_layer_tree').tree('find', 51);
		$('#ul_layer_tree').tree('uncheck', node1.target);
		
		var node2 = $('#ul_layer_tree').tree('find', 52);
		$('#ul_layer_tree').tree('uncheck', node2.target);
		
		// 접속함체 레이어 자동 Off
		var node3 = $('#ul_layer_tree').tree('find', 9);
		$('#ul_layer_tree').tree('uncheck', node3.target);
		
		var node4 = $('#ul_layer_tree').tree('find', 10);
		$('#ul_layer_tree').tree('uncheck', node4.target);
		
		var node5 = $('#ul_layer_tree').tree('find', 12);
		$('#ul_layer_tree').tree('uncheck', node5.target);
		
		var node6 = $('#ul_layer_tree').tree('find', 13);
		$('#ul_layer_tree').tree('uncheck', node6.target);
		
		var node7 = $('#ul_layer_tree').tree('find', 14);
		$('#ul_layer_tree').tree('uncheck', node7.target);
		
		// routing_layer
		var layer = map.getLayer("routing_layer");
		if(layer) layer.removeAllFeatures();

		// pathLayer
		var pathLayer = map.getLayer("routing_path_layer");
		if(pathLayer) pathLayer.removeAllFeatures();
		
		// markers
		var markers = map.getLayer("Markers");
		if(markers) markers.clearMarkers();
	},
	
	/**********************************************************************
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	analyze: function() {
		var that = this;
		
		var routingCondition = that.checkSubmitData();
		
		// analyze
		if(routingCondition != null && that.source != "" && that.targets.length > 0) {
			that.calculateRouting(routingCondition);
		}		
	},
	/**********************************************************************
	설명 : 불경유 영역 선택시 영역안 데이터 가져오기
	파라메터 : feature
	리턴값 : 
	***********************************************************************/
	selectByNonStopArea: function(feature, callback){
		var that = this;

		$.ajax({
			type: "POST",
			url: "/gis/findNearestArea",
			data: {
				'params' : feature.geometry.toString()
			},
			dataType: "json",
			success : function(data) {
				var res = data.data;
				for(var a = 0;a < res.length;a++){
					if(res[a].type =='P'){
						that.nonStopOverPoints.push(res[a]);
					}else{
						that.nonStopOverLines.push(res[a]);
					}
				}
				// 이동 기능 활성화
				gfnActiveControl("pan");
				$("#btn_pan img").trigger("click");
			}
		});
	},
	
	checkSubmitData: function() {
		var that = this;

		if(that.source == "" || that.targets.length == 0) {
			$.messager.alert("알림", "상위국과 하위국을 선택하세요.");
			return;
		}
		
		// 숫자형 체크
		var validItem = null;
		
		validItem = that.capacity;		
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}
		
		validItem = that.remainCapacity;		
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}
		
//		validItem = that.connectingPointCount;		
//		if(!validItem.validatebox("isValid")) {
//			validItem.focus();
//			return;
//		}
		
		validItem = that.coreCount;		
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}
		
		var routingCondition = {
			byICost: null,
			sysClf: null,
			skBbring : null,
			sktCtring : null,
			sktBsring : null,
			sktRfptp : null,
			sktEtc : null,
			skbRing : null,
			gisCodes: null,
			byCost : null,
			conCoreCount : null,
			newPpPrice : null,
			routingCount : null,
			// orderRequired : null,
			// allowOverlap: null,
			// avoidCoring : null,
			capacity: null,
			remainCapacity: null,
			// connectingPointCount: null,
			ungrLocs: null,
			coreCount: null,
			nonStopOverPoints: null,
			nonStopOverLines: null
			// stopOverPoints: null,
			// stopOverLines: null
			// netClfs: null
		};
		
		// 투자비산출기준
		routingCondition.byICost = that.byICost.filter(":checked").val();
		
		// 혼합구분
		routingCondition.sysClf = that.sysClf.filter(":checked").val();
		
		// 망구분
		// 망구분 - SKT기간망링
		routingCondition.sktBbring = that.sktBbring.is(':checked') ? "1" : "0";
		
		// 망구분 - SKT중심국링
		routingCondition.sktCtring = that.sktCtring.is(':checked') ? "1" : "0";
		
		// 망구분 - SKT기지국링
		routingCondition.sktBsring = that.sktBsring.is(':checked') ? "1" : "0";
		
		// 망구분 - SKT중계기P2P
		routingCondition.sktRfptp = that.sktRfptp.is(':checked') ? "1" : "0";
		
		// 망구분 - SKT기타
		routingCondition.sktEtc = that.sktEtc.is(':checked') ? "1" : "0";
		
		// 망구분 - SKB링
		routingCondition.skbRing = that.skbRing.is(':checked') ? "1" : "0";
		
		// 한전배전
		var gisCodesArr = [];
		var i = 0;
		for(i = 0; i < that.gisCode.length; i++) {
			if(that.gisCode[i].checked === true) {
				gisCodesArr.push(that.gisCode[i].value);
			}
		}
		routingCondition.gisCodes = gisCodesArr.join();
		
		// cost 산출조건
		routingCondition.byCost = that.byCost.filter(":checked").val();
		
		// 접속코어수
		routingCondition.conCoreCount = that.conCoreCount.val();
		
		// 신설포설단가
		routingCondition.newPpPrice = that.newPpPrice.val();

		// 용량조건(% 이하)
		routingCondition.capacity = that.capacity.val();

		// 잔여코어용량(개수 이상)
		routingCondition.remainCapacity = that.remainCapacity.val();
		
		// 접속점조건(개수 이하)
		// routingCondition.connectingPointCount = that.connectingPointCount.val();
		
		// 매설위치 구분
		routingCondition.ungrLocs = [];
		for(i = 0; i < that.ungrLoc.length; i++) {
			if(that.ungrLoc[i].checked === true) {
				routingCondition.ungrLocs.push(that.ungrLoc[i].value);
			}
		}		
		routingCondition.ungrLocs = routingCondition.ungrLocs.join();
		
		// 코어용량(이하)
		routingCondition.coreCount = that.coreCount.val();
		
		// 망구분
//		routingCondition.netClfs = [];
//		for(var i = 0; i < that.netClf.length; i++) {
//			if(that.netClf[i].checked === true) {
//				routingCondition.netClfs.push(that.netClf[i].value);
//			}
//		}
		
		// 회피선택 - 점선택
		var nonPoints = [];
		for(var i = 0; i < that.nonStopOverPoints.length; i++) {
			var nonStopOverPoint  = that.nonStopOverPoints[i];
			nonPoints.push(nonStopOverPoint.id);
		}
		routingCondition.nonStopOverPoints = nonPoints.join();
		
		// 회피선택 - 선선택
		var nonLines = [];
		for(var i = 0; i < that.nonStopOverLines.length; i++) {
			var nonStopOverLine  = that.nonStopOverLines[i];
			nonLines.push(nonStopOverLine.id);
		}
		routingCondition.nonStopOverLines = nonLines.join();
		
		return routingCondition;
	},

	selectStart: function() {
		var that = this;

		//엑셀 다운로드용 헤더와 바디 초기화
	    that.columList = null;
	    that.datas = null;

		//$.messager.alert("알림", "시작점을 선택하세요");
		if( that.source != "") {
			$.messager.alert("알림", "상위국이 이미 선택되어 있습니다.");
			return;
		}
//		this.source = "";
//		this.targets = [];
//		this.targetMarkers = {};
//		// this.bbox = "";
//		
//		// this.stopOverPoints = [];
//		// this.stopOverPointMarkers = {};
//		// this.stopOverLines = [];
//		this.nonStopOverPoints = [];
//		this.nonStopOverPointMarkers = {};
//		this.nonStopOverLines = [];
		
		
		// routing_layer
		var layer = map.getLayer("routing_layer");
		if(layer == null) {
			layer = new BiesVector("routing_layer");
			layer.id = "routing_layer";
			map.addLayer(layer);
		}
		//layer.removeAllFeatures();
		
		// pathLayer
		var pathLayer = map.getLayer("routing_path_layer");
		if(pathLayer == null) {
			pathLayer = new BiesVector("routing_path_layer");
			pathLayer.id = "routing_path_layer";
			map.addLayer(pathLayer);
		}
		//pathLayer.removeAllFeatures();
		
		// item path layer
		var itemPathLayer = map.getLayer("routing_item_path_layer");
		if(itemPathLayer == null) {
			itemPathLayer = new BiesVector("routing_item_path_layer");
			itemPathLayer.id = "routing_item_path_layer";
			map.addLayer(itemPathLayer);
		}
		
		map.setLayerIndex(itemPathLayer, 99);
		//itemPathLayer.removeAllFeatures();
		
		// markers
		var markers = map.getLayer("Markers");
		if(markers == null) {
			markers = new OpenLayers.Layer.Markers( "Markers" );
			markers.id = "Markers";
			map.addLayer(markers);
		}
		//markers.clearMarkers();
		
		// 수요반경
		var demand_layer = map.getLayer("demand_layer");
		if(demand_layer == null) {
			demand_layer = new BiesVector("demand_layer");
			demand_layer.id = "demand_layer";
			map.addLayer(demand_layer);
		}
		//demand_layer.removeAllFeatures();

		this.selectEdge("start");
	}, 
	
	selectEnd: function() {
		//$.messager.alert("알림", "종료점을 선택하세요");
		
		this.selectEdge("end");
	}, 
	selectInitPoint: function() {
		var that = this;		

		this.selectEdge("initPoint");
	}, 
	selectInitPointAll: function() {
		var that = this;	
		var markers = map.getLayer("Markers");
		if(that.arrMarkers != null){			
			markers.clearMarkers();	
			that.source = "";
			that.targets = [];
			that.targetMarkers = {};
			that.bbox = "";
			
			// this.stopOverPoints = [];
			// this.stopOverPointMarkers = {};
			// this.stopOverLines = [];
			that.nonStopOverPoints = [];
			that.nonStopOverPointMarkers = {};
			that.nonStopOverLines = [];
		}

	}, 
//	selectStopOverPoints: function() {
//		this.selectEdge("stopOvers");
//	}, 

	selectNonStopOverPoints: function() {
		this.selectEdge("nonStopOvers");
	}, 

//	selectStopOverLines: function() {
//		this.selectEdge("stopOverLines");
//	}, 

	selectNonStopOverLines: function() {
		this.selectEdge("nonStopOverLines");
	}, 

	selectNonStopOverArea: function() {
		this.selectEdge("nonStopOverArea");
	}, 
	
	selectEdge: function(type) {
		var that = this;

		if(type != "start" && that.source == "") {
			$.messager.alert("알림", "상위국이 선택되지 않았습니다.");
			return;
		}

		//컨트롤러 초기화
		for(var i in map.controls) {
			if(map.controls[i].type != OpenLayers.Control.TYPE_TOGGLE && map.controls[i].id != "pan") {
				map.controls[i].deactivate();	
			}
		}
		
		// 경유/불경유 선 선택할 때
		if(type == "stopOverLines" || type == "nonStopOverLines") {
			//gfnActiveControl(["pan", "spatialInfo"]);
			var layer = map.getLayer("line_layer");
			if(layer == null) {
				layer = new BiesVector("line_layer");
				layer.id = "line_layer";
				map.addLayer(layer);
			}
			layer.events.remove("beforefeaturesadded");
			layer.events.remove("featureadded");
			
			layer.removeAllFeatures();

			var stop_over_lines_selectors = map.getControlsBy("id", "stop_over_lines_selector");
			var stop_over_lines_selector;
			if(stop_over_lines_selectors.length > 0) {
				stop_over_lines_selector = stop_over_lines_selectors[0];
			} else {
				stop_over_lines_selector = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Point, { id : "stop_over_lines_selector" });
				map.addControl(stop_over_lines_selector);
			}
			layer.events.on({
				"featureadded" : function(evt) {
					var feature = evt.feature;
					
					layer.removeFeatures([feature]);
					
					that.findNearestLine(evt.feature, type);
				}
			});
			
			//컨트롤 활성화
			stop_over_lines_selector.activate();
			
		} else {
			var layer = map.getLayer("routing_layer");
			if(layer == null) {
				layer = new BiesVector("routing_layer");
				layer.id = "routing_layer";
				map.addLayer(layer);
			}
			layer.events.remove("beforefeaturesadded");
			layer.events.remove("featureadded");
	
			layer.events.on({
				"beforefeaturesadded" : function() {
					if(type == "start") {
						layer.removeAllFeatures();
					}
				},
				"featureadded" : function(evt) {
					var feature = evt.feature;
					
					layer.removeFeatures([feature]);
					
					that.findNearestEdge(feature, type);
				}
			});
			
			var routing_selectors = map.getControlsBy("id", "routing_selector");
			var routing_selector;
			if(routing_selectors.length > 0) {
				routing_selector = routing_selectors[0];
			} else {
				routing_selector = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Point, { id : "routing_selector" });
				map.addControl(routing_selector);
			}
			
			routing_selector.activate();
		}
	},
	
	findNearestEdge: function(feature, type) {
		var that = this;
		
		$.ajax({
			type: "POST",
			url: "/gis/findNearestEdge",
			data: {
				  'x': feature.geometry.x,
				  'y': feature.geometry.y
			},
			dataType: "json",
			success : function(data) {
				//console.log(data);

				var id = data.id;
				var x = data.x;
				var y = data.y;
				
				if(x == 0.0 && y == 0.0) {
					if(type == "start") {
						$.messager.alert("알림", "상위국을 찾지못했습니다.");
					} else if (type == "end"){
						$.messager.alert("알림", "하위국을 찾지못했습니다.");
					}else if (type == "stopOvers"){
						$.messager.alert("알림", "경유점을 찾지못했습니다.");
					}else if (type == "nonStopOvers"){
						$.messager.alert("알림", "불경유점을 찾지못했습니다.");
					}
					return;
				}

				
				var markers = map.getLayer("Markers");
				
				// 마커 레이어를 젤 위로 올린다.
				map.raiseLayer(markers, map.layers.length);

				// nonStopOvers
				if (type == "nonStopOvers") {
					// 기존에 있는 것은 다시 활성화 시킨다.
					var removed = false;
					for(var i = 0; i < that.nonStopOverPoints.length; i++) {
						var nonStopOverPoint  = that.nonStopOverPoints[i];
						if(id == nonStopOverPoint.id) {
							markers.removeMarker(nonStopOverPoint);
							that.nonStopOverPoints.splice(i, 1);
							removed = true;
							break;
						}
					}

					if(removed) {
						return;
					}

				} else if (type == "stopOvers") {
					// 기존에 있는 것은 다시 활성화 시킨다.
					/*
					var removed = false;
					for(var i = 0; i < that.stopOverPoints.length; i++) {
						var stopOverPoint  = that.stopOverPoints[i];
						if(id == stopOverPoint.id) {
							markers.removeMarker(stopOverPoint);
							that.stopOverPoints.splice(i, 1);
							removed = true;
							break;
						}
					}

					if(removed) {
						return;
					}
					*/
				}

				// add markers
				var url = "http://uiscloud.iptime.org:8180/geoserver";
				
				var icon = url + "/www/symbol/red_b.png";
				if(type == "start") {
					that.source = id;
					icon = url + "/www/symbol/red_b.png";
				} else if (type == "end"){
					that.targets.push(id);
					icon = url + "/www/symbol/blue_b.png";
				}else if (type == "stopOvers"){
					icon = url + "/www/symbol/o.png";
				}else if (type == "nonStopOvers"){
					icon = url + "/www/symbol/x.png";
				}

				if (type == "nonStopOvers") {
					var size = new OpenLayers.Size(20, 20);
					//var offset = new OpenLayers.Pixel(-(size.w/2) + 9, -size.h + 2);
					
					icon = new OpenLayers.Icon(icon, size);
					var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
					marker.id = id;
					markers.addMarker(marker);
					that.arrMarkers.push(marker);
					that.nonStopOverPoints.push(marker);
					
				} else if (type == "stopOvers") {
					/*
					var size = new OpenLayers.Size(20, 20);
					//var offset = new OpenLayers.Pixel(-(size.w/2) + 9, -size.h + 2);
					
					icon = new OpenLayers.Icon(icon, size);
					var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
					marker.id = id;
					markers.addMarker(marker);
					
					that.stopOverPoints.push(marker);
					*/
					
				} else if (type == "initPoint") {
					if(that.arrMarkers != null){	
						
						for(var i in that.arrMarkers){
							if(that.arrMarkers[i].id == id){					    
								markers.removeMarker(that.arrMarkers[i]);
								if(that.source == id){
									that.source = '';
								}
								for(var a in that.targets){
									if(that.targets[a] == id){
										that.targets.splice( a, 1);
									}
								}
							}
						}
					}
					
				} else {
					var size = new OpenLayers.Size(50, 45);
					var offset = new OpenLayers.Pixel(-(size.w/2) + 9, -size.h + 2);
					
					icon = new OpenLayers.Icon(icon, size, offset);
					var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
					marker.id = id;
					markers.addMarker(marker);
					that.arrMarkers.push(marker);
				}
				
				// 종료점은 분석 후 경로를 못 찾은 경우 아이콘을 바꾸기 위해서 저장한다.
				if(type == "end") {
					that.targetMarkers[id] = marker;
				}

				// 이동 기능 활성화
				for(var i in map.controls) {
					if(map.controls[i].type != OpenLayers.Control.TYPE_TOGGLE && !(map.controls[i].id == "pan" || ((type == "end" || type == "stopOvers" || type == "nonStopOvers") && map.controls[i].id == "routing_selector"))) {
						map.controls[i].deactivate();
					}
				}

				if(type == "start") {
					$("#btn_pan img").trigger("click");
				}
			}
		});
	},
	
	findNearestLine: function(feature, type) {
		var that = this;
		
		$.ajax({
			type: "POST",
			url: "/gis/findNearestLine",
			data: {
				  'x': feature.geometry.x,
				  'y': feature.geometry.y
			},
			dataType: "json",
			success : function(data) {
				// console.log(data);

				var gid = data.gid;
				var wkt = data.wkt;

				// nonStopOverLinesLayer
				
				// console.log("type : " + type);
				
				if(type == "nonStopOverLines") {
					var nonStopOverLinesLayer = map.getLayer("non_stop_over_lines_layer");
					if(nonStopOverLinesLayer == null) {
						nonStopOverLinesLayer = new BiesVector("non_stop_over_lines_layer");
						nonStopOverLinesLayer.id = "non_stop_over_lines_layer";
						map.addLayer(nonStopOverLinesLayer);
					}
					
					// 불경유 라인 레이어를 젤 위로 올린다.
					map.raiseLayer(nonStopOverLinesLayer, map.layers.length);
					
					// 기존에 있는 것은 다시 활성화 시킨다.
					for(var i = 0; i < that.nonStopOverLines.length; i++) {
						var nonStopOverLine  = that.nonStopOverLines[i];
						if(gid == nonStopOverLine.id) {
							nonStopOverLinesLayer.removeFeatures([nonStopOverLine]);
							that.nonStopOverLines.splice(i, 1);
							return;
						}
					}
	
					// draw new nonStopOverLine
					var wktReader = new jsts.io.WKTReader();
					var f = wktReader.read(wkt);
					
					var parser = new jsts.io.OpenLayersParser();
				    var feature = parser.write(f);
	
					var nonStopOverLine = new OpenLayers.Feature.Vector(feature, null, { strokeColor: '#F2F2F2', strokeWidth : 5});
					nonStopOverLine.id = gid;
					nonStopOverLinesLayer.addFeatures([nonStopOverLine]);
					
					that.nonStopOverLines.push(nonStopOverLine);


					// console.dir(that.nonStopOverLines);
					
				} else if(type == "stopOverLines") {
					var stopOverLinesLayer = map.getLayer("stop_over_lines_layer");
					if(stopOverLinesLayer == null) {
						stopOverLinesLayer = new BiesVector("stop_over_lines_layer");
						stopOverLinesLayer.id = "stop_over_lines_layer";
						map.addLayer(stopOverLinesLayer);
					}
					
					// 경유 라인 레이어를 젤 위로 올린다.
					map.raiseLayer(stopOverLinesLayer, map.layers.length);
					
					// 기존에 있는 것은 다시 활성화 시킨다.
					for(var i = 0; i < that.stopOverLines.length; i++) {
						var stopOverLine  = that.stopOverLines[i];
						if(gid == stopOverLine.id) {
							stopOverLinesLayer.removeFeatures([stopOverLine]);
							that.stopOverLines.splice(i, 1);
							return;
						}
					}
	
					// draw new stopOverLine
					var wktReader = new jsts.io.WKTReader();
					var f = wktReader.read(wkt);
					
					var parser = new jsts.io.OpenLayersParser();
				    var feature = parser.write(f);
	
					var stopOverLine = new OpenLayers.Feature.Vector(feature, null, { strokeColor: '#DA00FF', strokeWidth : 5});
					stopOverLine.id = gid;
					stopOverLinesLayer.addFeatures([stopOverLine]);
					
					that.stopOverLines.push(stopOverLine);
					

					// console.dir(that.stopOverLines);
				}
					
			}
		});
	},

	drawBbox: function() {
		var that = this;

		// deactivate bbox_selector
		var bbox_selector;
		var bbox_selectors = map.getControlsBy("id", "bbbox_selector");
		if (bbox_selectors.length > 0) {
			bbox_selector = bbox_selectors[0];
			bbox_selector.deactivate();
		}

		
		// init bbox layer
		var bbox_layer = map.getLayer("bbox_layer");
		if(bbox_layer == null) {
			bbox_layer = new BiesVector("bbox_layer");
			bbox_layer.id = "bbox_layer";
			map.addLayer(bbox_layer);
		}
		
		bbox_layer.removeAllFeatures();
		that.bbox = "";
		
		// bbox 레이어를 젤 위로 올린다.
		map.raiseLayer(bbox_layer, map.layers.length);

		// check buffer area
		var bufferArea = 0;
		
	    bufferArea = that.bufferArea.filter(":checked").val();
	    bufferArea = parseInt(bufferArea);
	    if(bufferArea == 4) {
	    	bufferArea = that.bufferAreaTxt.val();
	    	if(bufferArea == "" || bufferArea.trim().length == 0) {
	    		$.messager.alert("알림", "검색영역을 입력하세요.");
	        	that.bufferAreaTxt.val("");
	        	that.bufferAreaTxt.focus();
	    		return;
	    	}
	    	
	    	// validate char
	        if (isNaN(bufferArea)) {
	        	$.messager.alert("알림", "영역은 숫자만 입력가능합니다.");
	        	that.bufferAreaTxt.val("");
	        	that.bufferAreaTxt.focus();
	    		return;
	        }
	    	
	        bufferArea = parseInt(bufferArea) || 0;
	    }

	    // bbox selector를 제거한다.
		var bbox_selectors = map.getControlsBy("id", "kbbox_selector");
		if(bbox_selectors.length > 0) {
			bbox_selector = bbox_selectors[0];
			for(var idx = 0; idx < bbox_selectors.length; idx++) {
				map.removeControl(bbox_selectors[idx]);
			}
		}
		
		var polyOptions = {sides: 4, angle: 0, irregular: true};
		bbox_selector = new OpenLayers.Control.DrawFeature(bbox_layer, OpenLayers.Handler.RegularPolygon, { handlerOptions: polyOptions, id : "kbbox_selector" });
		bbox_selector.events.register("featureadded", ' ' , function(evt) {
			var feature = evt.feature;
			
			var reader = new jsts.io.WKTReader();
		    var input = reader.read(feature.geometry.toString());

		    var buffer = input.buffer(bufferArea * 1000);
		    buffer = buffer.getEnvelope();
		    
		    var parser = new jsts.io.OpenLayersParser();
		    buffer = parser.write(buffer);
		    
		    var feature1 = new OpenLayers.Feature.Vector(buffer, null, { fillColor: '#ffff00', fillOpacity: 0, strokeColor: '#ffff00'});
		    that.bboxFeature = [feature1];
		    bbox_layer.addFeatures([feature1]);

		    that.bbox = buffer.toString();
		    
		    bbox_selector.deactivate();

		    
		});
		map.addControl(bbox_selector);
		
		bbox_selector.activate();
	},
	
	calculateRouting: function(routingCondition) {		
		var that = this;

		//console.log("source : " + this.source);
		//console.log("endPoint : " + this.endPoint);
		var featuresKrouting =[];
		// routing_layer
		var layer = map.getLayer("routing_layer");
		if(layer == null) {
			layer = new BiesVector("routing_layer");
			layer.id = "routing_layer";
			map.addLayer(layer);
		}
		layer.removeAllFeatures();
		
		// routing_layer 레이어를 젤 위로 올린다.
		map.raiseLayer(layer, map.layers.length);
		
		// pathLayer
		var pathLayer = map.getLayer("routing_path_layer");
		if(pathLayer == null) {
			pathLayer = new BiesVector("routing_path_layer");
			pathLayer.id = "routing_path_layer";
			map.addLayer(pathLayer);
		}
		pathLayer.removeAllFeatures();
		
		// item path layer
		var itemPathLayer = map.getLayer("routing_item_path_layer");
		if(itemPathLayer == null) {
			itemPathLayer = new BiesVector("routing_item_path_layer");
			itemPathLayer.id = "routing_item_path_layer";
			map.addLayer(itemPathLayer);
		}
		
		map.setLayerIndex(itemPathLayer, 99);
		itemPathLayer.removeAllFeatures();

		// deactivate routing_selector
		var routing_selectors = map.getControlsBy("id", "routing_selector");
		var routing_selector;
		if(routing_selectors.length > 0) {
			routing_selector = routing_selectors[0];
			routing_selector.deactivate();
		}
		
		// change pan image
		$("#btn_pan img").trigger("click");

//		var gridId = "";
		
		var layer = map.getLayer("routing_layer");
		layer.events.remove("beforefeaturesadded");
		layer.events.remove("featureadded");
		
		$.ajax({
			type: "POST",
			url: "/gis/bookmarkrouting",
			data: {
				  'source': that.source.join(),
				  'targets': that.targets.join(),
				  'nonStopOverPoints': routingCondition.nonStopOverPoints,
				  'nonStopOverLines': routingCondition.nonStopOverLines,
				  'byICost' : routingCondition.byICost,
				  'sysClf': routingCondition.sysClf,
				  'sktBbring' : routingCondition.sktBbring,
				  'sktCtring' : routingCondition.sktCtring,
				  'sktBsring' : routingCondition.sktBsring,
				  'sktRfptp' : routingCondition.sktRfptp,
				  'sktEtc' : routingCondition.sktEtc,
				  'skbRing' : routingCondition.skbRing,
				  'gisCodes': routingCondition.gisCodes,
				  'byCost' : routingCondition.byCost,
				  'conCoreCount' : routingCondition.conCoreCount,
				  'newPpPrice' : routingCondition.newPpPrice,
				  'bbox': that.bbox,

				  // 'stopOverPoints': that.stopOverPoints.join(),
				  // 'stopOverLines': that.stopOverLines.join(),
				  'capacity': routingCondition.capacity,
				  'remainCapacity': routingCondition.remainCapacity,
				  // 'connectingPointCount': routingCondition.connectingPointCount,
				  'ungrLocs': routingCondition.ungrLocs,
				  'coreCount': routingCondition.coreCount
				  // 'netClfs': routingCondition.netClfs,
			},
			dataType: "json",
			success : function(data) {
				var layer = map.getLayer("routing_layer");

				// style
				var style = new OpenLayers.Style({
					pointRadius: 6,
					graphicName: "circle",
			        fillColor: "#008000",
			        fillOpacity: 0.5,
			        strokeColor: "\${strokeColor}",
			        strokeOpacity: 1,
			        strokeWidth: 3,
			        strokeDashstyle : "\${strokeDashstyle}",
			        strokeLineCap : "butt"
			    });
				var styleMap = new OpenLayers.StyleMap(style);
				layer.styleMap = styleMap;
				
				// add features
				var geojson_format = new OpenLayers.Format.GeoJSON({
	                'internalProjection': map.baseLayer.projection,
	                'externalProjection': map.baseLayer.projection
	            });

				// var tmp = "{\"results\":[{\"seq\":1,\"target\":\"863546\",\"fc\":{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"id\":2053548,\"seq\":1,\"caMgno\":\"30230CA006348\",\"sysClf\":\"SK\",\"coreCnt\":\"1\",\"compLen\":\"70\",\"ungrLoc\":\"가공\",\"useCoreC\":\"1\",\"useCoreP\":\"100%\",\"sido\":\"대전광역시 대덕구 오정동\",\"geometry\":{\"type\":\"MultiLineString\",\"coordinates\":[[[238085.959418993,317252.922504152],[238097.021521035,317248.891711963],[238106.194569111,317258.733646241]]]}}]}},{\"seq\":2,\"target\":\"866507\",\"fc\":{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"id\":2066878,\"seq\":1,\"caMgno\":\"30230CA002701\",\"sysClf\":\"SK\",\"coreCnt\":\"12\",\"compLen\":\"108\",\"ungrLoc\":\"가공\",\"useCoreC\":\"1\",\"useCoreP\":\"8%\",\"sido\":\"대전광역시 대덕구 오정동\",\"geometry\":{\"type\":\"MultiLineString\",\"coordinates\":[[[238106.194569111,317258.733646241],[238103.389860167,317253.682653548],[238101.426563906,317248.871708032]]]}}]}}],\"notfounds\":[]}";
				// data = $.parseJSON(tmp);
				
				// 경로를 그린다.
				var results = data.results;
				var targetLength = results.length;
				
				var featuresByTarget = new Array();
				var i = 0;
				var j = 0;
				var k = 0;
				var len = 0;
				var jLen = 0;
				var featuresSld =[];
				
				for(i = 0; i < targetLength; i++) {
					var route = results[i];
					var fc = route.fc;
					var features = geojson_format.read(fc);

					for(j=0, len=features.length; j < len; j++) {
						for(k=0, jLen=fc.features.length; k < jLen; k++) {
							if(features[j].fid == fc.features[k].id) {
								if(!dynamicSld.showSld.is(":checked")){
								var strokeColor = "#ff0000";
								var fillColor = "#ff0000";
								var strokeDashstyle = "solid";
								//console.log(fc.features[k])
								if(fc.features[k].gisCode == "CA005") {
									fillColor = "#0134ac";
									strokeColor = "#0134ac";
								}
								else if(fc.features[k].gisCode == "CA006") {
//									strokeDashstyle = "dash";
//									fillColor = "#0033ad";
//									strokeColor = "#0033ad";
									fillColor = "#002266";
									strokeColor = "#002266";
								}
								else if(fc.features[k].gisCode == "CA007") {
									fillColor = "#4781b9";
									strokeColor = "#4781b9";
								}
								else if(fc.features[k].gisCode == "CA001") {
									fillColor = "#e24900";
									strokeColor = "#e24900";
								}
								else if(fc.features[k].gisCode == "CA002") {
//									strokeDashstyle = "dash";
//									fillColor = "#ff3300";
//									strokeColor = "#ff3300";
									fillColor = "#980000";
									strokeColor = "#980000";
								}
								else if(fc.features[k].gisCode == "CA003") {
									fillColor = "#ff68ff";
									strokeColor = "#ff68ff";
								}
								else if(fc.features[k].gisCode == "CN002") {
									fillColor = "#000000";
									strokeColor = "#000000";
								}
								
								// SKT - 굵은 주황색 계열
								// SKB - 굵은 청색 계열
								if(that.sysClf == "BOTH") {
									if(fc.features[k].sysClf == "SK") {
										fillColor = "#ff7f00";
										strokeColor = "#ff7f00";
									} else if(fc.features[k].sysClf == "HT") {
										fillColor = "#0000ff";
										strokeColor = "#0000ff";
									}
								}
								
								features[j].attributes = {
									fillColor : fillColor,
									strokeColor : strokeColor,
									strokeDashstyle : strokeDashstyle
								}
								//break;
							} else{
								
								var feature = features[j];								
								var attrs = feature.attributes;				
								var ungrLoc = fc.features[k]["ungrLoc"];
									if(ungrLoc == "지중") {							
									attrs.isUngr = true;											
									}							
								featuresSld.push(feature);						
								}						
													
							break;
							}							
						}      			     			

						that.kRoutFeature.push(features[j]);
					}
					
					// marker icon
//					var marker = that.targetMarkers[route.target];
//					
//					var icon = marker.icon;
//					var size = icon.size;
//					icon.offset = new OpenLayers.Pixel(-(size.w/2), -size.h + 2);
//
//					var url = "http://uiscloud.iptime.org:8180/geoserver";
//					var icon = url + "/www/symbol/blue_b.png";
//					marker.setUrl(icon);
//					
//					layer.addFeatures(features);
//					layer.redraw();					
					// save features
					featuresByTarget[route.target] = features;
					//tabObj[index].push(featuresByTarget[route.target]);
					
				}

				// 경로를 못 찾은 것들을 처리한다.
				var notfounds = data.notfounds;
				console.log(notfounds)
				var notfoundsLength = notfounds.length;
				for(var i = 0; i < notfoundsLength; i++) {
					var target = notfounds[i];
					var marker = that.targetMarkers[target];
					
					var icon = marker.icon;
					var size = icon.size;
					icon.offset = new OpenLayers.Pixel(-(size.w/2), -size.h + 2);

					var url = "http://uiscloud.iptime.org:8180/geoserver";
					var icon = url + "/www/symbol/notfound.png";
					marker.setUrl(icon);
					that.arrMarkers.push(marker);
				}
				
				var onclickRow = function(obj, rowIndex) {
					var layer = map.getLayer("routing_layer");
					layer.redraw();
					layer.redraw(true);
	        		
					// var getRowValue = $(obj).datagrid("getSelected");
					var getRowValue = that.originalDatas[rowIndex];

					// clear routing_item_path_layer
					var itemPathLayer = map.getLayer("routing_item_path_layer");
					if(itemPathLayer == null) {
						itemPathLayer = new BiesVector("routing_item_path_layer");
						itemPathLayer.id = "routing_item_path_layer";
						map.addLayer(itemPathLayer);
					}
					
					map.setLayerIndex(itemPathLayer, 99);
					itemPathLayer.removeAllFeatures();

	        		// find fearureCollections by target
	        		var selectedTarget = getRowValue.target;
					for(var i = 0; i < targetLength; i++) {
						var route = results[i];
						if(route.target == selectedTarget) {
							
							// check pathLayer
							var pathLayer = map.getLayer("routing_path_layer");
			        		if(pathLayer == null) {
			        			pathLayer = new BiesVector("routing_path_layer");
			        			pathLayer.id = "routing_path_layer";
			        			map.addLayer(pathLayer);
			        		}
			        		pathLayer.removeAllFeatures();

							// style
							var style = new OpenLayers.Style({
						        strokeColor: "#FFFF00",
						        strokeWidth: 4
						    });
							var styleMap = new OpenLayers.StyleMap(style);
							pathLayer.styleMap = styleMap;
							
							var geojson_format = new OpenLayers.Format.GeoJSON({
				                'internalProjection': map.baseLayer.projection,
				                'externalProjection': map.baseLayer.projection
				            });
	
							// add features
							var features = [];
							for(var j=0; j < featuresByTarget[selectedTarget].length; j++) {
								
								features.push(featuresByTarget[selectedTarget][j].clone());									
								that.kRoutFeature.push(features[j]);
							}
							//var features = featuresByTarget[selectedTarget];
							pathLayer.addFeatures(features);							
							
							// pathLayer를 젤 위로 올린다.
							map.raiseLayer(pathLayer, map.layers.length);
							
							break;
						}				

					}
					
	        	};
	        					
				var ondblClickRow = function(obj, rowIndex) { 	
					// 팝업창으로 K-다익스트라 세부 경로 보여주기
					var winDetailPath = window.open("", "winDetailPath", "scrollbars=no,toolbar=no,resizable=no,width=950,height=700,left=100,top=100");
					winDetailPath.focus();
					
					var getRowValue = that.originalDatas[rowIndex];
					
					$("#hid_detail").val(JSON.stringify(getRowValue.fc.features));
					$("#frm_detailPath").attr("action", "/gis/krouting/detailPath");
//					$("#frm_detailPath").attr("target", "winDetailPath");
					$("#frm_detailPath").submit();	        		
	        	};	        	
				
				// grid
				var id = "routingInfo";
				var title = "기설선번순번";
				var gridId ="";
//				gridId = that.addDatagridTab(id, title, true, data.features, function(obj, rowData){
				gridId = that.addDatagridTab(id, title, true, results, onclickRow, ondblClickRow);
				if(dynamicSld.showSld.is(":checked")){
					dynamicSld.showFeatures(featuresSld, gridId);	
					if(that.bboxFeature != ""){
						tabObj[gridId].push(that.bboxFeature);
					}
					if(that.nonStopOverLines.length > 0){
						for(var r=0; r < that.nonStopOverLines.length;r++){
							tabObj[gridId].push(that.nonStopOverLines[r]);
						}				
					}
//					if(that.stopOverLines.length > 0){
//						for(var t=0; t < that.stopOverLines.length;t++){
//							tabObj[gridId].push(that.stopOverLines[r]);
//						}	
//					}
				}else{
					if(tabObj[gridId]){
						tabObj[gridId].push(that.kRoutFeature);
					}else{
						tabObj[gridId] = that.kRoutFeature;
					}
					if(that.bboxFeature != ""){
						tabObj[gridId].push(that.bboxFeature);
					}
					if(that.nonStopOverLines.length > 0){
						for(var r=0; r < that.nonStopOverLines.length;r++){
							tabObj[gridId].push(that.nonStopOverLines[r]);
						}				
					}
//					if(that.stopOverLines.length > 0){
//						for(var t=0; t < that.stopOverLines.length;t++){
//							tabObj[gridId].push(that.stopOverLines[r]);
//						}	
//					}
				}
			}
		});
	},

	/**********************************************************************
	설명: 그리드에 Tab 추가하기
		id는 새로 부여되어 리턴되고, 타이틀도 순번이 뒤에 붙어서 나오게 된다.
	파라미터:
		id 부여할 아이디. 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
		title 탭에 표시할 타이틀. 이것도 중복을 피하기 위해 뒤에 일련번호가 붙여져서 처리됨.
		singleSelect 그리드 내에 row 다중클릭/단건클릭여부 체크
		onclickRow 그리드내에 row를 클릭할때 마다 callback으로 function을 받아 처리
	리터값: 새로 부여된 아이디
	***********************************************************************/	
	addDatagridTab: function (id, title, singleSelect, datas, onclickRow, ondblClickRow) {
		var that = this;
		
		var i = null;
		var k = null;
		
		var newDatas = [];
		var summary = null;
		var cableCount = 0;
		
		var routes = null;
		var route = null;
		
	    var totalLengthForSKT = 0; // T 총길이
	    var totalLengthForSKB = 0; // B 총길이
	    var totalLengthForKE = 0; // 신설(한전) 총길이
	    
	    var totalUserCoreCountForSKT = 0; // T 사용코어수 합
	    var totalUserCoreCountForSKB = 0; // B 사용코어수 합
	    
	    var cableCountForSKT = 0; // T 케이블수
	    var cableCountForSKB = 0; // B 케이블수
	    
	    var cableCostSumForSKT = 0; // T 케이블 cost필드의 합
	    var cableCostSumForSKB = 0; // B 케이블 cost필드의 합
	    
	    var investmentCost = 0; // 투자비
	    var rentCost = 0; // 임차비
	    
	    var totalInvestmentCost = 0; // 투자비 총합
	    var totalRentCost = 0; // 임차비 총합
	    
	    var remandCoreMin = Number.POSITIVE_INFINITY; //잔여코어 최소량
	    var useCoreRateMax = Number.NEGATIVE_INFINITY; // 코어사용률 최대량

		if(datas.length == 0){
			$.messager.alert("알림", "검색결과가 없습니다.");
			return false;
		}
		
		// 검색 결과 데이터 그리드 클릭 및 더블 클릭을 위해 원본 저장
		that.originalDatas = datas;		
		
		var distinctCableCount = 0;
		var distinctTotalLengthForSKT = 0;
		var distinctTotalLengthForSKB = 0;
		var distinctTotalLengthForKE = 0;
		
		var sumTotalLengthForSKB = 0; // 각 경로 안에 중복을 포함한 B 총 길이의 합
		
	    var stdCostX = 0;
	    var stdCostY = 0;
	    
		var sktCableInfos = {};
		var skbCableInfos = {};
		var keCableInfos = {};
		
		for (i = 0; i < datas.length; i++) {
			routes = datas[i];
			
		    totalLengthForSKT = 0; // T 총길이
		    totalLengthForSKB = 0; // B 총길이
		    totalLengthForKE = 0; // 신설(한전) 총길이
		    
		    totalUserCoreCountForSKT = 0; // T 사용코어수 합
		    totalUserCoreCountForSKB = 0; // B 사용코어수 합
		    
		    cableCountForSKT = 0; // T 케이블수
		    cableCountForSKB = 0; // B 케이블수
		    
		    cableCostSumForSKT = 0; // T 케이블 cost필드의 합
		    cableCostSumForSKB = 0; // B 케이블 cost필드의 합
		    
		    investmentCost = 0; // 투자비
		    rentCost = 0; // 임차비
		    		    
		    remandCoreMin = Number.POSITIVE_INFINITY; // 잔여코어 최소량
		    useCoreRateMax = Number.NEGATIVE_INFINITY; // 코어사용률 최대량
		    
		    stdCostX = 0;
		    stdCostY = 0;
		    
			for (k = 0; k < routes.fc.features.length; k++) {
				route = routes.fc.features[k];
				
				if(route["sysClf"] === "KE") {
		    		// 신설(한전) 총길이
		    		totalLengthForKE += route["compLen"]? Number(route["compLen"]): 0;
		    		
	    			keCableInfos[route["caMgno"]] = Number(route["compLen"]);
		    	} else {				
			    	if(route["sysClf"] === "SK") {
			    		// T 총길이
			    		totalLengthForSKT += route["compLen"]? Number(route["compLen"]): 0;
			    	    // T 사용코어수 합
			    	    totalUserCoreCountForSKT += route["useCoreC"]? Number(route["useCoreC"]): 0;
			    		// T 케이블수
			    		cableCountForSKT++;
			    		
			    		cableCostSumForSKT += route["cost"]? Number(route["cost"]): 0;
			    		//stdCostX = route["cost"]? Number(route["cost"]): 0;
			    		//stdCostY = route["costb"]? Number(route["costb"]): 0;
			    		//cableCostSumForSKT += stdCostX * stdCostY;
			    		
		    			sktCableInfos[route["caMgno"]] = Number(route["compLen"]);
			    	} else if(route["sysClf"] === "HT") {
			    		// B 총길이
			    		totalLengthForSKB += route["compLen"]? Number(route["compLen"]): 0;
			    	    // B 사용코어수 합
			    	    totalUserCoreCountForSKB += route["useCoreC"]? Number(route["useCoreC"]): 0;			    		
			    		// B 케이블수
			    		cableCountForSKB++;
			    		
			    		cableCostSumForSKB += route["cost"]? Number(route["cost"]): 0;
			    		//stdCostX = route["cost"]? Number(route["cost"]): 0;
			    		//stdCostY = route["costb"]? Number(route["costb"]): 0;
			    		//cableCostSumForSKB += stdCostX * stdCostY;
			    		
			    		sumTotalLengthForSKB += route["compLen"]? Number(route["compLen"]): 0;

			    		skbCableInfos[route["caMgno"]] = Number(route["compLen"]);
			    	}  
		    	
			    	// 잔여코어 최소량
			    	if(remandCoreMin > (route["coreCnt"] - route["useCoreC"])) {
			    		remandCoreMin = route["coreCnt"] - route["useCoreC"];
			    	}
		    	}
		    	
		    	// 코어사용률 최대량
		    	if(useCoreRateMax < Math.ceil(route["useCoreC"] / route["coreCnt"] * 100)) {
		    		useCoreRateMax = Math.ceil(route["useCoreC"] / route["coreCnt"] * 100);
		    	}
			}
		    
		    if(that.byICost.filter(":checked").val() == "SKT") {
			    // 투자비 계산: SKT 투자비
			    //investmentCost = unitPrice.calculateInvestmentForSKT(that.conCoreCount.val(), cableCountForSKT, totalLengthForKE);
			    investmentCost = unitPrice.calculateInvestmentForSKT(cableCountForSKT, that.conCoreCount.val(), cableCostSumForSKT, totalLengthForKE); 
			    
			    // 임차비 계산: SKT 임차비
			    rentCost = unitPrice.calculateRentForSKT(totalLengthForSKB, that.conCoreCount.val());
		    } else if(that.byICost.filter(":checked").val() == "SKB") {
			    // 투자비 계산: SKB 투자비
			    //investmentCost = unitPrice.calculateInvestmentForSKB(that.conCoreCount.val(), cableCountForSKB, totalLengthForKE);
			    investmentCost = unitPrice.calculateInvestmentForSKB(cableCountForSKB, that.conCoreCount.val(), cableCostSumForSKB, totalLengthForKE);  
			    
			    // 임차비 계산: SKB 임차비
			    rentCost = unitPrice.calculateRentForSKB(totalLengthForSKT, that.conCoreCount.val());
		    }
		    
		    totalInvestmentCost += investmentCost; // 투자비 총합
		    totalRentCost += rentCost; // 임차비 총합
			
			cableCount = routes.fc.features.length;
			
			summary = {};
			// 순번
			summary.seq = routes.seq;
			// taget id
			summary.target = routes.target;
			// 하나의 경로에 포함된 케이블 수
			summary.cableCount = cableCount; 
		    // T 총길이
    		summary.totalLengthForSKT = gfnFormatNumber(totalLengthForSKT);
    		// B 총길이
    		summary.totalLengthForSKB = gfnFormatNumber(totalLengthForSKB);
			// 신설(KE) 총길이
			summary.totalLengthForKE = gfnFormatNumber(totalLengthForKE);
			// 투자비
			summary.investmentCost = gfnFormatNumber(investmentCost);
			// 임차비
			summary.rentCost = gfnFormatNumber(rentCost);
			// 잔여코어 최소량
			summary.remandCoreMin = remandCoreMin;
			// 코어사용률 최대량
			summary.useCoreRateMax = useCoreRateMax + " %";
			// 상위국 주소
			summary.sourceAddress = routes.fc.features[0].sido;
			// 도착지 주소
			summary.targetAddress = routes.fc.features[cableCount - 1].sido; 
			// 도착지 시설관리고유번호
			summary.targetCaMgno = routes.fc.features[cableCount - 1].caMgno; 
			// 도착지 시설관리고유번호
			summary.targetCaMgnoUnqMgno = routes.fc.features[cableCount - 1].caMgno + "/" + routes.fc.features[cableCount - 1].unqMgno; 
			
			newDatas.push(summary);
		}
		
		var key = null;
		var distinctCableCnt = 0;
		var distinctCableCountForSKT = 0;
		var distinctTotalLengthForSKT = 0;
		var distinctTotalLengthForSKB = 0;
		var distinctTotalLengthForKE = 0;
		
		for(key in sktCableInfos) {
			if(sktCableInfos.hasOwnProperty(key)) {
				distinctCableCnt++;
				distinctCableCountForSKT++;
				distinctTotalLengthForSKT += sktCableInfos[key];
			}
		}

		for(key in skbCableInfos) {
			if(skbCableInfos.hasOwnProperty(key)) {
				distinctCableCnt++;
				distinctTotalLengthForSKB += skbCableInfos[key];
			}
		}
		
		for(key in keCableInfos) {
			if(keCableInfos.hasOwnProperty(key)) {
				distinctCableCnt++;
				distinctTotalLengthForKE += keCableInfos[key];
			}
		}
	    
		summary = {};
		// 순번
		summary.seq = "총합";
		// taget id
		summary.target = "";
		// 중복 없는 케이블 수
		summary.cableCount = distinctCableCnt; 
	    // T 중복 없는 총길이
		summary.totalLengthForSKT = gfnFormatNumber(distinctTotalLengthForSKT);
		// B 중복 없는 총길이
		summary.totalLengthForSKB = gfnFormatNumber(distinctTotalLengthForSKB);
		// 신설(KE) 중복 없는 총길이
		summary.totalLengthForKE = gfnFormatNumber(distinctTotalLengthForKE);
		// 투자비
		summary.investmentCost = gfnFormatNumber(totalInvestmentCost);
		// 임차비
		summary.rentCost = gfnFormatNumber(totalRentCost);
		// 잔여코어 최소량
		summary.remandCoreMin = "";
		// 코어사용률 최대량
		summary.useCoreRateMax = "";
		// 상위국 주소
		summary.sourceAddress = "";
		// 도착지 주소
		summary.targetAddress = ""; 
		// 도착지 시설관리고유번호
		summary.targetCaMgno = "";
		
		newDatas.push(summary);		
		
		
		$("#div_layout").layout("expand", "south");
		// 객체를 복제시킴. 서로 데이터가 물고 있어서 칼럼 크기 변경시 오동작을 발생시키기 때문.
	    var newCols = JSON.parse(JSON.stringify(that.gridColumns));
	    
	    // 콤마 들어가게 포맷터 넣기. 메소드는 json으로 넘어가지 않기 때문.	    
	    newCols[0].formatter = gfnFormatNumber; // 순번
	    newCols[0].sorter = gfnNumberSorter; // 순번
//	    newCols[2].formatter = getkRoutingSearchDetailLength; // 하나의 경로에 포함된 케이블 수 
//	    newCols[3].formatter = getkRoutingSearchDetailLastCaMgno; // 도착지 시설관리고유번호
//	    newCols[4].formatter = getkRoutingSearchDetailLastAddress; // 도착지 주소
	    
//	    // 엑셀 다운로드를 위하여
//	    newCols[2].field = "cableCount"; // 하나의 경로에 포함된 케이블 수 
//	    newCols[3].field = "targetCaMgno"; // 도착지 시설관리고유번호
//	    newCols[4].field = "targetAddress"; // 도착지 주소
	    
	    // 숫자 필드 정렬에 문자가 있어서 Sorter 별도 구현
	    // 퍼센트(%) 경우 까지 처리
//	    newCols[0].sorter = gfnNumberSorter; // 순번
//	    newCols[3].sorter = gfnNumberSorter; // 코어용량
//	    newCols[4].sorter = gfnNumberSorter; // 길이
//	    newCols[6].sorter = gfnNumberSorter; // 사용코어수
//	    newCols[7].sorter = gfnNumberSorter; // 코어사용률
	    
	    var columList = [];
	    columList.push(newCols);

	    var rowCnt = datas.length;
	    ++gridIdex;
	    var ids = id + gridIdex;
	    var newTitle = gridIdex + "." + title + "(" + gfnFormatNumber(rowCnt) + "건)";
	    
	    //검색된 데이터가 없으면 검색결과가 없는 html 코드를 넣는다.
//	    var resultContents = 
//	            "<table id=\""+ids+"\"\ class=\"easyui-datagrid\"\" style=\"height:"+commonGridHeight+"px\">" +
//	            "<thead data-options=\"frozen:true\"><tr>" +
//	            "</tr></thead>" +
//	            "</table>";
	    var resultContents =  "<div id='" + ids + "' ></div>";
	    $("#div_bottom_tab").tabs('add',{
	    	title : newTitle,
	    	content : resultContents,
	    	height : commonGridHeight,
	    	closable : true
	    });   
	    
//	    $("#div_bottom_tab").tabs("resize");
//	    $("#div_bottom_tab").tabs({
//	    	onBeforeClose: function(title,index){	
//	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		var features = tabObj[id];
//	    		var marker = that.arrMarkers;
//	    		var markers = map.getLayer("Markers");
//	    		var kRoutingNew = map.getLayer("kRoutingNew");
//	    		if(features) {
//	    			
//	    		   gfnGetLayer("bbox_layer").removeFeatures(features);
//	    		   gfnGetLayer("routing_path_layer").removeFeatures(features);
//	    		   gfnGetLayer("routing_layer").removeFeatures(features);
//	    		   gfnGetLayer("routing_item_path_layer").removeFeatures(features);
//	    		   if(gfnGetLayer("non_stop_over_lines_layer") != null){
//	    			   gfnGetLayer("non_stop_over_lines_layer").removeFeatures(features);
//	    		   }
//	    		   if(gfnGetLayer("stop_over_lines_layer") != null){
//	    			   gfnGetLayer("stop_over_lines_layer").removeFeatures(features);
//	    		   }
//	    		   if(gfnGetLayer("kRoutingSearch") != null){
//	    			   gfnGetLayer("kRoutingSearch").removeAllFeatures();
//	    		   }
//	    		   if(kRoutingNew != null){
//	    			   kRoutingNew.removeAllFeatures();
//	    		   }
//	    		   dynamicSld.layer.removeFeatures(features);	    		   
//
////				   that.targets = [];
////				   that.source = "";
//	    		   delete tabObj[id];
//	    		}
////	    		if(marker) {
////	    			for(var z=0; z < marker.length; z++){
////	    				markers.removeMarker(marker[z]);
////	    			}
////	    			that.arrMarkers = [];
////	    		}
//	    	  },
//	    	  onSelect : function(title,index){
//		    		
//		    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//		    		if($("#"+id).datagrid()){
//		    		 $("#"+id).datagrid("reload");
//		    		}
//		    }
//	    });
//	    $("#div_bottom_tab").tabs("select",newTitle);
	    // T 총길이 / B 총길이 계산 및 Footer 표현
//	    var totalLengthForSKT = 0;
//	    var totalLengthForSKB = 0;
//	    var index = 0;
//	    
//	    for(index = 0; index < rowCnt; index++) {
//	    	if(datas[index]["sysClf"] === "SK") {
//	    		totalLengthForSKT += datas[index]["compLen"]? Number(datas[index]["compLen"]): 0;
//	    	} else if(datas[index]["sysClf"] === "HT") {
//	    		totalLengthForSKB += datas[index]["compLen"]? Number(datas[index]["compLen"]): 0;
//	    	}
//	    }
	    
//	    var footer = 'T 총길이: ' + gfnFormatNumberFloat2(totalLengthForSKT) + ' / B 총길이: ' + gfnFormatNumberFloat2(totalLengthForSKB);
//
//	    columList[0][4].title = "길이 (" + footer + ")";
	    //var tabid = $('#div_bottom_tab').tabs('getSelected').prop('id');
	    that.columList = columList;
	    that.datas = newDatas;
	    tabData[tabid] = newDatas;
	    $("#" + ids).datagrid({
	        data : newDatas,
	        columns : columList,
	        fitColumns: true,
	        pagination: false,
	        singleSelect : true,
	        selectOnCheck : false,
	        checkOnSelect : false,
	        remoteSort:false,
	        autoRowHeight: false,
//	        showFooter: true,
	        onClickRow: function(rowIndex, rowData){
	            if(onclickRow) {
	                onclickRow(this, rowIndex);
	            }
	        },
	    	onDblClickRow :function(rowIndex, rowData){
	            if(ondblClickRow) {
	            	ondblClickRow(this, rowIndex);
	            }
	        },
	        onRowContextMenu : function(e, rowIndex, rowData) {
//	        	if(onRowContextMenu) {
//	        		onRowContextMenu(rowIndex, rowData);
//	        	} else 
	            if(ondblClickRow) {
	            	ondblClickRow(this, rowIndex);
	            }
	        	
	        	e.preventDefault();
			}
	    });
	    
//	    // update footer rows with new data
//	    $("#" + ids).datagrid('reloadFooter',[
//	    	{compLen: footer}
//	    ]);
	    
	    return ids;		
	},
	// 검색 부분 그리드 컬럼 정의
	gridColumns: [
       	  {field:"seq", title:"순번", width:50, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"target",title:"target", width:120, halign:"center", align:"center", sortable: true, checkbox:false}
       	, {field:"cableCount", title:"케이블 피스수", width:120, halign:"center", align:"right", sortable: true, checkbox:false, sorter: gfnNumberSorter}
       	, {field:"totalLengthForSKT", title:"SKT 길이", width:120, halign:"center", align:"right", sortable: true, checkbox:false, sorter: gfnNumberSorter}
       	, {field:"totalLengthForSKB", title:"SKB 길이", width:120, halign:"center", align:"right", sortable: true, checkbox:false, sorter: gfnNumberSorter}
       	, {field:"totalLengthForKE", title:"신설길이", width:120, halign:"center", align:"right", sortable: true, checkbox:false, sorter: gfnNumberSorter}
       	, {field:"investmentCost", title:"투자비(만원)", width:120, halign:"center", align:"right", sortable: true, checkbox:false, sorter: gfnNumberSorter}
       	, {field:"rentCost", title:"임차비(만원)", width:120, halign:"center", align:"right", sortable: true, checkbox:false, sorter: gfnNumberSorter}
       	, {field:"remandCoreMin", title:"잔여코어 최소량", width:120, halign:"center", align:"right", sortable: true, checkbox:false, sorter: gfnNumberSorter}
       	, {field:"useCoreRateMax", title:"코어사용률 최대량", width:120, halign:"center", align:"right", sortable: true, checkbox:false, sorter: gfnNumberSorter}
       	, {field:"sourceAddress", title:"상위국 주소", width:120, halign:"right", align:"center", sortable: true, checkbox:false}
       	, {field:"targetAddress", title:"하위국 주소", width:120, halign:"right", align:"center", sortable: true, checkbox:false}
       	, {field:"targetCaMgnoUnqMgno", title:"하위국 시설물고유관리번호", width:120, halign:"right", align:"center", sortable: true, checkbox:false}
    ],
	
	/**********************************************************************
	설명 : 지도&엑셀 출력
	파라메터 :
	리턴값 :
	***********************************************************************/
    downloadExcel: function(newLines) {
		var that = this;
		
		var tabid = $('#div_bottom_tab').tabs('getSelected').prop('id');
		var url = "/gis/krouting/downloadExcel";
		var columList = that.columList;
		var datas = tabData[tabid];
		
		if(columList === null || datas === null) {
			$.messager.alert("알림", "먼저 기설 루트 [분석]을 클릭해서 분석을 완료해 주세요.");
			return;
		}
		
		var originalDatas = that.originalDatas;
		
		var statisticsDatas = [];
		
		var i = 0;
		var k = 0;
		var m = 0;
		var len = 0;
		var temp = null;
		var op1 = 0;
		var op2 = 0;
		
		for(i = 0; i < originalDatas.length; i++) {
			for(k = 0; k < originalDatas[i].fc.features.length; k++) {
				temp = originalDatas[i].fc.features[k]
				
				if(temp.type == "Feature") {
					len = statisticsDatas.length;
					
					// 전송 데이터 줄이기
					temp.geometry = null;
					
					for(m = 0; m < len; m++) {
						if(statisticsDatas[m].id == temp.id) {
							statisticsDatas[m].count++;
							break;
						}
					}
					
					if(m == len) {
						statisticsDatas.push(temp);
						statisticsDatas[m].count = 1;						
						statisticsDatas[m].remandCoreC = gfnNumberOrZero(temp.coreCnt) - gfnNumberOrZero(temp.useCoreC);
					}
				}
			}
		}
		
		for(m = 0; m < statisticsDatas.length; m++) {
			if(statisticsDatas[m].useCoreC == null || Number(statisticsDatas[m].useCoreC) == NaN) {
				statisticsDatas[m].afterUseCoreC = "";
			} else {
				statisticsDatas[m].afterUseCoreC = gfnNumberOrZero(statisticsDatas[m].count) + gfnNumberOrZero(statisticsDatas[m].useCoreC);	
			}
			
			if(statisticsDatas[m].useCoreC == null || Number(statisticsDatas[m].useCoreC) == NaN) {
				statisticsDatas[m].afterRemandCoreC = "";
			} else {
				statisticsDatas[m].afterRemandCoreC = gfnNumberOrZero(statisticsDatas[m].coreCnt) - gfnNumberOrZero(statisticsDatas[m].afterUseCoreC);	
			}
			
			if(statisticsDatas[m].useCoreC == null || Number(statisticsDatas[m].useCoreC) == NaN) {
				statisticsDatas[m].afterUseCoreP = "";
			} else {
				statisticsDatas[m].afterUseCoreP = gfnFormatNumber(statisticsDatas[m].afterUseCoreC / gfnNumberOrZero(statisticsDatas[m].coreCnt) * 100) + "%";	
			}
		}
		
//		// 3차 정렬 - 활용건수
//		var sort3 = function(a, b) {
//			if(a.count < b.count) return 1;
//			if(a.count == b.count) return 0;
//			if(a.count > b.count) return -1;
//		};
//
//		// 2차 정렬 - 코아사용률(설계후)
//		var sort2 = function(a, b) {
//			var percentA = Number(a.afterUseCoreP.replace("%", ""));
//			var percentB = Number(b.afterUseCoreP.replace("%", ""));
//			
//			if(percentA < percentB) return 1;
//			
//			if(percentA == percentB) {
//				return sort3(a, b);
//			};
//			
//			if(percentA > percentB) return -1;
//		};
//
//		// 1차 정렬 - 자산소유구분 - SK,HT,KE
//		var sort1 = function(a, b) {
//			if(a.sysClf == "SK") {
//				if(b.sysClf == "SK") {
//					return sort2(a, b);
//				}
//				
//				return -1;
//			}
//			
//			if(b.sysClf == "SK") {
//				return 1;
//			}
//
//			if(a.sysClf == "HT") {
//				if(b.sysClf == "HT") {
//					return sort2(a, b);
//				}
//				
//				return -1;
//			}
//			
//			if(b.sysClf == "HT") {
//				return 1;
//			}
//
//			
//			return sort2(a, b);
//		};

//		statisticsDatas.sort(sort1);
		
		var statisticsField = [
			  {field:'caMgno',title:'케이블 관리번호',width:100,align:'left', sortable: true}
			, {field:'sysClf',title:'자산소유구분',width:80,align:'right', sortable: true}
			, {field:'coreCnt',title:'코아수',width:50,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'compLen',title:'포설거리',width:60,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'ungrLoc',title:'매설위치',width:60,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'sido',title:'주소',width:300,align:'right', sortable: true}
			, {field:'count',title:'활용건수',width:40,align:'right', sortable: true}
			, {field:'useCoreC',title:'사용코아수',width:80,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'conCoreCount',title:'접속코어수',width:80,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'remandCoreC',title:'잔여코아수',width:80,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'useCoreP',title:'코아사용률',width:80,align:'right', sortable: true}
			, {field:'afterUseCoreC',title:'사용코아수(설계후)',width:80,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'afterRemandCoreC',title:'잔여코아수(설계후)',width:80,align:'right', sortable: true, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
			, {field:'afterUseCoreP',title:'코아사용률(설계후)',width:80,align:'right', sortable: true, formatter: gfnFormatNumberFloat2, sorter: gfnNumberSorter}
		];
		
		$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
		$("#jsonFieldString").val(JSON.stringify(columList[0]));
		$("#jsonDataString").val(JSON.stringify(datas));
		$("#jsonStatisticsFieldString").val(JSON.stringify(statisticsField));
		$("#jsonStatisticsDataString").val(JSON.stringify(statisticsDatas));
		$("#jsonNewLineDataString").val(JSON.stringify(newLines));
		$("#frm_file_download").attr("action", url);
		$("#frm_file_download").submit();
	},
	
	drawPartical: function(geometry) {
		var itemPathLayer = map.getLayer("routing_item_path_layer");
		if(itemPathLayer == null) {
			itemPathLayer = new BiesVector("routing_item_path_layer");
			itemPathLayer.id = "routing_item_path_layer";
			map.addLayer(itemPathLayer);
		}
//		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');

		map.setLayerIndex(itemPathLayer, 99);
		itemPathLayer.removeAllFeatures();

		// style
		var style = new OpenLayers.Style({
	        strokeColor: "#00FF00",
	        strokeWidth: 3
	    });
		var styleMap = new OpenLayers.StyleMap(style);
		itemPathLayer.styleMap = styleMap;
		
		var geojson_format = new OpenLayers.Format.GeoJSON({
            'internalProjection': map.baseLayer.projection,
            'externalProjection': map.baseLayer.projection
        });

		var feature = geojson_format.read(geometry);
		itemPathLayer.addFeatures(feature);

//		if(tabObj[id]){	        			
//			tabObj[id].push(feature[0]);	        			
//		}else{			
//			tabObj[id] = feature;	
//
//		}
	},
	addHighers : function(highers) {
		var that = this;
		
		// init
		that.source = [];
		that.sourcePoints = [];
		that.bboxes = [];
		
		// demand_layer
		var demand_layer = map.getLayer("demand_layer");
		if(demand_layer == null) {
			demand_layer = new BiesVector("demand_layer");
			demand_layer.id = "demand_layer";
			map.addLayer(demand_layer);
		}
		demand_layer.removeAllFeatures();

		// add markers
		var markers = map.getLayer("Markers");
		if(markers == null) {
			markers = new OpenLayers.Layer.Markers( "Markers" );
			markers.id = "Markers";
			map.addLayer(markers);
			
			map.setLayerIndex(markers, that.markersLayerIndex);
		}
		markers.clearMarkers();

		// loop
		for(var idx = 0; idx < highers.length; idx++) {
			var higher = highers[idx];
			
			var id = higher.id;
			var x = higher.x;
			var y = higher.y;
	
			that.source.push(id);
//			var tabId = $('#div_bottom_tab').tabs('getSelected').prop('id');
			var url = "http://uiscloud.iptime.org:8180/geoserver";
			var icon = url + "/www/symbol/red_b.png";
	
			var markers = map.getLayer("Markers");
			map.setLayerIndex(markers, that.markersLayerIndex);
			
			var size = new OpenLayers.Size(50, 45);
			var offset = new OpenLayers.Pixel(-(size.w/2) + 7, -size.h + 2);
			
			icon = new OpenLayers.Icon(icon, size, offset);
			var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
			markers.addMarker(marker);
			that.arrMarkers.push(marker);
			// that.sourcePoints.push(new OpenLayers.Geometry.Point(x, y));
			that.sourcePoints.push("POINT(" + x + " " + y + ")::Y");
			
			
			// draw my boundary
			//that.drawBoundary(x, y);
		}
//		if(tabObj[tabId]){
//			for(var z in that.boundFeature) {
//				tabObj[tabId].push(that.boundFeature[z]);
//			}
//		}
//		else{
//			tabObj[tabId] = that.boundFeature;
//		}

	},
	
	addLowers : function(highers, lowers) {
		var that = this;
		
		that.demands = [];
		that.targetMarkers = {};
		that.bldgWkt = {};

		var initBounds = new OpenLayers.Bounds();

		var wktReader = new jsts.io.WKTReader();
	    var parser = new jsts.io.OpenLayersParser();
		
		// 상위국 포함
	    for(var idx = 0; idx < highers.length; idx++) {
			var higher = highers[idx];
			
			var x = higher.x;
			var y = higher.y;
			
			var f = wktReader.read("POINT(" + x + " " + y + ")");
		    var higherGeom = parser.write(f);
	
		    initBounds.extend(higherGeom.getBounds());
	    }

		// add markers
		var markers = map.getLayer("Markers");
		if(markers == null) {
			markers = new OpenLayers.Layer.Markers( "Markers" );
			markers.id = "Markers";
			map.addLayer(markers);
			map.setLayerIndex(markers, that.markersLayerIndex);
		}
		
		var idx = 0;
		for(; idx < lowers.length; idx++) {
			var lower = lowers[idx];
			
			var id = lower.id;
			var wkt = lower.wkt;
			var bldgId = lower.bldgId;
			var bldgWkt = lower.bldgWkt;
			var higherId = lower.higherId;
			
			var f = wktReader.read(lower.bldgWkt);
			var x = f.getX();
			var y = f.getY();
			
			// console.log(id + ", " + bldgId + ", " + x + ", " + y +","+ bldgWkt);
			//var tabId = $('#div_bottom_tab').tabs('getSelected').prop('id');
			// targets에 저장한다.
			that.demands.push(higherId + "::" + id + "::" + bldgWkt + "::" + wkt);
			that.targets.push(higherId + "::" + id + "::" + bldgWkt + "::" + wkt);
			that.bldgWkt[bldgId] = bldgWkt;

			// add markers
			var url = "http://uiscloud.iptime.org:8180/geoserver";					
			var icon = url + "/www/symbol/blue_b.png";

			var size = new OpenLayers.Size(50, 45);
			var offset = new OpenLayers.Pixel(-(size.w/2) + 9, -size.h + 2);
			
			icon = new OpenLayers.Icon(icon, size, offset);
			var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
			markers.addMarker(marker);
			that.arrMarkers.push(marker);
			// 종료점은 분석 후 경로를 못 찾은 경우 아이콘을 바꾸기 위해서 저장한다.
			that.targetMarkers[higherId + "::" + id] = marker;

			var f = wktReader.read("POINT(" + x + " " + y + ")");
		    var lowerGeom = parser.write(f);

		    initBounds.extend(lowerGeom.getBounds());
		}

		map.zoomToExtent(initBounds);
		
	}
};