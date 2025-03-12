import { Peer } from "peerjs";
import Phaser from "phaser";

import { MainMenu } from "./scenes/menu";
import { GameScene } from "./scenes/main";

let game = new Phaser.Game({
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	scene: [new MainMenu("main"), new GameScene("game")],
	parent: 'game'
});