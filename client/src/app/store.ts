import { configureStore } from "@reduxjs/toolkit";
import { gigsReducer } from "../features/gig";

export const store = configureStore({
  reducer: {
    gigs: gigsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
