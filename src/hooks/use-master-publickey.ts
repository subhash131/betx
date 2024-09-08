import { MASTER_SEED, PROGRAM_ID } from "@/utils/constants";
import { PublicKey } from "@solana/web3.js";

export const useMasterPublickey = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MASTER_SEED)],
    PROGRAM_ID
  )[0];
};
