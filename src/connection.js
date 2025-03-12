import { DataConnection, Peer } from "peerjs";
import { GameScene } from "./scenes/main";

export class Connection {
	_peer;

	connected;
	#opened = false;

	get isOpen() {
		return this.#opened;
	}

	constructor() {
		this._peer = new Peer();
		this.connected = new Promise((resolve, reject) => {
			this._peer.on("open", resolve);
			this.#opened = true;
		});

		this._peer.on("error", (err) => {
			console.error(`PeerJS Error: `, err);
		});
	}

	opened() {

	}

	// TODO: Need something wayyyy more robust:
	update(state) {}

	get id() {
		return this.connected;
	}
}