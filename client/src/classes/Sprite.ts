import { Position, Velocity } from "./types";

type SpriteConstructor = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  position: Position;
  velocity?: Velocity;
  width?: number;
  height?: number;
  dpr?: number;
  color?: string;
};

export class Sprite {
  static gravity = 0.2;
  ctx: CanvasRenderingContext2D;
  position: Position;
  velocity: Velocity;
  height: number;
  canvas: HTMLCanvasElement;
  width: number;
  color: string;

  constructor({
    position,
    ctx,
    canvas,
    velocity = { x: 0, y: 0 },
    height = 150,
    width = 50,
    dpr = 1,
    color = "red",
  }: SpriteConstructor) {
    this.position = position;
    this.canvas = canvas;
    this.velocity = velocity;
    this.ctx = ctx;
    this.height = height * dpr;
    this.width = width * dpr;
    this.color = color;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    if (this.position.y < 0) {
      this.position.y += 1;
    } else {
      this.position.y += this.velocity.y;
    }
    if (this.position.x < 0) {
      this.position.x += 1;
    } else {
      this.position.x += this.velocity.x;
    }
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
