import { configureStore } from "@reduxjs/toolkit";
import { gigsReducer } from "../features/gig";
import { reviewsReducer } from "../features/reviews";

export const store = configureStore({
  reducer: {
    gigs: gigsReducer,
    reviews: reviewsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
