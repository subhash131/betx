"use client";

import { Connection, PublicKey } from "@solana/web3.js";

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
export const LamportsToSol = (lamports: number) => {
  return lamports / 1_000_000_000;
};

export const confirmTx = async (txHash: string, connection: Connection) => {
  const blockhashInfo = await connection.getLatestBlockhash();
  return await connection.confirmTransaction({
    blockhash: blockhashInfo.blockhash,
    lastValidBlockHeight: blockhashInfo.lastValidBlockHeight,
    signature: txHash,
  });
};
