/**
파일명 : mainMap.js
설명 : 지도 화면과 관련된 기능 
 
 수정일       수정자   수정내용
 ----------   -------  --------------------------------------------------
 2013.09.27 최원석	최초생성
 2013.12.16   정봉화   생성된 초기화에서 정보 풍선도움말(팝업)들도 지운다.
*/

/**********************************************************************
설명 :메인 지도 초기화
파라메터 :
리턴값 :
***********************************************************************/
function gfnInitMainMap() {
	map = gfnInitMap("div_map");														// 지도 초기화 - map.js
	gfnMainControl();																		// 메인지도 이벤트 연결 (확대, 축소, 이동, 전체, 이전, 다음, 거리, 면적, 초기화)
	
	gfnEventMap();																			// 지도 기본 기능 이벤트 연결
	gfnAppendBaseLayer(map);															// 지도 초기화 - /bies/js/mapsv/map.js
	gfnAppendWmsLayer(map, "biesLayer");										//  레이어 - /bies/js/mapsv/map.js 
	map.zoomToMaxExtent();
	spatialInfo.init(map);	// 정보보기 초기화 - /bies/js/mapsv/spatialInfo.js		
	
}

/**********************************************************************
설명 :메인 지도에서 사용할 컨트롤 생성 및 추가 (확대, 축소, 이동, 전체, 이전, 다음, 거리, 면적)
파라메터 :
리턴값 :
***********************************************************************/
function gfnMainControl() {
	// 거리, 면적 측정 스타일
	var measureStyleMap = new OpenLayers.StyleMap({
		'default': new OpenLayers.Style(null, {
			rules: [new OpenLayers.Rule({
				symbolizer : {
					"Point": {
						pointRadius: 4,
						graphicName: "square",
						fillColor: "#ffffff",
						fillOpacity: 1,
						strokeWidth: 1,
						strokeOpacity: 1,
						strokeColor: "#ff0000"
					},
					"Line": {
						strokeWidth: 3,
						strokeOpacity: 0.7,
						strokeColor: "#ff0000"
					},
					"Polygon": {
						strokeWidth: 3,
						strokeOpacity: 0.7,
						strokeColor: "#ff0000",
						fillColor: "#ff0000",
						fillOpacity: 0.3
					}
				}
			})]
		})
	});
	
	var controls = [
        // 이동
        new OpenLayers.Control.Navigation({ id : "pan" }),
        // 확대
        new OpenLayers.Control.ZoomBox({
        	id : "zoomIn",
        	draw: function() {
                this.handler = new OpenLayers.Handler.Box( this, {done: this.zoomBox}, {keyMask: this.keyMask} );
            }
        }),
        // 축소
        new OpenLayers.Control.ZoomBox({
        	id : "zoomOut",
        	out : true,
        	draw: function() {
                this.handler = new OpenLayers.Handler.Box( this, {done: this.zoomBox}, {keyMask: this.keyMask} );
            }
        }),
        // 이전, 다음
        new OpenLayers.Control.NavigationHistory({
        	id : "navigationHistory"
        }),
        // 거리 
        new OpenLayers.Control.Measure(BiesPathMeasure, {
        	id : "distance",
        	persist : true,
        	handlerOptions: {
        		multiLine : false,
        		movePopup : true,
        		persistControl : true,
        		layerOptions : {
        			styleMap: measureStyleMap
        		}
    		}
        }),
        // 면적 
        new OpenLayers.Control.Measure(BiesPolygonMeasure, {
        	id : "area",
        	persist : true,
        	handlerOptions: {
        		multiLine : false,
        		movePopup : true,
        		persistControl : true,
        		layerName : "BiesPolygonMeasure",
        		layerOptions : {
        			styleMap: measureStyleMap
        		}
    		}
        }),
        // 축척레벨바
        new BiesPanZoomBar({ id : "zoombar" }),
        // 하단 축척바
        new OpenLayers.Control.ScaleLine({ id : "scaleline" })
    ];
	
	// 지도에 추가
	for(var i=0, len=controls.length; i < len; i++) {
		map.addControl(controls[i]);
	}
}

/**********************************************************************
설명 : 지도 기본 기능 이벤트 연결 (화면설계서에 맞추기 위해서 기능별로 Function을 만듬)
파라메터 :
리턴값 :
***********************************************************************/
function gfnEventMap() {
	// 화면 확대
	$("#btn_zoomIn").click(gfnZoomInMapEvent);
	
	// 화면 축소
	$("#btn_zoomOut").click(gfnZoomOutMapEvent);
	
	// 화면 이동
	$("#btn_pan").click(gfnMoveMapEvent);
	
	// 전체 축척 - map.js 
	$("#btn_fullExtent").click(function() {
		gfnMoveMaxExtent();
	});
	
	// 이전
	$("#btn_prev").click(gfnPrevMapEvent);
	
	// 다음
	$("#btn_next").click(gfnNextMapEvent);
	
	// 거리
	$("#btn_dist").click(gfnMeasureDistanceEvent);
	
	// 면적
	$("#btn_area").click(gfnMeasureAreaEvent);

	// 초기화
	$("#btn_refresh").click(gfnRefreshEvent);
	
	// 정보보기
	$("#btn_info").click(gfnInfoEvent);
	
	// 다각형 검색
	$("#btn_poly").click(gfnPolyEvent);
	
	// 화면저장
	$("#btn_capture").click(gfnSaveMap);
	
	// easy ui east, west, south 숨김 
	$("#btn_news_hide").click(gfnHideNews);
}


/**********************************************************************
설명 : 지도 화면 확대
파라메터 :
리턴값 :
***********************************************************************/
function gfnZoomInMapEvent() {
	gfnActiveControl("zoomIn");
}

/**********************************************************************
설명 : 지도 화면 축소
파라메터 :
리턴값 :
***********************************************************************/
function gfnZoomOutMapEvent() {
	gfnActiveControl("zoomOut");
}

/**********************************************************************
설명 : 지도 화면 이동
파라메터 :
리턴값 :
***********************************************************************/
function gfnMoveMapEvent() {
	gfnActiveControl("pan");
}

/**********************************************************************
설명 : 이전 영역으로 이동
파라메터 :
리턴값 :
***********************************************************************/
function gfnPrevMapEvent() {
	
	map.getControl("navigationHistory").previousTrigger();
}

/**********************************************************************
설명 : 다음 영역으로 이동
파라메터 :
리턴값 :
***********************************************************************/
function gfnNextMapEvent() {
	
	map.getControl("navigationHistory").nextTrigger();
}

/**********************************************************************
설명 : 거리 측정
파라메터 :
리턴값 :
***********************************************************************/
function gfnMeasureDistanceEvent() {
	gfnActiveControl("distance");
}

/**********************************************************************
설명 : 면적 측정
파라메터 :
리턴값 :
***********************************************************************/
function gfnMeasureAreaEvent() {
	gfnActiveControl("area");
}

/**********************************************************************
설명 : 지도 초기화
파라메터 :
리턴값 :
***********************************************************************/
function gfnRefreshEvent() {
	var layers = map.layers;
	for(var i in layers) {
		if(layers[i].removeAllFeatures) layers[i].removeAllFeatures();
	}
	var popups = map.popups;
	for(var i=map.popups.length-1; i >= 0; i--) {
		map.removePopup(map.popups[i]);
	}
	$("#btn_pan img").trigger("click");								// 이동 기능 활성화
}

/**********************************************************************
설명 : 정보보기
파라메터 :
리턴값 :
***********************************************************************/
function gfnInfoEvent() {
	gfnActiveControl(["pan", "spatialInfo"]);
	
}

/**********************************************************************
설명 : 다각형 검색 정보보기
파라메터 :
리턴값 :
***********************************************************************/
function gfnPolyEvent() {
	gfnLimitZoomLevel(spatialInfo.zoom, gfnFormatNumber(spatialInfo.limitArea), "MSG1701");
	gfnActiveControl(["pan", "spatialPoly"]);
}

/**********************************************************************
설명 : easy ui layer east, west, south 숨김
파라메터 :
리턴값 :
***********************************************************************/
function gfnHideNews() {
	if($("#div_west").length)  {	$("#div_layout").layout("collapse", "west");  }	// 왼쪽 메뉴 숨김
	if($("#div_east").length)  {	$("#div_layout").layout("collapse", "east");  }	// 오른쪽 메뉴 숨김
	if($("#div_south").length) {	$("#div_layout").layout("collapse", "south"); }	// 아래쪽 메뉴 숨김
}


/**********************************************************************
설명 : 범례 트리 보기
파라메터 : layerNames - 레이어명 배열
			 korNames - 레이어 한글명 배열
리턴값 : 
***********************************************************************/
function gfnLoadGetStyle() {
	// 범례에서는 다른 트리의 내용 까지 필요
	var layerNames = [];
	var korNames = [];

	var nodes = $("#ul_layer_tree").tree('getChecked');
	// check 된 트리 노드를 순회하면서 json 에 layerName 들 push
	$(nodes).each(function() {
		if (this.attributes && this.attributes.layerName) {
			layerNames.push(this.attributes.layerName);
			korNames.push(this.text);
		}
	});
	nodes = $("#thema_cbnd").tree('getChecked');
	$(nodes).each(function() {
		if (this.attributes && this.attributes.layerName) {
			layerNames.push(this.attributes.layerName);
			korNames.push(this.text);
		}
	});
	
	// 한글명 객체 생성 (객체형태가 활용하기가 편해서 변형 Array -> Object)
	var alias = {};
	var baseLayerNames = [];		// 연속지적, 건물 범례 추출
	for(var i in baseLayers) {
		if(baseLayers[i].legend && baseLayers[i].visibility) {
			baseLayerNames.push(baseLayers[i].layer);
			alias[baseLayers[i].layer] = baseLayers[i].korName;
			alias[baseLayers[i].air] = baseLayers[i].korName;
		}
	}
	for(var i=0, len=layerNames.length; i < len; i++) {
		alias[layerNames[i]] = korNames[i];
	}
	
	var layersStr = baseLayerNames.join()+","+layerNames.join();
	gfnWMSGetStyles(layersStr, function(response) {
		var rules = [];
		
		var prefixSld = "";
		var prefixSe = "";
		// IE 외의 브라우저 호환성을 위해 추가
		if(OpenLayers.BROWSER_NAME == "msie") {
			prefixSld = "sld:";
			prefixSe = "se:";
		}
		
		var eleLayers = response.getElementsByTagName(prefixSld + "NamedLayer");
		for(var i=0, len=eleLayers.length; i < len; i++) {
			
			// 레이어 명 추출
			var layer = "";
			var eleLayerNames = eleLayers[i].getElementsByTagName(prefixSe + "Name");
			if(eleLayerNames.length > 0) layer = $(eleLayerNames[0]).text();
			
			var eleRules = eleLayers[i].getElementsByTagName(prefixSe + "Rule");
			for(var j=0, jLen=eleRules.length; j < jLen; j++) {
				var rule = {
					layer : layer,
					name : null,
					stroke : null,
					fill : null
				};
				// 룰명 추출
				var eleNames = eleRules[j].getElementsByTagName(prefixSe + "Name");
				if(eleNames.length > 0) rule.name = $(eleNames[0]).text();
				
				// 선색 파싱
				var lines = eleRules[j].getElementsByTagName(prefixSe + "LineSymbolizer");
				if(lines.length > 0) {
					var svgParam = lines[0].getElementsByTagName(prefixSe + "SvgParameter");
					if(svgParam.length > 0) {
						if(svgParam[0].getAttribute("name") == "stroke") {
							rule["stroke"] = $(svgParam[0]).text();
						}	
					}
				}
				// 면색 파싱
				var polygons = eleRules[j].getElementsByTagName(prefixSe + "PolygonSymbolizer");
				if(polygons.length > 0) {
					var svgParam = polygons[0].getElementsByTagName(prefixSe + "SvgParameter");
					if(svgParam.length > 0) {
						if(svgParam[0].getAttribute("name") == "fill") {
							rule["fill"] = $(svgParam[0]).text();
						}
					}
				}
				
				if(rule["stroke"] || rule["fill"]) {
					rules.push(rule);	
				}
			}
		}
		
		// 범례 레이어 그림
		var tagStr = "";
		for(var i=0, len=rules.length; i < len; i++) {
			tagStr += '<li>';
			tagStr += '<span class="span_symbol" style="';
			if(rules[i].stroke) {
				tagStr += "border:solid 1px " + rules[i].stroke + ";";
			}
			if(rules[i].fill) {
				tagStr += "background-color:" + rules[i].fill + ";";
			}
			tagStr += '"></span>';
			tagStr += '<span>' + alias[rules[i].layer] + '[' + rules[i].name + ']</span>';
			tagStr += '</li>';
		};
		$("#ul_lenged").html(tagStr);
	});
}