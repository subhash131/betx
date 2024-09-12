"use client";
import Game from "@/components/game";

export default function Page({
  params: { lobby },
}: {
  params: { lobby: string };
}) {
  return <Game />;
}
