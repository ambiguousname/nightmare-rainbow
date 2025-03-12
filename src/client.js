import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";
import { GameScene } from "./scenes/main";
export class Client extends Connection {

	_host;

	constructor(hostID) {
		super();
		this._host = this._peer.connect(hostID);
		this._host.on("data", this._receiveData.bind(this));
	}

	// TODO: Fix.
	#otherPlayer;
	_receiveData(data) {
		this.#otherPlayer = data;
	}

	update(scene) {
		this._host.send([scene.player.x, scene.player.y]);
		
		scene.otherPlayer.x = this.#otherPlayer[0];
		scene.otherPlayer.y = this.#otherPlayer[1];
	}

}