import axios from "axios";

// ✅ Proxy use kar rahe hain (vite.config.js me set hoga)
const axiosInstance = axios.create({
  baseURL: "/api",   // direct /api call → proxy backend pe bhej dega
  withCredentials: true, // cookies forward hongi
});

export default axiosInstance;
