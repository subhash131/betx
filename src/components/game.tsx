"use client";
import React, { useEffect, useRef, useState } from "react";
import { Sprite } from "@/classes/Sprite";
import { handleKeydown } from "@/utils/game/handle-keydown";
import { handleKeyup } from "@/utils/game/handle-keyup";
import { keys } from "@/utils/game/key-controls";
import { useOthers, useRoom } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { updatePresence } = useRoom();
  const others = useOthers();

  let player: Sprite | undefined;
  let enemy: Sprite | undefined;

  useEffect(() => {
    let animateFrame: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas) {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    }
    if (!ctx || !canvas) return;
    if (!player) {
      player = new Sprite({ canvas, ctx, position: { x: 0, y: 0 } });
    }
    if (!enemy) {
      enemy = new Sprite({ canvas, ctx, position: { x: 200, y: 0 } });
    }

    function animate() {
      if (!player || !enemy) return;
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.update();
        enemy.update();

        // update player velocity
        player.velocity.x = 0;
        if (keys.a.pressed && keys.lastKey === "a") {
          player.velocity.x = -1;
          updatePresence({
            velocity: player.velocity,
            position: player.position,
          });
        } else if (keys.d.pressed && keys.lastKey === "d") {
          player.velocity.x = 1;
          updatePresence({
            velocity: player.velocity,
            position: player.position,
          });
        } else if (keys.w.pressed) {
          player.velocity.y = -10;
          updatePresence({
            velocity: player.velocity,
            position: player.position,
          });
        }

        // update enemy velocity

        if (others.length > 0) {
          enemy.velocity = others[0].presence.velocity;
          enemy.position = others[0].presence.position;
          console.log(enemy.velocity);
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
      player = undefined;
      enemy = undefined;
    };
  }, [others]);

  return (
    <div className="w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} className="" />
    </div>
  );
};

export default Game;
