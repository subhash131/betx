export type Players = {
  [playerId: string]: {
    velocity: Vector;
    isAttacking: boolean;
    health: number;
  };
};

type Vector = {
  x: number;
  y: number;
};
