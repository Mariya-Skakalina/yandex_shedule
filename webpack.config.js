const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: {
        'main': [
            '@babel/polyfill',
            './assets/main.js',
            // './style/index.scss'
        ],
    },

    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'javascripts')
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                options: {
                    presets: ['@babel/env']
                }
            }
        ]
    },

    plugins: [
        new UglifyJSPlugin(),
        new ExtractTextPlugin('style/[name].css'),
    ],
    devServer: {
        https: true
    }
};