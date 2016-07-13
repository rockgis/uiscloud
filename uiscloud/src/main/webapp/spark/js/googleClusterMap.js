var mcOptions = {
	maxZoom : 20,
	minimumClusterSize : 1,
	zoomOnClick : false,
	calculator : function(markers, numStyles) {
		var weight = 0;

		for (var i = 0; i < markers.length; ++i) {
			weight += markers[i].weight;
		}
		return {
			text : weight,
			index : Math.min(String(weight).length, numStyles)
		};
	},
	styles : [ {
		height : 53,
		url : "img/m1.png",
		width : 53
	}, {
		height : 56,
		url : "img/m2.png",
		width : 56
	}, {
		height : 66,
		url : "img/m3.png",
		width : 66
	}, {
		height : 78,
		url : "img/m4.png",
		width : 78
	}, {
		height : 90,
		url : "img/m5.png",
		width : 90
	}, {
		height : 102,
		url : "img/m6.png",
		width : 102
	}, {
		height : 114,
		url : "img/m7.png",
		width : 114
	}, {
		height : 126,
		url : "img/m8.png",
		width : 126
	} ]

};

GoogleMap.prototype = new google.maps.OverlayView();
GoogleMap.prototype.draw = function() {};


var resIdx=[];
var prevent=false;
var zoomPrevent=false;
function GoogleMap() {
	this.map;
	this.clusterer = null;
	this.boundChnageListener = null;
	this.totalCount = 0;

	this.mapDiv = null;
	
	this.firework = null;
	this.showFirework = false;
	this.focus = true;
}

GoogleMap.prototype.createMap = function(divId) {

	this.mapDiv = document.getElementById(divId);
	this.map = new google.maps.Map(document.getElementById(divId), {
		disableDefaultUI : true,
		streetViewControl : false,
		zoom : 2,
		maxZoom : 20,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	});
	
	this.map.setZoom(2);
	
	this.firework = new Fireworks(this.mapDiv, this.map);
	this.setMap(this.map);
	

};

GoogleMap.prototype.move = function(lat, lng) {
	this.map.setCenter(new google.maps.LatLng(lat, lng));
};

GoogleMap.prototype.setLevel = function(level) {
	this.map.setZoom(level);

};

GoogleMap.prototype.getLevel = function() {
	return this.map.getZoom();
};

GoogleMap.prototype.getBound = function() {
	return this.map.getBounds();
};
GoogleMap.prototype.setData = function(data) {

	var ob = $.parseJSON(data);
	
	var clusterer = this.clusterer;

	var map = this.map;

	var pro = this.getProjection();
	
	var mapDiv = this.mapDiv;
	
	var firewors = this.firework;

	var showFi = (this.showFirework && this.focus);
	
	var tt = this.totalCount;

	var calc = function(markers, numStyles, clusterIcon , idx) {
		var weight = 0;

		for (var i = 0; i < markers.length; ++i) {
			weight += markers[i].weight;
			if(resIdx.length == 0 || !resIdx.includes(markers[i].idx)) {
				resIdx.push(markers[i].idx);
			} 
		}
			
		if ((typeof (clusterIcon.getSums()) == "number") && weight > clusterIcon.getSums() && clusterIcon.getSums() >= 10000) {
//			var strWeight = weight.toString();
//			var strOldWeight = clusterIcon.getSums().toString();
			var strWeight = parseInt(weight/10000);
			var strOldWeight = parseInt(clusterIcon.getSums()/10000);
			if ((strWeight > strOldWeight)) {
				loc = pro.fromLatLngToContainerPixel(clusterIcon.getCenter());
				if(showFi && !prevent && !zoomPrevent) {
					firewors.craetFierworksFromBottomCenter(loc.x, loc.y);
				}
			}
			
		} 
		// index : marker style index
		return {
			text : weight,
			index : weight.toString().length - 1

		};
	}

	var markers = [];

	if (ob.features.length < 0)
		return;
	markers = ($(ob.features).map(function(i, position) {
		var latLng = new google.maps.LatLng(position.geometry.coordinates[1],position.geometry.coordinates[0]);
		return new google.maps.Marker({
			text : position.properties.weight,
			weight : position.properties.weight,
			'position' : latLng,
			idx : ob.idx
		});
	}));

	this.clusterer.setCalculator(calc);
	if (markers.length > 0) {
		this.clusterer.replaceMarkers(markers);
	}
	// this.clusterer = new MarkerClusterer(this.map, markers, mcOptions);
	
	
	this.showFirework = this.totalCount > (ob.totalCount*3);
	this.totalCount++;
	
	
};

GoogleMap.prototype.createCluster = function(divId) {
	this.createMap(divId);
	this.clusterer = new MarkerClusterer(this.map, null, mcOptions);
	this.clusterer.setMaxZoom(20);

	var map = this.map;

	
	
};

GoogleMap.prototype.clear = function() {
	this.clusterer.clearMarkers();
	this.showFirework = false;
	this.totalCount = 0;
	resIdx = [];
	
};

GoogleMap.prototype.setBoundChangeListener = function(callback) {
	var boundChange=false;
	var cl = this.clusterer;
	
	google.maps.event.addListener(this.map, 'dragend', function() {
		zoomPrevent = true;
	});
	google.maps.event.addListener(this.map, 'zoom_changed', function() {
		zoomPrevent = true;
	});
	
	google.maps.event.addListener(this.map, 'bounds_changed', function() {
		boundChange=true;
		prevent = true;
	});
	
	google.maps.event.addListener(this.map, 'idle', function() {
		if(boundChange) {
			this.showFirework = false;
			this.totalCount = 0;
			boundChange=false;
			callback(false);
		}
		prevent = false;
		zoomPrevent = false;
	});
	
};

GoogleMap.prototype.setFireworkVisible = function(isShow) {
	this.focus = isShow;
};

GoogleMap.prototype.resize = function() {

	google.maps.event.trigger(this.map, 'resize');
	this.map.setZoom(this.map.getZoom());
};



GoogleMap.prototype.constructor = GoogleMap;