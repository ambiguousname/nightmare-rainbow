const path = require('path');

const webpack = require("webpack");

const MODE = "development";

let defines;

switch (MODE) {
	case "development":
		defines = new webpack.DefinePlugin({
			PEERJS_SERVER: JSON.stringify("localhost"),
			PEERJS_PORT: 8081
		});
		break;
	case "release":
		defines = new webpack.DefinePlugin({
			PEERJS_SERVER: JSON.stringify("0.peerjs.com"),
			PEERJS_PORT: 443
		});
		break;
}

module.exports = {
	mode: MODE,
	entry: {
		index: {
			import: './src/index.ts',
			dependOn: ['phaser', 'peer'],
		},
		phaser: 'phaser',
		peer: 'peerjs'
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
			},
		]
	},
	plugins: [defines],
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'public'),
	},
	cache: {
		type: 'filesystem',
	},
	optimization: {
		runtimeChunk: 'single',
	},
	devServer: {
		static: {
			directory: path.join(__dirname, 'public')
		},
		port: 8080
	}
};