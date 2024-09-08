"use client";
import { useLobbyPublicKey } from "@/hooks/use-lobby-publickey";
import { useProgram } from "@/hooks/use-program";
import { AnchorError, BN } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import React, { useState } from "react";
import { toast } from "sonner";

const PlaceBet = () => {
  const [lobbyId] = useState<number>(2);
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const program = useProgram(connection, wallet);

  const placeBet = async () => {
    if (!wallet?.publicKey) {
      toast.error("Please connect your wallet!");
      return;
    }

    if (!program) {
      toast.error("Failed to connect, please refresh the page");
      return;
    }

    const lobbyPk = useLobbyPublicKey(Number(lobbyId));

    try {
      await program.methods
        .placeBet(new BN(lobbyId))
        .accounts({
          lobby: lobbyPk,
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
      <button className="bg-blue-500 p-2 rounded-md" onClick={placeBet}>
        Place bet
      </button>
    </div>
  );
};

export default PlaceBet;
