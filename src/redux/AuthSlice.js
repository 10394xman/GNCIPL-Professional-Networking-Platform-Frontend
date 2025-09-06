import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  status: "idle", // 👈 loading / success state ke liye add kiya
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "success";
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
    },
    loginWithGoogle: (state, action) => {
      // 👇 yaha tum real Google token handle karoge (abhi ke liye dummy)
      state.user = { name: "Google User" };
      state.token = action.payload; // Google token
      state.status = "success";
    },
    setLoading: (state) => {
      state.status = "loading";
    },
  },
});

export const { loginSuccess, logout, loginWithGoogle, setLoading } = authSlice.actions;
export default authSlice.reducer;
