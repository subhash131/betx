"use client";
import { toggleModal } from "@/state-manager/features/modal";
import React from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";

const JoinGame = () => {
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(toggleModal(null));
  };

  return (
    <div
      className="w-96 h-fit rounded-xl bg-[#181818] overflow-hidden relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="w-full h-fit absolute flex justify-end pt-2 pr-2">
        <button
          className="size-10  bg-[#282828] rounded-full flex items-center justify-center group hover:bg-[#383838] transition-colors"
          onClick={closeModal}
        >
          <IoClose
            size={28}
            className="text-gray-300 group-hover:text-white transition-colors"
          />
        </button>
      </div>
      <form className="size-full flex items-center  flex-col gap-4 py-16">
        <h3 className="text-xl font-semibold">Join Game</h3>
        <div className="w-full flex flex-col items-center justify-center gap-4 px-10">
          <h4 className="font-semibold text-start">Enter Lobby id</h4>
          <input
            className="outline-none px-4 py-2 border rounded-lg bg-transparent"
            placeholder="lobby id"
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};

export default JoinGame;
