"use client";
import React, { useEffect, useRef, useState } from "react";
import { Sprite } from "@/classes/Sprite";
import { useMyPresence, useOthers, useRoom } from "@liveblocks/react";
import { useKeyControls } from "@/hooks/game/use-key-controls";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {} = useRoom();
  const presence = useMyPresence()[0];
  const keys = useKeyControls();
  const others = useOthers();

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
      if (!player || !enemy || !keys || !presence || !others) return;
      const { keyControl } = presence;
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.update();
        enemy.update();

        // update player
        player.velocity.x = 0;
        if (keyControl.a.pressed && keyControl.lastKey === "a") {
          player.velocity.x = -1;
        } else if (keyControl.d.pressed && keyControl.lastKey === "d") {
          player.velocity.x = 1;
        } else if (keyControl.w.pressed) {
          player.velocity.y = -10;
        }

        // update enemy
        if (others.length <= 0) return;
        enemy.velocity.x = 0;
        const {
          presence: { keyControl: enemyKeyControl },
        } = others[0];

        if (enemyKeyControl.a.pressed && enemyKeyControl.lastKey === "a") {
          enemy.velocity.x += -1;
        } else if (
          enemyKeyControl.d.pressed &&
          enemyKeyControl.lastKey === "d"
        ) {
          enemy.velocity.x += 1;
        } else if (enemyKeyControl.w.pressed) {
          enemy.velocity.y += -10;
        }
      }
      animateFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animateFrame);
    };
  }, [presence]);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} className="" />
    </div>
  );
};

export default Game;
