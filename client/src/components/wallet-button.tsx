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
        backgroundColor: "#000",
      }}
    />
  );
};

export default WalletButton;
