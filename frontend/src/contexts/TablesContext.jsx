// src/contexts/TablesContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const TablesContext = createContext();

export function TablesProvider({ children }) {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("restaurant_tables");
    if (saved) {
      try {
        setTables(JSON.parse(saved));
      } catch {
        initializeDefaultTables();
      }
    } else {
      initializeDefaultTables();
    }
  }, []);

  const initializeDefaultTables = () => {
    const defaults = [
      { id: 1, number: "T1", capacity: 4 },
      { id: 2, number: "T2", capacity: 6 },
      { id: 3, number: "T3", capacity: 2 },
      { id: 4, number: "T4", capacity: 8 },
    ];
    setTables(defaults);
    localStorage.setItem("restaurant_tables", JSON.stringify(defaults));
  };

  const saveTables = (newTables) => {
    setTables(newTables);
    localStorage.setItem("restaurant_tables", JSON.stringify(newTables));
  };

  const addTable = (table) => {
    const newTable = { ...table, id: Date.now() };
    saveTables([...tables, newTable]);
  };

  const updateTable = (id, updates) => {
    saveTables(tables.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTable = (id) => {
    saveTables(tables.filter(t => t.id !== id));
  };

  return (
    <TablesContext.Provider
      value={{ tables, addTable, updateTable, deleteTable, saveTables }}
    >
      {children}
    </TablesContext.Provider>
  );
}

export function useTables() {
  const context = useContext(TablesContext);
  if (!context) throw new Error("useTables must be used within TablesProvider");
  return context;
}