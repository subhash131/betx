import { keys } from "./key-controls";

export const handleKeyup = (e: KeyboardEvent) => {
  switch (e.key) {
    case "d":
    case "ArrowRight":
      keys.d.pressed = false;
      break;
    case "a":
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
    case "w":
    case "ArrowUp":
      keys.w.pressed = false;
      break;
  }
};
