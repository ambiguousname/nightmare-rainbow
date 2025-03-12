import { DataConnection, Peer } from "peerjs";
import { GameScene } from "./scenes/main";

export class Connection {
	protected peer : Peer;

	#opened : boolean = false;

	onOpen : Promise<string>;

	get isOpen() {
		return this.#opened;
	}

	constructor() {
		this.peer = new Peer();
		this.onOpen = new Promise((resolve, reject) => {
			this.peer.on("open", resolve);
			this.#opened = true;
		});

		this.peer.on("error", (err) => {
			console.error(`PeerJS Error: `, err);
		});
	}

	opened() {

	}

	// TODO: Need something wayyyy more robust:
	update(state : GameScene) {}
}