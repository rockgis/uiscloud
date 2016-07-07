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
	map = gfnInitMap("div_map");	// 지도 초기화 - map.js
	
	gfnMainControl();	// 메인지도 Control 연결 (확대/축소 버튼, 축척바, 축척라인, 전체화면, 이전, 다음)
	gfnMainInteraction();	// 메인지도 Interaction 연결 (확대/축소, 이동, 거리, 면적, 초기화)
	gfnEventMap();	// 지도 기본 기능 이벤트 연결
	gfnAppendBaseLayer(map);	// 지도 초기화 - /titan/js/mapsv/map.js
	gfnAppendWmsLayer(map, "biesLayer");	//  레이어 - /titan/js/mapsv/map.js
	

	spatialInfo.init(map);	// 정보보기 초기화 - /titan/js/mapsv/spatialInfo.js
	//spatialInfoGotcJP.init(map);	// 접속함체 선택 초기화 - /titan/js/mapsv/spatialInfo.js
	
	gfnActiveControl(["defaultInteraction"]);
	
	gfnAddProjectionList();
	
	//saveMap = new BiesSaveMap(map);
}

function gfnAddProjectionList(){
	//EPSG:3857 (Google, Spherical Mercator)
	var projection = new ol.proj.Projection({
		code : "EPSG:3857",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "http://www.opengis.net/gml/srs/epsg.xml#3857",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);

	// EPSG:5179 (UTM-K) [Naver]
	var projection = new ol.proj.Projection({
		code : "EPSG:5179",
		extent : [90112, 1192896, 1990673, 2761664],
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "http://www.opengis.net/gml/srs/epsg.xml#5179",
		extent : [90112, 1192896, 1990673, 2761664],
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "urn:ogc:def:crs:EPSG:5179",
		extent : [90112, 1192896, 1990673, 2761664],
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);


	// EPSG:5181 (GRS80 중부원점 20만, 50만) [Daum]
	var projection = new ol.proj.Projection({
		code : "EPSG:5181",
		canWrapX : true,
		extent : [-30000, -60000, 494288, 988576],
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "http://www.opengis.net/gml/srs/epsg.xml#5181",
		extent : [-30000, -60000, 494288, 988576],
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "urn:ogc:def:crs:EPSG:5181",
		extent : [-30000, -60000, 494288, 988576],
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);

	//EPSG:5183 (GRS80 동부원점 20만, 50만)
	var projection = new ol.proj.Projection({
		code : "EPSG:5183",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "http://www.opengis.net/gml/srs/epsg.xml#5183",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "urn:ogc:def:crs:EPSG:5183",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);	

	// EPSG:5186 (GRS80 중부원점 20만, 60만)
	var projection = new ol.proj.Projection({
		code : "EPSG:5186",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "http://www.opengis.net/gml/srs/epsg.xml#5186",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "urn:ogc:def:crs:EPSG:5186",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);	

	//EPSG:5187 (GRS80 동부원점 20만, 60만)
	var projection = new ol.proj.Projection({
		code : "EPSG:5187",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "http://www.opengis.net/gml/srs/epsg.xml#5187",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
	var projection = new ol.proj.Projection({
		code : "urn:ogc:def:crs:EPSG:5187",
		units : "m",
		axisOrientation : "enu"
	});
	ol.proj.addProjection(projection);
}

/**********************************************************************
설명 :메인 지도에서 사용할 control 생성 및 추가 (확대/축소 버튼, 축척바, 축척라인, 초기(전체)화면), 이전, 다음)
파라메터 :
리턴값 :
***********************************************************************/
function gfnMainControl() {
	// 출처
	var attributionControl = new ol.control.Attribution({
    	tipLabel : '',
    	label : ''
    });
	
	// 축척라인
	var scaleLineControl = new ol.control.ScaleLine({
		units : 'metric'
	});
	
	// 축척슬라이드
	var zoomSliderControl = new ol.control.ZoomSlider();
	
	// 확대/축소 버튼
	//var zoomControl = new ol.control.Zoom();
	
	// 전체영역으로 이동 버튼 : 초기화면이동 (extent 값을 주면 특정화면으로 이동가능)
	var zoomToExtentControl = new ol.control.ZoomToExtent({
		extent : map.getView().calculateExtent(map.getSize())
	});
	
	// 화면 전체보기 : tbies web에서는 다른 UI때문에 활용 불가능
	var fullScreenControl = new ol.control.FullScreen();
	
	// 지도에 추가
	var controls = [scaleLineControl, zoomSliderControl, zoomToExtentControl];
	for(var i=0, len=controls.length; i < len; i++) {
		map.addControl(controls[i]);
	}
	
	// 이전/다음 stack 관리
	map.on('moveend', function(){
		if(!flag){
			var viewInfo = {
				center : map.getView().getCenter(),
				zoom : map.getView().getZoom(),
				rotation : map.getView().getRotation()
			};
			historyStack.push(viewInfo);
			index++;
		}
		else{
			flag = false;
		}
	});
}

/**********************************************************************
설명 :메인 지도에서 사용할 interaction 생성 및 추가 (확대/축소, 이동, 거리, 면적, 초기화)
파라메터 :
리턴값 :
***********************************************************************/
function gfnMainInteraction() {
	// 거리/면적 초기화
	measure.init(map);
	
	/*
	ol.interaction.DragRotate,	ol.interaction.DoubleClickZoom
	ol.interaction.DragPan,	ol.interaction.PinchRotate
	ol.interaction.PinchZoom,	ol.interaction.KeyboardPan
	ol.interaction.KeyboardZoom,	ol.interaction.MouseWheelZoom
	ol.interaction.DragZoom
	*/
	var defaultInteractions = ol.interaction.defaults(); 
	defaultInteractions.forEach(function(interaction){
		if(interaction instanceof ol.interaction.DoubleClickZoom 
		|| interaction instanceof ol.interaction.DragPan
		|| interaction instanceof ol.interaction.MouseWheelZoom){
			interaction.set("id", "defaultInteraction");
			map.addInteraction(interaction);
		}
		
	});
	
	var dragZoomIn = new olCustom.DragZoomIn();
	dragZoomIn.set("id", "dragZoomIn");
    map.addInteraction(dragZoomIn);
    
    var dragZoomOut = new olCustom.DragZoomOut();
    dragZoomOut.set("id", "dragZoomOut");
    map.addInteraction(dragZoomOut);
	
	
	// 초기지도화면 active 설정
    gfnMoveMapEvent();
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
	
	
	/**
	 * 그리기 도구
	 */
	
	// 그리기 도구 div 열기
	$('#btn_drawTool').click(gfnShowDrawTool);
	
	// 점그리기
	$('#btn_drawPoint').click(gfnDrawPoint);
	
	// 선그리기
	$('#btn_drawLine').click(gfnDrawLine);
	
	// 면그리기
	$('#btn_drawPolygon').click(gfnDrawPolygon);
	
	// 도형선택
	$('#btn_selectFeature').click(gfnSelectFeature);
	
	// 도형이동
	$('#btn_moveFeature').click(gfnMoveFeature);
	
	// 도형편집
	$('#btn_editFeature').click(gfnEditFeature);
	
	// 도형삭제
	$('#btn_removeFeature').click(gfnRemoveFeature);
	
	// 점 복사
	// 선 복사
	// 면 복사
	// 도형연속입력
	// 점 그룹이동
	// 선 분리
	
	/**
	 * 편집 도구
	 */
	// 편집 도구 div 열기
	$('#btn_editTool').click(gfnShowEditTool);
	
	// 도형추가
	$('#btn_insertFeature').click(gfnInsertFeature);
	
	// 도형편집
	$('#btn_updateFeature').click(gfnUpdateFeature);
	
	// 도형삭제
	$('#btn_deleteFeature').click(gfnDeleteFeature);
	
	// 도형복사
	$('#btn_copyFeature').click(gfnCopyFeature);
	
	// 선분할
	$('#btn_divideFeature').click(gfnDivideFeature);
	
	
	// 배경지도 변경
	$('#selectBox_bgm').change(function(){
		// map에 setView로 변경 : center, zoom, resolution 맞춰서 변경...
		var selectedMap = $('#selectBox_bgm').val();
		var projection;
		var maxResolution;
		var resolution = map.getView().getResolution();
		var center = map.getView().getCenter();
		var extent = map.getView().calculateExtent(map.getSize());
		var source = map.getView().getProjection().getCode();
		var destination;
		if(selectedMap == "vworld"){
			projection = VWorldProj;
			maxResolution = 156543.0339;
		}
		else if(selectedMap == "daum"){
			projection = DaumProj;
			maxResolution = 2048;
		}
		else if(selectedMap == "naver"){
			projection = NaverProj;
			maxResolution = 2048;
		}
		var view = new ol.View({
			projection : projection,
			maxResolution : maxResolution
		});
		destination = projection.getCode();
		center = ol.proj.transform(center, source, destination);
		extent = ol.extent.applyTransform(extent, ol.proj.getTransform(source, destination));
		map.setView(view);
		map.getView().setResolution(map.getView().constrainResolution(resolution));
		map.getView().setCenter(center);
		//map.getView().fit(extent, map.getSize());
		
		// vector, wms 모두 좌표변경
		// 모든 ol.layer.Tile off
		map.getLayers().forEach(function(layer){
			if(layer instanceof ol.layer.Tile){
				layer.setVisible(false);
			}
			if(layer instanceof ol.layer.Vector){
				var features = layer.getSource().getFeatures();
				for(var i in features){
					features[i].getGeometry().transform(source, destination);
				}
			}
		});
		var params = gfnGetLayer("biesLayer").getSource().getParams();
		params.SRS = destination;
		gfnGetLayer("biesLayer").getSource().updateParams(params);
		
		
		// "기본도", "건물명칭", "위성영상" 3개중 켜져있는 ol.layer.Tile만 on
		if($("#a_layer_base").hasClass("layer_on")){
			gfnGetLayer(selectedMap + "_base").setVisible(true);
		}
		if($('#a_layer_hybrid').hasClass("layer_on")){
			gfnGetLayer(selectedMap + "_hybrid").setVisible(true);
		}
		if($('#a_layer_satellite').hasClass("layer_on")){
			gfnGetLayer(selectedMap + "_satellite").setVisible(true);
		}
	});
}

function gfnShowDrawTool(){
	$('#ul_map_drawTool').toggle();
}

function gfnDrawPoint(){
	gfnActiveInteraction(["defaultInteraction", "drawPoint"]);
}

function gfnDrawLine(){
	gfnActiveInteraction(["defaultInteraction", "drawLine"]);
}

function gfnDrawPolygon(){
	gfnActiveInteraction(["defaultInteraction", "drawPolygon"]);
}

function gfnSelectFeature(){
	gfnActiveInteraction(["defaultInteraction", "selectFeature"]);
}

function gfnMoveFeature(){
	gfnActiveInteraction(["defaultInteraction", "dragFeature"]);
}

function gfnEditFeature(){
	gfnActiveInteraction(["defaultInteraction", "selectFeature", "modifyFeature"]);
}

function gfnSelectFeature(){
	gfnActiveInteraction(["defaultInteraction", "selectFeature"]);
}

function gfnRemoveFeature(){
	var features = drawTool.source.getFeatures();
	var selectedFeatures = drawTool.selectInteraction.getFeatures().getArray();
	
	for(var i in features){
		for(var j in selectedFeatures){
			if(features[i] == selectedFeatures[j]){
				drawTool.source.removeFeature(features[i]);
			}
		}
	}
	
	drawTool.selectInteraction.getFeatures().clear(1);
	
	return false;
}

function gfnShowEditTool(){
	$('#ul_map_editTool').toggle();
}

function gfnInsertFeature(){
	var lyrType = $('#ul_map_editTool .targetEditLyr option:selected').attr("lyrType");
	if(lyrType == "point"){
		gfnActiveInteraction(["defaultInteraction", "editPoint"]);
	}
	else if(lyrType == "line"){
		gfnActiveInteraction(["defaultInteraction", "editLine"]);
	}
	else if(lyrType == "polygon"){
		gfnActiveInteraction(["defaultInteraction", "editPolygon"]);
	}
	
	editTool.mode = "insert";
}

function gfnUpdateFeature(){
	gfnActiveInteraction(["defaultInteraction", "getFeatureByPoint"]);
	editTool.editLayer.getSource().clear(true);
	// Interaction의 Feature 제거
	var interactions = map.getInteractions();
    interactions.forEach(function(interaction){
    	if(interaction instanceof ol.interaction.Select){
    		interaction.getFeatures().clear(1);
    	}
    });
	editTool.mode = "update";
}

function gfnDeleteFeature(){
	gfnActiveInteraction(["defaultInteraction", "getFeatureByPoint"]);
	editTool.mode = "delete";
}

function gfnCopyFeature(){
	gfnActiveInteraction(["defaultInteraction", "getFeatureByPoint"]);
	editTool.mode = "copy";
}

function gfnDivideFeature(){
	gfnActiveInteraction(["defaultInteraction", "getFeatureByPoint"]);
	editTool.mode = "divide";
}

/*function gfnUpdatePosFeature(){
	gfnActiveInteraction(["defaultInteraction", "selectFeature"]);
}*/




/**********************************************************************
설명 : 지도 화면 확대
파라메터 :
리턴값 :
***********************************************************************/
function gfnZoomInMapEvent() {
	gfnActiveControl(["dragZoomIn"]);
}

/**********************************************************************
설명 : 지도 화면 축소
파라메터 :
리턴값 :
***********************************************************************/
function gfnZoomOutMapEvent() {
    gfnActiveControl(["dragZoomOut"]);
}

/**********************************************************************
설명 : 지도 화면 이동
파라메터 :
리턴값 :
***********************************************************************/
function gfnMoveMapEvent() {
	// 거리/면적 측정 이벤트 해제
	map.un('pointermove', measure.pointerMoveHandler);
	
	gfnActiveControl(["defaultInteraction"]);
}

/**********************************************************************
설명 : 이전 영역으로 이동
파라메터 :
리턴값 :
***********************************************************************/
function gfnPrevMapEvent() {
	if(historyStack.getLength() > 0 && index > 0){
		moveMapHistory('prev');
	}
	else{
		alert("[이전] 지도화면이 더 이상 없습니다.");
	}
}

/**********************************************************************
설명 : 다음 영역으로 이동
파라메터 :
리턴값 :
***********************************************************************/
function gfnNextMapEvent() {
	if(historyStack.getLength() > 0 && index > -1 && index < historyStack.getLength()-1){
		moveMapHistory('next');
	}
	else{
		alert("[다음] 지도화면이 더 이상 없습니다.");
	}
}

/**********************************************************************
설명 : 거리 측정
파라메터 :
리턴값 :
***********************************************************************/
function gfnMeasureDistanceEvent() {
    measure.createDrawInteraction("LineString");
}

/**********************************************************************
설명 : 면적 측정
파라메터 :
리턴값 :
***********************************************************************/
function gfnMeasureAreaEvent() {
	measure.createDrawInteraction("Polygon");
}

/**********************************************************************
설명 : 지도 초기화
파라메터 :
리턴값 :
***********************************************************************/
function gfnRefreshEvent() {
    var layers = map.getLayers();
    var overlays = map.getOverlays();
    var interactions = map.getInteractions();
    
    /*
     * 거리/면적 측정 결과가 아름답게 지워지지 않는 문제..... 나중에 해결 필요
     */
    
    
    // Map의 Overlays 제거
    overlays.forEach(function(overlay){
    	map.removeOverlay(overlay);
    });
    
    
    // Interaction의 Feature 제거
    interactions.forEach(function(interaction){
    	if(interaction instanceof ol.interaction.Select){
    		interaction.getFeatures().clear(1);
    	}
    });
    
    // 모든 Vector 레이어의 Source.Feature 제거
    layers.forEach(function(layer){
    	if(layer instanceof ol.layer.Vector){
    		layer.getSource().clear(1);
    	}
    });
    
    gfnMoveMapEvent();
}

/**********************************************************************
설명 : 정보보기
파라메터 :
리턴값 :
***********************************************************************/
function gfnInfoEvent() {
	// 거리/면적 측정 이벤트 해제
	map.un('pointermove', measure.pointerMoveHandler);
	gfnActiveControl(["defaultInteraction", "spatialInfo"]);
}

/**********************************************************************
설명 : 다각형 검색 정보보기
파라메터 :
리턴값 :
***********************************************************************/
function gfnPolyEvent() {
	//gfnLimitZoomLevel(spatialInfo.zoom, gfnFormatNumber(spatialInfo.limitArea), "MSG1701");
	// 거리/면적 측정 이벤트 해제
	map.un('pointermove', measure.pointerMoveHandler);
	gfnActiveControl(["defaultInteraction", "spatialPoly"]);
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