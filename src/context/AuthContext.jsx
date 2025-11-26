import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import base_url from "../utils/baseurl";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState(null); // Will hold { user, employee, employee_id }
  const [loading, setLoading] = useState(true);

  // 🔄 Restore from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedAuthData = localStorage.getItem("authData");

    if (token && savedAuthData) {
      try {
        const parsed = JSON.parse(savedAuthData);
        setAuthData(parsed);
      } catch (e) {
        console.warn("Failed to parse authData from localStorage");
        localStorage.removeItem("token");
        localStorage.removeItem("authData");
      }
    }
    setLoading(false);
  }, []);

  // 🛡️ Axios interceptor (with cleanup)
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  // 🔑 Login function — saves FULL response data
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${base_url}/auth/login`, { email, password });

      const { token, user, employee, employee_id } = res.data;

      // ✅ Save full auth context
      const fullAuthData = { user, employee, employee_id };

      localStorage.setItem("token", token);
      localStorage.setItem("authData", JSON.stringify(fullAuthData));

      setAuthData(fullAuthData);
      setLoading(false);
      return { success: true, ...fullAuthData };
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error);
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      };
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authData");
    setAuthData(null);
  };

  // Expose user, employee, etc. directly for convenience
  const { user, employee, employee_id } = authData || {};

  return (
    <AuthContext.Provider
      value={{
        user,
        employee,
        employee_id,
        loading,
        isLoggedIn: !!authData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 💡 Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};