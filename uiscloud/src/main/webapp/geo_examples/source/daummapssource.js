goog.provide('ol.source.DaumMaps');

goog.require('ol.Attribution');
goog.require('ol.TileUrlFunction');
goog.require('ol.source.TileImage');
goog.require('ol.tilegrid.XYZ');

ol.source.DaumMaps = function(options) {

	if(!proj4.defs('EPSG:5181')) {
		proj4.defs("EPSG:5181", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
	}
	
	var projection = new ol.proj.Projection({
		code : "EPSG:5181",
		extent : [-30000, -60000, 494288, 988576],
		unit : "m"
	});
	
	var tileGrid = new ol.tilegrid.Daum({
		extent: ol.tilegrid.extentFromProjection(projection),
		maxZoom: 14,
		tileSize: options.tileSize
	});
	
	goog.base(this , {
		attributions: options.attributions,
		crossOrigin: options.crossOrigin,
	    logo: options.logo,
	    projection: projection,
	    tileLoadFunction: options.tileLoadFunction,
	    tilePixelRatio: options.tilePixelRatio,
	    tileUrlFunction: ol.TileUrlFunction.nullTileUrlFunction,
	    wrapX: goog.isDef(options.wrapX) ? options.wrapX : true
	});
	
	this.tileCoordTransform_ = tileGrid.createTileCoordTransform();

	var urls = [];
	if(options.type == "Hybrid") {
		urls.push("http://i0.maps.daum-img.net/map/image/G03/i/2015munich/L{z}/{y}/{x}.png");
		urls.push("http://i1.maps.daum-img.net/map/image/G03/i/2015munich/L{z}/{y}/{x}.png");
		urls.push("http://i2.maps.daum-img.net/map/image/G03/i/2015munich/L{z}/{y}/{x}.png");
		urls.push("http://i3.maps.daum-img.net/map/image/G03/i/2015munich/L{z}/{y}/{x}.png");
	}
	else if(options.type == "Physical") {
		urls.push("http://sr0.maps.daum-img.net/map/image/G03/sr/1.00/L{z}/{y}/{x}.png");
		urls.push("http://sr1.maps.daum-img.net/map/image/G03/sr/1.00/L{z}/{y}/{x}.png");
		urls.push("http://sr2.maps.daum-img.net/map/image/G03/sr/1.00/L{z}/{y}/{x}.png");
		urls.push("http://sr3.maps.daum-img.net/map/image/G03/sr/1.00/L{z}/{y}/{x}.png");
	}
	else if(options.type == "Satellite") {
		urls.push("http://s0.maps.daum-img.net/L{z}/{y}/{x}.jpg");
		urls.push("http://s1.maps.daum-img.net/L{z}/{y}/{x}.jpg");
		urls.push("http://s2.maps.daum-img.net/L{z}/{y}/{x}.jpg");
		urls.push("http://s3.maps.daum-img.net/L{z}/{y}/{x}.jpg");
	}
	else if(options.type == "Street") {
		urls.push("http://i0.maps.daum-img.net/map/image/G03/i/1.20/L{z}/{y}/{x}.png");
		urls.push("http://i1.maps.daum-img.net/map/image/G03/i/1.20/L{z}/{y}/{x}.png");
		urls.push("http://i2.maps.daum-img.net/map/image/G03/i/1.20/L{z}/{y}/{x}.png");
		urls.push("http://i3.maps.daum-img.net/map/image/G03/i/1.20/L{z}/{y}/{x}.png");
	}
	this.setUrls(urls);
}
goog.inherits(ol.source.DaumMaps, ol.source.TileImage);

ol.source.DaumMaps.prototype.setTileUrlFunction = function(tileUrlFunction) {
  goog.base(this, 'setTileUrlFunction',
      ol.TileUrlFunction.withTileCoordTransform(
          this.tileCoordTransform_, tileUrlFunction));
};

ol.source.DaumMaps.prototype.setUrl = function(url) {
  this.setTileUrlFunction(ol.TileUrlFunction.createFromTemplates(
      ol.TileUrlFunction.expandUrl(url)));
};

ol.source.DaumMaps.prototype.setUrls = function(urls) {
  this.setTileUrlFunction(ol.TileUrlFunction.createFromTemplates(urls));
};