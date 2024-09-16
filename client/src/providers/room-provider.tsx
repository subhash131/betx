"use client";

import {
  updatePlayerOneId,
  updatePlayerOnePlacedBet,
  updatePlayerOneUsername,
  updatePlayerTwoId,
  updatePlayerTwoPlacedBet,
  updatePlayerTwoUsername,
} from "@/state-manager/features/lobby";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";

const ioServer = process.env.NEXT_PUBLIC_SERVER;

type RoomContext = {
  socket?: Socket;
};

const Room = createContext<RoomContext>({});

export const useRoom = () => useContext(Room);

const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useDispatch();

  const newSocket = useCallback(
    () => io(ioServer || "https://betx.onrender.com"),
    []
  );
  useEffect(() => {
    const soc = newSocket();
    setSocket(soc);
  }, []);
  useEffect(() => {
    socket?.on("updatedLobby", (data) => {
      if (data.playerOneId) {
        dispatch(updatePlayerOneId(data.playerOneId));
      }
      if (data.playerOneUsername) {
        dispatch(updatePlayerOneUsername(data.playerOneUsername));
      }
      if (data.playerOneBetPlaced) {
        dispatch(updatePlayerOnePlacedBet(data.playerOneBetPlaced));
      }
      if (data.playerTwoId) {
        dispatch(updatePlayerTwoId(data.playerTwoId));
      }
      if (data.playerTwoUsername) {
        dispatch(updatePlayerTwoUsername(data.playerTwoUsername));
      }
      if (data.playerTwoBetPlaced) {
        dispatch(updatePlayerTwoPlacedBet(data.playerTwoBetPlaced));
      }
    });
  }, [socket]);
  return <Room.Provider value={{ socket }}>{children}</Room.Provider>;
};

export default RoomProvider;
