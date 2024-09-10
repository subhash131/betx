import { createSlice } from "@reduxjs/toolkit";
import { PublicKey } from "@solana/web3.js";

type LobbyT = {
  lobbyId?: string;
  playerOne?: PublicKey;
  playerTwo?: PublicKey;
  betAmount: number;
  playerOnePlacedBet: boolean;
  playerTwoPlacedBet: boolean;
  winner?: PublicKey;
  isActive: boolean;
};

const initialState: LobbyT = {
  betAmount: 1,
  playerOnePlacedBet: false,
  playerTwoPlacedBet: false,
  isActive: false,
};

const lobby = createSlice({
  name: "lobby",
  initialState,
  reducers: (create) => ({
    updateLobbyId: create.reducer<string | undefined>((state, action) => {
      state.lobbyId = action.payload;
    }),
    updatePlayerOne: create.reducer<PublicKey>((state, action) => {
      state.playerOne = action.payload;
    }),
    updatePlayerTwo: create.reducer<PublicKey>((state, action) => {
      state.playerTwo = action.payload;
    }),
    updateBetAmount: create.reducer<number>((state, action) => {
      state.betAmount = action.payload;
    }),
    updateIsActive: create.reducer<boolean>((state, action) => {
      state.isActive = action.payload;
    }),
    updateWinner: create.reducer<PublicKey>((state, action) => {
      state.winner = action.payload;
    }),
    updatePlayerOnePlacedBet: create.reducer<boolean>((state, action) => {
      state.playerOnePlacedBet = action.payload;
    }),
    updatePlayerTwoPlacedBet: create.reducer<boolean>((state, action) => {
      state.playerTwoPlacedBet = action.payload;
    }),
  }),
});

export const {
  updateLobbyId,
  updateBetAmount,
  updateIsActive,
  updatePlayerOne,
  updatePlayerOnePlacedBet,
  updatePlayerTwo,
  updatePlayerTwoPlacedBet,
  updateWinner,
} = lobby.actions;
export default lobby.reducer;
