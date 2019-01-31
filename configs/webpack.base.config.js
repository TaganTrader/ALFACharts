let path = require('path');

const webpack = require('webpack');
const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = env => {
    const { PLATFORM, VERSION } = env;

    return merge([
        {

            plugins: [
                new webpack.DefinePlugin({
                    'process.env.VERSION': JSON.stringify(env.VERSION),
                    'process.env.PLATFORM': JSON.stringify(env.PLATFORM)
                }),
                new CopyWebpackPlugin([{ from: './src/static' }]),
                new ExtractTextPlugin("common.css"),
                new webpack.ProvidePlugin({
                    axios: 'axios',
                    $: 'jquery',                    
                })
            ],

            devServer: {
                overlay: true,
                contentBase: [path.join(__dirname, '../test'), path.join(__dirname, '..')],
                inline: true
            },

            entry: "./src/js/index.js",
            output: {
                path: path.resolve(__dirname, './../assets/'),
                publicPath: "assets/",
                filename: "app.js"
            },

            module: {
                rules: [
                    { parser: { amd: false } },                
                    {
                        test: /\.js$/,
                        exclude: "/node_modules/",
                        use: [
                            'babel-loader'
                        ]
                    },
                    {
                        test: /\.styl$/,
                        use: ExtractTextPlugin.extract({
                            //fallback: "style-loader",
                            use: [
                                //MiniCssExtractPlugin.loader,
                                'css-loader',
                                'stylus-loader',
                            ],
                        })
                    },
                    {
                        test: /\.css$/,
                        use: ExtractTextPlugin.extract({
                            //fallback: "style-loader",
                            use: [
                                //MiniCssExtractPlugin.loader,
                                'css-loader',
                            ],
                        })
                    }
                ]
            }
        }]);
};