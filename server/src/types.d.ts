export type Lobby = {
  [lobbyId: string]: {
    playerOneId?: string;
    playerOneUsername?: string;
    playerOneBetPlaced?: boolean;
    playerTwoId?: string;
    playerTwoUsername?: string;
    playerTwoBetPlaced?: boolean;
    betAmount?: number;
  };
};

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
