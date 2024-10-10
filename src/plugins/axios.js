// src/plugins/axios.js
import axios from "axios";

// Create an Axios instance with base URL pointing to '/api'
const apiClient = axios.create({
  baseURL: "/api", // This will be proxied to your backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
