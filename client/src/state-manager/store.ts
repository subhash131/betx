import { combineReducers, configureStore } from "@reduxjs/toolkit";
import LobbyReducer from "./features/lobby";
import UserReducer from "./features/user";
import MasterReducer from "./features/master";
import ModalReducer from "./features/modal";

const reducer = combineReducers({
  LobbyReducer,
  UserReducer,
  MasterReducer,
  ModalReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
