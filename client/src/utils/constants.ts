import { PublicKey } from "@solana/web3.js";

export const MASTER_SEED = "master";
export const LOBBY_SEED = "lobby";
export const USER_SEED = "user";

export const PROGRAM_ID = new PublicKey(
  "DfDwFTWM6f99KRBYEWxShUsbXgJ4K1NR9KbSNWvQVu4H"
);

export const samuraiSPrites = {
  idle: {
    imageSrc: "/samuraiMack/Idle.png",
    framesMax: 8,
  },
  run: {
    imageSrc: "/samuraiMack/Run.png",
    framesMax: 8,
  },
  attack1: {
    imageSrc: "/samuraiMack/Attack1.png",
    framesMax: 8,
  },
};
