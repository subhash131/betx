"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Fighter } from "@/classes/Fighter";

import { useWallet } from "@solana/wallet-adapter-react";
import { io } from "socket.io-client";
import WalletButton from "./wallet-button";
import { socket } from "@/socket";
import { Background } from "@/classes/Background";
import { kenjiSPrites, samuraiSPrites } from "@/utils/constants";

export type Players = {
  [playerId: string]: Fighter;
};

const ioServer = process.env.NEXT_PUBLIC_SERVER;

export const players: Players = {};

const Game = () => {
  const [walletAddress, setWalletAddress] = useState<string>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enemyRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const { publicKey, connected } = useWallet();

  const newSocket = useMemo(
    () => io(ioServer || "https://betx.onrender.com"),
    [publicKey]
  );

  useEffect(() => {
    if (!connected && walletAddress) {
      newSocket.emit("walletDisconnect", walletAddress);
    } else {
      newSocket.emit("walletConnect", walletAddress);
    }
    return () => {
      newSocket.emit("walletDisconnect", walletAddress);
    };
  }, [connected]);

  // Manage players
  useEffect(() => {
    if (!connected) return;
    const dpr = devicePixelRatio || 1;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }

    setWalletAddress(publicKey?.toString());
    if (!walletAddress) {
      return;
    }

    newSocket.emit("walletConnect", walletAddress);

    newSocket.on("updatePlayers", (_players) => {
      //add backend players to frontend
      for (const key in _players) {
        if (!players[key]) {
          if (key == walletAddress) {
            players[key] = new Fighter({
              canvas,
              ctx,
              position: {
                x: innerWidth * 0.25 * dpr,
                y: 0,
              },
              dpr,
              color: "blue",
              isDead: false,
              imageSrc: "/samuraiMack/Idle.png",
              framesMax: 8,
              scale: 5,
              imageOffset: {
                x: 450,
                y: 500,
              },
              sprites: samuraiSPrites,
            });
          } else {
            players[key] = new Fighter({
              canvas,
              ctx,
              position: {
                x: innerWidth * 0.75 * dpr,
                y: 0,
              },
              dpr,
              color: "red",
              isDead: false,
              imageSrc: "/kenji/Idle.png",
              framesMax: 4,
              scale: 5,
              imageOffset: {
                x: 500,
                y: 500,
              },
              sprites: kenjiSPrites,
            });
          }
        } else {
          if (key == walletAddress) {
            players[key].velocity.x = _players[key].velocity.x;
          } else {
            players[key].velocity.x = _players[key].velocity.x * -1;
          }
          players[key].velocity.y = _players[key].velocity.y;
          if (_players[key].isAttacking) {
            players[key].attack();
          }
          console.log(
            "🚀 ~ newSocket.on ~ _players.action:",
            _players[key].action
          );
          switch (_players[key].action) {
            case "IDLE":
              players[key].image = players[key].sprites.idle.image!;
              players[key].framesMax = players[key].sprites.idle.framesMax;
              break;
            case "RUN":
              players[key].image = players[key].sprites.run.image!;
              players[key].framesMax = players[key].sprites.run.framesMax;
              break;
            case "ATTACK":
              players[key].image = players[key].sprites.attack1.image!;
              players[key].framesMax = players[key].sprites.attack1.framesMax;
              break;
            case "JUMP":
              players[key].image = players[key].sprites.jump.image!;
              players[key].framesMax = players[key].sprites.jump.framesMax;
              break;
            case "TAKE_HIT":
              players[key].image = players[key].sprites.takeHit.image!;
              players[key].framesMax = players[key].sprites.takeHit.framesMax;
              break;
            case "DEATH":
              players[key].image = players[key].sprites.death.image!;
              players[key].framesMax = players[key].sprites.death.framesMax;
              players[key].frameHold = 20;
              let timeout;
              if (!timeout) {
                timeout = setTimeout(
                  () => {
                    players[key].isDead = true;
                  },
                  walletAddress == key ? 935 : 938
                );
              }
              break;
          }
        }
        if (enemyRef.current && playerRef.current) {
          if (key === walletAddress) {
            playerRef.current.style.width = `${_players[key].health}%`;
          } else {
            enemyRef.current.style.width = `${_players[key].health}%`;
          }
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
      switch (e.code) {
        case "KeyA":
        case "ArrowLeft":
          socket.emit("keyup", { key: "a", player: walletAddress });
          players[walletAddress].velocity.x = 0;
          break;
        case "KeyD":
        case "ArrowRight":
          socket.emit("keyup", { key: "d", player: walletAddress });
          players[walletAddress].velocity.x = 0;
          break;
        case "KeyW":
        case "ArrowUp":
          socket.emit("keyup", { key: "w", player: walletAddress });
          break;
        case "Space":
          socket.emit("keyup", { key: "space", player: walletAddress });
          break;
      }
    };
    const handleKeydown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyA":
        case "ArrowLeft":
          socket.emit("keydown", { key: "a", player: walletAddress });
          players[walletAddress].velocity.x = -5;
          break;
        case "KeyD":
        case "ArrowRight":
          socket.emit("keydown", { key: "d", player: walletAddress });
          players[walletAddress].velocity.x = 5;
          break;
        case "KeyW":
        case "ArrowUp":
          socket.emit("keydown", { key: "w", player: walletAddress });
          break;
        case "Space":
          socket.emit("keydown", { key: "space", player: walletAddress });
          break;
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyup);
    };
  }, [publicKey]);

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

    let player: Fighter | null = null;
    let enemy: Fighter | null = null;
    let enemyId: string | null = null;

    const bg = new Background({
      canvas,
      ctx,
      imageSrc: "/bg.jpg",
      position: { x: 0, y: 0 },
    });

    function animate() {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bg.update();
        for (let i in players) {
          players[i].update();
          if (i == walletAddress) {
            player = players[i];
          } else {
            enemy = players[i];
            enemyId = i;
          }

          // detect attack
          if (enemy && player) {
            const attack: boolean =
              player.attackBox.position.x + player.attackBox.width >=
                enemy.position.x &&
              player.attackBox.position.x <= enemy.position.x + enemy.width &&
              player.attackBox.position.y + player.attackBox.height >=
                enemy.position.y &&
              player.attackBox.position.y <= enemy.position.y + enemy.height &&
              player.isAttacking;
            if (attack) {
              player.isAttacking = false;
              socket.emit("attack", enemyId);
            }
          }
        }
      }

      animateFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animateFrame);
    };
  }, [walletAddress]);

  return (
    <div className="w-screen h-screen overflow- relative">
      <div className="absolute top-0 w-screen h-screen bg-transparent flex overflow-hidden flex-col justify-between">
        <div className="size-full h-24 flex items-center justify-between py-4 px-10">
          <div className="w-full h-10 bg-transparent rounded-l-xl flex justify-end overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all rounded-l-xl"
              ref={playerRef}
            ></div>
          </div>
          <div className="w-fit flex-shrink-0 h-full rounded-md flex items-center justify-center">
            <WalletButton />
          </div>
          <div className="w-full h-10 bg-transparent rounded-r-xl flex items-start overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all rounded-r-xl"
              ref={enemyRef}
            ></div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="size-full bg-black" />
    </div>
  );
};

export default Game;
