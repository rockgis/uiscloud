/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */

/**
 * @requires OpenLayers/Layer/XYZ.js
 */

OpenLayers.Layer.Daum = OpenLayers.Class(OpenLayers.Layer.XYZ, {
    name: "DaumMap",
    url: [],
	sphericalMercator: false,
	transitionEffect: "resize",
	buffer: 1,
	displayOutsideMaxExtent: true,
    initialize: function(name, options) {
    	if(name == "AirMap") {
    		this.url= [
				"http://s0.maps.daum-img.net/L${z}/${y}/${x}.jpg?v=090323",
				"http://s1.maps.daum-img.net/L${z}/${y}/${x}.jpg?v=090323",
				"http://s2.maps.daum-img.net/L${z}/${y}/${x}.jpg?v=090323",
				"http://s3.maps.daum-img.net/L${z}/${y}/${x}.jpg?v=090323"
  		    ];
    	}
    	else if(name == "EmptyMap") {
    		this.url= [
				"http://h0.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
				"http://h1.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
				"http://h2.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
				"http://h3.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png"
  		    ];
    	} 
    	else {
    		this.url= [
				"http://i0.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
				"http://i1.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
				"http://i2.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png",
				"http://i3.maps.daum-img.net/map/image/G03/i/1.04/L${z}/${y}/${x}.png"
		    ];
    	}
    	
		if (!options) options = {resolutions: [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25]};
		else if (!options.resolutions) options.resolutions = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25];
        var newArgs = [name, null, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArgs);
    },
    clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Daum(
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
        var z = 14 - this.getServerZoom();

        if (this.wrapDateLine) {
            var limit = Math.pow(2, z);
            x = ((x % limit) + limit) % limit;
        }

        return {'x': x, 'y': y, 'z': z};
    },
	
    CLASS_NAME: "OpenLayers.Layer.Daum"
});