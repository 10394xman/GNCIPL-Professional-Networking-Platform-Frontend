// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",       // use vite proxy or set VITE_BACKEND_URL
  withCredentials: true, // send cookies (JWT cookie if backend sets it)
});

// ✅ Interceptor: har request ke sath token add karo (if exists)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
