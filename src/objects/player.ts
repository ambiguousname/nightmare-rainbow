import { Vector2 } from "../util";

const PLAYER_SETTINGS = {
	rotateSpeed: 2,
	acceleration: 0.1,
	airFriction: 0.04
}

export class Player extends Phaser.Physics.Matter.Sprite {

	constructor(world : Phaser.Physics.Matter.World, x : number, y: number, texture: string) {
		super(world, x, y, texture, "", {
			// Stickiness on walls:
			restitution: 0.3,

			friction: 0,
			frictionStatic: 0,
			frictionAir: PLAYER_SETTINGS.airFriction,
			chamfer: 0.5,
			
			shape: {
				width: 50,
				height: 25
			}
		});

		// Do not rotate unless we want:
		this.scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity);

		this.addToUpdateList();
		this.addToDisplayList();
	}

	get up() {
		let forwardAngle = (this.body as MatterJS.BodyType).angle;
		return {x: Math.cos(forwardAngle), y: Math.sin(forwardAngle) };
	}

	move(intent : Vector2, delta : number) {
		let delta_ms = delta/1000;

		this.scene.matter.body.rotate(this.body as MatterJS.BodyType, intent.x * delta_ms * PLAYER_SETTINGS.rotateSpeed);

		this.scene.matter.applyForceFromPosition(this.body as MatterJS.BodyType, this.body.position, delta_ms * PLAYER_SETTINGS.acceleration * intent.y);

		// TODO: I think a tire based system would be better.
	}
}