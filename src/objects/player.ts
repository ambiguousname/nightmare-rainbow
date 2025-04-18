import { Vector2 } from "../util";

const PLAYER_SETTINGS = {
	rotateSpeed: 2,
	acceleration: 0.05,
	airFriction: 0.04
}

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 25;

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
				width: PLAYER_WIDTH,
				height: PLAYER_HEIGHT
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

		let angle = (this.body as MatterJS.BodyType).angle;

		let wheelLeft = {x: Math.cos(angle) * PLAYER_WIDTH/2 + this.body.position.x, y: Math.sin(angle) * PLAYER_HEIGHT/2 + this.body.position.y};

		let wheelRight = {x: -PLAYER_WIDTH/2 * Math.cos(angle) + this.body.position.x, y: Math.sin(angle) * PLAYER_HEIGHT/2};

		this.scene.matter.body.rotate(this.body as MatterJS.BodyType, intent.x * delta_ms * PLAYER_SETTINGS.rotateSpeed);

		this.scene.matter.applyForceFromPosition(this.body as MatterJS.BodyType, wheelLeft, delta_ms * PLAYER_SETTINGS.acceleration * intent.y, angle /* TODO: Get this working with wheel angle */);
		
		this.scene.matter.applyForceFromPosition(this.body as MatterJS.BodyType, wheelRight, delta_ms * PLAYER_SETTINGS.acceleration * intent.y, angle /* TODO: Get this working with wheel angle */);

		// TODO: Need to either re-direct or slow down velocity that is not aligned with wheels.
		// Steps here:
		// 1. Create wheel sprite objects (for visual clarity)
		// 2. Left and right arrow keys set rotation of the wheels relative to the car
		// 3. When you accelerate, you accelerate in the direction the wheels are pointed in.
		// 4. Multiply the current velocity by sin(angle) and cos(angle), to get only the velocity pointed in the same direction as the angle.
	}
}