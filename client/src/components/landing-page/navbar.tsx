import dynamic from "next/dynamic";
import React from "react";

const WalletButton = dynamic(() => import("@/components/wallet-button"));
const Username = dynamic(() => import("@/components/username"));

const Navbar = () => {
  return (
    <div className="w-full h-20 font-semibold px-36 flex justify-between items-center fixed top-0 z-50">
      <div className="w-full flex gap-4 items-center justify-start h-full">
        <div className="size-5 rounded-full bg-black" />
        <h1 className="font-bold text-xl">BetX</h1>
      </div>
      <ul className="w-full flex list-none gap-8 items-center justify-center h-full">
        <li>Home</li>
        <li>Deck</li>
        <li>About</li>
      </ul>
      <div className="w-full h-full flex items-center justify-end gap-4">
        <WalletButton />
        <Username />
      </div>
    </div>
  );
};

export default Navbar;
