import { Scene, Vector2 } from "../util";

export class Room {
	#walls : MatterJS.CompositeType;
	constructor(scene : Scene, pos : Vector2, scale : Vector2) {
		this.#walls = scene.matter.composite.create();

		scene.matter.composite.add(this.#walls, scene.matter.add.rectangle(pos.x - scale.x/2, pos.y, 10, scale.y, {
			isStatic: true
		}));
		scene.matter.composite.add(this.#walls, scene.matter.add.rectangle(pos.x + scale.x/2, pos.y, 10, scale.y, {
			isStatic: true
		}));

		scene.matter.composite.add(this.#walls, scene.matter.add.rectangle(pos.x, pos.y - scale.y/2, scale.x, 10, {
			isStatic: true
		}));
		scene.matter.composite.add(this.#walls, scene.matter.add.rectangle(pos.x, pos.y + scale.y/2, scale.x, 10, {
			isStatic: true
		}));

	}
}