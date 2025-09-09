// src/api/axios.js
import axios from 'axios';

const BASE_URL = 'https://global-connect-backend-1.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
