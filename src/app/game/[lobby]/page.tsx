"use client";
import React, { useEffect, useRef } from "react";

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");

  useEffect(() => {
    if (!canvas || !ctx) return;
    canvasRef.current.width = innerWidth;
    canvasRef.current.height = innerHeight;
  }, []);
  return (
    <div className="w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} className="" />
    </div>
  );
};

export default Game;
