import axios from "axios";

// If Vercel has a URL, use it. Otherwise, use your local computer.
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const API = axios.create({ 
  baseURL: BASE_URL.replace(/\/$/, "") // Clean up any extra slashes
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;