"use strict";

// IE 8 오류로 console 사용 금지
var pgRoutingSearch = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 투자비산출기준
	byICost: $("#frmPgRouting :radio[name='byICost']"),
	
	// 혼합구분 
	sysClf: $("#frmPgRouting :radio[name='sysClf']"),
	
	// 망구분
	// 망구분 - SKT기간망링
	sktBbring: $("#frmPgRouting :checkbox[name='skt_bbring']"),
	
	// 망구분 - SKT중심국링
	sktCtring: $("#frmPgRouting :checkbox[name='skt_ctring']"),
	
	// 망구분 - SKT기지국링
	sktBsring: $("#frmPgRouting :checkbox[name='skt_bsring']"),
	
	// 망구분 - SKT중계기P2P
	sktRfptp: $("#frmPgRouting :checkbox[name='skt_rfptp']"),
	
	// 망구분 - SKT기타
	sktEtc: $("#frmPgRouting :checkbox[name='skt_etc']"),
	
	// 망구분 - SKB링
	skbRing: $("#frmPgRouting :checkbox[name='skb_ring']"),
	
	// 한전배전
	gisCode: $("#frmPgRouting :checkbox[name='gisCode']"),
	
	// cost 산출조건
	byCost: $("#frmPgRouting :radio[name='byCost']"),

	// BBOX 영역설정
	bufferArea: $("#frmPgRouting :radio[name='bufferArea']"),	
	bufferAreaTxt: $("#frmPgRouting .bufferAreaTxt"),
	
	// 접속코어수
	conCoreCount: $("#frmPgRouting .conCoreCount"),
	
	// 신설포설단가
	newPpPrice: $("#frmPgRouting .newPpPrice"),

	
	////////////////////////////////////////////////////////////////////////	
	////////////////////////////////////////////////////////////////////////	
	////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////	
	////////////////////////////////////////////////////////////////////////	
	////////////////////////////////////////////////////////////////////////
	// 심화 조건
	gurobiSel: $("#frmPgRouting .gurobiSel"),
	
	// 경로 개수
	routingCount: $("#frmPgRouting .routingCount"),
	
	// 경유점 순서고려
	orderRequired: $("#frmPgRouting :radio[name='orderRequired']"),	
	
	// 경로겹침 허용여부
	allowOverlap: $("#frmPgRouting :radio[name='allowOverlap']"),	
	
	// 코어링 회피여부
	avoidCoring: $("#frmPgRouting :radio[name='avoidCoring']"),	
	////////////////////////////////////////////////////////////////////////	
	////////////////////////////////////////////////////////////////////////	
	////////////////////////////////////////////////////////////////////////
	
	
	

	
	// 용량조건(% 이하)
	capacity: $("#frmPgRouting .capacity"),
	
	// 잔여코어용량(개수 이상)
	remainCapacity: $("#frmPgRouting .remainCapacity"),
	
	// 접속점조건(개수 이상)
	// connectingPointCount: $("#frmPgRouting .connectingPointCount"),
	
	// 매설위치 구분
	ungrLoc: $("#frmPgRouting :checkbox[name='ungrLoc']"),
	
	// 코어용량(이상)
	coreCount: $("#frmPgRouting .coreCount"),
	
	
	
	
	
	
	
	
	
	// 망구분
	//netClf: $("#frmPgRouting :checkbox[name='netClf']"),
	
	// 엑셀 다운로드용 테이블 헤더
	columList: {},
	
	// 엑셀 다운로드용 테이블 바디
	datas: {},

	startPoint: "",
	
	endPoint: "",		

	startPointId: "",
	
	endPointId: "",		
    
	arrMarkers : [],
	
	bboxFeature : "",
	//경유 점/선
	stopOverPoints: [],
	
	stopOverPointMarkers: {},
	
	stopOverLines: [],
	
	//불경우 점/선
	nonStopOverPoints: [],
	
	nonStopOverPointMarkers: {},
	
	nonStopOverLines: [],
	
	bbox: "",
	
	// 시작점 버튼
	startPointButton: $("#div_pgRouting .startPoint"),
	// 종료점 버튼
	finishPointButton: $("#div_pgRouting .finishPoint"),
	// BBOX 버튼
	bboxPointButton: $("#div_pgRouting .bboxPoint"),
	// 경유지 점 버튼
	stopOverPointsButton: $("#div_pgRouting .stopOverPoints"),
	// 불경유지 점 버튼
	nonStopOverPointsButton: $("#div_pgRouting .nonStopOverPoints"),
	// 경유지 선 버튼
	stopOverLinesButton: $("#div_pgRouting .stopOverLines"),
	// 불경유지 선 버튼
	nonStopOverLinesButton: $("#div_pgRouting .nonStopOverLines"),
	// 불경유지 영역 버튼
	nonStopOverAreaButton: $("#div_pgRouting .nonStopOverArea"),
	bboxClearButton : $("#div_pgRouting .bboxClear"),
	
	// 분석 버튼
	analyzeButton: $("#div_pgRouting .analyze"),
	
	// 지우기 버튼
	initPointButton: $("#div_pgRouting .initPoint"),
	
	// 초기화 버튼
	initPointAllButton: $("#div_pgRouting .initPointAll"),
	// 경유점 초기화 버튼
	initstopOverPointsButton: $("#div_pgRouting .initstopOverPoints"),
	
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
		
		that.layer = new BiesVector("pgRoutingSearch");
		map.addLayer(that.layer);
		
		var control = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Polygon, { 
			id : "pgRoutingSearch"
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
		
		// 시작점
		that.startPointButton.click(function() {
			that.selectStart();
		});

		// 끝점
		that.finishPointButton.click(function() {
			that.selectEnd();
		});
		
		// 지우기
		that.initPointButton.click(function() {
			that.selectInitPoint();
		});
		
		// 초기화
		that.initPointAllButton.click(function() {
			that.selectInitPointAll();
		});
		
		// 경유점 초기화
		that.initstopOverPointsButton.click(function() {
			that.selectInitstopOverPoints();
		});

		// 경유 점
		that.stopOverPointsButton.click(function() {
			that.selectStopOverPoints();
		});
		// 불경유 점
		that.nonStopOverPointsButton.click(function() {
			that.selectNonStopOverPoints();
		});

		// 경유 선
		that.stopOverLinesButton.click(function() {
			that.selectStopOverLines();
		});
		// 불경유 선
		that.nonStopOverLinesButton.click(function() {
			that.selectNonStopOverLines();
		});
		// 불경유 영역
		that.nonStopOverAreaButton.click(function() {	

			if(that.startPoint == "" ) {
				$.messager.alert("알림", "시작점이 선택되지 않았습니다.");
				return;
			}
			if(gfnGetLayer("pgRoutingSearch") !== null){
				gfnGetLayer("pgRoutingSearch").removeAllFeatures();
				that.stopOverPoints = [];
				that.nonStopOverLines = [];
			}
			gfnActiveControl(["pgRoutingSearch"]);
		});
		//지우기
		that.bboxClearButton.click(function() {
			
			$("#a_serGridToolbarTabsCloseAll").trigger('click');
			that.stopOverPoints = [];
			that.nonStopOverLines = [];
		});
		// BBOX
		that.bboxPointButton.click(function() {
			that.drawBbox();
		});
		
		// 검색
		that.analyzeButton.click(function() {
			that.analyze();
		});
		
		// 심화조건
		that.gurobiSel.click(function() {
			that.selectGurobi();
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

		that.startPoint = "";
		that.endPoint = "";
		that.startPointId = "";
		that.endPointId = "";
		that.stopOverPoints = [];
		that.stopOverPointMarkers = {};
		that.stopOverLines = [];
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

	},
	
	turnLayersOff: function() {
		// 라우팅정보 2 개 레이어 자동 Off
		var node1 = $('#ul_layer_tree').tree('find', 51);
		$('#ul_layer_tree').tree('uncheck', node1.target);
		
		var node2 = $('#ul_layer_tree').tree('find', 52);
		$('#ul_layer_tree').tree('uncheck', node2.target);
		
		
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
	설명 : 불경유 영역 선택시 영역안 데이터 가져오기
	파라메터 : feature
	리턴값 : 
	***********************************************************************/
	selectByNonStopArea: function(feature, callback){
		var that = this;

		//초기화
//		that.nonStopOverPoints.push(res[a]);
//		that.nonStopOverLines.push(res[a]);
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
	
	/**********************************************************************
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	analyze: function() {
		var that = this;
		
		var routingCondition = that.checkSubmitData();
		
		// analyze
		if(routingCondition != null && that.startPoint != "" && that.endPoint != "") {
			if(routingCondition.gurobiSel == "Y") {
				var requestGurobi = {};
				requestGurobi.startPoint = that.startPointId;
				requestGurobi.endPoint = that.endPointId;
				
				if(routingCondition.nonStopOverPoints != "") {
					var nonStopOverPoints = routingCondition.nonStopOverPoints.split(',').map(function(item) {
					    return parseInt(item, 10);
					});
				} else {
					nonStopOverPoints = [];
				}
				requestGurobi.nonStopOverPoints = nonStopOverPoints;
				
				if(routingCondition.nonStopOverLines != "") {
					var nonStopOverLines = routingCondition.nonStopOverLines.split(',').map(function(item) {
					    return parseInt(item, 10);
					});
				} else {
					nonStopOverLines = [];
				}
				requestGurobi.nonStopOverLines = nonStopOverLines;
				requestGurobi.byICost = routingCondition.byICost;
				requestGurobi.sysClf = routingCondition.sysClf;
				requestGurobi.sktBbring = parseInt(routingCondition.sktBbring);
				requestGurobi.sktCtring = parseInt(routingCondition.sktCtring);
				requestGurobi.sktBsring = parseInt(routingCondition.sktBsring);
				requestGurobi.sktRfptp = parseInt(routingCondition.sktRfptp);
				requestGurobi.sktEtc = parseInt(routingCondition.sktEtc);
				requestGurobi.skbRing = parseInt(routingCondition.skbRing);
				requestGurobi.gisCodes = routingCondition.gisCodes;
				requestGurobi.byCost = parseInt(routingCondition.byCost);
				requestGurobi.conCoreCount = parseInt(routingCondition.conCoreCount);
				//requestGurobi.newPpPrice = routingCondition.newPpPrice;
				requestGurobi.bbox = that.bbox;
				
				// 'stopOverPoints': that.stopOverPoints.join();
				// 'stopOverLines': that.stopOverLines.join();
				requestGurobi.capacity = routingCondition.capacity == "" ? -1 : parseInt(routingCondition.capacity);
				requestGurobi.remainCapacity = routingCondition.remainCapacity == "" ? -1 : parseInt(routingCondition.remainCapacity);
				// requestGurobi.connectingPointCount = routingCondition.connectingPointCount == "" ? null : parseInt(routingCondition.connectingPointCount);
				
				if(routingCondition.ungrLocs != "") {
					var ungrLocs = routingCondition.ungrLocs.split(',');
				} else {
					ungrLocs = [];
				}
				requestGurobi.ungrLocs = ungrLocs;
				requestGurobi.coreCount = parseInt(routingCondition.coreCount);
				// 'netClfs': routingCondition.netClfs;
				// requestGurobi.gurobiSel = routingCondition.gurobiSel;
				
				if(routingCondition.stopOverPoints != "") {
					var stopOverPoints = routingCondition.stopOverPoints.split(',').map(function(item) {
					    return parseInt(item, 10);
					});
				} else {
					stopOverPoints = [];
				}
				requestGurobi.stopOverPoints = stopOverPoints;
				
				if(routingCondition.stopOverLines != "") {
					var stopOverLines = routingCondition.stopOverLines.split(',').map(function(item) {
					    return parseInt(item, 10);
					});
				} else {
					stopOverLines = [];
				}
				//requestGurobi.stopOverLines = stopOverLines;
				requestGurobi.routingCount = routingCondition.routingCount == "" ? -1 : parseInt(routingCondition.routingCount);
				requestGurobi.orderRequired = routingCondition.orderRequired;
				requestGurobi.allowOverlap = routingCondition.allowOverlap;
				requestGurobi.avoidCoring = routingCondition.avoidCoring

				//console.log(JSON.stringify(requestGurobi, null, 2));
				
				// gurobi_start('curtis', '{\r\n    "startPoint": 4723369,\r\n    "endPoint": 4723369,\r\n    "stopOverPoints": [\r\n        267770,\r\n        117491,\r\n        233016,\r\n        456958,\r\n        40290,\r\n        5022372,\r\n        103802,\r\n        431379,\r\n        648193,\r\n        69660,\r\n        420611,\r\n        55713,\r\n        682795,\r\n        400967,\r\n        485138,\r\n        104808\r\n    ],\r\n    "stopOverLines": [],\r\n    "nonStopOverPoints": [],\r\n    "nonStopOverLines": [],\r\n    "capacity": 90,\r\n    "remainCapacity": 0,\r\n    "connectingPointCount": 0,\r\n    "ungrLocs": [\r\n        "A",\r\n        "D",\r\n        "F"\r\n    ],\r\n    "gisCodes": "CN002",\r\n    "sysClf": "BOTH",\r\n    "coreCount": 0,\r\n    "bbox": "POLYGON((153577 3700, 158288 3700, 158288 -460, 153577 -460, 153577 3700))",\r\n    "conCoreCount": 1,\r\n    "sktBbring": 1,\r\n    "sktCtring": 1,\r\n    "sktBsring": 1,\r\n    "sktRfptp": 1,\r\n    "sktEtc": 1,\r\n    "skbRing": 1,\r\n    "byICost": "SKT",\r\n    "byCost": 3,\r\n    "routingCount": 5,\r\n    "orderRequired": "N",\r\n    "allowOverlap": "Y",\r\n    "avoidCoring": "Y"\r\n}');
				
				console.log("gurobiUser : " + gurobiUser);
				console.log(JSON.stringify(requestGurobi));
				
				gurobi_start(gurobiUser, JSON.stringify(requestGurobi));
				
			} else {
				that.calculateRouting(routingCondition);
			}
		}
	},
	
	checkSubmitData: function() {
		var that = this;

		if(that.startPoint == "" || that.endPoint == "") {
			$.messager.alert("알림", "시작점과 종료점을 선택하세요.");
			return;
		}
		
		// 숫자형 체크
		var validItem = null;
		
//		validItem = that.capacity;		
//		if(!validItem.validatebox("isValid")) {
//			validItem.focus();
//			return;
//		}
//		
//		validItem = that.remainCapacity;		
//		if(!validItem.validatebox("isValid")) {
//			validItem.focus();
//			return;
//		}
//		
//		validItem = that.connectingPointCount;		
//		if(!validItem.validatebox("isValid")) {
//			validItem.focus();
//			return;
//		}
//		
//		validItem = that.coreCount;		
//		if(!validItem.validatebox("isValid")) {
//			validItem.focus();
//			return;
//		}
		
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
				orderRequired : null,
				allowOverlap: null,
				avoidCoring : null,
				capacity: null,
				remainCapacity: null,
				// connectingPointCount: null,
				ungrLocs: null,
				coreCount: null,
				nonStopOverPoints: null,
				nonStopOverLines: null,
				stopOverPoints: null,
				stopOverLines: null,
				gurobiSel: null
				//netClfs: null
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
		
		
		///////////////////////////////////////////////////////////////////////////
		routingCondition.gurobiSel = that.gurobiSel.is(':checked') ? "Y" : "N";
		
		// 경로 개수
		routingCondition.routingCount = that.routingCount.val();
		
		// 경유점 순서고려	
		routingCondition.orderRequired = that.orderRequired.filter(":checked").val();
		
		// 경로겹침 허용여부
		routingCondition.allowOverlap = that.allowOverlap.filter(":checked").val();	
		
		// 코어링 회피여부	
		routingCondition.avoidCoring = that.avoidCoring.filter(":checked").val();
		
		
		
		
		
		
		
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
//		for(i = 0; i < that.netClf.length; i++) {
//			if(that.netClf[i].checked === true) {
//				routingCondition.netClfs.push(that.netClf[i].value);
//			}
//		}
//		
//		routingCondition.netClfs = routingCondition.netClfs.join();
		
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
		
		// 필수경로 - 점선택
		var rPoints = [];
		for(var i = 0; i < that.stopOverPoints.length; i++) {
			var stopOverPoint  = that.stopOverPoints[i];
			rPoints.push(stopOverPoint.id);
		}
		routingCondition.stopOverPoints = rPoints.join();
		
		// 필수경로 - 선선택
		var rLines = [];
		for(var i = 0; i < that.stopOverLines.length; i++) {
			var stopOverLine  = that.stopOverLines[i];
			rLines.push(stopOverLine.id);
		}
		routingCondition.stopOverLines = rLines.join();
		
		return routingCondition;
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
			that.startPointId = '';
			that.startPoint = '';		
			that.endPointId = '';
			that.endPoint = '';
		}
	}, 
	selectInitstopOverPoints: function() {
		var that = this;		

		this.selectEdge("initstopOverPoints");
	}, 
	selectStart: function() {
		var that = this;
		
		//엑셀 다운로드용 헤더와 바디 초기화
	    that.columList = null;
	    that.datas = [];
		
		//$.messager.alert("알림", "시작점을 선택하세요");

//		this.startPoint = "";
//		this.endPoint = "";
//		this.startPointId = "";
//		this.endPointId = "";
//		// this.bbox = "";
//		
//		this.stopOverPoints = [];
//		this.stopOverPointMarkers = {};
//		this.StopOverLines = [];
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
		
		// nonStopOverLinesLayer
		var nonStopOverLinesLayer = map.getLayer("non_stop_over_lines_layer");
		if(nonStopOverLinesLayer == null) {
			nonStopOverLinesLayer = new BiesVector("non_stop_over_lines_layer");
			nonStopOverLinesLayer.id = "non_stop_over_lines_layer";
			map.addLayer(nonStopOverLinesLayer);
		}
		//nonStopOverLinesLayer.removeAllFeatures();
		
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

	selectStopOverPoints: function() {
		this.selectEdge("stopOvers");
	}, 

	selectNonStopOverPoints: function() {
		this.selectEdge("nonStopOvers");
	}, 

	selectStopOverLines: function() {
		this.selectEdge("stopOverLines");
	}, 

	selectNonStopOverLines: function() {
		this.selectEdge("nonStopOverLines");
	}, 
	
	selectNonStopOverArea: function() {
		this.selectEdge("nonStopOverArea");
	}, 

	
	selectEdge: function(type) {
		var that = this;

		if(type != "start" && that.startPoint == "" && type != "initPoint") {
			$.messager.alert("알림", "시작점이 선택되지 않았습니다.");
			return;
		}
		if(type == "end" && that.endPoint != "" && type != "initPoint") {
			$.messager.alert("알림", "이미 종료점이 선택되어 있습니다.");
			return;
		}

		//컨트롤러 초기화
		for(var i in map.controls) {
			if(map.controls[i].type != OpenLayers.Control.TYPE_TOGGLE && map.controls[i].id != "pan") {
				map.controls[i].deactivate();	
			}
		}
		if(type == "initPoint") {

			var layer = map.getLayer("routing_layer");
			layer.events.on({
				"featureadded" : function(evt) {
					var feature = evt.feature;					
					
					layer.removeFeatures([feature]);
					
					that.findNearestEdge(feature, type);
				}
			});
		}
		if(type == "initstopOverPoints") {
			var markers = map.getLayer("Markers");
			for(var i in that.stopOverPoints) {			
				markers.removeMarker(that.stopOverPoints[i]);						
			}
			that.stopOverPoints = '';
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
						//layer.removeAllFeatures();
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
						$.messager.alert("알림", "시작점을 찾지못했습니다.");
					} else if (type == "end"){
						$.messager.alert("알림", "종료점을 찾지못했습니다.");
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

				}
				// add markers
				var url = "http://uiscloud.iptime.org:8180/geoserver";
				
				var icon = url + "/www/symbol/red_b.png";
				if(type == "start") {
					that.startPoint = x + " " + y;
					that.startPointId = id;
					icon = url + "/www/symbol/red_b.png";
				} else if (type == "end"){
					that.endPoint = x + " " + y;
					that.endPointId = id;
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
					var size = new OpenLayers.Size(20, 20);
					//var offset = new OpenLayers.Pixel(-(size.w/2) + 9, -size.h + 2);
					
					icon = new OpenLayers.Icon(icon, size);
					var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
					marker.id = id;
					markers.addMarker(marker);
					that.arrMarkers.push(marker);
					that.stopOverPoints.push(marker);
					
				} else if (type == "initPoint") {
					if(that.arrMarkers != null){	
	
						for(var i in that.arrMarkers){
							if(that.arrMarkers[i].id == id){					    
								markers.removeMarker(that.arrMarkers[i]);
								if(that.startPointId == id){
									that.startPointId = '';
									that.startPoint = '';
								}
								if(that.endPointId == id){
									that.endPointId = '';
									that.endPoint = '';
								}
							}
						}
					}
				} else{
					var size = new OpenLayers.Size(50, 45);
					var offset = new OpenLayers.Pixel(-(size.w/2) + 9, -size.h + 2);
					
					icon = new OpenLayers.Icon(icon, size, offset);
					var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
					marker.id = id;
					markers.addMarker(marker);
					that.arrMarkers.push(marker);
				}
				
				// 이동 기능 활성화
				for(var i in map.controls) {
					if(map.controls[i].type != OpenLayers.Control.TYPE_TOGGLE && !(map.controls[i].id == "pan" || (type == "stopOvers" || type == "nonStopOvers" && map.controls[i].id == "routing_selector"))) {
						map.controls[i].deactivate();
					}
				}

				if(type == "start" || type == "end") {
					$("#btn_pan img").trigger("click");
				}
				// 이동 기능 활성화
				//gfnActiveControl("pan");
				//$("#btn_pan img").trigger("click");
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

					//  불경우 레이어를 젤 위로 올린다.
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
					
					//  경우 레이어를 젤 위로 올린다.
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
		var bbox_selectors = map.getControlsBy("id", "bbox_selector");
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
		var bbox_selectors = map.getControlsBy("id", "bbox_selector");
		if(bbox_selectors.length > 0) {
			bbox_selector = bbox_selectors[0];
			for(var idx = 0; idx < bbox_selectors.length; idx++) {
				map.removeControl(bbox_selectors[idx]);
			}
		}
		
		var polyOptions = {sides: 4, angle: 0, irregular: true};
		bbox_selector = new OpenLayers.Control.DrawFeature(bbox_layer, OpenLayers.Handler.RegularPolygon, { handlerOptions: polyOptions, id : "bbox_selector" });
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
		//console.log("startPoint : " + this.startPoint);
		//console.log("endPoint : " + this.endPoint);		
		var that = this;
		
		var layer = map.getLayer("routing_layer");
		layer.events.remove("beforefeaturesadded");
		layer.events.remove("featureadded");
		
		$.ajax({
			type: "POST",
			url: "/gis/routing",
			data: {
				  'startPoint': that.startPoint,
				  'endPoint': that.endPoint,
				  'startPointId': that.startPointId,
				  'endPointId': that.endPointId,
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
				  'coreCount': routingCondition.coreCount,
				  // 'netClfs': routingCondition.netClfs,
				  'gurobiSel' : routingCondition.gurobiSel,
				  'stopOverPoints': routingCondition.stopOverPoints,
				  'stopOverLines': routingCondition.stopOverLines,
				  'routingCount': routingCondition.routingCount,
				  'orderRequired': routingCondition.orderRequired,
				  'allowOverlap': routingCondition.allowOverlap,
				  'avoidCoring': routingCondition.avoidCoring
			},
			dataType: "json",
			success : function(data) {
				//var json = $.parseJSON(data);

				if(routingCondition.gurobiSel == "Y") {
					var obj = jQuery.parseJSON(data.jsonRequest);
					$.messager.alert("알림", JSON.stringify(obj, null, 2));
					return;
				}

				that.drawRouting(data);
	    	    
			}
		});
	},
	
	drawRouting: function(data) {

		var that = this;

		var layer = map.getLayer("routing_layer");

		// 라우팅 레이어를 젤 위로 올린다.
		map.raiseLayer(layer, map.layers.length);

		layer.events.remove("beforefeaturesadded");
		layer.events.remove("featureadded");
		//layer.removeAllFeatures();
		
		// style
		var style = new OpenLayers.Style({
			pointRadius: 6,
			graphicName: "circle",
	        fillColor: "\${fillColor}",
	        fillOpacity: 0.5,
	        strokeColor: "\${strokeColor}",
	        strokeOpacity: 1,
	        strokeWidth: 3,
	        strokeDashstyle : "\${strokeDashstyle}",
	        strokeLineCap : "butt"
	    });
		var styleMap = new OpenLayers.StyleMap(style);
		layer.styleMap = styleMap;
		//"solid"
		var geojson_format = new OpenLayers.Format.GeoJSON({
            'internalProjection': map.baseLayer.projection,
            'externalProjection': map.baseLayer.projection
        });
		var features = geojson_format.read(data);
		var i = 0;
		var j = 0;
		var len = 0;
		var jLen = 0;
		
		// console.log("features.length : " + features.length);
		var featuresSld =[];
		for(i = 0, len=features.length; i < len; i++) {
			for(j = 0, jLen=data.features.length; j < jLen; j++) {
				if(features[i].fid == data.features[j].id) {
					if(!dynamicSld.showSld.is(":checked")){
						var strokeColor = "#ff0000";
						var fillColor = "#ff0000";
						var strokeDashstyle = "solid";
						if(data.features[j].gisCode == "CA005") {
							fillColor = "#0134ac";
							strokeColor = "#0134ac";
						}
						else if(data.features[j].gisCode == "CA006") {
	//						strokeDashstyle = "dash";
	//						fillColor = "#0033ad";
	//						strokeColor = "#0033ad";
							fillColor = "#002266";
							strokeColor = "#002266";
						}
						else if(data.features[j].gisCode == "CA007") {
							fillColor = "#4781b9";
							strokeColor = "#4781b9";
						}
						else if(data.features[j].gisCode == "CA001") {
							fillColor = "#e24900";
							strokeColor = "#e24900";
						}
						else if(data.features[j].gisCode == "CA002") {
	//						strokeDashstyle = "dash";
	//						fillColor = "#ff3300";
	//						strokeColor = "#ff3300";
							fillColor = "#980000";
							strokeColor = "#980000";
						}
						else if(data.features[j].gisCode == "CA003") {
							fillColor = "#ff68ff";
							strokeColor = "#ff68ff";
						}
						else if(data.features[j].gisCode == "CN002") {
							fillColor = "#000000";
							strokeColor = "#000000";
						}
						
						// SKT - 굵은 주황색 계열
						// SKB - 굵은 청색 계열
						if(that.sysClf == "BOTH") {
							if(fc.features[j].sysClf == "SK") {
								fillColor = "#ff7f00";
								strokeColor = "#ff7f00";
							} else if(fc.features[j].sysClf == "HT") {
								fillColor = "#0000ff";
								strokeColor = "#0000ff";
							}
						}
						
						features[i].attributes = {
							fillColor : fillColor,
							strokeColor : strokeColor,
							strokeDashstyle : strokeDashstyle
						}
						break;
					}else{
						
						var feature = features[i];
						var attrs = feature.attributes;				
						var ungrLoc = data.features[j]["ungrLoc"];
						if(ungrLoc == "지중") {							
							attrs.isUngr = true;											
						}							
						featuresSld.push(feature);						
					}
					
				}
			}
		}
		
		
		
		// grid
		var id = "routingInfo";
		var title = "경로검색";
		var gridId ="";
		gridId = that.addDatagridTab(id, title, true, data.features, function(obj, rowData){
//		that.gridId = that.addDatagridTab(id, title, true, data.features, function(obj, rowData){
    		var getRowValue = $(obj).datagrid("getSelected");    		
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
		        strokeWidth: 5
		    });
			var styleMap = new OpenLayers.StyleMap(style);
			pathLayer.styleMap = styleMap;
			
			var geojson_format = new OpenLayers.Format.GeoJSON({
                'internalProjection': map.baseLayer.projection,
                'externalProjection': map.baseLayer.projection
            });
			var feature = geojson_format.read(getRowValue.geometry);
			pathLayer.addFeatures(feature);
			
			// pathLayer를 젤 위로 올린다.
			map.raiseLayer(pathLayer, map.layers.length);
			if(tabObj[gridId]){
				tabObj[gridId].push(feature[0]);			
			}
			else{
				tabObj[gridId] = feature[0];
			}
			
			
//			var tableArrs = [{
//				tableName : "GOTC_CA",
//				gids : [rowData.id]
//			}];
    	});		
		if(dynamicSld.showSld.is(":checked")){
			dynamicSld.showFeatures(featuresSld, gridId);	
			if(tabObj[gridId]){
				tabObj[gridId].push(featuresSld);
			}
			else{
				tabObj[gridId] = featuresSld;
			}
			if(that.bboxFeature != ""){
				tabObj[gridId].push(that.bboxFeature);
			}
			if(that.nonStopOverLines.length > 0){
				for(var r=0; r < that.nonStopOverLines.length;r++){
					tabObj[gridId].push(nonStopOverLines[r]);
				}				
			}
			if(that.stopOverLines.length > 0){
				for(var t=0; t < that.stopOverLines.length;t++){
					tabObj[gridId].push(that.stopOverLines[r]);
				}	
			}	
		}else{
		// redraw
		layer.addFeatures(features);
		layer.redraw();
			if(tabObj[gridId]){
				tabObj[gridId].push(features);
			}
			else{
				tabObj[gridId] = features;
			}
			if(that.bboxFeature != ""){
				tabObj[gridId].push(that.bboxFeature);
			}
			if(that.nonStopOverLines.length > 0){
				for(var r=0; r < that.nonStopOverLines.length;r++){
					tabObj[gridId].push(that.nonStopOverLines[r]);
				}				
			}
			if(that.stopOverLines.length > 0){
				for(var t=0; t < that.stopOverLines.length;t++){
					tabObj[gridId].push(that.stopOverLines[r]);
				}	
			}
		}
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
	addDatagridTab: function (id, title, singleSelect, datas, onclickRow) {
		var that = this;
		console.log(datas)
		if(datas.length == 0){
			$.messager.alert("알림", "검색결과가 없습니다.");
			return false;
		}
		
		$("#div_layout").layout("expand", "south");
		// 객체를 복제시킴. 서로 데이터가 물고 있어서 칼럼 크기 변경시 오동작을 발생시키기 때문.
	    var newCols = JSON.parse(JSON.stringify(that.gridColumns));
	    
	    // 콤마 들어가게 포맷터 넣기. 메소드는 json으로 넘어가지 않기 때문.	    
	    newCols[0].formatter = gfnFormatNumber; // 순번
	    newCols[3].formatter = gfnFormatNumber; // 코어용량
	    newCols[4].formatter = gfnFormatNumber;	// 사용코어수
	    newCols[5].formatter = gfnFormatNumber;	// 연결코어수
	    newCols[6].formatter = gfnRemandCore; // 잔여코어수
//	    newCols[10].formatter = gfnFormatNumber; // 길이 - 소수점 이하 버림 field:"compLen",title:"길이"
	    
	    // 숫자 필드 정렬에 문자가 있어서 Sorter 별도 구현
	    // 퍼센트(%) 경우 까지 처리
	    newCols[0].sorter = gfnNumberSorter; // 순번
	    newCols[3].sorter = gfnNumberSorter; // 코어용량
	    newCols[4].sorter = gfnNumberSorter; // 사용코어수
	    newCols[5].sorter = gfnNumberSorter; // 잔여코어수
	    newCols[6].sorter = gfnNumberSorter; // 잔여코어수
	  //  newCols[7].sorter = gfnNumberSorter; // 코어사용률
	  //  newCols[10].sorter = gfnNumberSorter; // 길이
	    
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
	    	closable : true,
//	    	id :ids
	    });   
	    
//	    $("#div_bottom_tab").tabs("resize");
//	    $("#div_bottom_tab").tabs({
//	    	onBeforeClose: function(title,index){
//	    		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
//	    		var features = tabObj[id];
//	    		var marker = that.arrMarkers;
//	    		var markers = map.getLayer("Markers");
//	    		var pgRoutingNew = map.getLayer("pgRoutingNew");
//	    		if(features) {
//	    			
//	    		   gfnGetLayer("bbox_layer").removeFeatures(features);
//	    		   if(gfnGetLayer("non_stop_over_lines_layer") != null){
//	    			   gfnGetLayer("non_stop_over_lines_layer").removeFeatures(features);
//	    		   }
//	    		   if(gfnGetLayer("stop_over_lines_layer") != null){
//	    			   gfnGetLayer("stop_over_lines_layer").removeFeatures(features);
//	    		   }	  
//	    		   if(pgRoutingNew != null){
//	    			   pgRoutingNew.removeAllFeatures();
//	    		   }
//	    		   if(gfnGetLayer("pgRoutingSearch") != null){
//	    			   gfnGetLayer("pgRoutingSearch").removeAllFeatures();
//	    		   }
//	    		   gfnGetLayer("routing_path_layer").removeFeatures(features);
//	    		   gfnGetLayer("routing_layer").removeFeatures(features);
//	    		   dynamicSld.layer.removeFeatures(features);
//	    		  
////	    		   that.endPointId = '';
////				   that.endPoint = '';
////				   that.startPointId = '';
////				   that.startPoint = '';
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
	    // T 총길이 / B 총길이 계산 표현
	    var totalLengthForSKT = 0; // T 총길이
	    var totalLengthForSKB = 0; // B 총길이
	    var totalLengthForKE = 0; // 신설(한전) 총길이
	    var index = 0;

	    // T 사용코어수 합
	    var totalUserCoreCountForSKT = 0;
	    // B 사용코어수 합
	    var totalUserCoreCountForSKB = 0;
	    	
	    var cableCountForSKT = 0; // T 케이블수
	    var cableCountForSKB = 0; // B 케이블수
	    
	    var cableCostSumForSKT = 0; // T 케이블 cost필드의 합
	    var cableCostSumForSKB = 0; // B 케이블 cost필드의 합
	    var stdCostX = 0;
	    var stdCostY = 0;
	    for(index = 0; index < rowCnt; index++) {
	    	if(datas[index]["sysClf"] === "SK") {
	    		totalLengthForSKT += datas[index]["compLen"]? Number(datas[index]["compLen"]): 0;
	    		totalUserCoreCountForSKT += datas[index]["useCoreC"]? Number(datas[index]["useCoreC"]): 0;
	    		cableCountForSKT++;
	    		console.log( datas[index])
				console.log( datas[index]["costb"])
				console.log( datas[index]["cost"])
	    		cableCostSumForSKT += datas[index]["cost"]? Number(datas[index]["cost"]): 0;
	    		//stdCostX = datas[index]["cost"]? Number(datas[index]["cost"]): 0;
	    		//stdCostY = datas[index]["costb"]? Number(datas[index]["costb"]): 0;
	    		//cableCostSumForSKT += stdCostX * stdCostY;
	    	} else if(datas[index]["sysClf"] === "HT") {
	    		totalLengthForSKB += datas[index]["compLen"]? Number(datas[index]["compLen"]): 0;
	    		totalUserCoreCountForSKB += datas[index]["useCoreC"]? Number(datas[index]["useCoreC"]): 0;
	    		cableCountForSKB++;
	    		cableCostSumForSKB += datas[index]["cost"]? Number(datas[index]["cost"]): 0;
	    		//stdCostX = datas[index]["cost"]? Number(datas[index]["cost"]): 0;
	    		//stdCostY = datas[index]["costb"]? Number(datas[index]["costb"]): 0;
	    		//cableCostSumForSKB += stdCostX * stdCostY;
	    	} else if(datas[index]["sysClf"] === "KE") {
	    		totalLengthForKE += datas[index]["compLen"]? Number(datas[index]["compLen"]): 0;
	    	}
	    	//datas[index]["caMgno_unqMgno"] = datas[index]["caMgno"] + "/" + datas[index]["unqMgno"];
	    	datas[index]["caMgno_unqMgno"] = datas[index]["unqMgno"] + "/" + datas[index]["fctsNm"];
	    }
	    
	    var info = '';
	    var investmentCost = 0; // 투자비
	    var rentCost = 0; // 임차비
	    
	    if(that.byICost.filter(":checked").val() == "SKT") {
		    // 투자비 계산: SKT 투자비
		    investmentCost = unitPrice.calculateInvestmentForSKT(cableCountForSKT, that.conCoreCount.val(), cableCostSumForSKT, totalLengthForKE); 
		    // 임차비 계산: SKT 임차비
		    rentCost = unitPrice.calculateRentForSKT(totalLengthForSKB, that.conCoreCount.val());
	    } else if(that.byICost.filter(":checked").val() == "SKB") {
		    // 투자비 계산: SKB 투자비
		    investmentCost = unitPrice.calculateInvestmentForSKB(cableCountForSKB, that.conCoreCount.val(), cableCostSumForSKB, totalLengthForKE); 
		    
		    // 임차비 계산: SKB 임차비
		    rentCost = unitPrice.calculateRentForSKB(totalLengthForSKT, that.conCoreCount.val());
	    }
	    
	    info += 'T: ' + gfnFormatNumber(totalLengthForSKT) + " m";
	    info += ' / B: ' + gfnFormatNumber(totalLengthForSKB) + " m";
	    info += ' / 신설: ' + gfnFormatNumber(totalLengthForKE) + " m";
	    info += ' / 투자비: ' + gfnFormatNumber(investmentCost) + " 만";
	    info += ' / 임차비: ' + gfnFormatNumber(rentCost) + " 만";
	    
	  //  columList[0][10].title = "길이 (" + info + ")";
	    //var tabid = $('#div_bottom_tab').tabs('getSelected').prop('id');
	    that.columList = columList;
	    //tabData[tabid] = datas;
	    that.datas = datas;
	    $("#" + ids).datagrid({
	        data : datas,
	        columns : columList,
	        fitColumns: true,
	        pagination: false,
	        singleSelect : true,
	        selectOnCheck : false,
	        checkOnSelect : false,
	        remoteSort:false,
	        autoRowHeight: false,
//	        showFooter: true,
	        onClickRow :function(rowIndex, rowData){
	            if(onclickRow) {
	                onclickRow(this, rowData);
	            }
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
       	  {field:"seq", title:"순번", width:50, halign:"center", align:"center", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
      	, {field:"caMgno",title:"ufid", width:250, halign:"center", align:"left", sortable: true, checkbox:false}
     	, {field:"sysClf", title:"rddv", width:50, halign:"center", align:"center", sortable: true, checkbox:false}
      	//, {field:"coreCnt",title:"COST", width:50, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"useCoreC",title:"rdln", width:50, halign:"center", align:"right", sortable: true, hidden: false, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	, {field:"conCoreCount",title:"rvwd", width:50, halign:"center", align:"right", sortable: true, hidden: false, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	//, {field:"remandCoreC",title:"잔여코어수", width:50, halign:"center", align:"right", sortable: true, hidden: false, checkbox:false, formatter: gfnRemandCore, sorter: gfnNumberSorter}
    	//, {field:"useCoreP",title:"코어사용률", width:50, halign:"center", align:"right", sortable: true, hidden: false, checkbox:false, sorter: gfnNumberSorter}
    	, {field:"ungrLoc",title:"pvqt", width:50, halign:"center", align:"center", sortable: true, checkbox:false}
    	, {field:"netClf",title:"dvyn", width:40, halign:"center", align:"center", sortable: true, checkbox:false}
    	//, {field:"compLen",title:"길이", width:270, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
    	//, {field:"sido",title:"법정동", width:150, halign:"center", align:"left", sortable: true, hidden: false, checkbox:false}
    	//, {field:"cnstMgno",title:"공사번호", width:100, halign:"center", align:"left", sortable: true, hidden: false, checkbox:false}
    	//, {field:"sgg",title:"시군구", width:100, halign:"center", align:"center", sortable: true, hidden: false, checkbox:false}
    	//, {field:"emd",title:"읍면동", width:100, halign:"center", align:"center", sortable: true, hidden: false, checkbox:false}
    ],
	
	/**********************************************************************
	설명 : 지도&엑셀 출력
	파라메터 :
	리턴값 :
	***********************************************************************/
    downloadExcel: function(newLines) {
		var that = this;
		
		
		var url = "/gis/pgRouting/downloadExcel";
		var columList = that.columList;
		var datas = that.datas;

		if(columList === null || datas === null) {
			$.messager.alert("알림", "먼저 기설 루트 [분석]을 클릭해서 분석을 완료해 주세요.");
			return;
		}
		
		$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
		$("#jsonFieldString").val(JSON.stringify(columList[0]));
		$("#jsonDataString").val(JSON.stringify(datas));
		$("#jsonNewLineDataString").val(JSON.stringify(newLines));
		$("#frm_file_download").attr("action", url);
		$("#frm_file_download").submit();
	}
};
