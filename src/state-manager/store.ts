import { combineReducers, configureStore } from "@reduxjs/toolkit";
import LobbyReducer from "./features/lobby";
import UserReducer from "./features/user";
import MasterReducer from "./features/master";

const reducer = combineReducers({ LobbyReducer, UserReducer, MasterReducer });

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
