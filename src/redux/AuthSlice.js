import { createSlice } from "@reduxjs/toolkit";

// ✅ Safe localStorage parse for user
let savedUser = null;
try {
  const userData = localStorage.getItem("user");
  if (userData && userData !== "undefined") {
    savedUser = JSON.parse(userData);
  }
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
  savedUser = null;
}

const initialState = {
  user: savedUser, // ✅ reload pe bhi user restore hoga
  token: localStorage.getItem("token") || null, // ✅ token persist
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user; // ✅ backend user object (role included)
      state.token = action.payload.token;
      state.status = "success";

      // ✅ Save token + user in localStorage
      try {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch (error) {
        console.error("Error saving auth data:", error);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";

      // ✅ Clear localStorage
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Error clearing auth data:", error);
      }
    },
    setLoading: (state) => {
      state.status = "loading";
    },
  },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;


