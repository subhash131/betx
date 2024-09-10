import { createSlice } from "@reduxjs/toolkit";
import { PublicKey } from "@solana/web3.js";

type UserT = {
  username: string | undefined;
};

const initialState: UserT = {
  username: undefined,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: (create) => ({
    setUsername: create.reducer<string>((state, action) => {
      state.username = action.payload;
    }),
  }),
});

export const { setUsername } = user.actions;
export default user.reducer;
