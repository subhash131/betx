export type Players = {
  [playerId: string]: {
    velocity: Vector;
    isAttacking: boolean;
    health: number;
    action: string;
  };
};

type Vector = {
  x: number;
  y: number;
};
