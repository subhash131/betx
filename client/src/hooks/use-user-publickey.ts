import { PROGRAM_ID, USER_SEED } from "@/utils/constants";
import { PublicKey } from "@solana/web3.js";

export const useUserPublickey = (walletAddress?: PublicKey | null) => {
  if (!walletAddress) return;
  return PublicKey.findProgramAddressSync(
    [Buffer.from(USER_SEED), walletAddress.toBuffer()],
    PROGRAM_ID
  )[0];
};
