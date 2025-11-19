// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // Change if deployed
  withCredentials: true,
});

// AUTOMATICALLY ADD JWT TOKEN TO EVERY REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("diner28_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// HANDLE 401 → AUTO LOGOUT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("diner28_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;