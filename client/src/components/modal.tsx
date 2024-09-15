"use client";
import { RootState } from "@/state-manager/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RegisterForm from "./landing-page/register-form";
import StartGame from "./landing-page/start-game";
import JoinGame from "./landing-page/join-game";

const Modal = () => {
  const { isActive, type } = useSelector(
    (root: RootState) => root.ModalReducer
  );
  const dispatch = useDispatch();

  const getContent = () => {
    switch (type) {
      case "REGISTER":
        return <RegisterForm />;
      case "START_GAME":
        return <StartGame />;
      case "JOIN_GAME":
        return <JoinGame />;
    }
  };

  return (
    <div
      className={`${
        isActive ? "top-0" : "top-[100vh]"
      } w-screen h-screen fixed transition-all flex items-center justify-center backdrop-blur-sm duration-300 z-[100] text-white`}
    >
      {getContent()}
    </div>
  );
};

export default Modal;
