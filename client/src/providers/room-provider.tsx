"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({
  children,
  roomId,
}: {
  children: ReactNode;
  roomId: string;
}) {
  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_dev_Bfpq5Ohfbe_SFvf09EBj799KqQMwWbz1S56k4LazSYCJyI-hJkZHZPocXrLokdh5"
      }
      throttle={16}
    >
      <RoomProvider
        id={roomId}
        autoConnect
        initialPresence={{
          keyControl: {
            lastKey: "",
            a: {
              pressed: false,
            },
            d: {
              pressed: false,
            },
            w: {
              pressed: false,
            },
          },
        }}
        // initialStorage={{
        //   playerOne: {
        //     position: { x: 0, y: 0 },
        //     velocity: { x: 0, y: 0 },
        //     walletAddress: "",
        //   },
        //   playerTwo: {
        //     position: { x: 0, y: 0 },
        //     velocity: { x: 0, y: 0 },
        //     walletAddress: "",
        //   },
        // }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
