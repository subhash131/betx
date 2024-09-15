"use client";
import React from "react";
import { TsParticles } from "@/components/landing-page/particles";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/state-manager/features/modal";

const Hero = () => {
  const dispatch = useDispatch();
  const handleStartGame = () => {
    dispatch(toggleModal("START_GAME"));
  };
  const handleJoinGame = () => {
    dispatch(toggleModal("JOIN_GAME"));
  };
  return (
    <div className="w-full h-screen pt-10 flex flex-col items-center justify-center px-40 gap-10 relative pb-12">
      <TsParticles />
      <div className="w-[90%] h-[80%] rounded-3xl bg-[#E1E1E1] flex items-start justify-between px-20 py-10 flex-col shadow-inner">
        <div className="h-[50%] flex-col pt-10 flex items-start justify-start gap-6">
          <h2 className="text-5xl tracking-wide leading-snug font-semibold text-start pr-36">
            Challenge your peers, dominate the game, and win big money!
          </h2>
          <h4 className="text-xl text-start font-medium text-gray-700">
            A competitive, secure, and engaging experience for players
            everywhere.
          </h4>
        </div>
        <div className="flex gap-4 font-semibold pb-4">
          <button
            className="px-10 shadow-xl py-4 bg-black text-white rounded-full transition-transform hover:scale-95 active:scale-90"
            onClick={handleStartGame}
          >
            Start Game
          </button>
          <button
            className="px-10 py-4 bg-white text-black shadow-xl rounded-full transition-transform hover:scale-95 active:scale-90"
            onClick={handleJoinGame}
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
