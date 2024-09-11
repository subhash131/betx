"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/client";

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
        initialStorage={{ players: new LiveMap() }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
