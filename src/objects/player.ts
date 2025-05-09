import { Vector2 } from "../util";

const PLAYER_SETTINGS = {
	acceleration: 0.1,
	airFriction: 0.01,
	turnSpeed: 4,
	mass: 500
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

		this.scene.matter.body.setMass(this.body as MatterJS.BodyType, PLAYER_SETTINGS.mass);

		this.#leftWheel = this.scene.add.rectangle(PLAYER_WIDTH/2, PLAYER_HEIGHT/2, 2.5, 10, 0xff0000);
		this.#rightWheel = this.scene.add.rectangle(-PLAYER_WIDTH/2, PLAYER_HEIGHT/2, 2.5, 10, 0xffffff);

		this.addToUpdateList();
		this.addToDisplayList();
	}

	#prevTurn = 0;

	updateWheels(turn : number, delta_ms : number) : number {
		let angle = (this.body as MatterJS.BodyType).angle;

		let leftWheelAngle = angle + 7 * Math.PI/8;
		let rightWheelAngle = angle + 9 * Math.PI/8;
		
		this.#prevTurn = Phaser.Math.Linear(this.#prevTurn, turn, delta_ms * PLAYER_SETTINGS.turnSpeed);

		let wheelTurn = angle + Math.PI/2 + this.#prevTurn;
		
		this.#leftWheel.setPosition(Math.cos(leftWheelAngle) * PLAYER_WIDTH/2 + this.body.position.x, Math.sin(leftWheelAngle) * PLAYER_WIDTH/2 + this.body.position.y, -1);
		this.#leftWheel.setRotation(wheelTurn);

		this.#rightWheel.setPosition(Math.cos(rightWheelAngle) * PLAYER_WIDTH/2 + this.body.position.x, Math.sin(rightWheelAngle) * PLAYER_WIDTH/2 + this.body.position.y);
		this.#rightWheel.setRotation(wheelTurn);

		return wheelTurn - Math.PI/2;
	}

	move(intent : Vector2, delta : number) {
		let delta_ms = delta/1000;

		let angle = this.updateWheels(intent.x, delta_ms);

// TODO: Verify velocity measurements and unit conversions are accurate, test to see if you can accelerate a car at a constant rate and get the velocity you expect
		
		
		// How I'm pretty sure rotating the wheels works while in motion:
		// The wheels take some fraction of the forward momentum and "redistribute it" in the direction they're facing.
		// So we need to figure out some formula to take forward momentum that is aligned with our wheels and reapply it as acceleration from a position,
		// While zeroing out (or making fractional) velocity elsewhere.

		// Guess One:
		// 1. Take a projection of the normalized velocity onto the vector representing the forward of the wheels.
		// 2. Subtract some fraction of the velocity (maybe 50%?). This represents our friction between the wheels and the ground, slowing things down.
		// 3. Multiply our projection by an even smaller fraction of the velocity's length. Divide by time. This represents what's been transferred over as acceleration.
		// I think the formula would be: 
		// outForce += this.body.mass * projectionNormalized * lengthFraction / dt;
		// velocity *= (1 - frictionFraction);
		// Angular velocity needs this treatment too, just in terms of friction.

		let outForce = (PLAYER_SETTINGS.acceleration * intent.y);

		this.scene.matter.applyForceFromPosition(this.body as MatterJS.BodyType, {x: this.#leftWheel.x, y: this.#leftWheel.y}, outForce, angle);
		
		this.scene.matter.applyForceFromPosition(this.body as MatterJS.BodyType, {x: this.#rightWheel.x, y: this.#rightWheel.y }, outForce, angle);

		// TODO: Need to either re-direct or slow down velocity that is not aligned with wheels.
		// Steps here:
		// 1. Create wheel sprite objects (for visual clarity) (done)
		// 2. Left and right arrow keys set rotation of the wheels relative to the car (done)
		// 3. When you accelerate, you accelerate in the direction the wheels are pointed in. (done)
		// 4. Figure out how the wheels control the body while in motion.
		// 5. Disable setting rotation, torque should *hopefully* handle that for us. (done)

		// 6. Set air friction to be very low (assume the wheels are spinning to keep the car in motion). This should hopefully feel more like rolling with step 4.
		// 7. Add braking/reversing.
		// 8. To counteract 6, need to figure out what the upper limit on car acceleration is. Is it just air friction?
		// 9. Lower moment of inertia? Or at least make it harder to rotate.
	}
}