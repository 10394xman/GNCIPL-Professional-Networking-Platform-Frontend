// src/redux/PostSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// ✅ Fetch posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/posts/feed");
      console.log("FETCH POSTS RESP:", res.data); // 👈 Debug log
      return res.data; // Check here: might be res.data.posts
    } catch (err) {
      console.error("FetchPosts Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Create a new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/posts", postData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("CREATE POST RESP:", res.data); // 👈 Debug log
      return res.data.post || res.data; // depends on backend response
    } catch (err) {
      console.error("CreatePost Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("FETCH POSTS FINAL STATE:", action.payload); // 👈 Debug
        state.posts = Array.isArray(action.payload)
          ? action.payload
          : action.payload.posts || []; // 👈 safeguard
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // ✅ createPost
      .addCase(createPost.fulfilled, (state, action) => {
        console.log("NEW POST ADDED TO STATE:", action.payload); // 👈 Debug
        if (action.payload) {
          state.posts.unshift(action.payload);
        }
      });
  },
});

export default postSlice.reducer;

