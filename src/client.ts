import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";
import { GameScene } from "./scenes/main";
export class Client extends Connection {

	protected host : DataConnection;

	#hostID : string = null;
	constructor(hostID : string) {
		super();
		this.#hostID = hostID;
		this.onOpen.then(this.opened.bind(this));
	}

	#canUpdate = false;

	opened() {
		this.host = this.peer.connect(this.#hostID);
		this.host.on("open", (() => {
			this.#canUpdate = true;
			this.host.on("data", this.receiveData.bind(this));
		}).bind(this));
	}

	// TODO: Fix.
	#otherPlayer : Array<number> = null;
	protected receiveData(data : any) {
		this.#otherPlayer = data;
	}

	update(scene : GameScene) {
		if (!this.#canUpdate) { return; }
		this.host.send([scene.player.x, scene.player.y]);

		if (this.#otherPlayer === null) {
			return;
		}
		
		scene.otherPlayer.x = this.#otherPlayer[0];
		scene.otherPlayer.y = this.#otherPlayer[1];
	}

}