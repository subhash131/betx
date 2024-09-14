"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const ioServer = process.env.NEXT_PUBLIC_SERVER;

type RoomContext = {
  socket?: Socket;
};

const Room = createContext<RoomContext>({});

export const useRoom = () => useContext(Room);

const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  const newSocket = useCallback(
    () => io(ioServer || "https://betx.onrender.com"),
    []
  );
  useEffect(() => {
    const soc = newSocket();
    setSocket(soc);
  }, []);
  return <Room.Provider value={{ socket }}>{children}</Room.Provider>;
};

export default RoomProvider;
