import { Vector2 } from "../util";

const PLAYER_SETTINGS = {
	rotateSpeed: 0.5,
	acceleration: 2,
	airFriction: 0.01
}

export class Player extends Phaser.Physics.Matter.Sprite {

	constructor(world : Phaser.Physics.Matter.World, x : number, y: number, texture: string) {
		super(world, x, y, texture, "", {
			// Stickiness on walls:
			restitution: 0.3,

			friction: 0,
			frictionStatic: 0,
			frictionAir: PLAYER_SETTINGS.airFriction,
		});

		// Do not rotate unless we want:
		this.scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity);

		this.addToUpdateList();
		this.addToDisplayList();
	}

	move(intent : Vector2, delta : number) {
		let delta_ms = delta/1000;

		this.scene.matter.body.rotate(this.body as MatterJS.BodyType, intent.x * delta_ms * PLAYER_SETTINGS.rotateSpeed);

		let forwardAngle = (this.body as MatterJS.BodyType).angle;
		
		let vel = this.getVelocity();

		let up = {x: Math.cos(forwardAngle) * intent.y, y: Math.sin(forwardAngle) * intent.y };

		this.setVelocity(vel.x + up.x * delta_ms * PLAYER_SETTINGS.acceleration, vel.y + up.y * delta_ms * PLAYER_SETTINGS.acceleration);
	}
}