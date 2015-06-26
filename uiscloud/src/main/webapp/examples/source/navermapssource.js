goog.provide('ol.source.NaverMaps');

goog.require('ol.Attribution');
goog.require('ol.TileUrlFunction');
goog.require('ol.source.TileImage');
goog.require('ol.tilegrid.XYZ');

ol.source.NaverMaps = function(options) {
	//if(!proj4.defs('EPSG:5179')) {
		proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs");
	//}
	
	var projection = new ol.proj.Projection({
		code : "EPSG:5179",
		extent : [90112, 1192896, 1990673, 2761664],
		//axisOrientation_ : 'neu'
		unit : "m"
	});
	
	var tileGrid = new ol.tilegrid.Naver({
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
		urls.push("http://onetile1.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_st_bg/ol_st_rd/ol_st_an");
		urls.push("http://onetile2.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_st_bg/ol_st_rd/ol_st_an");
		urls.push("http://onetile3.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_st_bg/ol_st_rd/ol_st_an");
		urls.push("http://onetile4.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_st_bg/ol_st_rd/ol_st_an");
	}
	else if(options.type == "Cadstral") {
		urls.push("http://onetile1.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_vc_bg/ol_lp_cn");
		urls.push("http://onetile2.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_vc_bg/ol_lp_cn");
		urls.push("http://onetile3.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_vc_bg/ol_lp_cn");
		urls.push("http://onetile4.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_vc_bg/ol_lp_cn");
	}
	else if(options.type == "Satellite") {
		urls.push("http://onetile1.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_st_bg/ol_st_an");
		urls.push("http://onetile2.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_st_bg/ol_st_an");
		urls.push("http://onetile3.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_st_bg/ol_st_an");
		urls.push("http://onetile4.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_st_bg/ol_st_an");
	}
	else if(options.type == "Street") {
		urls.push("http://onetile1.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an");
		urls.push("http://onetile2.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an");
		urls.push("http://onetile3.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an");
		urls.push("http://onetile4.map.naver.net/get/109/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an");
	}
	this.setUrls(urls);
}
goog.inherits(ol.source.NaverMaps, ol.source.TileImage);

ol.source.NaverMaps.prototype.setTileUrlFunction = function(tileUrlFunction) {
  goog.base(this, 'setTileUrlFunction',
      ol.TileUrlFunction.withTileCoordTransform(
          this.tileCoordTransform_, tileUrlFunction));
};

ol.source.NaverMaps.prototype.setUrl = function(url) {
  this.setTileUrlFunction(ol.TileUrlFunction.createFromTemplates(
      ol.TileUrlFunction.expandUrl(url)));
};

ol.source.NaverMaps.prototype.setUrls = function(urls) {
  this.setTileUrlFunction(ol.TileUrlFunction.createFromTemplates(urls));
};