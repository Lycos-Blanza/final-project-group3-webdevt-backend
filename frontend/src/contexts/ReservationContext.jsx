// src/contexts/ReservationContext.jsx → FINAL FIXED VERSION
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useNotification } from "./NotificationContext";
import { useAuth } from "./AuthContext";

const ReservationContext = createContext();

export const useReservation = () => useContext(ReservationContext);

export function ReservationProvider({ children }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const notify = useNotification();

  const fetchReservations = async () => {
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/reservations");
      setReservations(res.data.reservations || []);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        notify("Session expired. Please log in again.", "info");
      } else {
        notify("Failed to load reservations", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (data) => {
    try {
      const res = await api.post("/reservations", data);
      // Optimistically add to list
      setReservations(prev => [res.data.reservation, ...prev]);
      notify("Reservation created successfully!", "success");
      return res.data.reservation;
    } catch (err) {
      const msg = err.response?.data?.message || "Reservation failed";
      notify(msg, "error");
      throw err;
    }
  };

  const cancelReservation = async (id) => {
    try {
      await api.delete(`/reservations/${id}`);
      setReservations(prev => prev.filter(r => r._id !== id));
      notify("Reservation cancelled", "success");
    } catch (err) {
      notify("Failed to cancel", "error");
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      const res = await api.patch(`/reservations/${id}/${status}`);
      setReservations(prev =>
        prev.map(r => (r._id === id ? res.data.reservation : r))
      );
      notify(`Reservation ${status.toLowerCase()}`, "success");
    } catch (err) {
      notify("Failed to update status", "error");
    }
  };

  // REFRESH EVERY TIME USER CHANGES (login/logout)
  useEffect(() => {
    fetchReservations();
  }, [user]); // ← THIS IS THE KEY LINE

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        loading,
        createReservation,
        cancelReservation,
        updateReservationStatus,
        refetch: fetchReservations,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}