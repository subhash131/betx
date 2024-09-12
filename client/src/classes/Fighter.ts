import { Position, Velocity } from "./types";

type FighterConstructor = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  position: Position;
  velocity?: Velocity;
  width?: number;
  height?: number;
  dpr?: number;
  color?: string;
  isEnemy: boolean;
  imageSrc: string;
  framesMax: number;
  scale: number;
  imageOffset: { x: number; y: number };
};

export class Fighter {
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
  image: HTMLImageElement;
  framesCurrent = 0;
  framesElapsed = 0;
  frameHold = 10;
  framesMax: number;
  scale: number;
  imageSrc: string;
  imageOffset: { x: number; y: number };

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
    imageSrc,
    framesMax,
    scale = 1,
    imageOffset,
  }: FighterConstructor) {
    this.position = position;
    this.canvas = canvas;
    this.ctx = ctx;
    this.velocity = velocity;
    this.height = height * dpr;
    this.width = width * dpr;
    this.color = color;
    this.attackBox = {
      position: this.position,
      height: this.height / 3,
      width: this.width * 2.2,
    };
    this.isEnemy = isEnemy;
    this.framesMax = framesMax;
    this.scale = scale;
    this.imageOffset = imageOffset;
    this.imageSrc = imageSrc;
    this.image = new Image();
    this.image.src = imageSrc;
    this.image.onload = () => {
      this.update(); // Start drawing once the image has loaded
    };
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.imageOffset.x,
      this.position.y - this.imageOffset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.frameHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();

    if (this.position.y < 0) {
      this.position.y += 10;
    } else {
      this.position.y += this.velocity.y;
    }
    if (this.position.x < 0) {
      this.position.x += 1;
      this.velocity.x = 0;
    } else {
      this.position.x += this.velocity.x;
    }
    if (this.position.y + this.height >= this.canvas.height - 200) {
      this.velocity.y = 0;
      this.position.y -= 1;
    } else {
      this.velocity.y += Fighter.gravity;
    }
    if (this.position.x + this.width >= this.canvas.width) {
      this.position.x = this.canvas.width - this.width - 10;
      this.velocity.x = 0;
    }
  }
}
