import axios from "axios";
import { getToken, removeToken } from "./auth";

const API_BASE_URL = "http://127.0.0.1:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors and redirect to login
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      console.log("🔐 Authentication failed - clearing token");
      removeToken();
      
      // Trigger a storage event to notify other parts of the app
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'token',
        oldValue: 'expired',
        newValue: null,
        url: window.location.href
      }));
      
      // Force page reload to reset authentication state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
