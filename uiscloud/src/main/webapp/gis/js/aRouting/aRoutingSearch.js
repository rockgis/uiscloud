"use strict";

function getaRoutingSearchDetailLength (value, row, index){
	return row.fc.features.length;
} 

function getaRoutingSearchDetailLastCaMgno(value, row, index){
	return row.fc.features[row.fc.features.length - 1].caMgno;
}

function getaRoutingSearchDetailLastAddress(value, row, index){
	return row.fc.features[row.fc.features.length - 1].sido;
}

// IE 8 오류로 console 사용 금지
var aRoutingSearch = {
	// 엔터키 코드
	KEY_ENTER: 13,
	
	// 투자비산출기준
	byICost: $("#frmARouting :radio[name='byICost']"),
	
	// 혼합구분 
	sysClf: $("#frmARouting :radio[name='sysClf']"),
	
	// 망구분
	// 망구분 - SKT기간망링
	sktBbring: $("#frmARouting :checkbox[name='skt_bbring']"),
	
	// 망구분 - SKT중심국링
	sktCtring: $("#frmARouting :checkbox[name='skt_ctring']"),
	
	// 망구분 - SKT기지국링
	sktBsring: $("#frmARouting :checkbox[name='skt_bsring']"),
	
	// 망구분 - SKT중계기P2P
	sktRfptp: $("#frmARouting :checkbox[name='skt_rfptp']"),
	
	// 망구분 - SKT기타
	sktEtc: $("#frmARouting :checkbox[name='skt_etc']"),
	
	// 망구분 - SKB링
	skbRing: $("#frmARouting :checkbox[name='skb_ring']"),
	
	// 한전배전
	gisCode: $("#frmARouting :checkbox[name='gisCode']"),
	
	// cost 산출조건
	byCost: $("#frmARouting :radio[name='byCost']"),

	// BBOX 영역설정
	bufferArea: $("#frmARouting :radio[name='bufferArea']"),	
	bufferAreaTxt: $("#frmARouting .bufferAreaTxt"),
	
	// 접속코어수
	conCoreCount: $("#frmARouting .conCoreCount"),
	
	// 신설포설단가
	newPpPrice: $("#frmARouting .newPpPrice"),

	// 용량조건(% 이하)
	capacity: $("#frmARouting .capacity"),
	
	// 잔여코어용량(개수 이상)
	remainCapacity: $("#frmARouting .remainCapacity"),
	
	// 접속점조건(개수 이상)
	// connectingPointCount: $("#frmARouting .connectingPointCount"),
	
	// 매설위치 구분
	ungrLoc: $("#frmARouting :checkbox[name='ungrLoc']"),
	
	// 코어용량(이상)
	coreCount: $("#frmARouting .coreCount"),
	

	// 엑셀 다운로드용 테이블 헤더
	columList: null,
	
	// 엑셀 다운로드용 테이블 바디
	datas: null,
	
	// 검색 결과 데이터 그리드 클릭 및 더블 클릭을 위해 원본 저장
	originalDatas: null,

	// Hub반경
	hubMeters: $("#frmARouting .hubMeters"),
	
	// 수요반경
	bldgMeters: $("#frmARouting .bldgMeters"),

	// 시도 ComboBox
	sidoComboBox: $("#frmARouting .sidoComboBox"),
	// 시군구 ComboBox
	sggComboBox: $("#frmARouting .sggComboBox"),
	// 읍면동 ComboBox
	emdComboBox: $("#frmARouting .emdComboBox"),

	source: [],
	
	sourcePoints: [],
	
	bboxes : [],
	
	targets: [],
	
	arrMarkers : [],
	
	demands: [],
	
	aRoutFeature : [],
	
	targetMarkers: {},
	
	bldgWkt: {},
	
	bbox: "",
	
	bboxFeature : "",
	
	boundFeature : [],
	
	type: "",

	//다각형
	polyWkt : "",
	
	polyFeature : "",
	
	centerX: "",
	
	centerY: "",
	
	itemPathLayerIndex: 99,
	
	demandMarkersLayerIndex: 88,
	
	markersLayerIndex: 89,
	
	bboxBuffer : 3,
	
	// 시작점 버튼
	startPointButton: $("#frmARouting .startPoint"),
	// 종료점 버튼
	finishPointButton: $("#frmARouting .finishPoint"),
	// BBOX 버튼
	bboxPointButton: $("#frmARouting .bboxPoint"),
	// 분석 버튼
	analyzeButton: $("#frmARouting .analyze"),
	// 다각형 툴 버튼
	drawPolyButton: $("#frmARouting .drawPoly"),
	//다각형 지우기
	bboxClearButton : $("#frmARouting .bboxClear"),
	// 엑셀 다운로드 
	downloadExcelButton: $("#frmARouting .downloadExcel"),
	// 지우기 버튼
	initPointButton: $("#frmARouting .initPoint"),
	// 초기화 버튼
	initPointAllButton: $("#frmARouting .initPointAll"),
	
	/**********************************************************************
	설명 : 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/ 	
	init: function() {
		var that = this;
		
		that.initUi();
		that.bindEvents();
		
		// 시도 & 시군구 & 읍면동 combobox 들 초기화
		that.initAddressComboBoxes();
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
		that.hubMeters.validatebox({
			validType : ["number"],
			tipPosition : "right"
		});
		that.bldgMeters.validatebox({
			validType : ["number"],
			tipPosition : "right"
		});
	},
	/**********************************************************************
	설명 : 시도 & 시군구 & 읍면동 combobox 들 초기화
	파라메터 :
	리턴값 :
	***********************************************************************/
	initAddressComboBoxes: function() {
		var that = this;
		
		setAddressComboBoxes(that.sidoComboBox, that.sggComboBox, that.emdComboBox, that.liComboBox);
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
		
		// 다각형
		that.drawPolyButton.click(function() {
			that.selectDrawPoly();
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
		
		// 다운로드 버튼 클릭 이벤트
		that.downloadExcelButton.click(function() {
			that.downloadExcel();
		});
	},
	
	/**********************************************************************
	설명 : 검색창 리셋
	파라메터 :
	리턴값 :
	***********************************************************************/
	reset: function() {
		var that = this;


		that.source = [];
		that.sourcePoints = [];
		that.targets = [];
		that.demands = [];
		that.targetMarkers = {};
		that.bldgWkt = {};
		that.polyGeom = "";
		
		//that.selectStart();
	},
	
	clearBbox: function() {
		var bbox_layer = map.getLayer("a_bbox_layer");
		if(bbox_layer == null) {
			bbox_layer = new BiesVector("a_bbox_layer");
			bbox_layer.id = "a_bbox_layer";
			map.addLayer(bbox_layer);
		}
		bbox_layer.removeAllFeatures();
	},

	clearPolygon: function() {
		var polygon_layer = map.getLayer("poly_layer");
		if(polygon_layer == null) {
			polygon_layer = new BiesVector("poly_layer");
			polygon_layer.id = "poly_layer";
			map.addLayer(polygon_layer);
		}
		polygon_layer.removeAllFeatures();
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
		
		// demand markers
		var demandMarkers = map.getLayer("DemandMarkers");
		if(demandMarkers) demandMarkers.clearMarkers();
	},
	
	/**********************************************************************
	설명 : 검색
	파라메터 :
	리턴값 :
	***********************************************************************/
	analyze: function() {
		var that = this;

		// that.findTargets(that.source);
		// that.calculateRouting();
		
		var routingCondition = that.checkSubmitData();
		
		// analyze
		//&& that.targets.length > 0
		if(routingCondition != null && that.source.length > 0 ) {
			that.calculateRouting(routingCondition);
		} else {
			$.messager.alert("상위국을 선택하세요.");
		}
	},	
	
	checkSubmitData: function() {
		var that = this;

		/*
		if(that.source.length == 0 ) {
			$.messager.alert("상위국을 선택하세요.");
			return;
		}
		*/
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
		validItem = that.hubMeters;		
		if(!validItem.validatebox("isValid")) {
			validItem.focus();
			return;
		}
		validItem = that.bldgMeters;		
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
			// nonStopOverPoints: null,
			// nonStopOverLines: null
			// stopOverPoints: null,
			// stopOverLines: null
			// netClfs: null
			
			hubMeters: null,
			bldgMeters: null,
			lglCd:  null
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
//		for(i = 0; i < that.netClf.length; i++) {
//			if(that.netClf[i].checked === true) {
//				routingCondition.netClfs.push(that.netClf[i].value);
//			}
//		}
		
		// hub반경
		routingCondition.hubMeters = that.hubMeters.val();

		// 수요반경
		routingCondition.bldgMeters = that.bldgMeters.val();

		var sidoLglCd = that.sidoComboBox.combobox('getValue') || 0;
		var sggLglCd = that.sggComboBox.combobox('getValue') || 0;
		var emdlLglCd = that.emdComboBox.combobox('getValue') || 0;
		var lglCd = "";

		
		if(sidoLglCd !== 0 && sggLglCd == 0){
			$.messager.alert("시군구를 선택하세요.");
			return;
		}
		else {
			if(emdlLglCd !== 0) {
				lglCd = emdlLglCd;
			} else if(sggLglCd !== 0) {
				lglCd = sggLglCd;
			} else if(sidoLglCd !== 0){
				lglCd = sidoLglCd;
			};
		}
		
		// 주소
		routingCondition.lglCd = lglCd;
		
		return routingCondition;
	},

	selectStart: function() {
		// $.messager.alert("시작점을 선택하세요");
		var that = this;

//		this.source = [];
//		this.sourcePoints = [];
//		this.targets = [];
//		this.demands = [];
//		this.targetMarkers = {};
//		this.bldgWkt = {};
//		// this.bbox = "";
//		this.bboxes = [];
		
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
		
		map.setLayerIndex(itemPathLayer, that.itemPathLayerIndex);
		//itemPathLayer.removeAllFeatures();
		
		// markers
		var markers = map.getLayer("Markers");
		if(markers == null) {
			markers = new OpenLayers.Layer.Markers( "Markers" );
			markers.id = "Markers";
			map.addLayer(markers);
			map.setLayerIndex(markers, that.markersLayerIndex);
		}
		//markers.clearMarkers();
		
		// demandMarkers
		var demandMarkers = map.getLayer("DemandMarkers");
		if(demandMarkers == null) {
			demandMarkers = new OpenLayers.Layer.Markers( "DemandMarkers" );
			demandMarkers.id = "DemandMarkers";
			map.addLayer(demandMarkers);
			map.setLayerIndex(demandMarkers, that.demandMarkersLayerIndex);
		}
		//demandMarkers.clearMarkers();
		
		// 수요반경
		var demand_layer = map.getLayer("demand_layer");
		if(demand_layer == null) {
			demand_layer = new BiesVector("demand_layer");
			demand_layer.id = "demand_layer";
			map.addLayer(demand_layer);
		}
		//demand_layer.removeAllFeatures();
		
		// 기존 타켓에서 수요지점까지 라인(신규포설)을 그릴 레이어를 확인한다. 
		var newRoutingPathLayer = map.getLayer("new_routing_path_layer");
		if(newRoutingPathLayer == null) {
			newRoutingPathLayer = new BiesVector("new_routing_path_layer");
			newRoutingPathLayer.id = "new_routing_path_layer";
			map.addLayer(newRoutingPathLayer);
		}
		//newRoutingPathLayer.removeAllFeatures();

		this.type =  "start";
		this.selectEdge("start");
	},
	
	selectEnd: function() {
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

	selectInitPoint: function() {
		var that = this;		

		this.selectEdge("initPoint");
	}, 
	selectInitPointAll: function() {
		var that = this;		
		var markers = map.getLayer("Markers");
		var demandMarkers = map.getLayer("DemandMarkers"); 
		if(that.arrMarkers != null){	
			markers.clearMarkers();	
			demandMarkers.clearMarkers();	
			that.source = [];
			that.sourcePoints = [];
			that.targets = [];
			that.demands = [];
			that.targetMarkers = {};
			that.bldgWkt = {};
			// this.bbox = "";
			that.bboxes = [];
		}
	},
	selectDrawPoly: function() {		
		var that = this;
		
		that.polyWkt = "";

		for(var i in map.controls) {
			if(map.controls[i].type != OpenLayers.Control.TYPE_TOGGLE && map.controls[i].id != "pan") {
				map.controls[i].deactivate();	
			}
		}
		
		var layer = map.getLayer("poly_layer");
		if(layer == null) {
			layer = new BiesVector("poly_layer");
			layer.id = "poly_layer";
			map.addLayer(layer);
		}
		layer.removeAllFeatures();
		
		// 영역 선택 레이어를 젤 위로 올린다.
		map.raiseLayer(layer, map.layers.length);
		
		//컨트롤 생성
		var polygonControl = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Polygon, { 
			id : "drawPoly",
			handlerOptions: {
        		multiLine : false,
        		movePopup : true,
        		layerName : "poly_layer",
        		persistControl : true
    		}
		});
		map.addControl(polygonControl);	
		
		layer.events.on({
			"featureadded" : function(evt) {
				that.polyWkt = evt.feature.geometry.toString();
				that.polyFeature = evt.feature;
			}
		});		
		//컨트롤 활성화
		polygonControl.activate();
	}, 

	selectEdge: function(type) {
		var that = this;

		//컨트롤러 초기화
		for(var i in map.controls) {
			if(map.controls[i].type != OpenLayers.Control.TYPE_TOGGLE && map.controls[i].id != "pan") {
				map.controls[i].deactivate();	
			}
		}
		var layer = map.getLayer("routing_layer");
		if(layer == null) {
			layer = new BiesVector("routing_layer");
			layer.id = "routing_layer";
			map.addLayer(layer);
		}
		layer.events.remove("beforefeaturesadded");
		layer.events.remove("featureadded");

		layer.events.on({
			"featureadded" : function(evt) {
					var feature = evt.feature;
					
					layer.removeAllFeatures();
					
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
				
				if(id == -1) {

					if(type == "start") {
						$.messager.alert("상위국을 찾지못했습니다.");
					}
					return;
				}

				// add markers
				var url = "http://uiscloud.iptime.org:8180/geoserver/";
				
				var icon = url + "/www/symbol/red_b.png";				
				if(type == "start") {
					that.source.push(id);
					icon = url + "/www/symbol/red_b.png";
				}else {
					that.targets.push(id);
					icon = url + "/www/symbol/blue_b.png";
				}

				var markers = map.getLayer("Markers");
				if(markers == null) {
					markers = new OpenLayers.Layer.Markers( "Markers" );
					markers.id = "Markers";
					map.addLayer(markers);
					map.setLayerIndex(markers, that.markersLayerIndex);
				}
				
				// 마커 레이어를 젤 위로 올린다.
				map.raiseLayer(markers, map.layers.length);

				var size = new OpenLayers.Size(50, 45);
				var offset = new OpenLayers.Pixel(-(size.w/2) + 7, -size.h + 2);
				
				icon = new OpenLayers.Icon(icon, size, offset);
				var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
				marker.id = id;
				markers.addMarker(marker);
				that.arrMarkers.push(marker);
				// 종료점은 분석 후 경로를 못 찾은 경우 아이콘을 바꾸기 위해서 저장한다.
				if(type == "end") {
					that.targetMarkers[id] = marker;
					
				} else if(type == "start") {
					// that.sourcePoints.push(new OpenLayers.Geometry.Point(x, y));
					that.sourcePoints.push("POINT(" + x + " " + y + ")::N");

					// draw my boundary
					that.drawBoundary(x, y);
				} else if (type == "initPoint") {
					if(that.arrMarkers != null){	
						
						for(var i in that.arrMarkers){
							if(that.arrMarkers[i].id == id){					    
								markers.removeMarker(that.arrMarkers[i]);	
								for(var a in that.source){
									if(that.source[a] == id){
										that.source.splice( a, 1);
										that.sourcePoints.splice( a, 1);
									}
								}
								for(var b in that.targets){
									if(that.targets[b] == id){
										that.targets.splice( b, 1);
									}
								}
							}
						}
					}
					
				} 
				
				// 이동 기능 활성화
//				for(var i in map.controls) {
//					if(map.controls[i].type != OpenLayers.Control.TYPE_TOGGLE && !(map.controls[i].id == "pan" )|| (type == "end" && map.controls[i].id == "routing_selector"))) {
//						map.controls[i].deactivate();
//					}
//				}
				//if(type == "start") {
					//$("#btn_pan img").trigger("click");
					
					//that.findTargets(source);
				//}
			}
		});
	},
	
	drawBoundary: function(x, y) {
		var that = this;

		/*
		var bounds = new OpenLayers.Bounds();
		for (var x in that.sourcePoints) {
		    bounds.extend(that.sourcePoints[x]);
		}
		
		var center = bounds.getCenterLonLat();

		that.centerX = center.lon;
		that.centerY = center.lat;
		*/

		// 나의 영역 표시
		var wktReader = new jsts.io.WKTReader();
		var f = wktReader.read("POINT(" + x + " " + y + ")");
	    var jstsBuffer = f.buffer(parseInt(that.hubMeters.val()) * 1000);
	    
	    var parser = new jsts.io.OpenLayersParser();
	    var buffer = parser.write(jstsBuffer);

		var demand_layer = map.getLayer("demand_layer");
		if(demand_layer == null) {
			demand_layer = new BiesVector("demand_layer");
			demand_layer.id = "demand_layer";
			map.addLayer(demand_layer);
		}
		
		var entireBoundary = new OpenLayers.Feature.Vector(buffer, null, { fillColor: '#ffff00', fillOpacity: 0, strokeColor: '#ffff00'});
		demand_layer.addFeatures([entireBoundary]);
		that.boundFeature.push([entireBoundary][0]);

		// my bbox based boundary
	    var buffer = jstsBuffer.buffer(that.bboxBuffer * 1000); // buffer => 3 km
	    buffer = buffer.getEnvelope();
	    that.bboxes.push(buffer);
	},
	
	findTargets: function(source) {
		var that = this;

		//var paramX = x;
		//var paramY = y;

		$.ajax({
			type: "POST",
			url: "/gis/mrouting/findTargets",
			data: {
//				  'x': x,
//				  'y': y,
				  'source' : that.source.join(),
				  'hubMeters':that.hubMeters.val(),
				  'bldgMeters': that.bldgMeters.val()
			},
			dataType: "json",
			success : function(data) {
				
				that.type = "addTargets";

				var geojson_format = new OpenLayers.Format.GeoJSON({
	                'internalProjection': map.baseLayer.projection,
	                'externalProjection': map.baseLayer.projection
	            });
			 /*   
			    /////////////////////////////////////////////////////////////////////////////////			    
			    /////////////////////////////////////////////////////////////////////////////////			    
			    /////////////////////////////////////////////////////////////////////////////////			    
			    /////////////////////////////////////////////////////////////////////////////////			    
			    /////////////////////////////////////////////////////////////////////////////////
				//
				// draw boundary demand
				//
				var demand_layer = map.getLayer("demand_layer");
				if(demand_layer == null) {
					demand_layer = new BiesVector("demand_layer");
					demand_layer.id = "demand_layer";
					map.addLayer(demand_layer);
				}
				demand_layer.removeAllFeatures();
				
				var wktReader = new jsts.io.WKTReader();

				// 전체 영역 표시
				var f = wktReader.read("POINT(" + paramX + " " + paramY + ")");
			    var buffer = f.buffer(parseInt(that.hubMeters.val()) * 1000);
			    
			    var parser = new jsts.io.OpenLayersParser();
			    buffer = parser.write(buffer);
			    
				var entireBoundary = new OpenLayers.Feature.Vector(buffer, null, { fillColor: '#ffff00', fillOpacity: 0, strokeColor: '#ffff00'});
				demand_layer.addFeatures([entireBoundary]);
				
				// 수요건물 boundary 표시
				var bldgMeters = that.bldgMeters.val();

				var demands = data.demands;
				var demandsLength = demands.length;
				for (var i = 0; i < demandsLength; i++) {
					var f = demands[i];
					var feature = wktReader.read(f);

				    var buffer = feature.buffer(bldgMeters);
				    
				    var parser = new jsts.io.OpenLayersParser();
				    buffer = parser.write(buffer);
					
					var demandBoundary = new OpenLayers.Feature.Vector(buffer, null, { fillColor: '#ffff00', fillOpacity: 0, strokeColor: '#088A08', strokeDashstyle: 'dash'});
					demand_layer.addFeatures([demandBoundary]);
				}

			    /////////////////////////////////////////////////////////////////////////////////			    
			    /////////////////////////////////////////////////////////////////////////////////			    
			    /////////////////////////////////////////////////////////////////////////////////			    
			    /////////////////////////////////////////////////////////////////////////////////			    
			    /////////////////////////////////////////////////////////////////////////////////

				var results = data.results;
				var targetLength = results.length;
				
				// 검색된 결과가 없으면 종료
				if (targetLength == 0) {
					$.messager.alert("검색된 지점이 없습니다.");
					return;
				}
				
				// add features

				var layer = map.getLayer("routing_layer");
				
				var featuresByTarget = new Array();
				
				var mapExtent = map.getExtent();
				
				var markers = map.getLayer("Markers");
				map.setLayerIndex(markers, 89);
				
				for (var i = 0; i < targetLength; i++) {
					var f = results[i];
					var feature = geojson_format.read(f);

					// console.dir(feature[0]);
					
					var id = f.id;
					var bldgId = f.bldgId;
					var bldgWkt = f.bldgWkt;
					var x = feature[0].geometry.x;
					var y = feature[0].geometry.y;
					
					// console.dir(id + ", " + bldgId + ", " + x + ", " + y + ", " + feature);
					
					// targets에 저장한다.
					that.targets.push(bldgId + "::" + id);
					that.bldgWkt[bldgId] = bldgWkt;

					// add markers
					var url = "http://uiscloud.iptime.org:8180/geoserver";					
					var icon = url + "/www/symbol/blue_b.png";

					var size = new OpenLayers.Size(50, 45);
					var offset = new OpenLayers.Pixel(-(size.w/2) + 9, -size.h + 2);
					
					icon = new OpenLayers.Icon(icon, size, offset);
					var marker = new OpenLayers.Marker(new OpenLayers.LonLat(x, y), icon);
					markers.addMarker(marker);
					
					// 종료점은 분석 후 경로를 못 찾은 경우 아이콘을 바꾸기 위해서 저장한다.
					that.targetMarkers[bldgId + "::" + id] = marker;

					// save features
					//featuresByTarget[route.target] = features;
					
					mapExtent.extend(feature[0].geometry.getBounds());
				}
				// layer.redraw();
				
				// 모든 feature가 보이도록 줌한다.
				// map.zoomToExtent(layer.getDataExtent());
				map.zoomToExtent(mapExtent);
				
				// that.analyze();
*/			}
		});
	},
	
	drawBbox: function() {
		var that = this;

		// deactivate bbox_selector
		var bbox_selector;
		var bbox_selectors = map.getControlsBy("id", "a_bbox_selector");
		if (bbox_selectors.length > 0) {
			bbox_selector = bbox_selectors[0];
			bbox_selector.deactivate();
		}

		// init other bbox layer
		var pg_bbox_layer = map.getLayer("bbox_layer");
		if(pg_bbox_layer != null) {
			pg_bbox_layer.removeAllFeatures();
		}
		var k_bbox_layer = map.getLayer("k_bbox_layer");
		if(k_bbox_layer  != null) {
			k_bbox_layer.removeAllFeatures();
		}
		
		// init bbox layer
		var bbox_layer = map.getLayer("a_bbox_layer");
		if(bbox_layer == null) {
			bbox_layer = new BiesVector("a_bbox_layer");
			bbox_layer.id = "a_bbox_layer";
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
	    		$.messager.alert("검색영역을 입력하세요.");
	        	that.bufferAreaTxt.val("");
	        	that.bufferAreaTxt.focus();
	    		return;
	    	}
	    	
	    	// validate char
	        if (isNaN(bufferArea)) {
	        	$.messager.alert("영역은 숫자만 입력가능합니다.");
	        	that.bufferAreaTxt.val("");
	        	that.bufferAreaTxt.focus();
	    		return;
	        }
	    	
	        bufferArea = parseInt(bufferArea) || 0;
	    }
		
	    // bbox selector를 제거한다.
		var bbox_selectors = map.getControlsBy("id", "a_bbox_selector");
		if(bbox_selectors.length > 0) {
			bbox_selector = bbox_selectors[0];
			for(var idx = 0; idx < bbox_selectors.length; idx++) {
				map.removeControl(bbox_selectors[idx]);
			}
		}
		
		var polyOptions = {sides: 4, angle: 0, irregular: true};
		bbox_selector = new OpenLayers.Control.DrawFeature(bbox_layer, OpenLayers.Handler.RegularPolygon, { handlerOptions: polyOptions, id : "a_bbox_selector" });
		bbox_selector.events.register("featureadded", ' ' , function(evt) {
			var feature = evt.feature;

			var reader = new jsts.io.WKTReader();
		    var input = reader.read(feature.geometry.toString());

		    var buffer = input.buffer(bufferArea * 1000);
		    buffer = buffer.getEnvelope();

		    var parser = new jsts.io.OpenLayersParser();
		    buffer = parser.write(buffer);

		    var feature1 = new OpenLayers.Feature.Vector(buffer, null, { fillColor: '#ffff00', fillOpacity: 0, strokeColor: '#ffff00'});
		    bbox_layer.addFeatures([feature1]);
		    that.bboxFeature = [feature1][0];
		    that.bbox = buffer.toString();
		    
		    bbox_selector.deactivate();
		    
		});
		map.addControl(bbox_selector);
		
		bbox_selector.activate();
	},
	
	calculateRouting: function(routingCondition) {

		//console.log("source : " + this.source);
		//console.log("endPoint : " + this.endPoint);

		var that = this;

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
		
		map.setLayerIndex(itemPathLayer, that.itemPathLayerIndex);
		itemPathLayer.removeAllFeatures();

		// deactivate routing_selector
		var routing_selectors = map.getControlsBy("id", "routing_selector");
		var routing_selector;
		if(routing_selectors.length > 0) {
			routing_selector = routing_selectors[0];
			routing_selector.deactivate();
		}
		
		// demandMarkers
		var demandMarkers = map.getLayer("DemandMarkers");
		if(demandMarkers == null) {
			demandMarkers = new OpenLayers.Layer.Markers( "DemandMarkers" );
			demandMarkers.id = "DemandMarkers";
			map.addLayer(demandMarkers);
			map.setLayerIndex(demandMarkers, that.demandMarkersLayerIndex);
		}
		demandMarkers.clearMarkers();
		
		// change pan image
		$("#btn_pan img").trigger("click");

//		var gridId = "";
		
		var layer = map.getLayer("routing_layer");
		layer.events.remove("beforefeaturesadded");
		layer.events.remove("featureadded");
		
		
		$.ajax({
			type: "POST",
			url: "/gis/mrouting",
			data: {
				  'sourcePoints': that.sourcePoints.join(),
				  'targets' : that.targets.join(),
				  'demands' : that.demands.join(),
				  'source': that.source.join(),
				  'polyWkt' : that.polyWkt,
				  
				  // 'nonStopOverPoints': routingCondition.nonStopOverPoints,
				  // 'nonStopOverLines': routingCondition.nonStopOverLines,
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
				  'bboxes': that.bboxes.join("_BBOX_"),
				  'bbox': that.bbox,

				  // 'stopOverPoints': that.stopOverPoints.join(),
				  // 'stopOverLines': that.stopOverLines.join(),
				  'capacity': routingCondition.capacity,
				  'remainCapacity': routingCondition.remainCapacity,
				  // 'connectingPointCount': routingCondition.connectingPointCount,
				  'ungrLocs': routingCondition.ungrLocs,
				  'coreCount': routingCondition.coreCount,
				  // 'netClfs': routingCondition.netClfs,
				  
				  'hubMeters' : routingCondition.hubMeters,
				  'bldgMeters' : routingCondition.bldgMeters,
				  'lglCd': routingCondition.lglCd
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

				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// 경로를 못 찾은 것들을 처리한다.
				/*
				var notfounds = data.notfounds;
				var notfoundsLength = notfounds.length;
				var i = 0;
				
				for(i = 0; i < notfoundsLength; i++) {
					var target = notfounds[i];
					var marker = that.targetMarkers[target];
					
					var icon = marker.icon;
					var size = new OpenLayers.Size(30, 27);
					icon.size = size;
					icon.offset = new OpenLayers.Pixel(-(size.w/2), -size.h + 2);

					var url = "http://uiscloud.iptime.org:8180/geoserver";
					var icon = url + "/www/symbol/notfound.png";
					marker.setUrl(icon);
				}
				*/
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////

				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// 경로를 찾은 것들을 처리한다.
				var results = data.results;
				var targetLength = results.length;

				var featuresByTarget = [];
				
				var startMarkerZindex = 1;
				var i = 0;
				var j = 0;
				var k = 0;
				var len = 0;
				var jLen = 0;

				// 기존 타켓에서 수요지점까지 라인(신규포설)을 그릴 레이어를 확인한다.
				/*
				var newRoutingPathLayer = map.getLayer("new_routing_path_layer");
				if(newRoutingPathLayer == null) {
					newRoutingPathLayer = new BiesVector("new_routing_path_layer");
					newRoutingPathLayer.id = "new_routing_path_layer";
					map.addLayer(newRoutingPathLayer);
				}
				*/

				var demandMarkers = map.getLayer("DemandMarkers");
				map.setLayerIndex(demandMarkers, that.demandMarkersLayerIndex);
				
				var markers = map.getLayer("Markers");
				
				for (i = 0; i < targetLength; i++) {
					var route = results[i];
					var fc = route.fc;
					var features = geojson_format.read(fc);
					
					/*
					for(j = 0, len=features.length; j < len; j++) {
						for(k = 0, jLen=fc.features.length; k < jLen; k++) {
							if(features[j].fid == fc.features[k].id) {
								var strokeColor = "#ff0000";
								var fillColor = "#ff0000";
								var strokeDashstyle = "solid";
								if(fc.features[k].gisCode == "CA005") {
									fillColor = "#0134ac";
									strokeColor = "#0134ac";
								}
								else if(fc.features[k].gisCode == "CA006") {
									strokeDashstyle = "dash";
									fillColor = "#0033ad";
									strokeColor = "#0033ad";
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
									strokeDashstyle = "dash";
									fillColor = "#ff3300";
									strokeColor = "#ff3300";
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
								break;
							}
						}
					}
					*/
					
					var wktReader = new jsts.io.WKTReader();
					
					// target position
					var targetId = route.targetId;
					var targetWkt = route.targetWkt;
					var f = wktReader.read(targetWkt);
					var orgPos = new OpenLayers.LonLat(f.getX(), f.getY());
					
					// 수요지점 position
					var demandWkt = route.demandWkt;
					var f = wktReader.read(demandWkt);
					var newPos = new OpenLayers.LonLat(f.getX(), f.getY());
					
					// add markers
					var url = "http://uiscloud.iptime.org:8180/geoserver/";					
					var icon = url + "/www/symbol/blue_b.png";

					var size = new OpenLayers.Size(50, 45);
					var offset = new OpenLayers.Pixel(-(size.w/2) + 7, -size.h + 2);
					
					icon = new OpenLayers.Icon(icon, size, offset);
					var marker = new OpenLayers.Marker(new OpenLayers.LonLat(newPos.lon, newPos.lat), icon);
					demandMarkers.addMarker(marker);
					that.arrMarkers.push(marker);
					// 사용자가 지정한 기존 마커를 삭제한다.
					var marker = that.targetMarkers[targetId];
					if(marker) {
						markers.removeMarker(marker);
					}
					
					// 기존 타켓에서 수요지점까지 라인(신규포설)을 그린다.
					/*
					var points = new Array(
					   new OpenLayers.Geometry.Point(orgPos.lon, orgPos.lat),
					   new OpenLayers.Geometry.Point(newPos.lon, newPos.lat)
					);

					var style = { 
						strokeColor: '#0000ff', 
						strokeOpacity: 0.5,
						strokeWidth: 6
					};

					var newRoutingPath = new OpenLayers.Geometry.LineString(points);
					var newRoutingPathFeature = new OpenLayers.Feature.Vector(newRoutingPath, null, style);
					newRoutingPathLayer.addFeatures([newRoutingPathFeature]);
					*/

					// 아이콘 표시
					/*
					var icon = marker.icon;
					var size = new OpenLayers.Size(50, 45);
					icon.size = size;
					icon.offset = new OpenLayers.Pixel(-(size.w/2) + 8, -size.h + 2);

					var url = "http://uiscloud.iptime.org:8180/geoserver";
					var icon = url + "/www/symbol/blue_b.png";
					marker.setUrl(icon);
					*/

					// redraw
					// layer.addFeatures(features);
					
					// save features
					featuresByTarget[route.targetId] = features;
				}
				layer.redraw();
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////


				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// 삭제할 마커들을 삭제한다.
				/*
				var markers = map.getLayer("Markers");
				var targetsToDelete = data.targetsToDelete;
				
				// console.dir("targetsToDelete : " + targetsToDelete);
				
				var targetsToDeleteLength = targetsToDelete.length;
				var i = 0;
				var j = 0;
				
				for(i = 0; i < targetsToDeleteLength; i++) {
					var targetId = targetsToDelete[i];
					var marker = that.targetMarkers[targetId];
					if(marker) {
						markers.removeMarker(marker);
					}
				}
				markers.redraw(true);
				*/
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////


				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// 아무런 경로가 탐색되지 않은 수요에 마커들을 표시한다.
				var notReachableBldg = data.notReachableBldg;
				
				// console.dir("notReachableBldg : " + notReachableBldg);
				
				var notReachableBldgLength = notReachableBldg.length;
				for(i = 0; i < notReachableBldgLength; i++) {
					var bldgId = notReachableBldg[i].demandId;
					var bldgWkt = notReachableBldg[i].wkt;
					if(bldgWkt != "" && bldgWkt.length > 0) {
						var wktReader = new jsts.io.WKTReader();
						
						// 전체 영역 표시
						var f = wktReader.read(bldgWkt);
	
						// add markers
						var url = "http://uiscloud.iptime.org:8180/geoserver/";					
						var icon = url + "/www/symbol/notfound.png";
	
						var size = new OpenLayers.Size(30, 27);
						var offset = new OpenLayers.Pixel(-(size.w/2), -size.h + 2);
						
						icon = new OpenLayers.Icon(icon, size, offset);
						var marker = new OpenLayers.Marker(new OpenLayers.LonLat(f.getX(), f.getY()), icon);
						demandMarkers.addMarker(marker);
						that.arrMarkers.push(marker);
					}	
				}
				demandMarkers.redraw(true);
				
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				////////////////////////////////////////////////////////////////////////////////////////////////////////////
				
				
				
				
				// grid

				var onclickRow = function(obj, rowIndex) {
					var layer = map.getLayer("routing_layer");
					layer.redraw();
					layer.redraw(true);
	        		
					var getRowValue = $(obj).datagrid("getSelected");

					// clear routing_item_path_layer
					var itemPathLayer = map.getLayer("routing_item_path_layer");
					if(itemPathLayer == null) {
						itemPathLayer = new BiesVector("routing_item_path_layer");
						itemPathLayer.id = "routing_item_path_layer";
						map.addLayer(itemPathLayer);
					}
					
					map.setLayerIndex(itemPathLayer, that.itemPathLayerIndex);
					itemPathLayer.removeAllFeatures();

	        		// find fearureCollections by target
	        		var selectedTarget = getRowValue.targetId;
	        		
					for(i = 0; i < targetLength; i++) {
						var route = results[i];
						if(route.targetId == selectedTarget) {
							
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
							for(j = 0; j < featuresByTarget[selectedTarget].length; j++) {
								features.push(featuresByTarget[selectedTarget][j].clone());
								that.aRoutFeature.push(features[j]);
							}
							//var features = featuresByTarget[selectedTarget];
							pathLayer.addFeatures(features);
							
							break;
						}
					}
					
//					// 팝업창으로 세부 경로 보여주기
//					var winDetailPath = window.open("", "winDetailPath", "scrollbars=no,toolbar=no,resizable=no,width=900,height=700,left=100,top=100");
//					winDetailPath.focus();
//					
//					$("#hid_detail").val(JSON.stringify(getRowValue.fc.features));
////					$("#frm_detailPath").attr("action", "/gis/arouting/detailPath");
////					$("#frm_detailPath").attr("target", "winDetailPath");
//					$("#frm_detailPath").submit();
	        	};
								
				var ondblClickRow = function(obj, rowIndex) { 	
					// 팝업창으로 K-다익스트라 세부 경로 보여주기
					var winDetailPath = window.open("", "winDetailPath", "scrollbars=no,toolbar=no,resizable=no,width=960,height=700,left=100,top=100");
					winDetailPath.focus();
					
					var getRowValue = that.originalDatas[rowIndex];
					console.log(getRowValue)
					$("#hid_detail").val(JSON.stringify(getRowValue.fc.features));
					$("#frm_detailPath").attr("action", "/gis/krouting/detailPath");
//					$("#frm_detailPath").attr("target", "winDetailPath");
					$("#frm_detailPath").submit();	        		
	        	};
	        	
				var id = "routingInfo";
				var title = "기설선번순번";
				var gridId = "";
//				gridId = that.addDatagridTab(id, title, true, data.features, function(obj, rowData){
				gridId = that.addDatagridTab(id, title, true, results, onclickRow, ondblClickRow);
				if(tabObj[gridId]){
					tabObj[gridId].push(that.aRoutFeature);
				}else{
					tabObj[gridId] = that.aRoutFeature;
				}
				if(that.bboxFeature != ""){
					tabObj[gridId].push(that.bboxFeature);
				}
				if(that.polyFeature != ""){
					tabObj[gridId].push(that.polyFeature);
				}
				if(that.boundFeature != ""){
					for(var t in that.boundFeature){
					 tabObj[gridId].push(that.boundFeature[t]);
					}
				}
				/*
				that.addDatagridTab(id, title, true, results, function(obj, rowData) {

					var layer = map.getLayer("routing_layer");
					layer.redraw();
					layer.redraw(true);
	        		
					var getRowValue = $(obj).datagrid("getSelected");

					// clear routing_item_path_layer
					var itemPathLayer = map.getLayer("routing_item_path_layer");
					if(itemPathLayer == null) {
						itemPathLayer = new BiesVector("routing_item_path_layer");
						itemPathLayer.id = "routing_item_path_layer";
						map.addLayer(itemPathLayer);
					}
					
					map.setLayerIndex(itemPathLayer, that.itemPathLayerIndex);
					itemPathLayer.removeAllFeatures();

	        		// find fearureCollections by target
	        		var selectedTarget = getRowValue.target;
					for(i = 0; i < targetLength; i++) {
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
							for(j = 0; j < featuresByTarget[selectedTarget].length; j++) {
								features.push(featuresByTarget[selectedTarget][j].clone());
							}
							//var features = featuresByTarget[selectedTarget];
							pathLayer.addFeatures(features);
							
							break;
						}
					}
					
//					// 팝업창으로 세부 경로 보여주기
//					var winDetailPath = window.open("", "winDetailPath", "scrollbars=no,toolbar=no,resizable=no,width=900,height=700,left=100,top=100");
//					winDetailPath.focus();
//					
//					$("#hid_detail").val(JSON.stringify(getRowValue.fc.features));
////					$("#frm_detailPath").attr("action", "/gis/arouting/detailPath");
////					$("#frm_detailPath").attr("target", "winDetailPath");
//					$("#frm_detailPath").submit();
	        	});
	        	*/
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
	    
	    var cableCountForSKT = 0; // T 케이블수
	    var cableCountForSKB = 0; // B 케이블수
	    
	    var cableCostSumForSKT = 0; // T 케이블 cost필드의 합
	    var cableCostSumForSKB = 0; // B 케이블 cost필드의 합
	    
	    // T 사용코어수 합
	    var totalUserCoreCountForSKT = 0;
	    // B 사용코어수 합
	    var totalUserCoreCountForSKB = 0;
	    
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
		
		var sktCableInfos = {};
		var skbCableInfos = {};
		var keCableInfos = {};
		
		var stdCostX = 0;
	    var stdCostY = 0;
	    
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
			    		
			    		cableCostSumForSKT += route["bCost"]? Number(route["bCost"]): 0;
			    		//stdCostX = route["bCost"]? Number(route["bCost"]): 0;
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
			    		
			    		cableCostSumForSKB += route["bCost"]? Number(route["bCost"]): 0;
			    		//stdCostX = route["bCost"]? Number(route["bCost"]): 0;
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
			var res = routes.target.split("::");
			summary.targetId = res[1];
			// 수요 id
			summary.demandId = routes.demandId;
			// 하나의 경로에 포함된 케이블 수
			summary.cableCount = cableCount; 
		    // T 총길이
    		summary.totalLengthForSKT = gfnFormatNumber(totalLengthForSKT);
    		// B 총길이
    		summary.totalLengthForSKB = gfnFormatNumber(totalLengthForSKB);
			// 신설(KE) 총길이
			summary.totalLengthForKE = gfnFormatNumber(totalLengthForKE);
			// 인입길이
			summary.entranceLength = gfnFormatNumber(routes.entranceLength);
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
			summary.targetBdName = routes.fc.features[cableCount - 1].bdName;
			
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
//	    		var DemandMarkers = map.getLayer("DemandMarkers");
//	    		var aRoutingNew = map.getLayer("aRoutingNew");
//	    		if(features) {
//	    			
//	    		   gfnGetLayer("a_bbox_layer").removeFeatures(features);
//	    		   gfnGetLayer("demand_layer").removeFeatures(features);	    		   
//	    		   gfnGetLayer("routing_path_layer").removeFeatures(features);
//	    		   gfnGetLayer("routing_layer").removeFeatures(features);
//	    		   gfnGetLayer("routing_item_path_layer").removeFeatures(features);
//	    		   if(gfnGetLayer("non_stop_over_lines_layer") != null){
//	    			   gfnGetLayer("non_stop_over_lines_layer").removeFeatures(features);
//	    		   }
//	    		   if(gfnGetLayer("stop_over_lines_layer") != null){
//	    			   gfnGetLayer("stop_over_lines_layer").removeFeatures(features);
//	    		   }
//	    		   if(aRoutingNew != null){
//	    			   aRoutingNew.removeAllFeatures();
//	    		   }
//	    		   gfnGetLayer("poly_layer").removeFeatures(features);
//	    		   
//
////				   that.targets = [];
////				   that.source = [];
////                 that.sourcePoints = [];					
//                   that.bboxes = [];
//                   that.demands= [];
//	    		   delete tabObj[id];
//	    		}
////	    		if(marker) {
////	    			for(var z=0; z < marker.length; z++){
////	    				markers.removeMarker(marker[z]);
////	    				DemandMarkers.removeMarker(marker[z]);
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

//	    var tabid = $('#div_bottom_tab').tabs('getSelected').prop('id');
	    that.columList = columList;
	    that.datas = newDatas;
//	    tabData[tabid] = newDatas;
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
	addDatagridTabOld: function (id, title, singleSelect, datas, onclickRow) {
		var that = this;

		if(datas.length == 0){
			$.messager.alert("알림", "검색결과가 없습니다.");
			return false;
		}
		
		$("#div_layout").layout("expand", "south");
		// 객체를 복제시킴. 서로 데이터가 물고 있어서 칼럼 크기 변경시 오동작을 발생시키기 때문.
	    var newCols = JSON.parse(JSON.stringify(that.gridColumns));
	    
	    // 콤마 들어가게 포맷터 넣기. 메소드는 json으로 넘어가지 않기 때문.	    
	    newCols[0].formatter = gfnFormatNumber; // 순번
	    newCols[0].sorter = gfnNumberSorter; // 순번	    
	    newCols[3].formatter = gfnFormatNumber;
	    newCols[3].sorter = gfnNumberSorter;	    
	    newCols[4].formatter = gfnFormatNumber;
	    newCols[4].sorter = gfnNumberSorter;	    
	    newCols[5].formatter = gfnFormatNumber;
	    newCols[5].sorter = gfnNumberSorter;	    
	    newCols[6].formatter = gfnFormatNumber;
	    newCols[6].sorter = gfnNumberSorter;	    
	    newCols[7].formatter = gfnFormatNumber;
	    newCols[7].sorter = gfnNumberSorter;	     
	    newCols[8].formatter = gfnFormatNumber;
	    newCols[8].sorter = gfnNumberSorter;	    
	    newCols[9].formatter = gfnFormatNumber;
	    newCols[9].sorter = gfnNumberSorter;	    
	    newCols[10].formatter = gfnFormatNumber;
	    newCols[10].sorter = gfnNumberSorter;	    
	    newCols[11].formatter = gfnFormatNumber;
	    newCols[11].sorter = gfnNumberSorter;
	    
//	    newCols[2].formatter = getaRoutingSearchDetailLength; // 하나의 경로에 포함된 케이블 수 
//	    newCols[3].formatter = getaRoutingSearchDetailLastCaMgno; // 도착지 시설관리고유번호
//	    newCols[4].formatter = getaRoutingSearchDetailLastAddress; // 도착지 주소
	    	    
//	    newCols[2].title = "케이블 수";
//	    newCols[3].title = "도착지 시설관리고유번호";

	   //	    newCols[6].formatter = gfnFormatNumber;	// 사용코어수
	    
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
	    
	    //$("#div_bottom_tab").tabs("resize");
	    
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
	        },
	    	onDblClickRow : function(rowIndex, rowData){
	            if(onDblClickRow) {
	            	onDblClickRow(rowIndex, rowData);
	            }
	        },
	        onRowContextMenu : function(e, rowIndex, rowData) {
//	        	if(onRowContextMenu) {
//	        		onRowContextMenu(rowIndex, rowData);
//	        	} else 
	            if(onDblClickRow) {
	            	onDblClickRow(rowIndex, rowData);
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
       	, {field:"demandId",title:"seq(수요 id)", width:120, halign:"center", align:"center", sortable: true, checkbox:false}
       	, {field:"targetId",title:"target id", width:120, halign:"center", align:"center", sortable: true, checkbox:false}
       	, {field:"cableCount", title:"케이블 피스수", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"totalLengthForSKT", title:"SKT 길이", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"totalLengthForSKB", title:"SKB 길이", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"totalLengthForKE", title:"신설길이", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"entranceLength", title:"인입길이", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"investmentCost", title:"투자비(만원)", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"rentCost", title:"임차비(만원)", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"remandCoreMin", title:"잔여코어 최소량", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"useCoreRateMax", title:"코어사용률 최대량", width:120, halign:"center", align:"right", sortable: true, checkbox:false, formatter: gfnFormatNumber, sorter: gfnNumberSorter}
       	, {field:"sourceAddress", title:"상위국 주소", width:120, halign:"right", align:"center", sortable: true, checkbox:false}
       	, {field:"targetAddress", title:"하위국 주소", width:120, halign:"right", align:"center", sortable: true, checkbox:false}
       	, {field:"targetBdName", title:"하위국 시설물명", width:120, halign:"right", align:"center", sortable: true, checkbox:false}
    ],
	
	/**********************************************************************
	설명 : 지도&엑셀 출력
	파라메터 :
	리턴값 :
	***********************************************************************/
    downloadExcel: function() {
	    var that = this;

	    //var tabid = $('#div_bottom_tab').tabs('getSelected').prop('id');
		var url = "/gis/mrouting/downloadExcel";
		var columList = that.columList;
		var datas = that.datas;
		
		if(columList === null || datas === null) {
			$.messager.alert("알림", "먼저 기설 루트 [분석]을 클릭해서 분석을 완료해 주세요.");
			return;
		}
		
		$("#hid_data").val(encodeURIComponent(saveMap.getXML()));
		$("#jsonFieldString").val(JSON.stringify(columList[0]));
		$("#jsonDataString").val(JSON.stringify(datas));
		$("#frm_file_download").attr("action", url);
		$("#frm_file_download").submit();
	},
	
	drawPartical: function(geometry) {
		var that = this;
		
		var itemPathLayer = map.getLayer("routing_item_path_layer");
		if(itemPathLayer == null) {
			itemPathLayer = new BiesVector("routing_item_path_layer");
			itemPathLayer.id = "routing_item_path_layer";
			map.addLayer(itemPathLayer);
		}
//		var id = $('#div_bottom_tab').tabs('getSelected').prop('id');
		map.setLayerIndex(itemPathLayer, that.itemPathLayerIndex);
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
//		if(!tabObj[id]){	        			
//			tabObj[id] = feature[0];	        			
//		}else{				
//			tabObj[id].push(feature[0]);
//		}
	}
	
	
};