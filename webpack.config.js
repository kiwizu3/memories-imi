const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const token = require('./imi_data').token();

var production_build_config = {
    mode: 'production',
    entry: './js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    plugins: [
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
          }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CopyWebpackPlugin([
            { from: 'audio/*', to: 'audio/[name].[ext]' },
            { from: 'fonts/*', to: 'fonts/[name].[ext]' },
            { from: 'images/*', to: 'images/[name].[ext]' }
        ]),
        new JavaScriptObfuscator(
            {
                compact: true,
                stringArray: true,
                rotateStringArray: true,
                disableConsoleOutput: true,
                reservedNames: ['API'],
                reservedStrings: ['API']
            },['bundle.js']
        )
    ],
    module:
    {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
var development_build_config = {
    mode: 'development',
    entry: './js/main.js',
    optimization: {
        usedExports: true
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer:{
        contentBase: path.join(__dirname, 'dist')
    },
    plugins: [
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
          }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CopyWebpackPlugin([
            { from: 'audio/*', to: 'audio/[name].[ext]' },
            { from: 'fonts/*', to: 'fonts/[name].[ext]' },
            { from: 'images/*', to: 'images/[name].[ext]' }
        ])
    ],
    module: 
    {
        rules:[
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            }
        ]
    }
};
var production_with_server_config = {
    mode: 'production',
    entry: './js/main.js',
    watch: true,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        open: true,
        contentBase: path.join(__dirname, 'dist')
    },
    plugins: [
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
          }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CopyWebpackPlugin([
            { from: 'audio/*', to: 'audio/[name].[ext]' },
            { from: 'fonts/*', to: 'fonts/[name].[ext]' },
            { from: 'images/*', to: 'images/[name].[ext]' }
        ]),
        new JavaScriptObfuscator(
            {
                compact: true,
                stringArray: true,
                rotateStringArray: true,
                disableConsoleOutput: true,
                reservedNames: ['API'],
                reservedStrings: ['API']
            },['bundle.js']
        )
    ],
    module:
    {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
var development_with_server_config = {
    mode: 'development',
    entry: './js/main.js',
    watch:true,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer:{
        open:true,
        contentBase: path.join(__dirname, 'dist'),
        openPage: '?user='+token
    },
    plugins: [
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
          }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CopyWebpackPlugin([
            { from: 'audio/*', to: 'audio/[name].[ext]' },
            { from: 'fonts/*', to: 'fonts/[name].[ext]' },
            { from: 'images/*', to: 'images/[name].[ext]' }
        ])
    ],
    module: 
    {
        rules:[
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            }
        ]
    }
};
module.exports = function (env) {
    var config;
    switch (env) {
        case 'production_build':
            config =  production_build_config;
            break;
        case 'development_build':
            config =  development_build_config;
            break;
        case 'production_server':
            config =  production_with_server_config;
            break;
        case 'development_server':
            config =  development_with_server_config;
            break;
    }
    return config;
}