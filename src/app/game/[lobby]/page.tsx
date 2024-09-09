import Game from "@/components/game";
import { Room } from "@/providers/room-provider";

export default function Page({
  params: { lobby },
}: {
  params: { lobby: string };
}) {
  return (
    <Room roomId={lobby}>
      <Game />
    </Room>
  );
}
