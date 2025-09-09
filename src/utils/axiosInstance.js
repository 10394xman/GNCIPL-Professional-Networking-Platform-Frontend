// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",      // use vite proxy or set VITE_BACKEND_URL
  withCredentials: true // important: send HTTP-only cookie
});

export default axiosInstance;
