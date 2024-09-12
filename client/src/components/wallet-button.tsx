"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";

const WalletButton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WalletMultiButton
      style={{
        backgroundColor: "#3b82f6",
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default WalletButton;
