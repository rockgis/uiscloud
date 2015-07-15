goog.provide('ol.source.VworldMaps');

goog.require('ol.Attribution');
goog.require('ol.TileUrlFunction');
goog.require('ol.source.TileImage');
goog.require('ol.tilegrid.XYZ');

ol.source.VworldMaps = function(options) {

	if(!proj4.defs('EPSG:3857')) {
		proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");
	}
	
	var projection = new ol.proj.Projection({
		code : "EPSG:3857",
		extent : [-20037508.34, -20037508.34, 20037508.34, 20037508.34],
		unit : "m"
	});
	
	var tileGrid = new ol.tilegrid.Vworld({
		extent: ol.tilegrid.extentFromProjection(projection),
		maxZoom: 18,
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
		urls.push("http://xdworld.vworld.kr:8080/2d/Hybrid/201411/{z}/{x}/{y}.png");
	}
	else if(options.type == "Satellite") {
		urls.push("http://xdworld.vworld.kr:8080/2d/Satellite/201301/{z}/{x}/{y}.jpeg");
	}
	else if(options.type == "Street") {
		urls.push("http://xdworld.vworld.kr:8080/2d/Base/201411/{z}/{x}/{y}.png");
	}
	this.setUrls(urls);
}
goog.inherits(ol.source.VworldMaps, ol.source.TileImage);

ol.source.VworldMaps.prototype.setTileUrlFunction = function(tileUrlFunction) {
  goog.base(this, 'setTileUrlFunction',
      ol.TileUrlFunction.withTileCoordTransform(
          this.tileCoordTransform_, tileUrlFunction));
};

ol.source.VworldMaps.prototype.setUrl = function(url) {
  this.setTileUrlFunction(ol.TileUrlFunction.createFromTemplates(
      ol.TileUrlFunction.expandUrl(url)));
};

ol.source.VworldMaps.prototype.setUrls = function(urls) {
  this.setTileUrlFunction(ol.TileUrlFunction.createFromTemplates(urls));
};