import { createSlice } from "@reduxjs/toolkit";
import { PublicKey } from "@solana/web3.js";

export type MasterT = {
  lastLobbyId?: string;
  userCount?: string;
  owner?: PublicKey;
};

const initialState: MasterT = {};

const master = createSlice({
  name: "master",
  initialState,
  reducers: (create) => ({
    setLastLobbyId: create.reducer<string | undefined>((state, action) => {
      state.lastLobbyId = action.payload;
    }),
    setUserCount: create.reducer<string | undefined>((state, action) => {
      state.userCount = action.payload;
    }),
    setMasterWallet: create.reducer<PublicKey | undefined>((state, action) => {
      state.owner = action.payload;
    }),
  }),
});

export const { setLastLobbyId, setMasterWallet, setUserCount } = master.actions;
export default master.reducer;
