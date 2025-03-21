const path = require('path');

const webpack = require("webpack");

const MODE = "development";

let defines;

switch (MODE) {
	case "development":
		const os = require("os");
		
		let interfaces = os.networkInterfaces();

		let server;

		for (const name of Object.keys(interfaces)) {
			for (const interface of interfaces[name]) {
				// I'd like to use IPv6, but that doesn't work if I'm testing on localhost.
				if (interface.family === "IPv4") {
					server = `${interface.address}`;
					break;
				}
			}

			if (server !== undefined) {
				break;
			}
		}

		if (server === undefined) {
			console.error("Could not find obvious network that Peer.JS server would be hosted on.");
		}
		
		defines = new webpack.DefinePlugin({
			PEERJS_SERVER: JSON.stringify(server),
			DOMAIN: JSON.stringify(`${server}:8080`),
			PEERJS_PORT: 8081
		});
		break;
	case "release":
		defines = new webpack.DefinePlugin({
			PEERJS_SERVER: JSON.stringify("0.peerjs.com"),
			DOMAIN: "TODO",
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