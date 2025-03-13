export class Player extends Phaser.Physics.Matter.Sprite {
	constructor(world : Phaser.Physics.Matter.World, x : number, y: number, texture: string) {
		super(world, x, y, texture);

		this.addToUpdateList();
		this.addToDisplayList();
	}

	protected preUpdate(time: number, delta: number): void {
		let vel = this.getVelocity();
		this.setVelocity(vel.x * 0.95, vel.y * 0.95);
	}
}