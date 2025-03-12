import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";
import { GameScene } from "./scenes/main";

export class Host extends Connection {
	constructor() {
		super();
		this._peer.on("connection", this._connected.bind(this));
		this.id.then((id) => {
			console.log(id);
		});
		this._peer.on("disconnected", this._disconnected.bind(this));
	}
	
	_players = new Map();

	_connected(connection) {
		this._players.set(connection.connectionId, connection);
		connection.on("open", (() => {
			connection.on("data", this._receiveData.bind(this));
		}).bind(this));
	}

	_disconnected(id) {
		this._players.delete(id);
	}

	// TODO: Fix.
	#otherPlayer = null;
	_receiveData(data) {
		this.#otherPlayer = data;
	}

	update(scene) {
		if (!this.isOpen) { return; }

		for (let player of this._players.values()) {
			player.send([scene.player.x, scene.player.y]);
		}

		
		if (this.#otherPlayer === null) {
			return;
		}
		
		scene.otherPlayer.x = this.#otherPlayer[0];
		scene.otherPlayer.y = this.#otherPlayer[1];
	}
}