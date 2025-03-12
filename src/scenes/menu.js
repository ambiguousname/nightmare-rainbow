import { Client } from "../client";
import { Host } from "../host";
import { Connection } from "../connection";

import { GameScene } from "./main";

const menuButton = {
	fontFamily: "Arial",
	fontSize: "25px",
	backgroundColor: '#ff0000'
};

const BASE_URL = "localhost:8080";

export class MainMenu extends Phaser.Scene {
	#hostButton;
	
	#startButton;

	#joinText;

	#connection = null;

	preload() {
		this.#hostButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Host A Game!", menuButton).setPadding(32).setOrigin(0.5).setInteractive({ useHandCursor: true });
		
		this.#hostButton.on('pointerdown', () => {
			this.#startButton.setVisible(true);
			this.#joinText.setVisible(true);

			this.#connection = new Host();
			
			this.#connection.id.then((id) => {
				this.#joinText.setText(`${BASE_URL}/?join=${id}`);
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
			this.#connection.id.then((id) => {
				navigator.clipboard.writeText(`${BASE_URL}/?join=${id}`).then((() => {
					this.#joinText.text = "Copied!";
				}).bind(this));
			});
		}, this);
	}

	#joinID = null;

	create() {
		let params = new URLSearchParams(location.search);
		let join = params.get("join");
		if (join !== null) {
			this.#startButton.setVisible(true);
			this.#hostButton.destroy();

			this.#joinID = join;
		}
	}

	update() {

	}
};