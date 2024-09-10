import { LOBBY_SEED, PROGRAM_ID } from "@/utils/constants";
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export const useLobbyPublicKey = (id: number) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LOBBY_SEED), new BN(id).toArrayLike(Buffer, "le", 4)],
    PROGRAM_ID
  )[0];
};
