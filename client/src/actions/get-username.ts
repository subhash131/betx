import { AnchorError, type Idl, type Program } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";

export const getUsername = async ({
  wallet,
  userPublickey,
  program,
}: {
  wallet: AnchorWallet;
  userPublickey: PublicKey;
  program: Program<Idl>;
}) => {
  // todo::
  try {
    const user = await program.account.userProfile.fetch(userPublickey);
    if (!user) {
      return;
    }
    // dispatch(setUsername(user.userName));
  } catch (err) {
    if (err instanceof AnchorError) {
      toast.error(err.error.errorMessage);
    } else {
      console.log("🚀 ~ createLobby ~ err:", err);
    }
  }
};
