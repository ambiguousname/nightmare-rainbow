import { Client } from "../client";
import { Connection } from "../connection";
import { Player } from "../objects/player";

export class GameScene extends Phaser.Scene {
	player : Player;
	otherPlayer : Player;

	#cursors : Phaser.Types.Input.Keyboard.CursorKeys;

	#connection : Connection;

	init(data : Connection) {
		this.#connection = data;
	}

	preload() {
		const graphics = this.add.graphics();
		graphics.fillStyle(0xffffff);
		graphics.fillCircle(12.5, 12.5, 25);
		graphics.generateTexture("player", 25, 25);
		graphics.destroy();
	}

	create() {
		this.player = new Player(this.matter.world, 0, 0, "player");
		this.otherPlayer = new Player(this.matter.world, 0, 0, "player");
		this.otherPlayer.tint = 0xff0000;

		this.#cursors = this.input.keyboard.createCursorKeys();

		this.matter.world.disableGravity();
	}

	update(time : number, delta : number){
		let add = new Phaser.Math.Vector2();
		if (this.#cursors.left.isDown) {
			add.x -= 10;
		}

		if (this.#cursors.right.isDown) {
			add.x += 10;
		}

		if (this.#cursors.down.isDown) {
			add.y += 10;
		}

		if (this.#cursors.up.isDown) {
			add.y -= 10;
		}

		let vel = this.player.getVelocity();

		this.player.setVelocity(vel.x + add.x * delta/1000, vel.y + add.y * delta/1000);

		this.#connection.update(this);
	}
};