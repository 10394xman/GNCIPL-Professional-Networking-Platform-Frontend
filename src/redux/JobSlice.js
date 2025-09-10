import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// ✅ Fetch all jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/jobs");
      console.log("FETCH JOBS RESP:", res.data);
      return res.data.jobs || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Create a job (for recruiters)
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token; // 👈 auth token from Redux
      const res = await axiosInstance.post("/jobs", jobData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 secure recruiter request
        },
      });
      console.log("CREATE JOB RESP:", res.data);
      return res.data.job || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    status: "idle",
    error: null,
    createStatus: "idle", // 👈 track create job status
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ✅ create job
      .addCase(createJob.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        if (Array.isArray(state.jobs)) {
          state.jobs.unshift(action.payload); // 👈 add new job at top
        } else {
          state.jobs = [action.payload];
        }
      })
      .addCase(createJob.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      });
  },
});

export default jobSlice.reducer;
