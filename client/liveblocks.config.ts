// Define Liveblocks types for your application

import { Position, Velocity } from "@/classes/types";
import { LiveMap, LiveObject } from "@liveblocks/client";

// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      //   velocity: Velocity;
      //   position: Position;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Example, a conflict-free list
      // animals: LiveList<string>;
      //   playerOne: {
      //     velocity: Velocity;
      //     position: Position;
      //     walletAddress: string;
      //   };
      //   playerTwo: {
      //     walletAddress: string;
      //   };
      players: LiveMap<string, { position: Position; velocity: Velocity }>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // Example properties, for useSelf, useUser, useOthers, etc.
        name?: string;
        walletAddress?: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {  };
