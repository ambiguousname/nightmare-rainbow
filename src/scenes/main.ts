import { Client } from "../client";
import { Connection } from "../connection";
import { Room } from "../levels/room";
import { Player } from "../objects/player";
import { InputManager } from "../input";

export class GameScene extends Phaser.Scene {
	player : Player;
	otherPlayer : Player;

	#connection : Connection;

	init(data : Connection) {
		this.#connection = data;
	}
	
	#input : InputManager;

	preload() {
		const graphics = this.add.graphics();
		graphics.fillStyle(0xffffff);
		graphics.fillRoundedRect(0, 0, 50, 25, 10);
		graphics.generateTexture("player", 50, 25);
		graphics.destroy();

		this.#input = new InputManager(this);
	}

	create() {
		this.player = new Player(this.matter.world, 0, 0, "player");
		this.otherPlayer = new Player(this.matter.world, 0, 0, "player");
		this.otherPlayer.tint = 0xff0000;

		this.cameras.main.startFollow(this.player, false, 0.3, 0.3);

		this.#input = new InputManager(this);


		this.matter.world.disableGravity();

		new Room(this, {x: 0, y: 0}, {x: 500, y: 500});
	}

	update(time : number, delta : number){
		let intent = this.#input.getIntent();
		this.player.move(intent, delta);

		this.#connection.update(this);
	}
};