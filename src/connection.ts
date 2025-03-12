import { DataConnection, Peer } from "peerjs";
import { GameScene } from "./scenes/main";

declare var PEERJS_PORT : number;
declare var PEERJS_SERVER : string;

export abstract class Connection {
	protected peer : Peer;

	#opened : boolean = false;

	onOpen : Promise<string>;

	get isOpen() {
		return this.#opened;
	}

	constructor() {
		this.peer = new Peer({
			port: PEERJS_PORT,
			host: PEERJS_SERVER
		});
		this.onOpen = new Promise((resolve, reject) => {
			this.peer.on("open", resolve);
			this.#opened = true;
		});

		this.peer.on("error", (err) => {
			console.error(`PeerJS Error: `, err);
		});
	}

	// TODO: Need something wayyyy more robust:
	abstract update(state : GameScene) : void;
}