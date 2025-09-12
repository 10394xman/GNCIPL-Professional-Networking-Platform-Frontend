import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
const apiBase = import.meta.env.VITE_BACKEND_URL
// ✅ Fetch posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/posts/feed");
      return res.data;
    } catch (err) {
      console.error("FetchPosts Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to fetch posts" });
    }
  }
);

// ✅ Create a new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/posts", postData, {
        headers: {
          // Agar media hai to multipart, warna JSON
          "Content-Type": postData instanceof FormData ? "multipart/form-data" : "application/json",
        },
      });
      return res.data;
    } catch (err) {
      console.error("CreatePost Error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Failed to create post" });
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
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = Array.isArray(action.payload) ? action.payload : []; // ✅ array check
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // ✅ createPost
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload) {
          state.posts.unshift(action.payload);
        }
      });
  },
});

export default postSlice.reducer;


