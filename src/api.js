import axios from "axios";

// Create React App uses process.env, NOT import.meta
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const API = axios.create({ 
  baseURL: BASE_URL 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;