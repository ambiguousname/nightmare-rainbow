import { DataConnection, Peer } from "peerjs";
import { Connection } from "./connection";

export class Host extends Connection {
	constructor() {
		super();
		this._peer.on("connection", this._connected.bind(this));
		this.id.then((id) => {
			console.log(id);
		});
		this._peer.on("disconnected", this._disconnected.bind(this));
	}
	
	_players : Map<String, DataConnection> = new Map();

	_connected(connection : DataConnection) {
		this._players.set(connection.connectionId, connection);
		connection.on("data", this._receiveData.bind(this));
	}

	_disconnected(id : string) {
		this._players.delete(id);
	}

	_receiveData(data : any) {
		console.log(data);
	}
}