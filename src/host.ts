import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";
import { GameScene } from "./scenes/main";

export class Host extends Connection {
	constructor() {
		super();
		this.peer.on("connection", this.connected.bind(this));
		this.peer.on("disconnected", this._disconnected.bind(this));
	}
	
	protected players : Map<string, DataConnection> = new Map();

	protected connected(connection : DataConnection) {
		this.players.set(connection.connectionId, connection);
		connection.on("open", (() => {
			connection.on("data", this._receiveData.bind(this));
		}).bind(this));
	}

	_disconnected(id : string) {
		this.players.delete(id);
	}

	// TODO: Fix.
	#otherPlayer : Array<number> = null;
	_receiveData(data : any) {
		this.#otherPlayer = data;
	}

	update(scene : GameScene) {
		if (!this.isOpen) { return; }

		for (let player of this.players.values()) {
			player.send([scene.player.x, scene.player.y]);
		}

		
		if (this.#otherPlayer === null) {
			return;
		}
		
		scene.otherPlayer.x = this.#otherPlayer[0];
		scene.otherPlayer.y = this.#otherPlayer[1];
	}
}