goog.provide('ol.tilegrid.Vworld');

goog.require('ol.tilegrid.XYZ');

ol.tilegrid.Vworld = function(options) {
	goog.base(this, {
		extent : options.extent,
		maxZoom : options.maxZoom,
		minZoom : options.minZoom,
		tileSize : options.tileSize
	});
};
goog.inherits(ol.tilegrid.Vworld, ol.tilegrid.XYZ);

ol.tilegrid.Vworld.prototype.createTileCoordTransform = function(opt_options) {
	var options = goog.isDef(opt_options) ? opt_options : {};
	var minZ = this.minZoom;
	var maxZ = this.maxZoom;
	
	var tileRangeByZ = null;
	if (goog.isDef(options.extent)) {
		tileRangeByZ = new Array(maxZ + 1);
		var z;
		for (z = 0; z <= maxZ; ++z) {
			if (z < minZ) {
				tileRangeByZ[z] = null;
			} else {
				tileRangeByZ[z] = this.getTileRangeForExtentAndZ(options.extent, z);
			}
		}
	}
	return (
		function(tileCoord, projection, opt_tileCoord) {
			var z = tileCoord[0];
			var limit = Math.pow(2, z);
	        var x = tileCoord[1];
	        var y = limit - tileCoord[2] - 1;
	        //var y; // vworld의 경우 y값을 구할때의 기준이 bottom이 아닌 top 기준이기때문에 따로 계산해준다.
	        //var resolution = ol.tilegrid.TileGrid.prototype.
	        //var validBounds = ol.extent.applyTransform([124.41714675, 33.0022776231, 131.971482078, 38.6568782776],"EPSG:4326" , "EPSG:900913");
	        if (!goog.isNull(tileRangeByZ)) {
	          if (!tileRangeByZ[z].containsXY(x, y)) {
	            return null;
	          }
	        }
	        
	        if (y < 0 || y >= limit) {
	            return null;
	        } else  {
	            x = ((x % limit) + limit) % limit;
	            if (z >= 7 && z <= 18) {
                    return ol.tilecoord.createOrUpdate(z, x, y, opt_tileCoord);
                } else if (z > 18) {
	                    var n = z - 18;
	                    var z2 = z - n;
	                    var nsize = 256 * Math.pow(2, n);
	                    z = z2;
	                } else {
	                    return null;
	                }
	        }
	        
	        return ol.tilecoord.createOrUpdate(z, x, y, opt_tileCoord);
		}
	);
};