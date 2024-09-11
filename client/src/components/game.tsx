"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sprite } from "@/classes/Sprite";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { io } from "socket.io-client";
import WalletButton from "./wallet-button";
import { socket } from "@/socket";

// const sprites: Sprite[] = [];
export type Players = {
  [playerId: string]: Sprite;
};

const ioServer = process.env.NEXT_PUBLIC_SERVER;
console.log("🚀 ~ ioServer:", ioServer);

export const players: Players = {};

const Game = () => {
  const [walletAddress, setWalletAddress] = useState<string>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wallet = useAnchorWallet();
  const newSocket = useMemo(
    () => io(ioServer || "https://betx.onrender.com"),
    [wallet]
  );

  // Manage players
  useEffect(() => {
    const dpr = devicePixelRatio || 1;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }
    const walletAdd = wallet?.publicKey.toString();
    setWalletAddress(walletAdd);
    if (!walletAddress) return;
    newSocket.emit("walletConnect", walletAddress);
    console.log("🚀 ~ useEffect ~ walletAddress:", walletAddress);

    newSocket.on("updatePlayers", (_players) => {
      console.log("🚀 ~ newSocket.on ~ _players:", _players);
      //add backend players to frontend
      for (const key in _players) {
        if (!players[key]) {
          players[key] = new Sprite({
            canvas,
            ctx,
            position: { x: Math.random() * innerWidth, y: 0 },
            dpr,
            color: key == walletAddress ? "blue" : "red",
          });
        } else {
          players[key].velocity = _players[key].velocity;
        }
      }
      //remove players
      for (const key in players) {
        if (!_players[key]) {
          delete players[key];
        }
      }
    });

    newSocket.on("disconnect", (reason) => {
      if (!walletAddress) return;
      delete players[walletAddress];
      console.log("Disconnected from server, reason:", reason);
    });

    const handleKeyup = (e: KeyboardEvent) => {
      switch (e.key) {
        case "a":
        case "A":
        case "ArrowLeft":
          socket.emit("keyup", { key: "a", player: walletAddress });
          players[walletAddress].velocity.x = 0;
          break;
        case "d":
        case "D":
        case "ArrowRight":
          socket.emit("keyup", { key: "d", player: walletAddress });
          players[walletAddress].velocity.x = 0;
          break;
        case "w":
        case "ArrowUp":
          socket.emit("keyup", { key: "w", player: walletAddress });
          players[walletAddress].velocity.y = 0;
          break;
      }
    };
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "a":
        case "A":
        case "ArrowLeft":
          socket.emit("keydown", { key: "a", player: walletAddress });
          players[walletAddress].velocity.x = -1;
          break;
        case "d":
        case "D":
        case "ArrowRight":
          socket.emit("keydown", { key: "d", player: walletAddress });
          players[walletAddress].velocity.x = 1;
          break;
        case "w":
        case "ArrowUp":
          socket.emit("keydown", { key: "w", player: walletAddress });
          players[walletAddress].velocity.y = -10;
          break;
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyup);
      newSocket.emit("walletDisconnect", walletAddress);
      socket.disconnect();
    };
  }, [wallet?.publicKey]);

  useEffect(() => {
    let animateFrame: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const dpr = devicePixelRatio || 1;
    if (canvas) {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
    }
    if (!ctx || !canvas) return;

    function animate() {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i in players) {
          players[i].update();
        }
      }
      animateFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animateFrame);
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      <div className="absolute top-0">
        <WalletButton />
      </div>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

export default Game;
