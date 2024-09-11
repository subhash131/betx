// "use client";

// import { useAnchorWallet } from "@solana/wallet-adapter-react";
// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { io } from "socket.io-client";
// export type Players = {
//   [playerId: string]: {
//     velocity: Vector;
//   };
// };

// const initKeys = {
//   lastKey: "",
//   a: {
//     pressed: false,
//   },
//   d: {
//     pressed: false,
//   },
//   w: {
//     pressed: false,
//   },
// };

// type Vector = {
//   x: number;
//   y: number;
// };

// type ContextType = {
//   players?: Players;
//   setKeys: React.Dispatch<React.SetStateAction<typeof initKeys>>;
// };

// const RoomContext = createContext<ContextType>({
//   players: {},
//   setKeys: () => {},
// });
// export const useRoom = () => useContext(RoomContext);

// export function Room({ children }: { children: ReactNode }) {
//   // const [walletAdd, setWalletAdd] = useState<string>();
//   // const [players, setPlayers] = useState<Players>({});
//   const wallet = useAnchorWallet();
//   // const newSocket = useMemo(() => io("http://localhost:8000"), [wallet]);

//   const [keys, setKeys] = useState(initKeys);

//   const handleKeydown = (e: KeyboardEvent) => {
//     switch (e.key) {
//       case "d":
//       case "ArrowRight":
//         setKeys((prev) => ({ ...prev, d: { pressed: true }, lastKey: "d" }));
//         break;
//       case "a":
//       case "ArrowLeft":
//         setKeys((prev) => ({ ...prev, a: { pressed: true }, lastKey: "a" }));

//         break;
//       case "w":
//       case "ArrowUp":
//         setKeys((prev) => ({ ...prev, w: { pressed: true }, lastKey: "w" }));
//         break;
//     }
//   };
//   const handleKeyup = (e: KeyboardEvent) => {
//     switch (e.key) {
//       case "d":
//       case "ArrowRight":
//         setKeys((prev) => ({ ...prev, d: { pressed: false } }));
//         break;
//       case "a":
//       case "ArrowLeft":
//         setKeys((prev) => ({ ...prev, a: { pressed: false } }));
//         break;
//       case "w":
//       case "ArrowUp":
//         setKeys((prev) => ({ ...prev, w: { pressed: false } }));
//         break;
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("keydown", handleKeydown);
//     document.addEventListener("keyup", handleKeyup);
//     return () => {
//       document.removeEventListener("keydown", handleKeydown);
//       document.removeEventListener("keyup", handleKeyup);
//     };
//   });

//   // useEffect(() => {
//   //   console.log(keys);
//   //   if (keys.a.pressed) {
//   //     newSocket?.emit("keyControl", { walletAdd, key: "a" });
//   //   } else if (keys.d.pressed) {
//   //     newSocket?.emit("keyControl", { walletAdd, key: "d" });
//   //   } else {
//   //     newSocket?.emit("keyControl", { walletAdd, key: "" });
//   //   }
//   // }, [keys]);

//   // useEffect(() => {
//   //   if (!wallet?.publicKey) {
//   //     return;
//   //   }
//   //   setWalletAdd(wallet.publicKey.toString());
//   //   newSocket.emit("walletConnect", wallet.publicKey.toString());

//   //   newSocket.on("updatePlayers", (_players) => {
//   //     for (const key in _players) {
//   //       setPlayers((prev) => ({ ...prev, key: _players[key] }));
//   //     }

//   //     for (const key in players) {
//   //       if (!_players[key]) {
//   //         const filteredP = players;
//   //         delete filteredP[key];
//   //         setPlayers(filteredP);
//   //       }
//   //     }
//   //     console.log("🚀 ~ newSocket.on ~ _players:", _players);
//   //     console.log("🚀 ~ updatePlayers:", players);
//   //   });

//   //   newSocket.on("disconnect", (reason) => {
//   //     console.log("Disconnected from server, reason:", reason);
//   //   });

//   //   return () => {
//   //     newSocket.disconnect();
//   //     newSocket.emit("walletDisconnect", walletAdd);
//   //   };
//   // }, [wallet?.publicKey]);

//   return (
//     <RoomContext.Provider value={{ setKeys }}>{children}</RoomContext.Provider>
//   );
// }
