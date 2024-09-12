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
  isEnemy: boolean;
};

export class Sprite {
  static gravity = 0.7;
  ctx: CanvasRenderingContext2D;
  position: Position;
  velocity: Velocity;
  height: number;
  canvas: HTMLCanvasElement;
  width: number;
  color: string;
  isAttacking: boolean = false;
  attackBox: {
    position: Position;
    width: number;
    height: number;
  };
  isEnemy: boolean = false;
  constructor({
    position,
    ctx,
    canvas,
    velocity = { x: 0, y: 0 },
    height = 150,
    width = 50,
    dpr = 1,
    color = "red",
    isEnemy,
  }: SpriteConstructor) {
    this.position = position;
    this.canvas = canvas;
    this.velocity = velocity;
    this.ctx = ctx;
    this.height = height * dpr;
    this.width = width * dpr;
    this.color = color;
    this.attackBox = {
      position: this.position,
      height: this.height / 3,
      width: this.width * 2.2,
    };
    this.isEnemy = isEnemy;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  draw() {
    // player
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    //attack box
    if (this.isAttacking) {
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(
        this.isEnemy
          ? this.attackBox.position.x
          : this.attackBox.position.x - this.attackBox.width + this.width,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
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
    if (this.position.y + this.height >= this.canvas.height - 200) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += Sprite.gravity;
    }
    if (this.position.x + this.width >= this.canvas.width) {
      this.velocity.x = 0;
    }
  }
}
