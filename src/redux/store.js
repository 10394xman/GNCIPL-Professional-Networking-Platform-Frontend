import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";  
import postReducer from "./PostSlice";
import jobReducer from "./JobSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
     posts: postReducer,
     jobs: jobReducer,
  },
});
