import { configureStore } from "@reduxjs/toolkit";
import { gigsReducer } from "../features/gig";
import { reviewsReducer } from "../features/reviews";
import { jobsReducer } from "../features/job";

export const store = configureStore({
  reducer: {
    gigs: gigsReducer,
    reviews: reviewsReducer,
    jobs: jobsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
