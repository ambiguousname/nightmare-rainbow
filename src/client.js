import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";
import { GameScene } from "./scenes/main";
export class Client extends Connection {

	_host;

	#hostID;
	constructor(hostID) {
		super();
		this.#hostID = hostID;
		this.connected.then(this.opened.bind(this));
	}

	#canUpdate = false;

	opened() {
		this._host = this._peer.connect(this.#hostID);
		this._host.on("open", (() => {
			this.#canUpdate = true;
			this._host.on("data", this._receiveData.bind(this));
		}).bind(this));
	}

	// TODO: Fix.
	#otherPlayer = null;
	_receiveData(data) {
		this.#otherPlayer = data;
	}

	update(scene) {
		if (!this.#canUpdate) { return; }
		this._host.send([scene.player.x, scene.player.y]);

		if (this.#otherPlayer === null) {
			return;
		}
		
		scene.otherPlayer.x = this.#otherPlayer[0];
		scene.otherPlayer.y = this.#otherPlayer[1];
	}

}