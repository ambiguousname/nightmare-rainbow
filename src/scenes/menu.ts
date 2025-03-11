export class MainMenu extends Phaser.Scene {
	#hostButton : Phaser.GameObjects.Text;

	preload() {
		this.#hostButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Host A Game!", {
			fontFamily: "Arial",
			fontSize: "25px",
			backgroundColor: '#ff0000'
		}).setPadding(32).setOrigin(0.5).setInteractive({ useHandCursor: true });
	}

	create() {
	}

	update() {

	}
};