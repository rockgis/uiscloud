goog.provide('ol.source.Daum');
goog.require('ol.source.XYZ');
ol.source.Daum = function(options) {
	if(!options) options = {};
	var urls = this.getUrls(options.type);
	
	options = {
		projection : "EPSG:5181",
		urls : urls,
		tileGrid : new ol.tilegrid.TileGrid({
	        origin: [-30000, -60000],
	        resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]
	  	}),
	  	tileUrlFunction : function (coordinate) {
			var z = 14 - coordinate[0];
			var x = coordinate[1];
			var y = coordinate[2];
			var url = this.urls[goog.math.randomInt(this.urls.length)];
			return url.replace(/\{z\}/g, z).replace(/\{y\}/g, y).replace(/\{x\}/g, x);
		}
	};
	goog.base(this, options);
};
goog.inherits(ol.source.Daum, ol.source.XYZ);

ol.source.Daum.prototype.getUrls = function(type) {
	var urls = null;
	// 영상
	if(type == "satellite") {
		urls = [
			"http://s0.maps.daum-img.net/L{z}/{y}/{x}.jpg?v=141021",
			"http://s1.maps.daum-img.net/L{z}/{y}/{x}.jpg?v=141021",
			"http://s2.maps.daum-img.net/L{z}/{y}/{x}.jpg?v=141021",
			"http://s3.maps.daum-img.net/L{z}/{y}/{x}.jpg?v=141021"
		];
		
	}
	// 하이브리드
	else if(type == "hybrid") {
		urls = [
			"http://h0.maps.daum-img.net/map/image/G03/h/2015eight/L{z}/{y}/{x}.png",
			"http://h1.maps.daum-img.net/map/image/G03/h/2015eight/L{z}/{y}/{x}.png",
			"http://h2.maps.daum-img.net/map/image/G03/h/2015eight/L{z}/{y}/{x}.png",
			"http://h3.maps.daum-img.net/map/image/G03/h/2015eight/L{z}/{y}/{x}.png"
		];
	}
	// 자전거
	else if(type == "bike") {
		urls = [
			"http://bicycle.maps.daum-img.net/map/image/G03/bicycle/0bicycle/1.00/L{z}/{y}/{x}.png",
		];
	}
	// 지형도
	else if(type == "topography") {
		urls = [
			"http://sr0.maps.daum-img.net/map/image/G03/sr/2.00/L{z}/{y}/{x}.png",
			"http://sr1.maps.daum-img.net/map/image/G03/sr/2.00/L{z}/{y}/{x}.png",
			"http://sr2.maps.daum-img.net/map/image/G03/sr/2.00/L{z}/{y}/{x}.png",
			"http://sr3.maps.daum-img.net/map/image/G03/sr/2.00/L{z}/{y}/{x}.png"
		];
	}
	// 교통
	else if(type == "traffic") {
		urls = [
			"http://r0.maps.daum-img.net/mapserver/file/realtimeroad/L{z}/{y}/{x}.png",
			"http://r1.maps.daum-img.net/mapserver/file/realtimeroad/L{z}/{y}/{x}.png",
			"http://r2.maps.daum-img.net/mapserver/file/realtimeroad/L{z}/{y}/{x}.png",
			"http://r3.maps.daum-img.net/mapserver/file/realtimeroad/L{z}/{y}/{x}.png"
		];
	}
	// 로드뷰
	else if(type == "roadview") {
		urls = [
			"http://t0.maps.daum-img.net/map/image/G03/t/2.00/L{z}/{y}/{x}.png",
			"http://t1.maps.daum-img.net/map/image/G03/t/2.00/L{z}/{y}/{x}.png",
			"http://t2.maps.daum-img.net/map/image/G03/t/2.00/L{z}/{y}/{x}.png",
			"http://t3.maps.daum-img.net/map/image/G03/t/2.00/L{z}/{y}/{x}.png"
		];
	}
	// 기본
	else {
		urls = [
			"http://i0.maps.daum-img.net/map/image/G03/i/2015eight/L{z}/{y}/{x}.png",
			"http://i1.maps.daum-img.net/map/image/G03/i/2015eight/L{z}/{y}/{x}.png",
			"http://i2.maps.daum-img.net/map/image/G03/i/2015eight/L{z}/{y}/{x}.png",
			"http://i3.maps.daum-img.net/map/image/G03/i/2015eight/L{z}/{y}/{x}.png"
		];
	}
	return urls; 
};
