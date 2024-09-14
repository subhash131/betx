"use client";
import { toggleModal } from "@/state-manager/features/modal";
import { RootState } from "@/state-manager/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import RegisterForm from "./register-form";

const Modal = () => {
  const { isActive, type } = useSelector(
    (root: RootState) => root.ModalReducer
  );
  const dispatch = useDispatch();

  const getContent = () => {
    switch (type) {
      case "REGISTER":
        return <RegisterForm />;
    }
  };

  return (
    <div
      className={`${
        isActive ? "top-0" : "top-[100vh]"
      } w-screen h-screen fixed transition-all flex items-center justify-center bg-[rgb(0,0,0,0.7)] duration-300 z-[100] text-white`}
      onClick={() => {
        dispatch(toggleModal(null));
      }}
    >
      {getContent()}
    </div>
  );
};

export default Modal;
