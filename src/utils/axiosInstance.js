import axios from "axios";
const apiBase = import.meta.env.VITE_BACKEND_URL

// ✅ Proxy use kar rahe hain (vite.config.js me set hoga)
const axiosInstance = axios.create({
  baseURL: `${apiBase}/api`,   // direct /api call → proxy backend pe bhej dega
  withCredentials: true, // cookies forward hongi
});

export default axiosInstance;
