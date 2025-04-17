import { Vector2 } from "./util";

export class InputManager {
	#directions = [false, false, false, false];

	#keys : object;
	constructor(scene : Phaser.Scene) {
		const KEYS = {
			left: [Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.A],
			right: [Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D],
			up: [Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W],
			down: [Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S]
		}

		this.createBindings(scene.input.keyboard, 0, KEYS.left);
		this.createBindings(scene.input.keyboard, 1, KEYS.right);
		this.createBindings(scene.input.keyboard, 2, KEYS.up);
		this.createBindings(scene.input.keyboard, 3, KEYS.down);

		scene.input.gamepad.addListener('connected', (pad : Phaser.Input.Gamepad.Gamepad) => {
			pad.on('down', () => {

			});
		});
	}

	bindingDown(direction : integer, isUp : boolean) {
		this.#directions[direction] = isUp;
	}

	createBindings(keyboard : Phaser.Input.Keyboard.KeyboardPlugin, direction : integer, keys : Array<number>) {
		for(let k of keys) {
			let key = keyboard.addKey(k);
			key.on('down', this.bindingDown.bind(this, direction, true));
			key.on('up', this.bindingDown.bind(this, direction, false));
		}
	}

	getIntent() : Vector2 {
		let add = {x: 0, y: 0};


		if (this.#directions[0]) {
			add.x -= 10;
		}

		if (this.#directions[1]) {
			add.x += 10;
		}

		if (this.#directions[2]) {
			add.y -= 10;
		}

		if (this.#directions[3]) {
			add.y += 10;
		}
		return add;
	}
}