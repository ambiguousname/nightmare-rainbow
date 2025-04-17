import { Client } from "../client";
import { Host } from "../host";
import { Connection } from "../connection";

import { GameScene } from "./main";

const menuButton = {
	fontFamily: "Arial",
	fontSize: "25px",
	backgroundColor: '#ff0000'
};

declare var DOMAIN : string;

export class MainMenu extends Phaser.Scene {
	#hostButton : Phaser.GameObjects.Text;
	
	#startButton : Phaser.GameObjects.Text;

	#joinText : Phaser.GameObjects.Text;

	#connection : Connection = null;

	preload() {
		this.#hostButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Host A Game!", menuButton).setPadding(32).setOrigin(0.5).setInteractive({ useHandCursor: true });
		
		this.#hostButton.on('pointerdown', () => {
			this.#startButton.setVisible(true);
			this.#joinText.setVisible(true);

			this.#connection = new Host();
			
			this.#connection.onOpen.then((id) => {
				this.#joinText.setText(`${DOMAIN}/?join=${id}`);
			});

			this.#hostButton.destroy();
		}, this);

		this.#startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Start", menuButton).setPadding(32).setOrigin(0.5).setInteractive({useHandCursor: true});

		this.#startButton.setVisible(false);

		this.#startButton.on('pointerdown', () => {
			if (this.#connection === null) {
				this.#connection = new Client(this.#joinID);
			}
			this.scene.start("game", this.#connection);
		}, this);

		this.#joinText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, "Connecting...", menuButton).setPadding(32).setOrigin(0.5).setInteractive({ useHandCursor: true });

		this.#joinText.setVisible(false);

		this.#joinText.on('pointerdown', () => {
			this.#connection.onOpen.then((id) => {
				navigator.clipboard.writeText(`${DOMAIN}/?join=${id}`).then((() => {
					this.#joinText.text = "Copied!";
				}).bind(this));
			});
		}, this);
	}

	#joinID : string = null;

	create() {
		let params = new URLSearchParams(location.search);
		let join = params.get("join");
		if (join !== null) {
			this.#startButton.setVisible(true);
			this.#hostButton.destroy();

			this.#joinID = join;
		}

		let host = params.get("host");
		if (host !== null) {
			this.#hostButton.emit('pointerdown');

			this.#connection.onOpen.then(() => {
				this.#startButton.emit('pointerdown');
			});
		}
	}

	update() {

	}
};