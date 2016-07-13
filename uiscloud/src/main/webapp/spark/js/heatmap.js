/**
 * 
 */

function Heatmap(divId,googleId) {

	 var gmap = new google.maps.Map(document.getElementById(googleId), {
	      disableDefaultUI: true,
	      keyboardShortcuts: false,
	      draggable: false,
	      disableDoubleClickZoom: true,
	      scrollwheel: false,
	      streetViewControl: false,
	      
	    });
	 
		var projection = new ol.proj.Projection({
			code : 'EPSG:4326',
			units : 'degrees',
			axisOrientation : 'neu'
		});


	this.vector = new ol.layer.Heatmap({
		source: new ol.source.Vector({
			projection: projection,
			format : new ol.format.GeoJSON()
		})
	});

	
	var format = 'image/png';
	var bounds = [ -180, -90, 180, 90 ];
	
	var raster = new ol.layer.Image({
		source : new ol.source.ImageWMS({
			ratio : 1,
			url : 'http://192.168.0.113:80/geoserver/test/wms',
			params : {
				'FORMAT' : format,
				'VERSION' : '1.1.1',
				LAYERS : 'test:land_polygons',
				STYLES : '',
			}
		})
	});
        

	
	
    var view = new ol.View({
        // make sure the view doesn't go beyond the 22 zoom levels of Google Maps
    	projection : projection,
    	maxZoom: 20
      });

	
      var olMapDiv = document.getElementById(divId);

	this.map = new ol.Map({
        layers: [this.vector],
        interactions: ol.interaction.defaults({
            altShiftDragRotate: false,
            dragPan: false,
            rotate: false
          }).extend([new ol.interaction.DragPan({kinetic: null})]),
        target: olMapDiv,
        view: view
      });
	
    view.on('change:center', function() {
    	gmap.setCenter(new google.maps.LatLng(view.getCenter()[1], view.getCenter()[0]));
      });
      view.on('change:resolution', function() {
    	  gmap.setZoom(view.getZoom());
      });
	
	
    this.map.getView().setCenter([0,0]);
    this.map.getView().setZoom(2);
	olMapDiv.parentNode.removeChild(olMapDiv);
    gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
	
   
}

Heatmap.prototype = {
		setBlur : function(blurValue) {
			this.vector.setBlur(parseInt(blurValue, 10));
		},
		
		setRadius : function(radiusValue) {
			this.vector.setRadius(parseInt(radiusValue, 10));
		},
		
		move : function(lat , lng) {
			this.map.getView().setCenter([lng,lat]);
			
		},
		
		setLevel :function(level) {
			this.map.getView().setZoom(level);
		},
		
		getLevel :function() {
			return this.map.getView().getZoom();
		},
		
		getBox :function() {
			var mapExtent = this.map.getView().calculateExtent(this.map.getSize());
			return mapExtent;
		},
		
		setData : function(data) {
//			this.vector.addFeatures(feautres);
			var geojson_format = new  ol.format.GeoJSON();
			
			var obj = geojson_format.readFeatures(data, {
			    featureProjection: 'EPSG:4326'
			});
			
			this.vector.getSource().addFeatures(obj);
			
		},
		clear :function() {
			
			this.vector.getSource().clear();
		},
		setListener : function(linstener) {
		
			this.map.getView().on('change:center', function() {
				linstener(false);
		      });
			this.map.getView().on('change:resolution', function() {
				linstener(true);
		      });
		}
		
}

Heatmap.prototype.constructor = Heatmap;

