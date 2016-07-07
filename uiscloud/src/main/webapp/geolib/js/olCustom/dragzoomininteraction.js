goog.provide('olCustom.DragZoomIn');
goog.require('goog.asserts');
goog.require('ol.events.condition');
goog.require('ol.extent');
goog.require('ol.interaction.DragBox');
goog.require('ol.interaction.Interaction');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
olCustom.DragZoomIn = function(opt_options) {
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
goog.inherits(olCustom.DragZoomIn, ol.interaction.DragZoom);


/**
 * @inheritDoc
 */
olCustom.DragZoomIn.prototype.onBoxEnd = function() {
  var map = this.getMap();
  var view = map.getView();
  goog.asserts.assert(!goog.isNull(view), 'view should not be null');
  var extent = this.getGeometry().getExtent();
  var center = ol.extent.getCenter(extent);
  var size = map.getSize();
  goog.asserts.assert(goog.isDef(size), 'size should be defined');
  
  map.beforeRender(ol.animation.zoom({
	resolution: view.getResolution(),
	duration: this.duration_,
	easing: ol.easing.easeOut
  }));
  
  view.setCenter(center);
  view.setResolution(view.getResolutionForExtent(extent, size));
  /*
  ol.interaction.Interaction.zoom(map, view,
        view.getResolutionForExtent(extent, size),
        center, this.duration_);*/
};
