import Game from "@/components/game";
import { Room } from "@/providers/room-provider";

export default function Page() {
  return (
    <Room>
      <Game />
    </Room>
  );
}
