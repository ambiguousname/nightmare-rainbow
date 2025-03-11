import { Peer } from "peerjs";
import { MainMenu } from "./scenes/menu";
import Phaser from "phaser";

let game = new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: MainMenu,
	parent: 'game'
});


let peer = new Peer();

peer.on('connection', (conn) => {
	conn.on('data', (data) => {
		// game.scene.getScenes(true)[0].updateOther(data);
	});
});