// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    const newNotif = { id, message, type };
    setNotifications(prev => [...prev, newNotif]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <ToastContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
}

function ToastContainer({ notifications }) {
  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-[9999] pointer-events-none">
      {notifications.map(({ id, message, type }) => (
        <div
          key={id}
          className={`
            min-w-[300px] max-w-[400px] p-4 rounded-xl shadow-xl text-white font-medium
            flex items-center gap-3 animate-slide-in-right pointer-events-auto
            ${type === "success" ? "bg-green-600" :
              type === "error" ? "bg-red-600" :
              type === "info" ? "bg-blue-600" :
              "bg-yellow-600"}
          `}
        >
          <span className="flex-1">{message}</span>
          <button
            onClick={() => setNotifications(prev => prev.filter(n => n.id !== id))}
            className="text-white/70 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context.addNotification;
};