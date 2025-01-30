import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Gig, GigInput, ResponseGig } from "../types/Gig";
import {
  addPhotosToGig,
  createGig,
  deleteGig,
  getGig,
  getGigByUser,
  getGigs,
  updateGig,
} from "../api/gigs";

export type GigState = {
  gigs: Gig[] | null;
  gig: Gig | null;
  gigsByUser: Gig[] | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string;
};

const initialState: GigState = {
  gigs: null,
  gig: null,
  gigsByUser: null,
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: "",
};

export const fetchGigs = createAsyncThunk(
  "products/fetchGigs",
  async (filters: Record<string, string>) => {
    const data = await getGigs(filters);
    return data;
  }
);

export const fetchGig = createAsyncThunk(
  "products/fetchGig",
  async (id: string) => {
    const data = await getGig(id);

    return data;
  }
);

export const createGigAsync = createAsyncThunk<Gig, GigInput>(
  "gigs/createGig",
  async (data: GigInput, { rejectWithValue }) => {
    try {
      const response = await createGig(data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create gig");
    }
  }
);

export const updateGigAsync = createAsyncThunk(
  "gigs/updateGig",
  async (
    { id, dataToUpdate }: { id: string; dataToUpdate: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateGig(id, dataToUpdate);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update gig");
    }
  }
);

export const deleteGigAsync = createAsyncThunk(
  "gigs/deleteGig",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteGig(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete gig");
    }
  }
);

export const addPhotosToGigAsync = createAsyncThunk(
  "gigs/addPhotosToGig",
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await addPhotosToGig(id, data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchGigsByUser = createAsyncThunk(
  "gigs/fetchGigsByUser",
  async () => {
    const data = await getGigByUser();

    return data;
  }
);

export const GigsSlice = createSlice({
  name: "gigs",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        fetchGigs.fulfilled,
        (state, action: PayloadAction<ResponseGig>) => {
          state.gigs = action.payload.gigs;
          state.loading = false;
        }
      )
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load gigs";
      })
      .addCase(fetchGig.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchGig.fulfilled, (state, action: PayloadAction<Gig>) => {
        state.gig = action.payload;
        state.loading = false;
      })
      .addCase(fetchGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load gigs";
      })
      .addCase(createGigAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        createGigAsync.fulfilled,
        (state, action: PayloadAction<Gig>) => {
          state.loading = false;
          state.gigs = state.gigs
            ? [...state.gigs, action.payload]
            : [action.payload];
        }
      )
      .addCase(createGigAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create gig";
      })
      .addCase(updateGigAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        updateGigAsync.fulfilled,
        (state, action: PayloadAction<Gig>) => {
          if (state.gigs) {
            const updatedGig = action.payload;
            state.gigs = state.gigs.map((gig) =>
              gig._id === updatedGig._id ? updatedGig : gig
            );
          }
          state.loading = false;
        }
      )
      .addCase(updateGigAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update gig";
      })
      .addCase(deleteGigAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        deleteGigAsync.fulfilled,
        (state, action: PayloadAction<string>) => {
          if (state.gigs) {
            state.gigs = state.gigs.filter((gig) => gig._id !== action.payload);
          }
          state.loading = false;
        }
      )
      .addCase(deleteGigAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete gig";
      })
      .addCase(addPhotosToGigAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        addPhotosToGigAsync.fulfilled,
        (state, action: PayloadAction<Gig>) => {
          const updatedGig = action.payload;
          if (state.gigs && Array.isArray(state.gigs)) {
            const gigIndex = state.gigs.findIndex(
              (gig) => gig._id === updatedGig._id
            );
            if (gigIndex !== -1) {
              state.gigs[gigIndex] = updatedGig;
            }
          }
          state.loading = false;
        }
      )
      .addCase(addPhotosToGigAsync.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to add photos";
      })
      .addCase(fetchGigsByUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        fetchGigsByUser.fulfilled,
        (state, action: PayloadAction<Gig[]>) => {
          state.gigsByUser = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchGigsByUser.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load gigs by user";
      });
  },
});

export const { reducer: gigsReducer } = GigsSlice;
export const { setCurrentPage } = GigsSlice.actions;
