import { Vector2 } from "../util";

const PLAYER_SETTINGS = {
	rotateSpeed: 2,
	acceleration: 0.05,
	airFriction: 0.04
}

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 25;

export class Player extends Phaser.Physics.Matter.Sprite {

	#leftWheel : Phaser.GameObjects.Components.Transform;
	#rightWheel : Phaser.GameObjects.Components.Transform;

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

		this.scene.matter.body.setInertia(this.body as MatterJS.BodyType, 5000);

		this.#leftWheel = this.scene.add.rectangle(PLAYER_WIDTH/2, PLAYER_HEIGHT/2, 2.5, 10, 0xff0000);
		this.#rightWheel = this.scene.add.rectangle(-PLAYER_WIDTH/2, PLAYER_HEIGHT/2, 2.5, 10, 0xffffff);

		this.addToUpdateList();
		this.addToDisplayList();
	}

	updateWheels(turn : number, delta_ms : number) : number {
		let angle = (this.body as MatterJS.BodyType).angle;

		let leftWheelAngle = angle + 7 * Math.PI/8;
		let rightWheelAngle = angle + 9 * Math.PI/8;

		let wheelTurn = angle + Math.PI/2 + turn;
		
		this.#leftWheel.setPosition(Math.cos(leftWheelAngle) * PLAYER_WIDTH/2 + this.body.position.x, Math.sin(leftWheelAngle) * PLAYER_WIDTH/2 + this.body.position.y, -1);
		this.#leftWheel.setRotation(wheelTurn);

		this.#rightWheel.setPosition(Math.cos(rightWheelAngle) * PLAYER_WIDTH/2 + this.body.position.x, Math.sin(rightWheelAngle) * PLAYER_WIDTH/2 + this.body.position.y);
		this.#rightWheel.setRotation(wheelTurn);

		return wheelTurn - Math.PI/2;
	}

	move(intent : Vector2, delta : number) {
		let delta_ms = delta/1000;

		// this.scene.matter.body.rotate(this.body as MatterJS.BodyType, intent.x * delta_ms * PLAYER_SETTINGS.rotateSpeed);

		let angle = this.updateWheels(intent.x, delta_ms);

		this.scene.matter.applyForceFromPosition(this.body as MatterJS.BodyType, {x: this.#leftWheel.x, y: this.#leftWheel.y}, delta_ms * PLAYER_SETTINGS.acceleration * intent.y, angle);
		
		this.scene.matter.applyForceFromPosition(this.body as MatterJS.BodyType, {x: this.#rightWheel.x, y: this.#rightWheel.y }, delta_ms * PLAYER_SETTINGS.acceleration * intent.y, angle);

		// TODO: Need to either re-direct or slow down velocity that is not aligned with wheels.
		// Steps here:
		// 1. Create wheel sprite objects (for visual clarity) (done)
		// 2. Left and right arrow keys set rotation of the wheels relative to the car (done)
		// 3. When you accelerate, you accelerate in the direction the wheels are pointed in. (done)
		// 4. Multiply the current velocity by sin(angle) and cos(angle), to get only the velocity pointed in the same direction as the front wheels.
		// 5. Disable setting rotation, torque should *hopefully* handle that for us. (done)

		// 6. Set air friction to be very low (assume the wheels are spinning to keep the car in motion). This should hopefully feel more like rolling with step 4.
		// 7. Add braking/reversing.
		// 8. To counteract 6, need to figure out what the upper limit on car acceleration is. Is it just air friction?
	}
}