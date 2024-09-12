export type Players = {
  [playerId: string]: {
    velocity: Vector;
    isAttacking: boolean;
  };
};

type Vector = {
  x: number;
  y: number;
};
