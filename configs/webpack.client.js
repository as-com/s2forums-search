var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({
	path: path.join(__dirname, '../dist')
});
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

module.exports = {
	target: "web",
	cache: false,
	context: __dirname,
	debug: false,
	devtool: "source-map",
	entry: ["../src/client"],
	output: {
		path: path.join(__dirname, "../static/dist"),
		filename: "client.[hash].js",
		publicPath: "/dist/",
		chunkFilename: "chunk.[id].[chunkhash].js",
	},
	plugins: [
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			__PRODUCTION__: true,
			__DEV__: false
		}),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				unsafe: true,
				screw_ie8: true,
				warnings: false
			},
			output: {
				screw_ie8: true,
				preamble: "//! Scratch Forums Search v0.6.7-beta | (c) Andrew Sun | https://github.com/as-com/s2forums-search"
			}
		}),
		new ExtractTextPlugin("client.[contenthash].css"),
		assetsPluginInstance
	],
	module: {
		loaders: [{
			test: /\.json$/,
			loaders: ["json"]
		}, {
			test: /\.css$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
		}, {
			test: /\.less$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!less-loader")
		}, {
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!sass-loader")
		}, {
			test: /\.(png|woff|woff2|eot|ttf|svg)$/,
			loader: 'file-loader'
		}],
		postLoaders: [{
			test: /\.js$/,
			loaders: ["babel?presets[]=es2015&presets[]=stage-0&presets[]=react"],
			exclude: /node_modules/
		}],
		noParse: /\.min\.js/
	},
	resolve: {
		modulesDirectories: [
			"src",
			"node_modules",
			"web_modules"
		],
		extensions: ["", ".json", ".js", ".jsx"]
	},
	node: {
		__dirname: true,
		fs: 'empty'
	},
	postcss: function() {
		return [cssnano({
			safe: true,
			autoprefixer: {
				add: true,
				remove: true,
				browsers: ['last 2 versions']
			},
			discardComments: {
				removeAll: true
			}
		})];
	}
};
