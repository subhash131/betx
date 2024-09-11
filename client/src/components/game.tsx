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

const players: Players = {};

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wallet = useAnchorWallet();
  const [walletAdd, setWalletAdd] = useState<string>();
  const newSocket = useMemo(
    () => io(ioServer || "http://localhost:8000"),
    [wallet]
  );

  useEffect(() => {
    const dpr = devicePixelRatio || 1;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }
    const walletAddress = wallet?.publicKey.toString();
    if (!walletAddress) return;
    setWalletAdd(walletAddress);
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
      if (!walletAdd) return;
      delete players[walletAdd];
      console.log("Disconnected from server, reason:", reason);
    });

    return () => {
      newSocket.emit("walletDisconnect", walletAdd);
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
