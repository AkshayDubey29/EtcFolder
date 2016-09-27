define(["jquery","underscore","vizapi/SplunkVisualizationBase"], function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by syuan on 3/7/16.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1),
	    __webpack_require__(2),
	    __webpack_require__(3)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function($, _, SplunkVisualizationBase) {
	    return SplunkVisualizationBase.extend({
	        className: 'tagcloud-viz',
	        initialize: function() {
	            SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
	            // Save this.$el for convenience
	            this.$el = $(this.el);
	            // Add a css selector class
	            this.$el.addClass('splunk-tag-cloud').addClass("tagcloud-viz");
	        },
	        getInitialDataParams: function() {
	            return ({
	                outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
	                count: 200
	            });
	        },
	        updateView: function(data, config) {
	            var labelField = config['display.visualizations.custom.simple_xml_examples.tagcloud.labelField'];
	            var valueField = config['display.visualizations.custom.simple_xml_examples.tagcloud.valueField'];
	            var minFontSize = parseFloat(config['display.visualizations.custom.simple_xml_examples.tagcloud.minFontSize']);
	            var maxFontSize = parseFloat(config['display.visualizations.custom.simple_xml_examples.tagcloud.maxFontSize']);

	            // Clear the current view
	            var el = this.$el.empty().css('line-height', Math.ceil(maxFontSize * 0.55) + 'px');
	            var minMagnitude = Infinity, maxMagnitude = -Infinity;

	            var fieldNames = _.pluck(data.fields, 'name');
	            var labelFieldIdx = fieldNames.indexOf(labelField);
	            var valueFieldIdx = fieldNames.indexOf(valueField);
	            _(data.rows).chain().map(function(result) {
	                // Extract and convert the magnitude field value
	                var magnitude = parseFloat(result[valueFieldIdx]);
	                // Find the maximum and minimum of the magnitude field values
	                minMagnitude = magnitude < minMagnitude ? magnitude : minMagnitude;
	                maxMagnitude = magnitude > maxMagnitude ? magnitude : maxMagnitude;
	                return {
	                    label: result[labelFieldIdx],
	                    magnitude: magnitude
	                };
	            }).each(function(result) {
	                // Calculate relative size of each tag
	                var size = minFontSize + ((result.magnitude - minMagnitude) / maxMagnitude * (maxFontSize - minFontSize));
	                // Render the tag
	                $('<a class="link" href="#" /> ').text(result.label + ' ').css({
	                    'font-size': size
	                }).appendTo(el).click(function(e) {
	                    // register drilldown handler
	                    e.preventDefault();
	                    var payload = {
	                        action: SplunkVisualizationBase.FIELD_VALUE_DRILLDOWN,
	                        data: {}
	                    };
	                    payload.data[labelField] = $.trim($(e.target).text());
	                    this.drilldown(payload);
	                }.bind(this));
	            }, this);
	        }
	    });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])});;