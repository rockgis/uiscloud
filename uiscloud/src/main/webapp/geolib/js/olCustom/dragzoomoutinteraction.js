goog.provide('olCustom.DragZoomOut');
goog.require('goog.asserts');
goog.require('ol.events.condition');
goog.require('ol.extent');
goog.require('ol.interaction.DragBox');
goog.require('ol.interaction.Interaction');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
olCustom.DragZoomOut = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};

  var condition = goog.isDef(options.condition) ?
      options.condition : ol.events.condition.always;

  /**
   * @private
   * @type {number}
   */
  this.duration_ = goog.isDef(options.duration) ? options.duration : 200;

  /**
   * @private
   * @type {ol.style.Style}
   */
  var style = goog.isDef(options.style) ?
      options.style : new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [0, 0, 255, 1]
        })
      });

  goog.base(this, {
    condition: condition,
    style: style
  });

};
goog.inherits(olCustom.DragZoomOut, ol.interaction.DragZoom);


/**
 * @inheritDoc
 */
olCustom.DragZoomOut.prototype.onBoxEnd = function() {
  var map = this.getMap();
  var view = map.getView();
  goog.asserts.assert(!goog.isNull(view), 'view should not be null');
  var extent = this.getGeometry().getExtent();
  var center = ol.extent.getCenter(extent);
  var size = map.getSize();
  
  var curExtent = view.calculateExtent(size);
  // 현재영역과, 사용자가 그린 영역의 비율에 *3을 해서 축소비율을 구한다. ????
  var extentRatio = Math.floor(ol.extent.getWidth(curExtent) / ol.extent.getWidth(extent)) * 3;
  var newMinX = center[0] - (((extent[2] - extent[0]) * extentRatio) / 2);
  var newMaxX = center[0] + (((extent[2] - extent[0]) * extentRatio) / 2);
  var newMinY = center[1] - (((extent[3] - extent[1]) * extentRatio) / 2);
  var newMaxY = center[1] + (((extent[3] - extent[1]) * extentRatio) / 2);
  var newExtent = [newMinX, newMinY, newMaxX, newMaxY];
  goog.asserts.assert(goog.isDef(size), 'size should be defined');
  ol.interaction.Interaction.zoom(map, view,
      view.getResolutionForExtent(newExtent, size),
      center, this.duration_);
};
