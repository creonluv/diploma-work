import { configureStore } from "@reduxjs/toolkit";
import { gigsReducer } from "../features/gig";
import { reviewsReducer } from "../features/reviews";
import { jobsReducer } from "../features/job";
import { profileReducer } from "../features/profile";
import { bidsReducer } from "../features/bids";

export const store = configureStore({
  reducer: {
    gigs: gigsReducer,
    reviews: reviewsReducer,
    jobs: jobsReducer,
    profile: profileReducer,
    bids: bidsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
