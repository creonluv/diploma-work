import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Bid, BidInput } from "../types/Bid";
import { createBid, getBids } from "../api/bids";

export type BidsState = {
  bids: Bid[] | null;
  loading: boolean;
  error: string;
};

const initialState: BidsState = {
  bids: null,
  loading: false,
  error: "",
};

export const fetchBidsForJob = createAsyncThunk(
  "gigs/fetchBidsForJob",
  async (jobId: string | undefined, { rejectWithValue }) => {
    try {
      const bids = await getBids(jobId);

      return bids;
    } catch (error) {
      return rejectWithValue("Something went wrong!");
    }
  }
);

export const addBidToJob = createAsyncThunk(
  "jobs/addBidToJob",
  async (
    { id, data }: { id: string | undefined; data: BidInput },
    { rejectWithValue }
  ) => {
    try {
      const bid = await createBid(id, data);
      return bid;
    } catch (error) {
      return rejectWithValue("Something went wrong!");
    }
  }
);

export const BidsSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBidsForJob.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchBidsForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.bids = action.payload;
      })
      .addCase(fetchBidsForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBidToJob.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addBidToJob.fulfilled, (state, action) => {
        state.loading = false;
        if (state.bids) {
          state.bids.push(action.payload);
        } else {
          state.bids = [action.payload];
        }
      })
      .addCase(addBidToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { reducer: bidsReducer } = BidsSlice;
