const path = require('path');

module.exports = {
	mode: "development",
	entry: {
		index: {
			import: './src/index.ts',
			dependOn: ['phaser', 'peer'],
		},
		phaser: 'phaser',
		peer: 'peerjs'
	},
	module: {
		rules: [
			{
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
			},
		],
	},
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