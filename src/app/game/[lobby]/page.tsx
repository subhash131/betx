"use client";
import { Sprite } from "@/classes/Sprite";
import React, { useEffect, useRef } from "react";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animateFrame: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas) {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    }
    if (!ctx || !canvas) return;
    const player = new Sprite({ canvas, ctx, position: { x: 0, y: 0 } });
    const enemy = new Sprite({ canvas, ctx, position: { x: 200, y: 0 } });

    function animate() {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.update();
        enemy.update();
      }
      animateFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animateFrame);
    };
  }, []);
  return (
    <div className="w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} className="" />
    </div>
  );
};

export default Game;
