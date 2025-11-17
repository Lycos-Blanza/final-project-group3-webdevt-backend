// src/components/PaymentModal.jsx
import React, { useState, useEffect } from "react";

export default function PaymentModal({ reservation, onSuccess, onClose }) {
  const [method, setMethod] = useState("gcash");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onClose();
      alert("Payment window expired!");
    }
  }, [timeLeft, onClose]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePay = () => {
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-center text-[#6d4c1b]">
          Complete Payment
        </h3>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Reservation: {reservation.date} @ {reservation.time}
          </p>
          <p className="text-lg font-bold text-red-600">
            Time left: {formatTime(timeLeft)}
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="method"
              value="gcash"
              checked={method === "gcash"}
              onChange={(e) => setMethod(e.target.value)}
              className="w-5 h-5"
            />
            <span>GCash</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="method"
              value="maya"
              checked={method === "maya"}
              onChange={(e) => setMethod(e.target.value)}
              className="w-5 h-5"
            />
            <span>Maya</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="method"
              value="card"
              checked={method === "card"}
              onChange={(e) => setMethod(e.target.value)}
              className="w-5 h-5"
            />
            <span>Credit/Debit Card</span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePay}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
          >
            Pay Now
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}