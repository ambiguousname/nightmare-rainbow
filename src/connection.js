import { DataConnection, Peer } from "peerjs";
import { GameScene } from "./scenes/main";

export class Connection {
	_peer;

	#connected;

	constructor() {
		this._peer = new Peer();
		this.#connected = new Promise((resolve, reject) => {
			this._peer.on("open", resolve);
		});

		this._peer.on("error", (err) => {
			console.error(`PeerJS Error: `, err);
		});
	}

	// TODO: Need something wayyyy more robust:
	update(state) {}

	get id() {
		return this.#connected;
	}
}