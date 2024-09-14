"use client";
import { toggleModal } from "@/state-manager/features/modal";
import React, { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useMasterPublickey } from "@/hooks/use-master-publickey";
import { useProgram } from "@/hooks/use-program";
import { useUserPublickey } from "@/hooks/use-user-publickey";
import { AnchorError } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SendTransactionError, SystemProgram } from "@solana/web3.js";
import { toast } from "sonner";

const RegisterForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const program = useProgram(connection, wallet);
  const user = useUserPublickey(wallet?.publicKey);
  const master = useMasterPublickey();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(toggleModal(null));
  };
  const registerUser = async () => {
    if (!program) {
      toast.error("Failed to connect, please refresh the page");
      return;
    }
    const username = inputRef.current?.value;
    if (!wallet?.publicKey) {
      toast.error("Please connect your wallet!");
      return;
    }
    if (!username) {
      toast.error("Enter your name..!!");
      return;
    }

    try {
      setLoading(true);
      const res = await program.methods
        .registerUser(username)
        .accounts({
          user,
          master,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log(res);
      if (res) {
        setLoading(false);
        toast.success("Registered successfully");
        dispatch(toggleModal(null));
      }
    } catch (err) {
      if (err instanceof SendTransactionError) {
        toast.error(err.transactionError.message);
      } else if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        console.log("🚀 ~ createLobby ~ err:", err);
      }
    }
  };
  return (
    <div
      className="w-96 h-60 rounded-xl bg-[#181818] overflow-hidden relative"
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
      <form className="size-full flex items-center justify-center flex-col gap-4">
        <h3 className="text-xl font-semibold">Register username</h3>
        <div className="w-full flex flex-col items-center justify-center gap-4 px-10">
          <input
            ref={inputRef}
            type="text"
            placeholder="username..."
            className="p-2 px-4 bg-[#313742] rounded-lg w-full outline-none"
            autoFocus
          />
          <button
            className="bg-white px-6 py-2 rounded-lg text-black w-fit hover:scale-95 active:scale-90 transition-transform disabled:bg-gray-300"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              registerUser();
            }}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
