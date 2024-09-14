"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/state-manager/features/modal";

const RegisterUser = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col">
      <button
        className="bg-black text-white px-4 py-3 rounded-md transition-transform hover:scale-95 active:scale-90"
        onClick={() => {
          dispatch(toggleModal("REGISTER"));
        }}
      >
        Register
      </button>
    </div>
  );
};

export default RegisterUser;
