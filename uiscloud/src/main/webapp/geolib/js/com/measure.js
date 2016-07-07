/**
 * 거리/면적 측정 공통함수
 */

var measure = {
		
	init: function(mapObj) {
		var that = this;
		that.map = mapObj;
	},
	
	defaultStyle : new ol.style.Style({
        fill : new ol.style.Fill({
            color : 'rgba(255, 0, 0, 0.3)',
            
        }),
        stroke : new ol.style.Stroke({
            color : 'rgba(255, 0, 0, 0.7)',
            //lineDash : [10, 10],
            width : 3
        }),
        image : new ol.style.RegularShape({
            radius : 4,
            points : 4,
            stroke : new ol.style.Stroke({
                color : 'rgba(255, 0, 0, 1)',
                width : 1
            }),
            fill : new ol.style.Fill({
                color : 'rgba(255, 255, 255, 1)'
            })
        })
    }),
    
	drawInteraction : null,
	
	geodesicCheckbox : {
		checked : false
	},
	
	wgs84Sphere : new ol.Sphere(6378137),
	
	/**
	 * Currently drawn feature.
	 * @type {ol.Feature}
	 */
	sketch : null,
	
	/**
	 * The help tooltip element.
	 * @type {Element}
	 */
	helpTooltipElement : null,
	
	/**
	 * Overlay to show the help messages.
	 * @type {ol.Overlay}
	 */
	helpTooltip : null,
	
	/**
	 * The measure tooltip element.
	 * @type {Element}
	 */
	measureTooltipElement : null,
	
	/**
	 * Overlay to show the measurement.
	 * @type {ol.Overlay}
	 */
	measureTooltip : null,
	
	/**
	 * Message to show when the user is drawing a polygon.
	 * @type {string}
	 */
	continuePolygonMsg : '클릭하여 도형을 그릴 수 있습니다.',
	
	/**
	 * Message to show when the user is drawing a line.
	 * @type {string}
	 */
	continueLineMsg : '클릭하여 라인을 그릴 수 있습니다.',
	
	createDrawInteraction : function(type){
		var that = this;
		that.drawInteraction = null;
		that.sketch = null;
		
		map.on('pointermove', measure.pointerMoveHandler);
		
		var layers = map.getLayers();
	    var interactions = map.getInteractions();
	    var vectorSource;
	    layers.forEach(function(layer){
	    	if(layer instanceof ol.layer.Vector){
	    		vectorSource = layer.getSource();
	    	}
	    });
	    
	    interactions.forEach(function(interaction){
	    	if(interaction.get("id") == 'id_LineString' || interaction.get("id") == 'id_Polygon'){
	    		map.removeInteraction(interaction);
	    	}
	    });
		
		that.drawInteraction = new ol.interaction.Draw({
            source : vectorSource,
            type : /** @type {ol.geom.GeometryType} */(type),
            style : new ol.style.Style({
                fill : new ol.style.Fill({
                    color : 'rgba(255, 255, 255, 0.2)'
                }),
                stroke : new ol.style.Stroke({
                    color : 'rgba(0, 0, 0, 0.5)',
                    lineDash : [10, 10],
                    width : 2
                }),
                image : new ol.style.Circle({
                    radius : 5,
                    stroke : new ol.style.Stroke({
                        color : 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill : new ol.style.Fill({
                        color : 'rgba(255, 255, 255, 0.2)'
                    })
                })
            })
        });
		
		that.drawInteraction.set("id", "id_" + type);
		
		map.addInteraction(measure.drawInteraction);

	    measure.createMeasureTooltip();
	    measure.createHelpTooltip();
	    
	    measure.drawInteraction.on('drawstart', function(evt) {
	        // set sketch
	    	measure.sketch = evt.feature;
	    }, this);

	    measure.drawInteraction.on('drawend', function(evt) {
	        // 위치좌표(Point)일 경우 draw가 끝날 때 결과값 표출
	        if (measure.sketch.getGeometry() instanceof ol.geom.Point) {
	            var tooltipCoord = evt.feature.getGeometry().getLastCoordinate();
	            measure.measureTooltipElement.innerHTML = '[ ' + tooltipCoord.join(', ') + ' ]';
	            measure.measureTooltip.setPosition(tooltipCoord);
	        }

	        measure.measureTooltipElement.className = 'ol3_measure_tooltip ol3_measure_tooltip-static';
	        measure.measureTooltip.setOffset([0, -7]);
	        // unset sketch
	        measure.sketch = null;
	        // unset tooltip so that a new one can be created
	        measure.measureTooltipElement = null;
	        measure.createMeasureTooltip();
	    }, this);
	    
	    measure.drawInteraction.on('change:active', function(){
	    	if(measure.drawInteraction.getActive() == false){
	    		map.removeOverlay(measure.helpTooltip);
		    	map.removeOverlay(measure.measureTooltip);
	    	}
	    });
	},

	/**
	 * Handle pointer move.
	 * Map 객체에 사용되는 이벤트핸들러(this == map)
	 * @param {ol.MapBrowserEvent} evt
	 * 
	 */
	pointerMoveHandler : function(evt) {
		var that = measure;
		
	    if (evt.dragging) {
	        return;
	    }
	    /** @type {string} */
	    var helpMsg = 'Click to start drawing';
	    /** @type {ol.Coordinate|undefined} */
	    var tooltipCoord = evt.coordinate;

	    if (that.sketch) {
	        var output;
	        var geom = (that.sketch.getGeometry());
	        if ( geom instanceof ol.geom.Polygon) {
	            output = that.formatArea(/** @type {ol.geom.Polygon} */(geom));
	            helpMsg = that.continuePolygonMsg;
	            tooltipCoord = geom.getInteriorPoint().getCoordinates();
	        } else if ( geom instanceof ol.geom.LineString) {
	            output = that.formatLength(/** @type {ol.geom.LineString} */(geom));
	            helpMsg = that.continueLineMsg;
	            tooltipCoord = geom.getLastCoordinate();
	        } else if ( geom instanceof ol.geom.Circle) {
	            output = that.formatRadius(/** @type {ol.geom.Circle} */(geom));
	            helpMsg = that.continuePolygonMsg;
	            tooltipCoord = geom.getLastCoordinate();
	        }

	        that.measureTooltipElement.innerHTML = output;
	        that.measureTooltip.setPosition(tooltipCoord);
	    }

	    that.helpTooltipElement.innerHTML = helpMsg;
	    that.helpTooltip.setPosition(evt.coordinate);
	},

	/**
	 * Creates a new help tooltip
	 */
	createHelpTooltip : function() {
		var that = this;
		
	    if (that.helpTooltipElement) {
	    	that.helpTooltipElement.parentNode.removeChild(that.helpTooltipElement);
	    }
	    that.helpTooltipElement = document.createElement('div');
	    that.helpTooltipElement.className = 'ol3_measure_tooltip';
	    that.helpTooltip = new ol.Overlay({
	        element : that.helpTooltipElement,
	        offset : [15, 0],
	        positioning : 'center-left'
	    });
	    that.map.addOverlay(that.helpTooltip);
	},

	/**
	 * Creates a new measure tooltip
	 */
	createMeasureTooltip : function() {
		var that = this;
	
	    if (that.measureTooltipElement) {
	    	that.measureTooltipElement.parentNode.removeChild(that.measureTooltipElement);
	    }
	    that.measureTooltipElement = document.createElement('div');
	    that.measureTooltipElement.className = 'ol3_measure_tooltip ol3_measure_tooltip-measure';
	    that.measureTooltip = new ol.Overlay({
	        element : that.measureTooltipElement,
	        offset : [0, -15],
	        positioning : 'bottom-center'
	    });
	    that.map.addOverlay(that.measureTooltip);
	},

	/**
	 * format length output
	 * @param {ol.geom.LineString} line
	 * @return {string}
	 */
	formatLength : function(line) {
		var that = this;
		
	    var length;
	    if (that.geodesicCheckbox.checked) {
	        var coordinates = line.getCoordinates();
	        length = 0;
	        var sourceProj = that.map.getView().getProjection();
	        for (var i = 0,
	            ii = coordinates.length - 1; i < ii; ++i) {
	            var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
	            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
	            length += wgs84Sphere.haversineDistance(c1, c2);
	        }
	    } else {
	        length = Math.round(line.getLength() * 100) / 100;
	    }
	    var output;
	    if (length > 100) {
	        output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
	    } else {
	        output = (Math.round(length * 100) / 100) + ' ' + 'm';
	    }
	    return output;
	},

	/**
	 * format length output
	 * @param {ol.geom.Polygon} polygon
	 * @return {string}
	 */
	formatArea : function(polygon) {
		var that = this;
		
	    var area;
	    if (that.geodesicCheckbox.checked) {
	        var sourceProj = that.map.getView().getProjection();
	        var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(sourceProj, 'EPSG:4326'));
	        var coordinates = geom.getLinearRing(0).getCoordinates();
	        area = Math.abs(that.wgs84Sphere.geodesicArea(coordinates));
	    } else {
	        area = polygon.getArea();
	    }
	    var output;
	    if (area > 10000) {
	        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
	    } else {
	        output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
	    }
	    return output;
	},

	/**
	 * format length output
	 * @param {ol.geom.Circle} circle
	 * @return {string}
	 */
	formatRadius : function(circle) {
		var that = this;
		
	    var radius = Math.round(circle.getRadius() * 100) / 100;
	    var output;
	    if (radius > 100) {
	        output = (Math.round(radius / 1000 * 100) / 100) + ' ' + 'km';
	    } else {
	        output = (Math.round(radius * 100) / 100) + ' ' + 'm';
	    }
	    return output;
	}
};
