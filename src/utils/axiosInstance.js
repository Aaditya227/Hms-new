import axios from "axios";
import base_url from "./baseurl";

const axiosInstance = axios.create({
  baseURL: `${base_url}`,
  timeout: 10000,
});

// If you use JWT login:
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
