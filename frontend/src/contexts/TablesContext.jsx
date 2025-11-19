// src/contexts/TablesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useNotification } from "./NotificationContext";

const TablesContext = createContext();
export const useTables = () => useContext(TablesContext);

export function TablesProvider({ children }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const notify = useNotification();

  const fetchTables = async () => {
    try {
      const res = await api.get("/api/tables"); // ← ADD /api
      setTables(res.data.tables.map(t => ({
        id: t._id || t.number,
        number: t.number || t.tableNumber,
        capacity: t.capacity
      })));
    } catch (err) {
      notify("Failed to load tables", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <TablesContext.Provider value={{ tables, loading, refetch: fetchTables }}>
      {children}
    </TablesContext.Provider>
  );
}