// FIXME should handle all geo-referenced data, not just vector data

goog.provide('olCustom.DragAndDrop');
goog.provide('olCustom.DragAndDropEvent');

goog.require('goog.asserts');
//goog.require('goog.events');
//goog.require('goog.events.Event');
//goog.require('goog.events.FileDropHandler');
//goog.require('goog.events.FileDropHandler.EventType');
//goog.require('goog.fs.FileReader');
goog.require('goog.functions');
goog.require('ol.interaction.Interaction');
goog.require('ol.proj');


/**
 * @classdesc
 * Handles input of vector data by drag and drop.
 *
 * @constructor
 * @extends {ol.interaction.Interaction}
 * @fires ol.interaction.DragAndDropEvent
 * @param {olx.interaction.DragAndDropOptions=} opt_options Options.
 * @api stable
 */
olCustom.DragAndDrop = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  goog.base(this, {
    handleEvent: olCustom.DragAndDrop.handleEvent
  });

  /**
   * @private
   * @type {Array.<function(new: ol.format.Feature)>}
   */
  this.formatConstructors_ = goog.isDef(options.formatConstructors) ?
      options.formatConstructors : [];

  /**
   * @private
   * @type {ol.proj.Projection}
   */
  this.projection_ = goog.isDef(options.projection) ?
      ol.proj.get(options.projection) : null;

  /**
   * @private
   * @type {goog.events.FileDropHandler}
   */
  this.fileDropHandler_ = null;

  /**
   * @private
   * @type {goog.events.Key|undefined}
   */
  this.dropListenKey_ = undefined;
  
  /**
   * @private
   * @type {ol.proj.Projection}
   * @불러오는 파일의 좌표계
   */
  this.fileProjection_ = goog.isDef(options.fileProjection) ?
      ol.proj.get(options.projection) : null;

};
goog.inherits(olCustom.DragAndDrop, ol.interaction.DragAndDrop);

/**
 * @param {File} file File.
 * @param {string} result Result.
 * @private
 */
olCustom.DragAndDrop.prototype.handleResult_ = function(file, result) {
  var map = this.getMap();
  goog.asserts.assert(!goog.isNull(map), 'map should not be null');
  var projection = this.projection_;
  if (goog.isNull(projection)) {
    var view = map.getView();
    goog.asserts.assert(!goog.isNull(view), 'view should not be null');
    projection = view.getProjection();
    goog.asserts.assert(goog.isDef(projection),
        'projection should be defined');
  }
  var formatConstructors = this.formatConstructors_;
  var features = [];
  var i, ii;
  for (i = 0, ii = formatConstructors.length; i < ii; ++i) {
    var formatConstructor = formatConstructors[i];
    // 파일의 좌표계값으로 format 객체 생성
    var format = new formatConstructor({defaultDataProjection : this.fileProjection_});
    var readFeatures = this.tryReadFeatures_(format, result);
    /*
    if(file.name.indexOf(".shp") == -1){
            readFeatures = this.tryReadFeatures_(format, result);
        }
        else{
            var resultGeoJson = new Shapefile(result);
            var geojson = resultGeoJson.formatIntoGeoJson;
            readFeatures = ol.format.GeoJSON().readFeatures(geojson, this.fileProjection_);
        }*/
    
     
    if (!goog.isNull(readFeatures)) {
      var featureProjection = format.readProjection(result);
      if(featureProjection.getCode() != projection.getCode()){
          var transform = ol.proj.getTransform(featureProjection, projection);
          var j, jj;
          for (j = 0, jj = readFeatures.length; j < jj; ++j) {
            var feature = readFeatures[j];
            var geometry = feature.getGeometry();
            if (goog.isDefAndNotNull(geometry)) {
              geometry.applyTransform(transform);
            }
            features.push(feature);
          }
      }
      else{
          for (j = 0, jj = readFeatures.length; j < jj; ++j) {
            features.push(readFeatures[j]);
          }
      }
    }
  }
  this.dispatchEvent(
      new olCustom.DragAndDropEvent(
    		  olCustom.DragAndDropEventType.ADD_FEATURES, this, file,
          features, projection));
};

/**
 * @classdesc
 * Events emitted by {@link ol.interaction.DragAndDrop} instances are instances
 * of this type.
 *
 * @constructor
 * @extends {goog.events.Event}
 * @implements {oli.interaction.DragAndDropEvent}
 * @param {ol.interaction.DragAndDropEventType} type Type.
 * @param {Object} target Target.
 * @param {File} file File.
 * @param {Array.<ol.Feature>=} opt_features Features.
 * @param {ol.proj.Projection=} opt_projection Projection.
 */
olCustom.DragAndDropEvent =
    function(type, target, file, opt_features, opt_projection) {

  goog.base(this, type, target);

  /**
   * @type {Array.<ol.Feature>|undefined}
   * @api stable
   */
  this.features = opt_features;

  /**
   * @type {File}
   * @api stable
   */
  this.file = file;

  /**
   * @type {ol.proj.Projection|undefined}
   * @api
   */
  this.projection = opt_projection;

};
goog.inherits(olCustom.DragAndDropEvent, ol.interaction.DragAndDropEvent);

olCustom.DragAndDropEventType = {
  /**
   * Triggered when features are added
   * @event ol.interaction.DragAndDropEvent#addfeatures
   * @api stable
   */
  ADD_FEATURES: 'addfeatures'
};
