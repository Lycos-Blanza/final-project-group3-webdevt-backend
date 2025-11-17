// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { generateToken, verifyToken } from "../utils/jwt";

const AuthContext = createContext();

export const STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allReservations, setAllReservations] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("diner28_token");
    const savedReservations = localStorage.getItem("diner28_reservations");
    const savedMessages = localStorage.getItem("diner28_messages");
    const savedProfiles = localStorage.getItem("diner28_profiles");

    if (token) {
      const payload = verifyToken(token);
      if (payload) setUser(payload);
    }
    if (savedReservations) setAllReservations(JSON.parse(savedReservations));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  const login = (email, password) => {
    // Hardcoded
    if (email === "admin@diner28.com" && password === "admin123") {
      const admin = { email, role: "admin" };
      const token = generateToken(admin);
      localStorage.setItem("diner28_token", token);
      setUser(admin);
      return true;
    }
    if (email === "customer@diner28.com" && password === "customer123") {
      const customer = { email, role: "customer" };
      const token = generateToken(customer);
      localStorage.setItem("diner28_token", token);
      setUser(customer);
      return true;
    }

    const users = JSON.parse(localStorage.getItem("diner28_users") || "[]");
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const logged = { email: found.email, role: "customer" };
      const token = generateToken(logged);
      localStorage.setItem("diner28_token", token);
      setUser(logged);
      return true;
    }
    return false;
  };

  const register = (email, password) => {
    const users = JSON.parse(localStorage.getItem("diner28_users") || "[]");
    if (users.some(u => u.email === email)) return false;
    users.push({ email, password });
    localStorage.setItem("diner28_users", JSON.stringify(users));
    return true;
  };

  const updateProfile = (updates) => {
    const profiles = JSON.parse(localStorage.getItem("diner28_profiles") || "{}");
    profiles[user.email] = { ...profiles[user.email], ...updates };
    localStorage.setItem("diner28_profiles", JSON.stringify(profiles));
    setUser(prev => ({ ...prev, ...updates }));
  };

  const getProfile = () => {
    const profiles = JSON.parse(localStorage.getItem("diner28_profiles") || "{}");
    return profiles[user?.email] || {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("diner28_token");
  };

  const addReservation = (res) => {
    const newRes = {
      ...res,
      id: Date.now(),
      originalStatus: STATUS.PENDING,
      email: user.email,
      createdAt: new Date().toISOString(),
    };
    const updated = [...allReservations, newRes];
    setAllReservations(updated);
    localStorage.setItem("diner28_reservations", JSON.stringify(updated));
  };

  const updateReservation = (updates) => {
    const updated = allReservations.map(r =>
      r.id === updates.id ? { ...r, ...updates } : r
    );
    setAllReservations(updated);
    localStorage.setItem("diner28_reservations", JSON.stringify(updated));
  };

  const addMessage = (msg) => {
    const newMsg = { ...msg, id: Date.now(), date: new Date().toISOString() };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem("diner28_messages", JSON.stringify(updated));
  };

  const getUserReservations = () => allReservations.filter(r => r.email === user?.email);
  const getAllReservations = () => allReservations;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        getProfile,
        reservations: user ? getUserReservations() : [],
        getAllReservations,
        addReservation,
        updateReservation,
        messages,
        addMessage,
        STATUS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}