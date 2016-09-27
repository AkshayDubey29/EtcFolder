/**
 * Created by syuan on 3/7/16.
 */
define([
    'jquery',
    'underscore',
    'vizapi/SplunkVisualizationBase'
], function($, _, SplunkVisualizationBase) {
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
});