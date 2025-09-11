import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// ✅ Fetch all jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/jobs");
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
      const token = getState().auth.token;
      const res = await axiosInstance.post("/jobs", jobData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.job || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Apply for a job (candidate only)
export const applyJob = createAsyncThunk(
  "jobs/applyJob",
  async (jobId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axiosInstance.post(
        `/jobs/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.application || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Save a job (candidate only)
export const saveJob = createAsyncThunk(
  "jobs/saveJob",
  async (jobId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axiosInstance.post(
        `/jobs/${jobId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.savedJob || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch candidate's applications
export const fetchMyApplications = createAsyncThunk(
  "jobs/fetchMyApplications",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axiosInstance.get("/applications/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.applications || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    applications: [], // 👈 candidate applied jobs
    savedJobs: [], // 👈 candidate saved jobs
    status: "idle", // fetch jobs / fetch applications
    error: null,
    createStatus: "idle",
    createError: null,
    applyStatus: "idle",
    saveStatus: "idle",
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
          state.jobs.unshift(action.payload);
        } else {
          state.jobs = [action.payload];
        }
      })
      .addCase(createJob.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      // ✅ apply job
      .addCase(applyJob.pending, (state) => {
        state.applyStatus = "loading";
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.applyStatus = "succeeded";
        state.applications.push(action.payload);
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.applyStatus = "failed";
        state.error = action.payload;
      })

      // ✅ save job
      .addCase(saveJob.pending, (state) => {
        state.saveStatus = "loading";
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.savedJobs.push(action.payload);
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.error = action.payload;
      })

      // ✅ fetch my applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
