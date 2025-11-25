

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import base_url from "../utils/baseurl";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // ✅ Axios interceptor to attach token automatically
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
  }, []);

  // ✅ Login function (calls backend /api/auth/login)
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${base_url}/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setLoading(false);
      return { success: true, user };
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error);
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      };
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
