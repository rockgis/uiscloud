<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>지도 테스트</title>
<link rel="stylesheet" type="text/css" href="/geolib/lib/openlayers/theme/default/style.css">
</head>
<body>
	<div id="div_map" style="width:800px;height:600px;background-color:#ffff00;"></div>


	<script type="text/javascript" src="/geolib/js/com/properties.js"></script>

	<script type="text/javascript" src="/geolib/lib/jquery/jquery-1.7.2.js"></script>
	<script type="text/javascript" src="/geolib/lib/jquery/easyui/jquery.easyui.min.js"></script>

	<!-- openlayers & custom -->
	<script type="text/javascript" src="/geolib/lib/openlayers/OpenLayers-min.js"></script>
	<script type="text/javascript" src="/geolib/js/mapsv/openLayersCustom.js"></script>
	
	<!-- 다음 레이어  -->
	<script type="text/javascript" src="/geolib/js/Daum/OpenLayers.Layer.DaumHybrid.js"></script>
	<script type="text/javascript" src="/geolib/js/Daum/OpenLayers.Layer.DaumPhysical.js"></script>
	<script type="text/javascript" src="/geolib/js/Daum/OpenLayers.Layer.DaumSatellite.js"></script>
	<script type="text/javascript" src="/geolib/js/Daum/OpenLayers.Layer.DaumStreet.js"></script>
	
	<script type="text/javascript" src="/geolib/js/com/map.js"></script>
	<script type="text/javascript" src="/geolib/js/map/MyClickControl.js"></script>
	<script type="text/javascript">
	var map;
	$(function() {
		map = new OpenLayers.Map("div_map", {
			displayProjection : new OpenLayers.Projection("EPSG:5181"),
			projection : new OpenLayers.Projection("EPSG:5181"),
			//resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
			maxResolution : 2048,
			maxExtent : new OpenLayers.Bounds(-30000, -60000, 494288, 988576),
			numZoomLevels : 18,
			unit : "m",
			controls : []
		});
		gfnAppendBaseLayer(map);
		
		//gfnAppendWmsLayer(map,  "titanLayer");
		
		var wmsLayer = new OpenLayers.Layer.WMS(
			"WmsTestLayer",
			"http://211.58.18.254:8180/sktbigis/wms",
			{
				layers : "gotc_tpo_cws",
				styles : "GOTC_TOP_STYLE",
				format : "image/png",
				exceptions : "text/xml",
				version : "1.3.0",
				crs : "EPSG:5181",
				transparent : true
			},
			{
				singleTile : true,
				transitionEffect: 'resize',
				ratio : 1,
				yx : {'EPSG:5181' : true}
			}
		);
		map.addLayer(wmsLayer);
		
		var panControl = new OpenLayers.Control.Navigation({ id : "pan" });
		map.addControl(panControl);
		
		var vectorLayer =  new OpenLayers.Layer.Vector();
		map.addLayer(vectorLayer);
		
		var myClickControl = new OpenLayers.Control.MyClickControl(vectorLayer, OpenLayers.Handler.Point, 
				{ 
					id : "myClickControl"
					/* ,drawFeature: function(geometry) {
				        var feature = new OpenLayers.Feature.Vector(geometry);
				        var proceed = this.layer.events.triggerEvent(
				            "sketchcomplete", {feature: feature}
				        );
				        if(proceed !== false) {
				            feature.state = OpenLayers.State.INSERT;
				            this.layer.addFeatures([feature]);
				            this.featureAdded(feature);
				            this.events.triggerEvent("featureadded",{feature : feature});
				        }
				        alert(geometry.x + " : " + geometry.y);
				    }	 */
				    /* , featureAdded : function(feature) {
				        alert(feature.geometry.x + " : " + feature.geometry.y);
				    } */
				}
		);
		map.addControl(myClickControl);
		if(myClickControl.active) {
			myClickControl.deactivate();
		}
		myClickControl.activate();
		
		var searchLayer = new OpenLayers.Layer.Vector();
		map.addLayer(vectorLayer);
		
		vectorLayer.events.register("featureadded", this, function(res) {
			getFeatureByPoint(res.feature.geometry, function(features) {
				searchLayer.addFeatures(features);
			});
		});
		
		//var point = new OpenLayers.Geometry.Point(x, y);
		map.events.register("moveend", this, function(result){
			 var mapData = result.object ;
			 if(mapData.getZoom() >= 13){
			 	var x = mapData.getCenter().lon;
			 	var y = mapData.getCenter().lat;
				var point = new OpenLayers.Geometry.Point( x, y );
				
				getFeatureByPoint(point, function(features) {
            		alert(features[0].data.name);	
				});
				
				
				/* 
				// 내부 gfnWFSGetFeature 함수에서 보내는 geom필드명과 gcmm_lgld_gm의 geom 필드명이랑 달라서 사용 못함
				gfnGetFeatureByIntersects("gcmm_lgld_gm", point, false, false, false,function(result){
					debugger;	
				});  */
				
		 	}
		 });
		
		map.zoomToMaxExtent();
	});
	
	function getFeatureByPoint(point, callback) {
		var protocol = new OpenLayers.Protocol.WFS.v1_1_0({
	        url: "/geolib/proxy?Service=WFS",
	        geometryName: "the_gom",
	        featureType: "gcmm_lgld_gm",
	        featurePrefix: "",
	        srsName: "EPSG:5181"
	    });
	    protocol.read({
	    	maxFeatures : 9999,
	        filter: new OpenLayers.Filter.Spatial({
	            type: OpenLayers.Filter.Spatial.INTERSECTS,
	            value:point
	        }),
	        callback: function(response) {
	        	$('#loadingBar').hide();
	            if(response && response.features) {
	            	if(response.features.length > 0) {
	            		if(callback) callback(response.features);
	            	}
	            	else {
	            		alert("선택된 데이터가 없습니다.");
	            	}
	            	//debugger;
	            }
	            else {
	            	$.messager.alert("알림", "WFS 호출에 실패했습니다.");
	            }
	        }
	    });
	}
	</script>

</body>
</html>