goog.provide('ol.tilegrid.Daum');

goog.require('ol.tilegrid.XYZ');

ol.tilegrid.Daum = function(options) {
	goog.base(this, {
		extent : options.extent,
		maxZoom : options.maxZoom,
		minZoom : options.minZoom,
		tileSize : options.tileSize
	});
};
goog.inherits(ol.tilegrid.Daum, ol.tilegrid.XYZ);

ol.tilegrid.Daum.prototype.createTileCoordTransform = function(opt_options) {
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
			var z = maxZ - (tileCoord[0] - 1);
			var n = Math.pow(2, z);
	        var x = tileCoord[1];
	        var y = tileCoord[2];
	        if (!goog.isNull(tileRangeByZ)) {
	          if (!tileRangeByZ[z].containsXY(x, y)) {
	            return null;
	          }
	        }
	        return ol.tilecoord.createOrUpdate(z, x, y, opt_tileCoord);
		}
	);
};