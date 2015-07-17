goog.provide('ol.Size');
goog.provide('ol.size');


goog.require('goog.asserts');


/**
 * An array of numbers representing a size: `[width, height]`.
 * @typedef {Array.<number>}
 * @api stable
 */
ol.Size;


/**
 * Returns a buffered size.
 * @param {ol.Size} size Size.
 * @param {number} buffer Buffer.
 * @param {ol.Size=} opt_size Optional reusable size array.
 * @return {ol.Size}
 */
ol.size.buffer = function(size, buffer, opt_size) {
  if (!goog.isDef(opt_size)) {
    opt_size = [0, 0];
  }
  opt_size[0] = size[0] + 2 * buffer;
  opt_size[1] = size[1] + 2 * buffer;
  return opt_size;
};


/**
 * Compares sizes for equality.
 * @param {ol.Size} a Size.
 * @param {ol.Size} b Size.
 * @return {boolean} Equals.
 */
ol.size.equals = function(a, b) {
  return a[0] == b[0] && a[1] == b[1];
};


/**
 * Determines if a size has a positive area.
 * @param {ol.Size} size The size to test.
 * @return {boolean} The size has a positive area.
 */
ol.size.hasArea = function(size) {
  return size[0] > 0 && size[1] > 0;
};


/**
 * Returns a size scaled by a ratio. The result will be an array of integers.
 * @param {ol.Size} size Size.
 * @param {number} ratio Ratio.
 * @param {ol.Size=} opt_size Optional reusable size array.
 * @return {ol.Size}
 */
ol.size.scale = function(size, ratio, opt_size) {
  if (!goog.isDef(opt_size)) {
    opt_size = [0, 0];
  }
  opt_size[0] = (size[0] * ratio + 0.5) | 0;
  opt_size[1] = (size[1] * ratio + 0.5) | 0;
  return opt_size;
};


/**
 * Returns an `ol.Size` array for the passed in number (meaning: square) or
 * `ol.Size` array.
 * (meaning: non-square),
 * @param {number|ol.Size} size Width and height.
 * @param {ol.Size=} opt_size Optional reusable size array.
 * @return {ol.Size} Size.
 * @api stable
 */
ol.size.toSize = function(size, opt_size) {
  if (goog.isArray(size)) {
    return size;
  } else {
    goog.asserts.assert(goog.isNumber(size));
    if (!goog.isDef(opt_size)) {
      opt_size = [size, size];
    } else {
      opt_size[0] = size;
      opt_size[1] = size;
    }
    return opt_size;
  }
};
