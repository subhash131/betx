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
    imageSrc: "/samuraiMack/Attack2.png",
    framesMax: 6,
  },
  jump: {
    imageSrc: "/samuraiMack/Jump.png",
    framesMax: 2,
  },
  takeHit: {
    imageSrc: "/samuraiMack/TakeHitWhite.png",
    framesMax: 4,
  },
  death: {
    imageSrc: "/samuraiMack/Death.png",
    framesMax: 6,
  },
};
export const kenjiSPrites = {
  idle: {
    imageSrc: "/kenji/Idle.png",
    framesMax: 4,
  },
  run: {
    imageSrc: "/kenji/Run.png",
    framesMax: 8,
  },
  attack1: {
    imageSrc: "/kenji/Attack1.png",
    framesMax: 4,
  },
  jump: {
    imageSrc: "/kenji/Jump.png",
    framesMax: 2,
  },
  takeHit: {
    imageSrc: "/kenji/TakeHit.png",
    framesMax: 3,
  },
  death: {
    imageSrc: "/kenji/Death.png",
    framesMax: 7,
  },
};
