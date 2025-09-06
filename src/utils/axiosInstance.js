import axios from "axios";

const API_BASE_URL = "https://global-connect-backend-4ruw.onrender.com"; 
// ✅ abhi ke liye deployed backend ka link use karo

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // JWT cookies ke liye
});

export default axiosInstance;
