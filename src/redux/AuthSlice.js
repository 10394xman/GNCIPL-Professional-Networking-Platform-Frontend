// src/redux/AuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Helper to read cookie by name
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

let savedUser = null;
let savedToken = null;

try {
  const userData = localStorage.getItem("user");
  if (userData && userData !== "undefined") {
    savedUser = JSON.parse(userData);
  }

  const tokenData = localStorage.getItem("token");
  if (tokenData && tokenData !== "undefined") {
    savedToken = tokenData;
  } else {
    // ✅ fallback to cookie if localStorage missing
    savedToken = getCookie("token");
  }
} catch (error) {
  console.error("Error restoring auth:", error);
}

const initialState = {
  user: savedUser || null,
  token: savedToken || null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "success";

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

      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

