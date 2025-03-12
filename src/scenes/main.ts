import { Client } from "../client";
import { Connection } from "../connection";

export class GameScene extends Phaser.Scene {
	#player : Phaser.GameObjects.Graphics;
	#otherPlayer : Phaser.GameObjects.Graphics;

	#cursors :	Phaser.Types.Input.Keyboard.CursorKeys;

	#connection : Connection;

	init(data : Connection) {
		this.#connection = data;
	}

	preload() {
		const graphics = this.add.graphics();
		graphics.fillStyle(0xff0000);
		this.#player = graphics.fillCircle(0, 0, 100);

		const newGraphics = this.add.graphics();

		newGraphics.fillStyle(0x00ff00);
		this.#otherPlayer = newGraphics.fillCircle(0, 0, 100);
	}

	create() {
		this.#cursors = this.input.keyboard.createCursorKeys();
		
		if (this.#connection instanceof Client) {
			this.#connection.send();
		}
	}

	updateOther(data : any) {
		this.#otherPlayer.x = data[0];
		this.#otherPlayer.y = data[1];
	}

	// conn = null;

	update(){
		if (this.#cursors.left.isDown) {
			this.#player.x -= 10;
		}

		if (this.#cursors.right.isDown) {
			this.#player.x += 10;
		}

		// if (this.conn !== null) {
		// 	this.conn.send([this.player.x, this.player.y]);
		// }
	}
};