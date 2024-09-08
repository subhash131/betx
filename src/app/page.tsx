import WalletButton from "@/components/wallet-button";
import Username from "@/components/username";
import RegisterUsername from "@/components/register-user";
import CreateLobby from "@/components/create-lobby";
import JoinLobby from "@/components/join-lobby";
import PlaceBet from "@/components/place-bet";

export default function Home() {
  return (
    <div className="flex gap-20">
      <CreateLobby />
      <WalletButton />
      <Username />
      <JoinLobby />
      <PlaceBet />
    </div>
  );
}
