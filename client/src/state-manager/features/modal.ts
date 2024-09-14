import { createSlice } from "@reduxjs/toolkit";

type ModalT = {
  isActive: boolean;
  type: "REGISTER" | null;
};

const initialState: ModalT = {
  isActive: false,
  type: null,
};

const modal = createSlice({
  name: "modal",
  initialState,
  reducers: (create) => ({
    toggleModal: create.reducer<ModalT["type"]>((state, action) => {
      state.isActive = !state.isActive;
      state.type = action.payload;
    }),
  }),
});

export const { toggleModal } = modal.actions;
export default modal.reducer;
