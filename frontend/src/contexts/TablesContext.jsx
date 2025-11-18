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
      const res = await api.get("/tables");
      setTables(res.data.tables.map(t => ({
        id: t._id || t.tableNumber,
        number: t.tableNumber,
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

  const value = {
    tables,
    loading,
    refetch: fetchTables
  };

  return (
    <TablesContext.Provider value={value}>
      {children}
    </TablesContext.Provider>
  );
}