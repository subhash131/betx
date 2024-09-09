import { keys } from "./key-controls";

export const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case "d":
    case "ArrowRight":
      keys.d.pressed = true;
      keys.lastKey = "d";
      break;
    case "a":
    case "ArrowLeft":
      keys.a.pressed = true;
      keys.lastKey = "a";
      break;
    case "w":
    case "ArrowUp":
      keys.w.pressed = true;
      break;
  }
};
