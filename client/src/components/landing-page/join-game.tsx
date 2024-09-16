"use client";
import { useLobbyPublicKey } from "@/hooks/use-lobby-publickey";
import { useProgram } from "@/hooks/use-program";
import { useUserPublickey } from "@/hooks/use-user-publickey";
import { useRoom } from "@/providers/room-provider";
import { toggleModal } from "@/state-manager/features/modal";
import { RootState } from "@/state-manager/store";
import { LamportsToSol } from "@/utils/helpers";
import { AnchorError, BN } from "@project-serum/anchor";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SendTransactionError,
  SystemProgram,
} from "@solana/web3.js";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type Lobby = {
  id: number;
  playerOne: string;
  playerTwo: string;
  betAmount: number;
  isActive: boolean;
  winner: null | string;
  claimed: boolean;
  playerOnePlacedBet: boolean;
  playerTwoPlacedBet: boolean;
  playerOneUsername: string;
};

const JoinGame = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { username } = useSelector((state: RootState) => state.UserReducer);
  const { socket } = useRoom();
  const dispatch = useDispatch();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const program = useProgram(connection, wallet);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedLobby, setSearchedLobby] = useState<Lobby>();
  const [betPlaced, setBetPlaced] = useState<boolean>();
  const [joinedGame, setJoinedGame] = useState<boolean>();

  const closeModal = () => {
    dispatch(toggleModal(null));
  };
  const getUsername = async ({ userId }: { userId: string }) => {
    const parsedUserId = new PublicKey(userId);
    const userPk = useUserPublickey(parsedUserId);
    if (!userPk || !wallet) {
      console.log("🚀 ~ getUsername ~ wallet:", wallet);
      return;
    }

    try {
      const user = await program?.account.userProfile.fetch(userPk);
      if (!user) {
        return;
      }
      return user.userName;
    } catch (err) {
      if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        console.log("🚀 ~ username ~ err:", err);
      }
    }
  };

  const joinGame = async () => {
    const lobbyPk = inputRef.current?.value;
    if (!program) {
      toast.error("Failed to connect, please refresh the page");
      return;
    }
    if (!wallet) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      setLoading(true);
      const res = await program.methods
        .joinLobby(new BN(searchedLobby?.id))
        .accounts({
          lobby: lobbyPk,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      if (res) {
        socket?.emit("join-game", {
          id: lobbyPk,
          player: wallet.publicKey,
          username,
        });
        setJoinedGame(true);
      }
    } catch (err) {
      if (err instanceof WalletSignTransactionError) {
        toast.error(err.message);
      } else if (err instanceof SendTransactionError) {
        toast.error(err.transactionError.message);
      } else if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        console.log("🚀 ~ Join Game ~ err:", err);
      }
    }
    setLoading(false);
  };

  const searchLobby = async () => {
    const lobbyPk = inputRef.current?.value;
    if (!lobbyPk) {
      toast.error("Enter the lobby id");
      return;
    }

    try {
      setLoading(true);
      const res = await program?.account.lobby.fetch(lobbyPk);
      console.log("🚀 ~ searchLobby ~ res:", res);
      if (res) {
        const {
          isActive,
          id,
          playerOne,
          playerTwo,
          betAmount,
          winner,
          claimed,
          playerOnePlacedBet,
          playerTwoPlacedBet,
        } = res;

        if (!isActive) {
          toast.error("Not an active lobby");
          return;
        }
        if (playerTwo && playerTwo.toString()) {
          setJoinedGame(true);
        }
        if (playerTwoPlacedBet) {
          setBetPlaced(true);
        }
        if (playerTwo && playerTwo.toString() && playerTwoPlacedBet) {
          socket?.emit("join-game", {
            id: lobbyPk,
            player: wallet?.publicKey,
            username,
          });
        }

        if (playerOne.toString() === wallet?.publicKey.toString()) {
          toast.error(
            "Attempt to join as player 2 by player 1..!! Try again with a different wallet"
          );
          setLoading(false);
          return;
        }

        const user = await getUsername({ userId: playerOne.toString() });
        console.log("🚀 ~ searchLobby ~ user:", user);

        setSearchedLobby({
          isActive,
          id,
          playerOne: playerOne.toString(),
          playerTwo: playerOne.toString(),
          betAmount,
          winner,
          claimed,
          playerOnePlacedBet,
          playerTwoPlacedBet,
          playerOneUsername: user,
        });
      } else {
        toast.error("Lobby not found!!");
        return;
      }
    } catch (err) {
      if (err instanceof WalletSignTransactionError) {
        toast.error(err.message);
      } else if (err instanceof SendTransactionError) {
        toast.error(err.transactionError.message);
      } else if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        console.log("🚀 ~ Join Game ~ err:", err);
      }
    }
    setLoading(false);
  };

  const placeBet = async () => {
    if (!wallet?.publicKey) {
      toast.error("Please connect your wallet!");
      return;
    }

    if (!program) {
      toast.error("Failed to connect, please refresh the page");
      return;
    }

    const lobbyPk = useLobbyPublicKey(Number(searchedLobby?.id));

    try {
      setLoading(true);
      const res = await program.methods
        .placeBet(new BN(searchedLobby?.id))
        .accounts({
          lobby: lobbyPk,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      if (res) {
        console.log("🚀 ~ placeBet ~ res:", res);
        setBetPlaced(true);
      }
    } catch (err) {
      if (err instanceof WalletSignTransactionError) {
        toast.error(err.message);
      } else if (err instanceof SendTransactionError) {
        toast.error(err.transactionError.message);
      } else if (err instanceof AnchorError) {
        toast.error(err.error.errorMessage);
      } else {
        console.log("🚀 ~ Join Game ~ err:", err);
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="w-96 h-fit rounded-xl bg-[#181818] overflow-hidden relative font-semibold"
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
        <h3 className="text-xl ">Join Game</h3>
        <div className="w-full flex flex-col items-center justify-center gap-4 px-10">
          <h4 className="text-start">Enter Lobby id</h4>
          <input
            className="outline-none px-4 py-2 border rounded-lg bg-transparent"
            placeholder="lobby id"
            autoFocus
            ref={inputRef}
          />
        </div>
        {searchedLobby ? (
          <div className="font-semibold flex flex-col gap-2 mt-4">
            <h6>Game started by:</h6>
            <div className="h-fit py-2 px-4 rounded-lg flex-col bg-[#282828] w-full flex items-start justify-center">
              <p>{searchedLobby.playerOneUsername}</p>
              <p className="text-xs">
                {searchedLobby.playerOne.toString().substring(0, 14)}
                ....
                {searchedLobby.playerOne
                  .toString()
                  .substring(
                    searchedLobby.playerOne.toString().length - 4,
                    searchedLobby.playerOne.toString().length
                  )}
              </p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={searchLobby}
            className="bg-white rounded-xl px-4 py-2 text-black"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        )}
        {searchedLobby && !joinedGame && (
          <button
            type="button"
            className="px-4 py-1 bg-white rounded-lg text-black hover:scale-95 active:scale-90 transition-transform disabled:scale-100"
            onClick={joinGame}
            disabled={loading}
          >
            Join
          </button>
        )}
        {searchedLobby?.betAmount && joinedGame && (
          <div className="flex flex-col gap-2">
            <h6>Bet Amount</h6>
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-fit py-2 px-4 rounded-lg bg-[#282828] flex items-center justify-center text-xs text-nowrap disabled:cursor-default text-white border">
                {LamportsToSol(Number(searchedLobby.betAmount.toString()))} SOL
              </div>
              <button
                className="bg-white px-4 py-2 rounded-lg text-black text-xs hover:scale-95 active:scale-90 transition-transform disabled:scale-100"
                type="button"
                disabled={betPlaced}
                onClick={placeBet}
              >
                {betPlaced ? (
                  <div className="text-nowrap flex items-center">
                    Bet Placed
                    <span className="ml-2">
                      <FaCheckCircle />
                    </span>
                  </div>
                ) : loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Place Bet"
                )}
              </button>
            </div>
          </div>
        )}
        {betPlaced && (
          <Link
            href={`/game/${inputRef.current?.value}`}
            className="bg-white px-4 py-2 rounded-xl text-black mt-6"
            onClick={() => {
              dispatch(toggleModal(null));
            }}
          >
            Start Game
          </Link>
        )}
      </form>
    </div>
  );
};

export default JoinGame;
