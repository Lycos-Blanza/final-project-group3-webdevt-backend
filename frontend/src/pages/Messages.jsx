// src/pages/Messages.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Messages() {
  const { user, messages } = useAuth();

  if (!user || user.role !== "admin") {
    return (
      <div className="pt-14 p-6 text-center text-red-600">Access denied.</div>
    );
  }

  return (
    <div className="pt-14 p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#6d4c1b]">
        Customer Messages
      </h2>
      {messages.length === 0 ? (
        <p className="text-center text-gray-600">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-5 rounded-xl shadow">
              <p>
                <strong>From:</strong> {msg.email}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(msg.date).toLocaleString()}
              </p>
              <p className="mt-2">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}