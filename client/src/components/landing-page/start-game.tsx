"use client";
import { toggleModal } from "@/state-manager/features/modal";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useMasterPublickey } from "@/hooks/use-master-publickey";
import { useProgram } from "@/hooks/use-program";
import { AnchorError, BN } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SendTransactionError,
  SystemProgram,
} from "@solana/web3.js";
import { toast } from "sonner";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { useLobbyPublicKey } from "@/hooks/use-lobby-publickey";
import { solToLamports } from "@/utils/helpers";
import { MasterT } from "@/state-manager/features/master";
import { BsCopy } from "react-icons/bs";
import { useRoom } from "@/providers/room-provider";
import { RootState } from "@/state-manager/store";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { updateLobbyId } from "@/state-manager/features/lobby";

const StartGame = () => {
  const { socket } = useRoom();
  const [lastLobbyId, setLastLobbyId] = useState<string>();
  const [betAmount, setBetAmount] = useState<"5" | "1">("1");
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const program = useProgram(connection, wallet);
  const masterPk = useMasterPublickey();
  const [loading, setLoading] = useState(false);
  const [lobbyCreated, setLobbyCreate] = useState<boolean>(false);
  const [currentLobbyId, setCurrentLobbyId] = useState<PublicKey>();
  const [lobbyIdCopied, setLobbyIdCopied] = useState<boolean>(false);

  const { username } = useSelector((state: RootState) => state.UserReducer);

  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(toggleModal(null));
  };

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

  const createLobby = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
    }

    const lobbyPk = useLobbyPublicKey(Number(lastLobbyId) + 1);

    const lamports = solToLamports(Number(betAmount));
    try {
      setLoading(true);
      setCurrentLobbyId(lobbyPk);
      const res = await program.methods
        .createLobby(new BN(lamports))
        .accounts({
          lobby: lobbyPk,
          master: masterPk,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      if (res) {
        socket?.emit("start-game", {
          id: lobbyPk,
          betAmount,
          playerOneId: wallet.publicKey.toString(),
          playerOneUsername: username,
        });
        dispatch(updateLobbyId(lobbyPk.toString()));
        console.log("🚀 ~ createLobby ~ res:", res);
        toast.success("Lobby created, waiting for others to join");
        setLobbyCreate(true);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      if (err instanceof WalletSignTransactionError) {
        toast.error(err.message);
      } else if (err instanceof SendTransactionError) {
        toast.error(err.transactionError.message);
      } else if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        console.log("🚀 ~ createLobby ~ err:", err);
      }
    }
  };

  useEffect(() => {
    getMaster();
  }, [program]);

  return (
    <div
      className="w-96 h-fit rounded-xl bg-[#181818] overflow-hidden relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="w-full h-fit absolute flex justify-end pt-2 pr-2">
        <button
          className="size-10  bg-[#282828] rounded-full flex items-center justify-center group hover:bg-[#383838] transition-colors"
          onClick={closeModal}
        >
          <IoClose
            size={28}
            className="text-gray-300 group-hover:text-white transition-colors"
          />
        </button>
      </div>
      <form className="size-full flex items-center  flex-col gap-4 py-16">
        <h3 className="text-xl font-semibold">Start Game</h3>
        <div className="w-full flex flex-col items-center justify-center gap-4 px-10">
          <h4 className="font-semibold">
            {lobbyCreated ? "Bet amount" : "Select bet amount"}
          </h4>
          <div className="flex gap-4 text-black font-semibold">
            <button
              type="button"
              className="relative w-fit py-2 px-4 rounded-lg bg-white flex items-center justify-center text-xs cursor-pointer text-nowrap disabled:cursor-default"
              onClick={() => {
                setBetAmount("1");
              }}
              disabled={lobbyCreated}
            >
              1 SOL
              {betAmount === "1" && (
                <span className="ml-2">
                  <FaCheckCircle />
                </span>
              )}
            </button>
            <button
              type="button"
              className="relative w-fit py-2 px-4 rounded-lg bg-white flex items-center justify-center text-xs cursor-pointer text-nowrap disabled:cursor-default"
              onClick={() => {
                setBetAmount("5");
              }}
              disabled={lobbyCreated}
            >
              5 SOL{" "}
              {betAmount === "5" && (
                <span className="ml-2">
                  <FaCheckCircle />
                </span>
              )}
            </button>
          </div>
          {lobbyCreated && currentLobbyId ? (
            <div className="font-semibold">
              <p className="text-xs">Share Lobby ID</p>
              <div className="flex gap-2">
                <div className="px-4 py-2 border rounded-lg">
                  {currentLobbyId.toString().substring(0, 14)}
                  ....
                  {currentLobbyId
                    .toString()
                    .substring(
                      currentLobbyId.toString().length - 4,
                      currentLobbyId.toString().length
                    )}
                </div>
                <button
                  type="button"
                  className="py-2 px-3 border rounded-lg flex-shrink-0 flex items-center justify-center"
                  onClick={() => {
                    navigator.clipboard.writeText(currentLobbyId.toString());
                    setLobbyIdCopied(true);
                  }}
                >
                  {lobbyIdCopied ? <FaCheck /> : <BsCopy />}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="bg-white px-6 text-xs font-semibold py-2 rounded-lg text-black w-fit hover:scale-95 active:scale-90 transition-transform disabled:bg-gray-200 disabled:scale-100"
              onClick={createLobby}
              disabled={loading}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Confirm"
              )}
            </button>
          )}
          {lobbyCreated && (
            <div className="font-semibold flex flex-col gap-2 mt-4">
              <h6>Waiting for Players join..!</h6>
              <div className="h-fit py-2 px-4 rounded-lg flex-col bg-[#282828] w-full flex items-start justify-center">
                <p>name</p>
                <p className="text-xs">asnamxksm</p>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default StartGame;
