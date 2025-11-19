// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const notify = useNotification();

  // Check for token on app start
  useEffect(() => {
    const token = localStorage.getItem("diner28_token");
    if (token) {
      // Optional: validate token with backend
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      // Simple protected endpoint to verify token + get user
      const res = await api.get("/auth/me"); // we'll create this tiny endpoint later if needed
      setUser(res.data.user);
    } catch (err) {
      // Token invalid or expired
      localStorage.removeItem("diner28_token");
      notify("Session expired. Please log in again.", "info");
    } finally {
      setLoading(false);
    }
  };

  const login = (email, _, userData) => {
    setUser({
      email,
      name: userData?.name || email.split("@")[0],
      role: userData?.role || "customer",
      contact: userData?.contact,
      profilePic: userData?.profilePic,
      _id: userData?._id,
    });
  };

  const logout = () => {
    localStorage.removeItem("diner28_token");
    setUser(null);
    localStorage.removeItem("token");
    notify("Logged out successfully", "success");
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
