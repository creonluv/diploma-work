import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Profile } from "../types/Profile";
import { getProfile } from "../api/profile";

export type ProfileState = {
  profile: Profile | null;
  loading: boolean;
  error: string;
};

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: "",
};

export const fetchProfileAsync = createAsyncThunk(
  "products/fetchProfileAsync",
  async (id: string) => {
    const data = await getProfile(id);
    return data;
  }
);

export const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        fetchProfileAsync.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.profile = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load gigs";
      });
  },
});

export const { reducer: profileReducer } = ProfileSlice;
