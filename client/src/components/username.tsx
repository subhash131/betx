"use client";
import { useUserPublickey } from "@/hooks/use-user-publickey";
import { setUsername } from "@/state-manager/features/user";
import { RootState } from "@/state-manager/store";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RegisterUser from "./register-button";
import { useProgram } from "@/hooks/use-program";
import { AnchorError } from "@project-serum/anchor";
import { toast } from "sonner";

const Username = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const dispatch = useDispatch();
  const { username } = useSelector((state: RootState) => state.UserReducer);
  const userPk = useUserPublickey(wallet?.publicKey);
  const program = useProgram(connection, wallet);

  const getUsername = async () => {
    if (!userPk || !wallet) {
      dispatch(setUsername(""));
      console.log("🚀 ~ getUsername ~ wallet:", wallet);
      return;
    }

    try {
      const user = await program?.account.userProfile.fetch(userPk);
      if (!user) {
        return;
      }
      dispatch(setUsername(user.userName));
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        console.log("🚀 ~ username ~ err:", err);
      }
    }
  };

  useEffect(() => {
    if (!wallet?.publicKey) {
      console.log("🚀 ~ Username ~ wallet:", wallet);
      dispatch(setUsername(""));
    }
  }, [wallet?.publicKey]);

  useEffect(() => {
    if (wallet?.publicKey) {
      getUsername();
    }
  }, [wallet?.publicKey]);

  if (!wallet?.publicKey) return;
  return (
    <>
      {username ? (
        <div className="text-white bg-blue-400 p-2 rounded-md">{username}</div>
      ) : (
        <RegisterUser />
      )}
    </>
  );
};

export default Username;
