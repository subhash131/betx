export type Players = {
  [playerId: string]: {
    velocity: Vector;
    position: Vector;
  };
};

type Vector = {
  x: number;
  y: number;
};
