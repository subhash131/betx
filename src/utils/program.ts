import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { AnchorProvider, BN, Program } from "@project-serum/anchor";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  SystemProgram,
} from "@solana/web3.js";
import { Idl } from "@project-serum/anchor";

import IDL from "./idl.json";
import { LOBBY_SEED, USER_SEED, MASTER_SEED, PROGRAM_ID } from "./constants";
import { confirmTx } from "./helpers";

export const buyTicket = async (connection: Connection, wallet: Wallet) => {
  const lotteryId = 4;
  const program = getProgram(connection, wallet);
  // const lotteryPk = await getLotteryAddress(lotteryId);
  // const lottery = await program.account.lottery.fetch(lotteryPk);
  // const ticket = await getTicketAddress(lotteryPk, lottery.lastTicketId);
  try {
    // const txHash = await program.methods
    //   .buyTicket(lotteryId)
    //   .accounts({
    //     lottery: lotteryPk,
    //     ticket,
    //     buyer: wallet.publicKey,
    //     systemProgram: SystemProgram.programId,
    //   })
    //   .rpc();
    // const tx = await confirmTx(txHash, connection);
    // console.log("🚀 ~ buyTicket ~ tx:", tx);
  } catch (err) {
    console.log("🚀 ~ buyTicket ~ err:", err);
  }
};

// How to fetch our Program
export const getProgram = (connection: Connection, wallet: Wallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(IDL as Idl, PROGRAM_ID, provider);
  return program;
};

export const getMasterAddress = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MASTER_SEED)],
    PROGRAM_ID
  )[0];
};

export const getLobbyPk = (id: number) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LOBBY_SEED), new BN(id).toArrayLike(Buffer, "le", 4)],
    PROGRAM_ID
  )[0];
};

export const getUserPk = (walletAddress: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(USER_SEED), walletAddress.toBuffer()],
    PROGRAM_ID
  )[0];
};

interface Lottery {
  lastTicketId: number;
  ticketPrice: BN;
}
// Return the lastTicket ID and multiply the ticket price and convert LAMPORTS PER SOL and convert it to String
export const getTotalPrize = (lottery: Lottery) => {
  return new BN(lottery.lastTicketId)
    .mul(lottery.ticketPrice)
    .div(new BN(LAMPORTS_PER_SOL))
    .toString();
};
