// frontend/src/api/axios.js
import axios from "axios";

// Gunakan environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,  // ← PAKAI ENV VARIABLE!
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true, // ← Tambahkan ini untuk Sanctum
});

// ============================================
// INTERCEPTOR REQUEST
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🔑 [Request] URL:", config.url);
    console.log("🔑 [Request] Token exists:", !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found!");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// INTERCEPTOR RESPONSE
// ============================================
api.interceptors.response.use(
  (response) => {
    console.log("✅ [Response]", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log("❌ [Response Error]", error.response?.status, error.response?.data);
    
    // 🔥 HANDLE 401
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const isAuthPage = path.includes('/login') || path.includes('/register');
      const isAuthRequest = error.config?.url?.includes('/login') || 
                           error.config?.url?.includes('/register');
      
      if (!isAuthPage && !isAuthRequest) {
        console.warn("🔐 Token expired, redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("dashboardStats");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;