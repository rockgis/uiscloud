/**
 * drawTool.js
 */

var drawTool = {
	drawLayer : null,
	
	source : null,
	
	selectInteraction : null,
	
	map : null,
		
	init : function(map){
		var that = this;
		that.map = map;
		
		that.fn_init_drawLayer();
		that.fn_init_drawInteractions();
		that.fn_init_event();
	},
	
	fn_init_drawLayer : function(){
		var that = this;
		
		that.source = new ol.source.Vector();
		that.drawLayer = new ol.layer.Vector({
			id : "drawLayer",
			source : that.source,
			style : new ol.style.Style({
				fill: new ol.style.Fill({
			      color: 'rgba(255, 255, 255, 0.2)'
			    }),
			    stroke: new ol.style.Stroke({
			      color: 'rgba(255, 204, 51, 1)',
			      width: 2
			    }),
			    image: new ol.style.Circle({
			      radius: 7,
			      fill: new ol.style.Fill({
			        color: 'rgba(255, 204, 51, 1)'
			      })
			    })
			})
		});
		
		that.map.addLayer(that.drawLayer);
	},
	
	fn_init_drawInteractions : function(){
		var that = this;
		
		var snap = new ol.interaction.Snap({
			source: that.source,
		});
		snap.set('id','snap');
		snap.set('name','snap');
		
		var drawPoint = new ol.interaction.Draw({
			source: that.source,
		    type: /** @type {ol.geom.GeometryType} */ ('Point')
		});
		drawPoint.set('id','drawPoint');
		drawPoint.set('name','drawPoint');
		
		var drawLine = new ol.interaction.Draw({
			source: that.source,
		    type: /** @type {ol.geom.GeometryType} */ ('LineString')
		});
		drawLine.set('id','drawLine');
		drawLine.set('name','drawLine');
		
		var drawPolygon = new ol.interaction.Draw({
			source: that.source,
		    type: /** @type {ol.geom.GeometryType} */ ('Polygon')
		});
		drawPolygon.set('id','drawPolygon');
		drawPolygon.set('name','drawPolygon');
		
		var selectFeature = new ol.interaction.Select();
		selectFeature.set('id','selectFeature');
		selectFeature.set('name','selectFeature');
		that.selectInteraction = selectFeature;
		
		var modifyFeature = new ol.interaction.Modify({
			features : selectFeature.getFeatures(),
			deleteCondition: function(event) {
				return ol.events.condition.shiftKeyOnly(event) &&
		        		ol.events.condition.singleClick(event);
			}
		});
		modifyFeature.set('id','modifyFeature');
		modifyFeature.set('name','modifyFeature');
		
		var dragFeature = new olCustom.DragFeature({});
		dragFeature.set('id','dragFeature');
		dragFeature.set('name','dragFeature');
		
		var interactions = [snap, drawPoint, drawLine, drawPolygon, selectFeature, modifyFeature, dragFeature];
		
		for(var i in interactions){
			that.map.addInteraction(interactions[i]);
		}
	},
	
	fn_init_event : function(){
		var that = this;
	}
};