import { DataConnection, Peer } from "peerjs";

export abstract class Connection {
	_peer : Peer;

	#connected : Promise<string>;

	constructor() {
		this._peer = new Peer();
		this.#connected = new Promise((resolve, reject) => {
			this._peer.on("open", resolve);
		});

		this._peer.on("error", (err) => {
			console.error(`PeerJS Error: `, err);
		});
	}

	get id() : Promise<string> {
		return this.#connected;
	}
}