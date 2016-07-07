goog.provide('olCustom.service.WFS');

olCustom.service.WFS.defaultParams = {
	url : null,
	featurePrefix : null,
	srsName : null,
	geometryName : "geom",
	version : "1.1.0"
};

olCustom.service.WFS.setDefaultParams = function(params) {
	$.extend(olCustom.service.WFS.defaultParams, params);
};

olCustom.service.WFS.getFeatureByObjectId = function(featureType, values, callback, params, options) {
	if(goog.isString(values)) {
		values = values.splite(",");
	}
	var filter = new OpenLayers.Filter.FeatureId({
		fids : values
	});
	olCustom.service.WFS.getFeature(featureType, filter, callback, params, options);
};

olCustom.service.WFS.getFeatureByCQL = function(featureType, value, callback, params, options) {
	var format = new OpenLayers.Format.CQL();
	var filter = format.read(value);
	olCustom.service.WFS.getFeature(featureType, filter, callback, params, options);
};

/**
 * APIProperty: type
 * {String} type: type of the comparison. This is one of
 * - OpenLayers.Filter.Comparison.EQUAL_TO                 = "==";
 * - OpenLayers.Filter.Comparison.NOT_EQUAL_TO             = "!=";
 * - OpenLayers.Filter.Comparison.LESS_THAN                = "<";
 * - OpenLayers.Filter.Comparison.GREATER_THAN             = ">";
 * - OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO    = "<=";
 * - OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO = ">=";
 * - OpenLayers.Filter.Comparison.BETWEEN                  = "..";
 * - OpenLayers.Filter.Comparison.LIKE                     = "~"; 
 */
olCustom.service.WFS.getFeatureByComparison = function(featureType, type, property, value, callback, params, options) {
	var filter = new OpenLayers.Filter.FeatureId({
		type : type,
		property : property,
		value : value
	});
	olCustom.service.WFS.getFeature(featureType, filter, callback, params, options);
};

olCustom.service.WFS.getFeatureByBBOX = function(featureType, value, callback, params, options) {
	var filter = new OpenLayers.Filter.Spatial({
        type : "BBOX",
        value : OpenLayers.Bounds.fromArray(value)
    });
	olCustom.service.WFS.getFeature(featureType, filter, callback, params, options);
};

/**
 * APIProperty: type
 * {String} Type of spatial filter.
 *
 * The type should be one of:
 * - OpenLayers.Filter.Spatial.INTERSECTS = "INTERSECTS";
 * - OpenLayers.Filter.Spatial.DWITHIN = "WITHIN";
 * - OpenLayers.Filter.Spatial.CONTAINS = "CONTAINS";
 */
olCustom.service.WFS.getFeatureBySpatial = function(featureType, type, value, callback, params, options) {
	if(goog.isString(featureType)) {
		featureType = featureType.split(",");
	}
	
	var geometry = null;
	if(options && options.version && options.version == 2) {
		geometry = value;
	}
	else {
		var ol2format = new OpenLayers.Format.GeoJSON();
		var ol3format = new ol.format.GeoJSON();
		var json = ol3format.writeGeometryObject(value);
		geometry = ol2format.read(json, "Geometry");
	}

	if(options && options.buffer && options.buffer > 0) {
		var jsts_parser = new jsts.io.OpenLayersParser();
		var jGeom = jsts_parser.read(geometry.clone());				
		var jbGeom = jGeom.buffer(options.buffer);
		geometry = jsts_parser.write(jbGeom);
	}
	
	var filter = new OpenLayers.Filter.Spatial({
        type : type,
        value : geometry
    });
	olCustom.service.WFS.getFeature(featureType, filter, callback, params, options);
};

olCustom.service.WFS.getFeatureByDWithin = function(featureType, distance, value, callback, params, options) {
	if(goog.isString(featureType)) {
		featureType = [featureType];
	}
	
	var geometry = null;
	if(options && options.version && options.version == 2) {
		geometry = value;
	}
	else {
		var ol2format = new OpenLayers.Format.GeoJSON();
		var ol3format = new ol.format.GeoJSON();
		var json = ol3format.writeGeometryObject(value);
		geometry = ol2format.read(json, "Geometry");
	}

	var filter = new OpenLayers.Filter.Spatial({
        type : "DWITHIN",
        value : geometry,
        distance : distance,
        distanceUnits : "m"
    });
	olCustom.service.WFS.getFeature(featureType, filter, callback, params, options);
};

olCustom.service.WFS.getFeatureByRelation = function(featureType, values, relationFeatureType, type, callback, params, options) {
	olCustom.service.WFS.getFeatureByObjectId(featureType, values, function(features) {
		
		var buffer = "0.01";
		if(options && options.buffer && options.buffer > 0) {
			buffer = options.buffer;
		}
		
		//var multiPolygon = new ol.geom.MultiPolygon(null);
		
		var multiPolygon = null; 
		for(var i in features) {
			var feature = features[i];
			var geometry = feature.getGeometry().clone();
			
			var ol3format = new ol.format.GeoJSON();
			
			var reader = new jsts.io.GeoJSONParser();
			var polygon = reader.read(ol3format.writeGeometryObject(geometry)).buffer(buffer);
			
			if(i==0) {
				multiPolygon = polygon;
			}
			else {
				multiPolygon.union(polygon);
			}
			/*var multipolygon = geoms[0];
			for (var x=1; x < geoms.length ; x++){
			    multipolygon = multipolygon.union(geoms[x]);
			}*/
			/*var jsts_parser = new jsts.io.OpenLayersParser();
			var jGeom = jsts_parser.read(geometry.clone());				
			var jbGeom = jGeom.buffer(buffer);
			var geom = jsts_parser.write(jbGeom);
			
			var polygons = geom.getPolygons();
			for(var j in polygons) {
				var polygon = polygons[j].clone();
				polygon.setLayout(ol.geom.GeometryLayout.XY);
				multiPolygon.appendPolygon(polygon);
			}*/
		}
		var jsts_parser = new jsts.io.OpenLayersParser();
		olCustom.service.WFS.getFeatureBySpatial(relationFeatureType, type, jsts_parser.write(multiPolygon), callback, params, { version : 2 });
	}, params, options);
};

olCustom.service.WFS.transaction = function(featureType, srsName, insertFeatures, updateFeatures, deleteFeatures, callback) {
	var p = $.extend({}, olCustom.service.WFS.defaultParams);
	p.featureType = featureType;
	p.srsName = srsName;
	
	if(goog.isDef(p.geometryName)) {
		for(var i in insertFeatures) {
			insertFeatures[i].setGeometryName(p.geometryName);
			var properties = insertFeatures[i].getProperties();
			properties[p.geometryName] = properties["geometry"];
			delete properties["geometry"];
			insertFeatures[i].setProperties(properties);
		}
		for(var i in updateFeatures) {
			updateFeatures[i].setGeometryName(p.geometryName);
			var properties = updateFeatures[i].getProperties();
			properties[p.geometryName] = properties["geometry"];
			delete properties["geometry"];
			updateFeatures[i].setProperties(properties);
		}
	}

	var format = new ol.format.WFS();
	var node = format.writeTransaction(insertFeatures, updateFeatures, deleteFeatures, p);
	var data = $(node).clone().wrapAll("<div/>").parent().html();
	
	$.ajax({
		url : p.url,
		type : "POST",
		dataType : "text",
		data : data,
		contentType : "text/xml",
    	success : function(response) {
    		var prefixWfs = "";
    		var agent = navigator.userAgent.toLowerCase();
    		var appName = navigator.appName.toLowerCase();
    		
    		//익스11버젼 체크 추가
    		if((agent.indexOf("msie") != -1) || (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1)) {
    			prefixWfs = "wfs:";
    		}
    		
    		var xml = $.parseXML(response);
    		var inserted = $(xml).find(prefixWfs+"totalInserted").text();
    		var updated = $(xml).find(prefixWfs+"totalUpdated").text();
    		var deleted = $(xml).find(prefixWfs+"totalDeleted").text();
    		if(goog.isDef(callback)) callback({
    			inserted : inserted,
    			updated : updated,
    			deleted : deleted
    		});
    	}
	});
	
};

olCustom.service.WFS.getFeature = function(featureType, filter, callback, params, options) {
	var p = $.extend({}, olCustom.service.WFS.defaultParams, params);
	p.featureType = featureType;
	
	if(!goog.isDef(options)) options = {};
	options.filter = filter;
	
	var format = new olCustom.format.WFS();
	var data = format.writeGetFeature(p, options);
	$("#txa_request").val(data);
	
	$.ajax({
    	url : p.url,
    	type : "POST",
    	dataType : "text",
    	data : data,
    	contentType : "text/xml",
    	success : function(response) {
    		var format = new ol.format.GML3();
    		
    		var features = [];
    		
    		if(p.serverType == "arcgis" || p.serverType == "kmaps") {
    			// ARC 를 위한 코드 추가
        		var prefixOgc = "";
        		var agent = navigator.userAgent.toLowerCase();
        		
        		//익스11버젼 체크 추가
        		if((agent.indexOf("msie") != -1) || (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1)) {
        			prefixOgc = "ogc:";
        		}
        		var featureMembers = $.parseXML(response).getElementsByTagName(prefixOgc+"featureMember");
        		
        		for(var i=0, len=featureMembers.length; i < len; i++) {
        			var feature = format.readFeatures(featureMembers[i]);
        			if(p.serverType == "arcgis") {
        				feature.setId(feature.getProperties()["OBJECTID"]);	
        			}
        			features.push(feature);
        		}
    		}
    		else {
    			features = format.readFeatures(response);
    		}
    		
    		if(goog.isDef(callback)) callback(features);
    	},
    	error : function(response) {
    		$("#txa_response").val(response);
    		
    		var format = new ol.format.GML3();
    		if(goog.isDef(callback)) callback(format.readFeatures(response));
    	}
    });
	
};