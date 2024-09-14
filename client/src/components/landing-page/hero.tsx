import React from "react";
import Modal from "../modal";

const Hero = () => {
  return (
    <div className="w-full h-screen pt-10 flex flex-col items-center justify-center px-40 gap-10">
      <div className="w-[90%] h-[80%] rounded-3xl bg-red-500">
        <h2 className="text-6xl tracking-wide leading-snug font-semibold">
          Jump into the game, place your bets, and compete to win. Ready to play
          and earn?
        </h2>
      </div>
      {/* <div className="flex flex-col gap-4">
        
        <h4 className="text-xl">
          competitive, secure, and engaging experience for players everywhere.
        </h4>
      </div>
      <div className="flex gap-4 items-start w-full font-semibold">
        <button className="px-10 py-4 bg-black text-white rounded-full  hover:scale-95 active:scale-90 transition-transform">
          Start Game
        </button>
        <button className="px-10 py-4 bg-white border text-black shadow-lg rounded-full hover:scale-95 active:scale-90 transition-transform">
          Join Game
        </button>
      </div> */}
    </div>
  );
};

export default Hero;
