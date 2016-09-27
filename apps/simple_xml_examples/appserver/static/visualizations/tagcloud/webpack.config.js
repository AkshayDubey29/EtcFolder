/**
 * Created by syuan on 3/8/16.
 */
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: 'tagcloud',
    resolve: {
        root: [
            path.join(__dirname, 'src')
        ]
    },
    output: {
        filename: 'visualization.js',
        libraryTarget: 'amd'
    },
    externals: [
        'jquery',
        'underscore',
        'vizapi/SplunkVisualizationBase',
        'vizapi/SplunkVisualizationUtils'
    ]
};