"use client";
import React, { useEffect, useRef } from "react";
import { Sprite } from "@/classes/Sprite";
import { handleKeydown } from "@/utils/game/handle-keydown";
import { handleKeyup } from "@/utils/game/handle-keyup";
import { keys } from "@/utils/game/key-controls";

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

        // update velocity
        player.velocity.x = 0;
        if (keys.a.pressed && keys.lastKey === "a") {
          player.velocity.x = -1;
        } else if (keys.d.pressed && keys.lastKey === "d") {
          player.velocity.x = 1;
        } else if (keys.w.pressed) {
          player.velocity.y = -10;
        }
      }
      animateFrame = requestAnimationFrame(animate);
    }

    animate();
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);
    return () => {
      cancelAnimationFrame(animateFrame);
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyup);
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} className="" />
    </div>
  );
};

export default Game;
