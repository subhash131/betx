"use client";
import Game from "@/components/game";
// import { Room } from "@/providers/room-provider";
import { socket } from "@/socket";
import { useEffect } from "react";

export default function Page({
  params: { lobby },
}: {
  params: { lobby: string };
}) {
  useEffect(() => {
    socket.on("updateEnemy", (players) => {
      console.log("🚀 ~ updatePlayers:", players);
    });
  }, [socket]);
  return <Game />;
}
