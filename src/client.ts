import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";
export class Client extends Connection {

	_host : DataConnection;

	constructor(hostID : string) {
		super();
		this._host = this._peer.connect(hostID);
		this._host.on("open", () => {
			console.log("HE");
		});
	}

	send() {
		this._host.send([0, 0]);
	}

}