let path = require('path');

const merge = require('webpack-merge');

// plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// configs
const baseConfig = require('./webpack.base.config');


const prodConfiguration = () => {
    return merge([
        {
            // optimization: {
            //     runtimeChunk: 'single',
            //     splitChunks: {
            //       cacheGroups: {
            //         vendor: {
            //           test: /[\\/]node_modules[\\/]/,
            //           name: 'vendors',
            //           chunks: 'all'
            //         }
            //       }
            //     },
            //     minimizer: [new UglifyJsPlugin({
            //         // extractComments: true, // crop comments
            //     })]
            // },
            plugins: [
                new MiniCssExtractPlugin(),
                new OptimizeCssAssetsPlugin(),
            ],
        },
    ]);
}

module.exports = env => {
    return merge(baseConfig(env), prodConfiguration(env));
}