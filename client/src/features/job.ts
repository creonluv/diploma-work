import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Job, JobInput, ResponseJob } from "../types/Job";
import { createJob, getJob, getJobs } from "../api/jobs";
import { Params } from "../utils/getSearchParams";

export type JobState = {
  jobs: Job[] | null;
  job: Job | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string;
};

const initialState: JobState = {
  jobs: null,
  job: null,
  totalCount: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: "",
};

export const createJobAsync = createAsyncThunk<Job, JobInput>(
  "gigs/createGig",
  async (data: JobInput, { rejectWithValue }) => {
    try {
      const response = await createJob(data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create gig");
    }
  }
);

export const fetchJobsAsync = createAsyncThunk(
  "products/fetchJobs",
  async (filters: string) => {
    const data = await getJobs(filters);

    return data;
  }
);

export const fetchJobAsync = createAsyncThunk(
  "products/fetchJob",
  async (id: string) => {
    const data = await getJob(id);

    return data;
  }
);

export const JobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobsAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        fetchJobsAsync.fulfilled,
        (state, action: PayloadAction<ResponseJob>) => {
          state.jobs = action.payload.jobs;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
          state.loading = false;
        }
      )
      .addCase(fetchJobsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load gigs";
      })

      .addCase(fetchJobAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchJobAsync.fulfilled, (state, action: PayloadAction<Job>) => {
        state.job = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load gigs";
      })

      .addCase(createJobAsync.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        createJobAsync.fulfilled,
        (state, action: PayloadAction<Job>) => {
          state.loading = false;
          state.jobs = state.jobs
            ? [...state.jobs, action.payload]
            : [action.payload];
        }
      )
      .addCase(createJobAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create job";
      });
  },
});

export const { reducer: jobsReducer } = JobsSlice;
