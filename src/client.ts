import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";
import { GameScene } from "./scenes/main";
export class Client extends Connection {

	_host : DataConnection;

	#hostID : string = null;
	constructor(hostID : string) {
		super();
		this.#hostID = hostID;
		this.onOpen.then(this.opened.bind(this));
	}

	#canUpdate = false;

	opened() {
		this._host = this.peer.connect(this.#hostID);
		this._host.on("open", (() => {
			this.#canUpdate = true;
			this._host.on("data", this._receiveData.bind(this));
		}).bind(this));
	}

	// TODO: Fix.
	#otherPlayer : Array<number> = null;
	_receiveData(data : any) {
		this.#otherPlayer = data;
	}

	update(scene : GameScene) {
		if (!this.#canUpdate) { return; }
		this._host.send([scene.player.x, scene.player.y]);

		if (this.#otherPlayer === null) {
			return;
		}
		
		scene.otherPlayer.x = this.#otherPlayer[0];
		scene.otherPlayer.y = this.#otherPlayer[1];
	}

}