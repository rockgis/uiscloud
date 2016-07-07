goog.provide('ol.source.Naver');
goog.require('ol.source.XYZ');
ol.source.Naver = function(options) {
	if(!options) options = {};
	var urls = this.getUrls(options.type);
	
	options = {
		projection : "EPSG:5179",
		urls : urls,
		tileGrid : new ol.tilegrid.TileGrid({
	        origin: [90112, 1192896],
	        resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]
	  	}),
	  	tileUrlFunction : function (coordinate) {
			var z = coordinate[0] + 1;
			var x = coordinate[1];
			var y = coordinate[2];
			var url = this.urls[goog.math.randomInt(this.urls.length)];
			return url.replace(/\{z\}/g, z).replace(/\{y\}/g, y).replace(/\{x\}/g, x);
		}
	};
	goog.base(this, options);
};
goog.inherits(ol.source.Naver, ol.source.XYZ);

ol.source.Naver.prototype.getUrls = function(type) {
	var urls = null;
	// 영상
	if(type == "satellite") {
		urls = [
			"http://onetile1.map.naver.net/get/130/0/1/{z}/{x}/{y}/bl_st_bg",
			"http://onetile2.map.naver.net/get/130/0/1/{z}/{x}/{y}/bl_st_bg",
			"http://onetile3.map.naver.net/get/130/0/1/{z}/{x}/{y}/bl_st_bg",
			"http://onetile4.map.naver.net/get/130/0/1/{z}/{x}/{y}/bl_st_bg"
		];
		
	}
	// 하이브리드
	else if(type == "hybrid") {
		urls = [
			"http://onetile1.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_st_rd/ol_st_an",
			"http://onetile2.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_st_rd/ol_st_an",
			"http://onetile3.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_st_rd/ol_st_an",
			"http://onetile4.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_st_rd/ol_st_an"
		];
	}
	// 자전거
	else if(type == "bike") {
		urls = [
			"http://onetile1.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_bc_hb",
			"http://onetile2.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_bc_hb",
			"http://onetile3.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_bc_hb",
			"http://onetile4.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_bc_hb"
		];
	}
	// 지형도
	else if(type == "topography") {
		urls = [
			"http://onetile1.map.naver.net/get/130/0/0/{z}/{x}/{y}/bl_tn_bg/ol_vc_bg/ol_vc_an",
			"http://onetile2.map.naver.net/get/130/0/0/{z}/{x}/{y}/bl_tn_bg/ol_vc_bg/ol_vc_an",
			"http://onetile3.map.naver.net/get/130/0/0/{z}/{x}/{y}/bl_tn_bg/ol_vc_bg/ol_vc_an",
			"http://onetile4.map.naver.net/get/130/0/0/{z}/{x}/{y}/bl_tn_bg/ol_vc_bg/ol_vc_an"
		];
	}
	// 교통
	else if(type == "traffic") {
		urls = [
			"http://onetile1.map.naver.net/get/130/1073289/0/{z}/{x}/{y}/empty/ol_tr_rt/ol_vc_an",
			"http://onetile2.map.naver.net/get/130/1073289/0/{z}/{x}/{y}/empty/ol_tr_rt/ol_vc_an",
			"http://onetile3.map.naver.net/get/130/1073289/0/{z}/{x}/{y}/empty/ol_tr_rt/ol_vc_an",
			"http://onetile4map.naver.net/get/130/1073289/0/{z}/{x}/{y}/empty/ol_tr_rt/ol_vc_an"
		];
	}
	// 지적편집도
	else if(type == "lgstr") {
		urls = [
			"http://onetile1.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_lp_cn",
			"http://onetile2.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_lp_cn",
			"http://onetile3.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_lp_cn",
			"http://onetile4.map.naver.net/get/130/0/0/{z}/{x}/{y}/empty/ol_lp_cn"
		];
	}
	// 기본
	else {
		urls = [
			"http://onetile1.map.naver.net/get/123/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an",
			"http://onetile2.map.naver.net/get/123/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an",
			"http://onetile3.map.naver.net/get/123/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an",
			"http://onetile4.map.naver.net/get/123/0/0/{z}/{x}/{y}/bl_vc_bg/ol_vc_an"
		];
	}
	return urls; 
};
