"use client";
import { useMasterPublickey } from "@/hooks/use-master-publickey";
import { useProgram } from "@/hooks/use-program";
import { useUserPublickey } from "@/hooks/use-user-publickey";
import { AnchorError } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import React, { useRef } from "react";
import { toast } from "sonner";

const RegisterUser = () => {
  const usernameRef = useRef<HTMLInputElement>(null);

  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const program = useProgram(connection, wallet);
  const user = useUserPublickey(wallet?.publicKey);
  const master = useMasterPublickey();

  const registerUser = async () => {
    if (!program) {
      toast.error("Failed to connect, please refresh the page");
      return;
    }
    const username = usernameRef.current?.value;
    if (!wallet?.publicKey) {
      toast.error("Please connect your wallet!");
      return;
    }
    if (!username) {
      toast.error("Enter your name..!!");
      return;
    }

    try {
      await program.methods
        .registerUser(username)
        .accounts({
          user,
          master,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        console.log("🚀 ~ createLobby ~ err:", err);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <input
        ref={usernameRef}
        placeholder="username"
        className="p-2 bg-transparent"
      />
      <button className="bg-blue-500 p-2 rounded-md" onClick={registerUser}>
        Register User
      </button>
    </div>
  );
};

export default RegisterUser;
