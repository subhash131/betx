"use client";
import { useLobbyPublicKey } from "@/hooks/use-lobby-publickey";
import { useMasterPublickey } from "@/hooks/use-master-publickey";
import { useProgram } from "@/hooks/use-program";
import { MasterT } from "@/state-manager/features/master";
import { confirmTx, solToLamports } from "@/utils/helpers";
import { AnchorError, BN } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const CreateLobby = () => {
  const [lastLobbyId, setLastLobbyId] = useState<string>();
  const betRef = useRef<HTMLInputElement>(null);
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const masterPk = useMasterPublickey();
  const program = useProgram(connection, wallet);

  async function getMaster(): Promise<Omit<MasterT, "owner"> | undefined> {
    try {
      if (!program) {
        toast.error("something went wrong refresh page  ");
        return;
      }
      const master = await program?.account.master.fetch(masterPk);
      if (master) {
        setLastLobbyId(master.lastLobbyId.toString());
      }
      if (!master) {
        toast.error("Failed to connect");
        return;
      }
    } catch (err) {
      console.log("🚀 ~ getMaster ~ err:", err);
    }
  }

  const createLobby = async () => {
    const betAmount = betRef.current?.value;
    if (!wallet?.publicKey) {
      toast.error("Please connect your wallet!");
      return;
    }

    if (!program) {
      toast.error("Failed to connect, please refresh the page");
      return;
    }

    if (!lastLobbyId) {
      await getMaster();
      return;
    }

    const lobbyPk = useLobbyPublicKey(Number(lastLobbyId) + 1);

    const lamports = solToLamports(Number(betAmount));
    try {
      await program.methods
        .createLobby(new BN(lamports))
        .accounts({
          lobby: lobbyPk,
          master: masterPk,
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
        ref={betRef}
        placeholder="betAmount"
        className="p-2 bg-transparent"
      />
      <button className="bg-blue-500 p-2 rounded-md" onClick={createLobby}>
        create lobby
      </button>
    </div>
  );
};

export default CreateLobby;
