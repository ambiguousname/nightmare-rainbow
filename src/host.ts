import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";
import { GameScene } from "./scenes/main";

export class Host extends Connection {
	constructor() {
		super();
		this.peer.on("connection", this.connected.bind(this));
		this.peer.on("disconnected", this.disconnected.bind(this));
	}
	
	protected players : Map<string, DataConnection> = new Map();

	protected connected(connection : DataConnection) {
		connection.on("open", (() => {
			this.players.set(connection.connectionId, connection);
			connection.on("data", this.receiveData.bind(this));
		}).bind(this));
	}

	protected disconnected(id : string) {
		this.players.delete(id);
	}

	// TODO: Fix.
	#otherPlayer : Array<number> = null;
	protected receiveData(data : any) {
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