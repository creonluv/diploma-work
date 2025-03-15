import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Job, JobInput, ResponseJob } from "../types/Job";
import { createJob, getJob, getJobs, updateJobStep } from "../api/jobs";

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
  "jobs/createJob",
  async (data: JobInput, { rejectWithValue }) => {
    try {
      const response = await createJob(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to create job");
    }
  }
);

export const fetchJobsAsync = createAsyncThunk(
  "jobs/fetchJobs",
  async (filters: string) => {
    const data = await getJobs(filters);
    return data;
  }
);

export const fetchJobAsync = createAsyncThunk(
  "jobs/fetchJob",
  async (id: string) => {
    const data = await getJob(id);
    return data;
  }
);

export const updateJobStepAsync = createAsyncThunk(
  "jobs/updateJobStep",
  async ({ id, step }: { id: string; step: number }, { rejectWithValue }) => {
    try {
      await updateJobStep(id, step);
      return { id, step };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update job step"
      );
    }
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
        state.error = action.error.message || "Failed to load jobs";
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
        state.error = action.error.message || "Failed to load job";
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
      })
      .addCase(
        updateJobStepAsync.fulfilled,
        (state, action: PayloadAction<{ id: string; step: number }>) => {
          if (state.job && state.job._id === action.payload.id) {
            state.job.step = action.payload.step;
          }

          if (state.jobs) {
            state.jobs = state.jobs.map((job) =>
              job._id === action.payload.id
                ? { ...job, step: action.payload.step }
                : job
            );
          }
        }
      )

      .addCase(updateJobStepAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update job step";
      });
  },
});

export const { reducer: jobsReducer } = JobsSlice;
