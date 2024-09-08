"use client";
import { PROGRAM_ID } from "@/utils/constants";
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { Connection } from "@solana/web3.js";

import IDL from "@/utils/idl.json";
import { useMemo } from "react";

export const useProgram = (
  connection: Connection,
  wallet: Wallet | undefined
) => {
  if (!wallet) {
    return;
  }
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = new Program(IDL as Idl, PROGRAM_ID, provider);
  return program;
};
