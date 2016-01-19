var webpack = require("webpack");
var config = require("./webpack.client.js");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({path: path.join(__dirname, '../dist')});

var hostname = process.env.HOSTNAME || "localhost";
var port = 8080;

config.cache = true;
config.debug = true;
config.devtool = "source-map";

config.entry.unshift(
	"webpack-dev-server/client?http://" + hostname + ":" + port,
	"webpack/hot/only-dev-server"
);

config.output.publicPath = "http://" + hostname + ":" + port + "/dist/";
config.output.hotUpdateMainFilename = "update/[hash]/update.json";
config.output.hotUpdateChunkFilename = "update/[hash]/[id].update.js";

config.plugins = [
	new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false, __PRODUCTION__: false, __DEV__: true}),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin(),
	new ExtractTextPlugin("client.[contenthash].css"),
	assetsPluginInstance
];

config.module.postLoaders = [
	{test: /\.js$/, loaders: ["babel?cacheDirectory&presets[]=es2015&presets[]=stage-0&presets[]=react&presets[]=react-hmre"], exclude: /node_modules/}
];

config.devServer = {
	publicPath:  config.output.publicPath,
	hot:         true,
	inline:      false,
	lazy:        false,
	quiet:       false,
	noInfo:      false,
	headers:     {"Access-Control-Allow-Origin": "*"},
	stats:       {colors: true},
	host:        process.env.HOSTNAME || "localhost"
};

module.exports = config;
