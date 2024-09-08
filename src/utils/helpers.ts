"use client";
import { RootState } from "@/state-manager/store";
import { BN } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSelector } from "react-redux";

export const mockWallet = () => {
  return {};
};

export const shortenPk = (pk: PublicKey, chars = 5) => {
  const pkStr = typeof pk === "object" ? pk.toBase58() : pk;
  return `${pkStr.slice(0, chars)}...${pkStr.slice(-chars)}`;
};

export const solToLamports = (sol: number) => {
  return sol * 1_000_000_000;
};

export const confirmTx = async (txHash: string, connection: Connection) => {
  const blockhashInfo = await connection.getLatestBlockhash();
  return await connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  });
};
