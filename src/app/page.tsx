"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";

export default function Home() {
  const endPoint =
    "https://mainnet.helius-rpc.com/?api-key=b6f51962-5102-4fdb-a944-bf09ea5c3c14";

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={endPoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <div className="flex gap-20">
            <WalletMultiButton style={{ backgroundColor: "#3b82f6" }} />
            <button className="bg-blue-500 p-2 rounded-md">
              Connect Wallet
            </button>
            <button className="bg-blue-500 p-2 rounded-md">
              Connect Wallet
            </button>
            <button className="bg-blue-500 p-2 rounded-md">
              Connect Wallet
            </button>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
