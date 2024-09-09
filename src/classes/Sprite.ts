import { Position, Velocity } from "./types";

type SpriteConstructor = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  position: Position;
  velocity?: Velocity;
};

export class Sprite {
  static gravity = 0.2;
  ctx: CanvasRenderingContext2D;
  position: Position;
  velocity: Velocity;
  height: number;
  canvas: HTMLCanvasElement;
  width: number;
  constructor({
    position,
    ctx,
    canvas,
    velocity = { x: 0, y: 0 },
  }: SpriteConstructor) {
    this.position = position;
    this.canvas = canvas;
    this.velocity = velocity;
    this.ctx = ctx;
    this.height = 150;
    this.width = 150;
  }

  draw() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.position.x, this.position.y, 50, 150);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.position.y + this.height >= this.canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += Sprite.gravity;
    }
    if (this.position.x + this.width >= this.canvas.width) {
      this.velocity.x = 0;
    }
  }
}
