export type Player = {
  [playerId: string]: {
    position: Vector;
    velocity: Vector;
  };
};

type Vector = {
  x: number;
  y: number;
};
