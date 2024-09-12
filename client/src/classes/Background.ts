import { Position, Velocity } from "./types";

type BackgroundConstructor = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  position: Position;
  imageSrc: string;
};

export class Background {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  position: Position;
  image: HTMLImageElement;
  constructor({ position, ctx, canvas, imageSrc }: BackgroundConstructor) {
    this.position = position;
    this.canvas = canvas;
    this.ctx = ctx;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.canvas.width,
      this.canvas.height
    );
  }

  update() {
    this.draw();
  }
}
