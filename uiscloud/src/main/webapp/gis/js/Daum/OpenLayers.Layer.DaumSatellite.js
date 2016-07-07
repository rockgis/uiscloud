﻿/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/XYZ.js
 * http://s3.maps.daum-img.net/L2/3939/1723.jpg?v=090323
 */

OpenLayers.Layer.DaumSatellite = OpenLayers.Class(OpenLayers.Layer.XYZ, {

    name: "DaumSatelliteMap",
    url: [
		"http://s0.maps.daum-img.net/L${z}/${y}/${x}.jpg",
		"http://s1.maps.daum-img.net/L${z}/${y}/${x}.jpg",
		"http://s2.maps.daum-img.net/L${z}/${y}/${x}.jpg",
		"http://s3.maps.daum-img.net/L${z}/${y}/${x}.jpg"
    ],
	serverResolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
	attribution: '<a target="_blank" href="http://local.daum.net/map/index.jsp" '
		+ 'style="float: left; width: 38px; height: 17px; cursor: pointer; background-image: url(http://i1.daumcdn.net/localimg/localimages/07/2008/map/n_local_img_03_b.png); background-repeat: no-repeat no-repeat; " '
		+ 'title="Daum 지도로 보시려면 클릭하세요."></a>' 
		+ 'ⓒ 2013 Daum',
	sphericalMercator: false,
	transitionEffect: "resize",
	buffer: 1,
	numZoomLevels: 14,
	minResolution: 0.25,
	maxResolution: 2048,
	units: "m",
	projection: new OpenLayers.Projection("EPSG:5181"),
	displayOutsideMaxExtent: true,
	maxExtent: new OpenLayers.Bounds(-30000, -60000, 494288, 988576),
	extension : "jpg",
    initialize: function(name, options) {
		if (!options) options = {serverResolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]};
		else if (!options.serverResolutions) options.serverResolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
        var newArgs = [name, null, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArgs);
    },
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.DaumSatellite(
                this.name, this.getOptions());
        }
        obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
        return obj;
    },

	getXYZ: function(bounds) {
        var res = this.getServerResolution();
        var x = Math.round((bounds.left - this.maxExtent.left) /
            (res * this.tileSize.w));
        var y = Math.round((bounds.bottom - this.maxExtent.bottom) /
            (res * this.tileSize.h));
        var z = this.numZoomLevels - this.getServerZoom() - 4;

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }

        return {'x': x, 'y': y, 'z': z};
    },
	
    CLASS_NAME: "OpenLayers.Layer.DaumSatellite"
});
