"use client";
import { store } from "@/state-manager/store";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useMemo } from "react";
import { Provider } from "react-redux";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const network = "devnet";
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <Provider store={store}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            <LiveblocksProvider
              publicApiKey={
                "pk_dev_Bfpq5Ohfbe_SFvf09EBj799KqQMwWbz1S56k4LazSYCJyI-hJkZHZPocXrLokdh5"
              }
            >
              <RoomProvider id="my-room">
                <ClientSideSuspense fallback={<div>Loading…</div>}>
                  {children}
                </ClientSideSuspense>
              </RoomProvider>
            </LiveblocksProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </Provider>
  );
};

export default AppProvider;
