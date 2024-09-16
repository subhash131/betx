import { createSlice } from "@reduxjs/toolkit";

type LobbyT = {
  lobbyId?: string;
  betAmount: number;
  isActive: boolean;
  playerOneId?: string;
  playerOnePlacedBet: boolean;
  playerOneUsername?: string;
  playerTwoId?: string;
  playerTwoPlacedBet: boolean;
  playerTwoUsername?: string;
  winner?: string;
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
    updatePlayerOneId: create.reducer<string>((state, action) => {
      state.playerOneId = action.payload;
    }),
    updatePlayerTwoId: create.reducer<string>((state, action) => {
      state.playerOneId = action.payload;
    }),
    updateBetAmount: create.reducer<number>((state, action) => {
      state.betAmount = action.payload;
    }),
    updateIsActive: create.reducer<boolean>((state, action) => {
      state.isActive = action.payload;
    }),
    updateWinner: create.reducer<string>((state, action) => {
      state.winner = action.payload;
    }),
    updatePlayerOnePlacedBet: create.reducer<boolean>((state, action) => {
      state.playerOnePlacedBet = action.payload;
    }),
    updatePlayerTwoPlacedBet: create.reducer<boolean>((state, action) => {
      state.playerTwoPlacedBet = action.payload;
    }),
    updatePlayerOne: create.reducer<{
      betAmount: number;
      username: string;
      walletAddress: string;
    }>((state, action) => {
      state.playerOneId = action.payload.walletAddress;
      state.playerOneUsername = action.payload.username;
    }),
    updatePlayerTwo: create.reducer<{
      betAmount: number;
      username: string;
      walletAddress: string;
    }>((state, action) => {
      state.playerTwoId = action.payload.walletAddress;
      state.playerTwoUsername = action.payload.username;
    }),
    updatePlayerOneUsername: create.reducer<{
      username: string;
    }>((state, action) => {
      state.playerOneUsername = action.payload.username;
    }),
    updatePlayerTwoUsername: create.reducer<{
      username: string;
    }>((state, action) => {
      state.playerTwoUsername = action.payload.username;
    }),
  }),
});

export const {
  updateLobbyId,
  updateBetAmount,
  updateIsActive,
  updatePlayerOneId,
  updatePlayerOnePlacedBet,
  updatePlayerTwoId,
  updatePlayerTwoPlacedBet,
  updateWinner,
  updatePlayerOne,
  updatePlayerTwo,
  updatePlayerOneUsername,
  updatePlayerTwoUsername,
} = lobby.actions;
export default lobby.reducer;
