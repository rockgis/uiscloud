"use strict";

var interactive = {
		
	popup : null,

	layer : null,
		
	init: function() {
		var that = this;
		
		that.initGis();
	},
	
	/**
	 * Gis. Layer, Control 등록 
	 */
	initGis : function() {
		var that = this;
		
		that.layer = new BiesVector("interactiveUI");
		map.addLayer(that.layer);
		
		var control = new OpenLayers.Control.DrawFeature(that.layer, OpenLayers.Handler.Polygon, {
			id : "interactiveUI"
		});
		map.addControl(control);
		
		that.layer.events.on({
			"beforefeaturesadded": function() {
				$("#btn_pan img").trigger("click");
				that.layer.removeAllFeatures();
				$("#div_west").focus();
				that.popup.focus();
			}
		});
	},
	
	/**
	 * Polygon 정보 가져오기
	 */
	getPolygonWKT : function() {
		var that = this;
		var features = that.layer.features;
		if(features.length == 1) {
			var feature = features[0];
			if(feature.geometry.getArea() > 1000000000) {
				return "over";
			}
			
			var format = new OpenLayers.Format.WKT();
			var polygonWKT = format.write(features[0]);
			return polygonWKT;
		}
		else {
			return null;
		}
	},
	
	/**
	 * 반경조건 초기화
	 */
	reset : function() {
		var that = this;
		that.layer.removeAllFeatures();
	},
	
	focus : function() {
		window.top.focus();
	}
}