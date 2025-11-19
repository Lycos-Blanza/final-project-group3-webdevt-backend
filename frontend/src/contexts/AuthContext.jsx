// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const notify = useNotification(); // ← Now just a function

  useEffect(() => {
    const token = localStorage.getItem("diner28_token");
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
      notify("Welcome back!", "success");
    } catch (err) {
      console.log("Token invalid or expired:", err.response?.data);
      localStorage.removeItem("diner28_token");
      notify("Session expired. Please login again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem("diner28_token", token);
      setUser(userData);
      notify(`Welcome back, ${userData.name}!`, "success");
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      notify(msg, "error");
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post("/api/auth/register", formData);
      notify("Account created! Please login.", "success");
      return true;
    } catch (err) {
      notify(err.response?.data?.message || "Registration failed", "error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("diner28_token");
    setUser(null);
    notify("Logged out successfully", "success");
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin"
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}