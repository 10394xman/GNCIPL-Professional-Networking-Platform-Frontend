// src/redux/JobSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
const apiBase = import.meta.env.VITE_BACKEND_URL
// ✅ Fetch all jobs
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axiosInstance.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.jobs || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Create a job (recruiter only)
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
      const res = await axiosInstance.get("/jobs/applications/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.applications || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch recruiter’s applications
export const fetchRecruiterApplications = createAsyncThunk(
  "jobs/fetchRecruiterApplications",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axiosInstance.get("/jobs/applications/recruiter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.applications || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Update application status (recruiter only)
export const updateApplicationStatus = createAsyncThunk(
  "jobs/updateApplicationStatus",
  async ({ applicationId, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await axiosInstance.put(
        `/jobs/applications/${applicationId}/status`,
        { status }, // ✅ must be one of: pending | reviewed | accepted | rejected
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.application || res.data;
    } catch (err) {
      console.error("Update Application Status Error:", err.response?.data);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    applications: [], // candidate applications
    savedJobs: [],
    status: "idle",
    error: null,
    createStatus: "idle",
    createError: null,
    applyStatus: "idle",
    saveStatus: "idle",
    recruiterApplications: [], // recruiter’s job applications
    recruiterStatus: "idle",
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
        state.jobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      // ✅ apply job
      .addCase(applyJob.fulfilled, (state, action) => {
        state.applyStatus = "succeeded";
        state.applications.push(action.payload);
      })

      // ✅ save job
      .addCase(saveJob.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.savedJobs.push(action.payload);
      })

      // ✅ fetch my applications
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = action.payload;
      })

      // ✅ recruiter apps
      .addCase(fetchRecruiterApplications.pending, (state) => {
        state.recruiterStatus = "loading";
      })
      .addCase(fetchRecruiterApplications.fulfilled, (state, action) => {
        state.recruiterStatus = "succeeded";
        state.recruiterApplications = action.payload;
      })
      .addCase(fetchRecruiterApplications.rejected, (state, action) => {
        state.recruiterStatus = "failed";
        state.error = action.payload;
      })

      // ✅ update application status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const idx = state.recruiterApplications.findIndex(
          (app) => app._id === action.payload._id
        );
        if (idx !== -1) {
          state.recruiterApplications[idx] = action.payload;
        }
      });
  },
});

export default jobSlice.reducer;
