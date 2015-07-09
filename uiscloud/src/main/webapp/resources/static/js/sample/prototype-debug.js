/**
 * Prototype
 */
$(document).ready(function() {
	// 마우스 우클릭 Context Menu 생성
	map.getViewport().addEventListener('contextmenu', function (e) { // or $(map.getViewport()).on('contextmenu', function(e) with jQuery
	    e.preventDefault(); //우클릭방지
	    var feature = map.forEachFeatureAtPixel(map.getEventPixel(e),
	        function (feature, layer) {
	            return feature;
	        });
	    if (feature) {
	        // ...
	    }
	    
	    $("#popup").show();
	    var coordinate = map.getCoordinateFromPixel([e.layerX,e.layerY]);
	    content.innerHTML = '<div style="margin-bottom:3px;"><a href="#" class="pClass">FCMS전송</a></div><div><a href="#" class="pClass">NITS전송</a></div>';
	    overlay.setPosition(coordinate);
	});
	map.on('click', function(event) {
		  $("#popup").hide();
	});
	$("#popup-content").on("click", ".pClass", function(e){
		closer.onclick();
		return false;
	});
	
	// Mouse Position 컨트롤 추가
	map.getControls().extend([new ol.control.MousePosition({
    	target : goog.dom.getElement('mousePosition_div'), // 좌표가 보여질 div 엘리먼트
    	undefinedHTML: '▶ 마우스좌표 : 지도를 벗어났습니다.',
    	projection: mapInfo.crs[currentMapType],
    	coordinateFormat: function(coordinate) {
    		return ol.coordinate.format(coordinate, '▶ 마우스좌표 : [ {x}, {y} ]', 0);
    	},
    	className : 'custom-mouse-position',
    }),new ol.control.ScaleLine(),new ol.control.Zoom(),
	new ol.control.ZoomSlider()]);
	
	// 현재 Zoom레벨 표시
	map.on('moveend', onMoveEnd);
	
	// vectorLayer에 Feature가 수정되었을 때, 현재 ZoomLevel판단하여 Style 적용 및 Feature 정보 입력(대상레이어테이블명, 추가된 Feature라는 "insert"값 명시) 
	vectorLayer.getSource().on("addfeature", changeDrawStyle, this);
	
	// 레이어 On/Off
	$('#switchLayer .chkLayer').change(function(){
		if($(this).attr("checked") == "checked"){
			$(this).attr("checked", false);
		}
		else{
			$(this).attr("checked", true);
		}
		var newLayers = '';
		var namespace = 'sktbigis:';
		
		$('#switchLayer').find('.chkLayer').each(function(){
			if($(this).attr("checked") == "checked"){
				newLayers += namespace + $(this).val() + ',';
			}
		});
		newLayers = newLayers.substr(0, newLayers.length-1);
		updateParams(newLayers);
	});
	
	// 편집대상 레이어 변경
	$("#select_editTargetLayer").change(function(){
		// 도형추가도중이였으면 도형모양을 반영한다(점인지 선인지..)
		var interactions = map.getInteractions();
		interactions.forEach(function(f){
			if(f instanceof ol.interaction.Draw){
				var name = f.get("name");
				if(name.indexOf("draw") != -1 && name.indexOf("Feature") != -1){
					$('#drawFeatureBtn').trigger("click");
				}
			}
			if(editVectorLayer.getSource().getFeatures().length > 0){
				$('#getFeatureBtn').trigger("click");
			}
		});
	});
	
	/**
	 * 기타
	 */
	// Vworld 지도 타입 변경
	$('#select_type').change(function(){
		var type = $(this).val();
		var source = new ol.source.VworldMaps({ type : type, maxZoom : mapInfo.maxZoom["v"] });
		vworldLayer.setSource(source);
	});
	
	// 배경지도 변경
	$('#selVWorldMapBtn').click(function(){
		changeBackgroundMap("v");
		currentMapType = "v";
	});
	$('#selNaverMapBtn').click(function(){
		changeBackgroundMap("n");
		currentMapType = "n";
	});
	$('#selDaumMapBtn').click(function(){
		changeBackgroundMap("d");
		currentMapType = "d";
	});
	
	// 지도 툴바 선택 시 이미지 변경
	$("#div_map a img.toggle").click(function() {	
		$("#div_map a img").each(function() {
			$(this).attr("src", $(this).attr("src").replace("_a.", "_n.").replace("_h.", "_n."));	
		});
		$(this).attr("src", $(this).attr("src").replace("_n.", "_a."));
	});
	
	// 상단메뉴 선택시 이미지 변경
	$('#navbar ul li a').click(function(){
		$("#navbar ul li").each(function() {
			$(this).attr("class", "");	
		});
		$(this).parent().attr("class", "active");
	});
	
	/**
	 * 지도 기본조작
	 */
	$('#moveBtn').on('click', function(){
		initInteraction();
	});
	$('#zoomInBtn').on('click', function(){
		// 최소, 최대 Zoom Level 사이에서 확대
		if(map.getView().getZoom() >= mapInfo.minZoom[currentMapType] && map.getView().getZoom() < mapInfo.maxZoom[currentMapType]){
			map.getView().setZoom(map.getView().getZoom() + 1);
		}
		else{
			alert("더 이상 확대할 수 없습니다.");
		}
	});
	$('#zoomOutBtn').on('click', function(){
		// 최소, 최대 Zoom Level 사이에서 축소
		if(map.getView().getZoom() > mapInfo.minZoom[currentMapType] && map.getView().getZoom() <= mapInfo.maxZoom[currentMapType]){
			map.getView().setZoom(map.getView().getZoom() - 1);
		}
		else{
			alert("더 이상 축소할 수 없습니다.");
		}
	});
	$('#prevBtn').on('click', function(){
		if(historyStack.getLength() > 0 && index > 0){
			index--;
			var viewInfo = historyStack.item(index);
			var center = viewInfo.center;
			var angle = viewInfo.rotation * Math.PI / 180;
			var level = viewInfo.zoom;
			flag = true;
			map.getView().setCenter(center);
			map.getView().setRotation(angle);
			map.getView().setZoom(level);
		}
		else{
			alert("[이전] 지도화면이 더 이상 없습니다.");
		}
	});
	$('#nextBtn').on('click', function(){
		if(historyStack.getLength() > 0 && index > -1 && index < historyStack.getLength()-1){
			index++;
			var viewInfo = historyStack.item(index);
			var center = viewInfo.center;
			var angle = viewInfo.rotation * Math.PI / 180;
			var level = viewInfo.zoom;
			flag = true;
			map.getView().setCenter(center);
			map.getView().setRotation(angle);
			map.getView().setZoom(level);
		}
		else{
			alert("[다음] 지도화면이 더 이상 없습니다.");
		}
	});
	$('#fullExtentBtn').on('click', function(){
		// 지정한 위치로 지도 이동
		var center = [14112668, 4167169];
		var angle = 0;
		var level = 16;
		
		map.getView().setCenter(center);
		map.getView().setRotation(angle);
		map.getView().setZoom(level);
	});
	$('#initBtn').on('click', function(){
		// Vector Layers의 모든 Feature 제거
		var layers = map.getLayers();
		layers.forEach(function(f){
			if(f instanceof ol.layer.Vector){
				// vector에 추가된 feature 삭제
				f.getSource().clear();
			}
		});
		// Overlays의 모든 Feature 제거 
		var overlays = map.getOverlays();
		overlays.forEach(function(f){
			map.removeOverlay(f);
		});
		
		var source = new ol.source.Vector();
		editVectorLayer.setSource(source);
		
		$('#moveBtn').trigger("click");
	});
	$('#lineMeasureBtn').on('click', function(){
		initInteraction();
		typeSelect = 'line';
		map.on('pointermove', pointerMoveHandler);
		map.removeInteraction(draw);
		addInteraction();
	});
	$('#polygonMeasureBtn').on('click', function(){
		initInteraction();
		if(helpTooltip){
			$(helpTooltip.getElement()).show();
		}
		typeSelect = 'area';
		map.on('pointermove', pointerMoveHandler);
		map.removeInteraction(draw);
		addInteraction();
	});
	
	/**
	 * 도형 그리기 & 도형 편집
	 */
	// 도형추가
	$('#drawFeatureBtn').on('click', function(){
		var editTargetLayer = $("#select_editTargetLayer").val();
		var drawType = "Point";
		if(editTargetLayer == "tttgotc_ca" || editTargetLayer == "tttgotc_cd"){
			drawType = "LineString";
		}
		else if(editTargetLayer == "tttpolygon"){
			drawType = "Polygon";
		}
		else{
			drawType = "Point";
		}
		initInteraction();
		vectorLayer.setSource(source);
		var draw = new ol.interaction.Draw({
			source: vectorLayer.getSource(),
		    type: /** @type {ol.geom.GeometryType} */ (drawType)
		});
		draw.set("name",'draw' + drawType + 'Feature');
		map.addInteraction(draw);
		map.addInteraction(snap);
	});
	$('#drawCircleFeatureBtn').on('click', function(){
		initInteraction();
		vectorLayer.setSource(source);
		var draw = new ol.interaction.Draw({
			source: vectorLayer.getSource(),
		    type: /** @type {ol.geom.GeometryType} */ ('Circle')
		});
		draw.set("name",'drawCircleFeature');
		map.addInteraction(draw);
		map.addInteraction(snap);
	});
	$('#editFeatureBtn').on('click', function(){
		initInteraction();
		map.addInteraction(selectSingleClick);
		var modify = new ol.interaction.Modify({
			//features: new ol.Collection(vectorLayer.getSource().getFeatures()),
			features: selectSingleClick.getFeatures(),
			name : 'modifyFeature'
		  // the SHIFT key must be pressed to delete vertices, so
		  // that new vertices can be drawn at the same position
		  // of existing vertices
		  /*,deleteCondition: function(event) {
		    return ol.events.condition.shiftKeyOnly(event) &&
		        ol.events.condition.singleClick(event);
		  }*/
		});
		map.addInteraction(modify);
		map.addInteraction(snap);
	});
	$('#selectFeatureBtn').on('click', function(){
		initInteraction();
		map.addInteraction(selectSingleClick);
	});
	$('#moveFeatureBtn').on('click', function(){
		initInteraction();
		var drag = new app.Drag();
		map.addInteraction(drag);
	});
	$('#delFeatureBtn').on('click', function(){
		var flag = false;
		var vectorFeatureArr = vectorLayer.getSource().getFeatures();
		for(var i in vectorFeatureArr){
			var selectFeatureArr = selectSingleClick.getFeatures().getArray();
			for(var j in selectFeatureArr){
				if(vectorFeatureArr[i] == selectFeatureArr[j]){
					vectorLayer.getSource().removeFeature(vectorFeatureArr[i]);
					flag = true;
				}
			}
		}
		if(!flag){
			alert("편집버튼을 통해 선택된 도형만 삭제 가능합니다.");
		}
		selectSingleClick.getFeatures().clear();
	});
	$('#saveFeatureBtn').on('click', function(){
		var inserts = [], updates = [], deletes = [];
		var targetFeatures = editVectorLayer.getSource().getFeatures();
		var vectorFeatures = vectorLayer.getSource().getFeatures();
		for(var i in vectorFeatures){
			targetFeatures.push(vectorFeatures[i]);
		}
		for(var i in targetFeatures){
			// DB에 구축된 좌표계로 좌표변경
			targetFeatures[i].getGeometry().transform("EPSG:3857", "EPSG:5181");
			var targetTableNm = targetFeatures[i].get("targetTableNm");
			var transactionMode = targetFeatures[i].get("transactionMode");
			if(targetTableNm == $('#select_editTargetLayer').val()){
				targetFeatures[i].unset("targetTableNm");
				targetFeatures[i].unset("transactionMode");
				if(transactionMode == "insert"){
					inserts.push(targetFeatures[i]);
				}
				else{
					updates.push(targetFeatures[i]);
				}
			}
		}
		var options = {
			featureNS : 'sktbigis.skt.org',
			featureType : $('#select_editTargetLayer').val(),
			featurePrefix : 'sktbigis',
			gmlFormat : new ol.format.GML3(),
			//nativeElements : '',
			//handle : '',
			gmlOptions : {
				featureNS : 'sktbigis.skt.org',
				featureType : $('#select_editTargetLayer').val(),
				schemaLocation : 'sktbigis.skt.org http://211.58.18.254:8180/sktbigis/wfs?service=WFS&version=1.0.0&request=DescribeFeatureType&typeName=sktbigis%3Abd_object_cable http://www.opengis.net/wfs http://211.58.18.254:8180/schemas/wfs/1.1.0/wfs.xsd',
				srsName : 'EPSG:5181'
			}
		};
		var wfs = new ol.format.WFS(options);
		var node = wfs.writeTransaction(inserts,updates,deletes,options);
		var serializer_ = new XMLSerializer();
		var dataStr = serializer_.serializeToString(node);
		dataStr = dataStr.replace(/geometry/g,"the_geom");
 
		$.ajax({
	      url : "/proxy.do",
	      data : dataStr,
	      type : "POST",
	      contentType : "application/json",
	      dataType : "text",
	      success : function(res) {
	    	  var resTxt = $(res).text();
	    	  var resInsertCnt = resTxt.substr(0, 1)*1;
	    	  var resUpdateCnt = resTxt.substr(1, 1)*1;
	    	  var resT = "";
	    	  resT += resInsertCnt + "개 Insert 성공 // ";
	    	  resT += resUpdateCnt + "개 Update 성공";
	    	  
	    	  alert(resT);
	    	  selectSingleClick.getFeatures().clear();
	    	  redrawAll();
	    	  $('#getFeatureBtn').trigger("click");
	    	  $('#editFeatureBtn').trigger("click");
	      }
	   });
	});
	$('#deleteFeatureBtn').on('click', function(){
		var deletes;
		var inserts;
		var updates;
		// 선택된 Features
		var selFeatures = selectSingleClick.getFeatures().getArray();
		if(selFeatures.length < 1){
			alert("선택된 도형이 없습니다.");
			return false;
		}
		for(var i in selFeatures){
			selFeatures[i].getGeometry().transform("EPSG:3857", "EPSG:5181");
		}
		deletes = selFeatures;
		
		var options = {
				featureNS : 'sktbigis.skt.org',
				featureType : $('#select_editTargetLayer').val(),
				featurePrefix : 'sktbigis',
				gmlFormat : new ol.format.GML3(),
				gmlOptions : {
					featureNS : 'sktbigis.skt.org',
					featureType : $('#select_editTargetLayer').val(),
					schemaLocation : 'sktbigis.skt.org http://211.58.18.254:8180/sktbigis/wfs?service=WFS&version=1.0.0&request=DescribeFeatureType&typeName=sktbigis%3Abd_object_cable http://www.opengis.net/wfs http://211.58.18.254:8180/schemas/wfs/1.1.0/wfs.xsd',
					srsName : 'EPSG:5181'
				}
			};
		var wfs = new ol.format.WFS(options);
		var node = wfs.writeTransaction(inserts,updates,deletes,options);
		var serializer_ = new XMLSerializer();
		var dataStr = serializer_.serializeToString(node);
		dataStr = dataStr.replace(/geometry/g,"the_geom");
 
		$.ajax({
	      url : "/proxy.do",
	      data : dataStr,
	      type : "POST",
	      contentType : "application/json",
	      dataType : "text",
	      success : function(res) {
			  var resTxt = $(res).text();
			  var resDeleteCnt = resTxt.substr(2, 1)*1;
			  alert(resDeleteCnt + "개 Delete 성공");
			  selectSingleClick.getFeatures().clear();
			  redrawAll();
			  $('#getFeatureBtn').trigger("click");
			  $('#editFeatureBtn').trigger("click");
	      }
	   });
	});
	
	/**
	 * WMS, WFS GetFeature
	 */
	// WMS - GetFeatureInfo 버튼
	$('#getFeatureInfoBtn').on('click', function(){
		initInteraction();
		// 단일클릭 이벤트 정의 - 클릭 위치로 WMS 요청 후 결과를 'div_info'에 표출
		map.on('singleclick', getFeatureInfoEvt);
		alert("대상 레이어를 선택하면 정보를 볼 수 있습니다.");
	});
	
	// WFS - GetFeature 버튼
	// 현재 영역의 "선택된 편집대상 레이어" 벡터데이터를 물러와서 화면에 하이라이팅
	$('#getFeatureBtn').on('click', function(){
		initInteraction();
		var vectorSource = new ol.source.Vector({
		  loader: function(extent, resolution, projection) {
		    var url = 'http://211.58.18.254:8180/sktbigis/wfs?service=WFS&' +
		        'version=1.1.0&request=GetFeature&typename=sktbigis:' + $('#select_editTargetLayer').val() + '&' +
		        'outputFormat=application/json' +
		        '&srsname=' + mapInfo.crs[currentMapType] + '&bbox=' + extent.join(',') + ',' + mapInfo.crs[currentMapType];

		    $.post(
				"/proxyUrl.do",
				{
					url : encodeURIComponent(url)
				}, 
				function (res) {
					loadFeatures(res);
				}
			);
		  },
		  strategy: ol.loadingstrategy.tile(new ol.tilegrid.XYZ({
		    maxZoom: 19
		  })),
		  projection: mapInfo.crs[currentMapType]
		});
		
		editVectorLayer.setSource(vectorSource);
		$('#editFeatureBtn').trigger("click");
	});
	
	/**
	 * 지도 이벤트 설정
	 */
	// 이동완료 시점
	map.on('moveend', function(){
		/**
		 * 이전, 다음을 위한 stack 관리
		 */ 
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
	
	redrawAll();
});

/**
 * Function
 */
// WMS, WFS GetFeature - Feature 그리기 function
window.loadFeatures = function(response) {
	var geojsonFormat = new ol.format.GeoJSON();
	editVectorLayer.getSource().addFeatures(geojsonFormat.readFeatures(response));
};

// Interaction 초기화
function initInteraction(){
	// 모든 Interaction 제거
	map.getInteractions().clear();
	map.un('singleclick', getFeatureInfoEvt);
	map.un('pointermove', pointerMoveHandler);
	if(helpTooltip){
		$(helpTooltip.getElement()).hide();
	}
	// 마우스 지도 조작 Interaction 추가 
	var move = new ol.interaction.DragPan({name : 'dragPan'});
	var mouseWheelZoom = new ol.interaction.MouseWheelZoom({name : 'mouseWheelZoom'});
	map.addInteraction(move);
	map.addInteraction(mouseWheelZoom);
}

// 지도 다시 그리기
function redrawAll(){
	var layers = map.getLayers();
	layers.forEach(function(f){
		if(f.getSource().updateParams){
			f.getSource().updateParams({time_: (new Date()).getTime()});
		}
	});
	map.render();
}

// MoveEnd 이벤트 function
function onMoveEnd(evt) {
  var map = evt.map;
  var extent = map.getView().calculateExtent(map.getSize());
  var bottomLeft = ol.extent.getBottomLeft(extent);
  var topRight = ol.extent.getTopRight(extent);
  var viewPosition = "[ " + parseInt(bottomLeft[0]) + ", " + parseInt(bottomLeft[1]) + ", " + parseInt(topRight[0]) + ", " + parseInt(topRight[1]) + " ]";
  var zoomLevel = map.getView().getZoom();
  
  $('#zoom_div').text("▶ 줌 레벨 : " + zoomLevel);
  $('#viewPosition_div').text("▶ 현재좌표 : " + viewPosition);
}

// vectorLayer.getSource()에 addFeature 이벤트 발생시 실행 함수
function changeDrawStyle(target){
	var zoom = map.getView().getZoom();
	var idx = zoom;
	if(currentMapType != "v"){
		idx += 6;
	}
	var color = drawColorArr[idx]; // #rrggbb
	var colorStr = ol.color.asString(ol.color.asArray(color)); // 'rgba(255, 255, 255, 0.2)'
	var styleObj = new ol.style.Style({
	    fill: new ol.style.Fill({
	    	color: colorStr
	    }),
	    stroke: new ol.style.Stroke({
			//lineCap : "", //  butt, round, or square. Default is round.
			//lineJoin : "", // bevel, round, or miter. Default is round.
			//lineDash ; [], // Array.<Number>로 표현
	    	color: color,
		    width: drawSizeArr[idx] // 확대 될수록 굵어진다.
	    }),
	    image: new ol.style.Circle({
	    	radius: drawSizeArr[idx],
	    	fill: new ol.style.Fill({
	    		color: color
		    })
		})
	});
	
	// 추가된 Feature에 스타일 지정
	//target.feature.setStyle(styleObj);
	
	// 추가된 Feature에 속성넣기(대상 레이어테이블명, transaction방법)
	target.feature.set("targetTableNm",$('#select_editTargetLayer').val());
	target.feature.set("transactionMode","insert");
}

function hideInfo(){
	$('#infoDiv').hide();
}

function getFeatureInfoEvt(evt) {
  var wmsSource = wmsLayer.getSource();
  var viewResolution = /** @type {number} */ (view.getResolution());
  var url = wmsSource.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, mapInfo.crs[currentMapType],
      {'INFO_FORMAT': 'application/json'});
  if (url) {
    /*document.getElementById('div_info').innerHTML =
        '<iframe seamless src="' + url + '"></iframe>';*/
    $.post(
		"/proxyUrl.do",
		{
			url : url
		},
		function (res) {
			var str = "";
			var hstr = "";
			var features = res.features;
			for(var i in features){
				hstr += "<tr><th colspan='2'>" + features[i].id + "</th></tr>";
				for(var j in features[i].properties){
					str += "<tr><td>";
					str += j;
					str += "</td><td>";
					str += features[i].properties[j];
					str += "</td></tr>";
				}
			}
			if(str != "" && hstr != ""){
				$('#infoDiv').show();
				$('#infoDiv').css("left", ($(window).width()/2 - 150) + "px");
				$('#infoDiv').css("top", ($(window).height()/2 - 150) + "px");
				$('#infoDiv thead').html(hstr);
				$('#infoDiv tbody').html(str);
			}
		}
	);
  }
}

function changeBackgroundMap(mapType){
	var oldCrs = imageWMSOption.params.CRS;
	var newCrs = mapInfo.crs[mapType];
	imageWMSOption.params.CRS = newCrs;
	
	wmsLayer = new ol.layer.Image({
		extent : mapInfo.maxExtent[mapType],
		source : new ol.source.ImageWMS(imageWMSOption)
	});
	
	map.setLayerGroup(mapInfo.layerGroup[mapType]);
	
	var oldView = map.getView();
	var oldCenter = oldView.getCenter();
	var newCenter = ol.proj.transform(oldCenter, oldCrs, newCrs);
	
	var oldZoom = map.getView().getZoom();
	var newZoom;

	if(currentMapType == "v" && mapType != "v"){
		newZoom = oldZoom - 6;
		if(newZoom < 0){
			newZoom = 0;
		}
	}
	else if(currentMapType != "v" && mapType == "v"){
		newZoom = oldZoom + 6;
		if(newZoom > 23){
			newZoom = 23;
		}
	}
	else{
		newZoom = oldZoom;
	}
	
	var newView = new ol.View({
		projection : mapInfo.projection[mapType],
		maxResolution : mapInfo.maxResolution[mapType],
		center : newCenter,
		zoom : newZoom,
		maxZoom : mapInfo.maxZoom[mapType]
	});
	
	map.setView(newView);
	
}

// 레이어 On/Off에 사용 (imageWMS 레이어목록 변경)
function updateParams(newLayers){
	var obj = {};
	if(newLayers != ""){
		obj['LAYERS'] = newLayers;
	}
	wmsLayer.getSource().updateParams(obj);
	if(newLayers == ""){
		wmsLayer.setVisible(false);
	}
	else{
		wmsLayer.setVisible(true);
	}
}