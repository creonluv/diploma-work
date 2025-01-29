import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReviewData, ReviewType } from "../types/Review";
import { addReview, getReviewsForGig } from "../api/review";

export type ReviewsState = {
  reviewsForGig: ReviewType[] | null;
  loading: boolean;
  error: string;
};

const initialState: ReviewsState = {
  reviewsForGig: null,
  loading: false,
  error: "",
};

export const fetchReviewsForGig = createAsyncThunk(
  "gigs/fetchReviewsForGig",
  async (gigId: string | undefined, { rejectWithValue }) => {
    try {
      const reviews = await getReviewsForGig(gigId);
      return reviews;
    } catch (error) {
      return rejectWithValue("Something went wrong!");
    }
  }
);

export const addReviewToGig = createAsyncThunk(
  "gigs/addReviewToGig",
  async (data: ReviewData, { rejectWithValue }) => {
    try {
      const review = await addReview(data);

      return review;
    } catch (error) {
      return rejectWithValue("Something went wrong!");
    }
  }
);

export const ReviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsForGig.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchReviewsForGig.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewsForGig = action.payload;
      })
      .addCase(fetchReviewsForGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addReviewToGig.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addReviewToGig.fulfilled, (state, action) => {
        state.loading = false;

        if (state.reviewsForGig) {
          state.reviewsForGig.push(action.payload);
        } else {
          state.reviewsForGig = [action.payload];
        }
      })
      .addCase(addReviewToGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reducer: reviewsReducer } = ReviewsSlice;
