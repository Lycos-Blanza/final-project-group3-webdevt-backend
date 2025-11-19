// src/contexts/ReservationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useNotification } from "./NotificationContext";
import { useAuth } from "./AuthContext";

const ReservationContext = createContext();
export const useReservation = () => useContext(ReservationContext);

export function ReservationProvider({ children }) {
  const [myReservations, setMyReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);     // ← Global (for booking)
  const [loadingMy, setLoadingMy] = useState(true);               // ← Only blocks My Reservations
  const [loadingAll, setLoadingAll] = useState(true);             // ← NEVER blocks UI
  const { user, logout } = useAuth();
  const notify = useNotification();

  // 1. Load user's own reservations (for My Reservations page)
  const fetchMyReservations = async () => {
    if (!user) {
      setMyReservations([]);
      setLoadingMy(false);
      return;
    }
    try {
      setLoadingMy(true);
      const res = await api.get("/api/reservations");
      setMyReservations(res.data.reservations || []);
    } catch (err) {
      if (err.response?.status === 401) logout();
    } finally {
      setLoadingMy(false);
    }
  };

  // 2. Load ALL reservations (for booking page) — NON-BLOCKING!
  const fetchAllReservations = async () => {
    if (!user) {
      setAllReservations([]);
      setLoadingAll(false);
      return;
    }

    try {
      setLoadingAll(true);
      const res = await api.get("/api/reservations/all");
      setAllReservations(res.data.reservations || []);
    } catch (err) {
      console.warn("Global reservations failed to load — continuing anyway", err);
      // NEVER crash the app — fallback to user's own (safe)
      setAllReservations(myReservations);
    } finally {
      setLoadingAll(false);
    }
  };

  const createReservation = async (data) => {
    const res = await api.post("/api/reservations", data);
    const newRes = res.data.reservation;
    setMyReservations(prev => [newRes, ...prev]);
    setAllReservations(prev => [newRes, ...prev]);
    notify("Reservation created!", "success");
    return newRes;
  };

  const cancelReservation = async (id) => {
    await api.delete(`/api/reservations/${id}`);
    setMyReservations(prev => prev.filter(r => r._id !== id));
    setAllReservations(prev => prev.filter(r => r._id !== id));
  };

  const updateReservation = async (id, data) => {
    const res = await api.put(`/api/reservations/${id}`, data);
    const updated = res.data.reservation;
    setMyReservations(prev => prev.map(r => r._id === id ? updated : r));
    setAllReservations(prev => prev.map(r => r._id === id ? updated : r));
    notify("Reservation updated!", "success");
    return updated;
  };

  useEffect(() => {
    fetchMyReservations();
    fetchAllReservations(); // ← Runs in background, never blocks
  }, [user]);

  return (
    <ReservationContext.Provider value={{
      reservations: myReservations,
      allReservations,
      loading: loadingMy,           // ← Only my reservations block UI
      loadingAll,                   // ← Booking page can show spinner separately if needed
      createReservation,
      cancelReservation,
      updateReservation,
      refetch: fetchMyReservations,
      refetchAll: fetchAllReservations,
    }}>
      {children}
    </ReservationContext.Provider>
  );
}