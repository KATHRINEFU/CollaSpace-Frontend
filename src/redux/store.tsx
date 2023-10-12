import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { rootReducer } from "./combinedReducers";
import { environment } from "../types";

export const store = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState,
    devTools: process.env.NODE_ENV !== environment.PRODUCTION,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore["dispatch"];
