export class Player extends Phaser.Physics.Matter.Sprite {
	constructor(world : Phaser.Physics.Matter.World, x : number, y: number, texture: string) {
		super(world, x, y, texture, "", {
			// Stickiness on walls:
			restitution: 0.3,

			friction: 0,
			frictionStatic: 0,
			frictionAir: 0.01,
		});

		// Do not rotate unless we want:
		this.scene.matter.body.setInertia(this.body as MatterJS.BodyType, Infinity);

		this.addToUpdateList();
		this.addToDisplayList();
	}

	protected preUpdate(time: number, delta: number): void {
		let vel = this.getVelocity();
		this.setVelocity(vel.x * 0.95, vel.y * 0.95);
	}
}