"use client";
import { useRoom } from "@liveblocks/react";
import { useEffect, useState } from "react";

const initKeys = {
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
};
export const useKeyControls = () => {
  const [keys, setKeys] = useState(initKeys);
  const { updatePresence, isPresenceReady } = useRoom();

  const handleKeyup = (e: KeyboardEvent) => {
    if (!isPresenceReady()) return;
    switch (e.key) {
      case "d":
      case "ArrowRight":
        setKeys((prev) => ({ ...prev, d: { pressed: false } }));
        break;
      case "a":
      case "ArrowLeft":
        setKeys((prev) => ({ ...prev, a: { pressed: false } }));
        break;
      case "w":
      case "ArrowUp":
        setKeys((prev) => ({ ...prev, w: { pressed: false } }));
        break;
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (!isPresenceReady()) return;
    switch (e.key) {
      case "d":
      case "ArrowRight":
        setKeys((prev) => ({ ...prev, d: { pressed: true }, lastKey: "d" }));
        break;
      case "a":
      case "ArrowLeft":
        setKeys((prev) => ({ ...prev, a: { pressed: true }, lastKey: "a" }));

        break;
      case "w":
      case "ArrowUp":
        setKeys((prev) => ({ ...prev, w: { pressed: true }, lastKey: "" }));
        keys.w.pressed = true;
        break;
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyup);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyup);
    };
  }, []);

  return keys;
};
