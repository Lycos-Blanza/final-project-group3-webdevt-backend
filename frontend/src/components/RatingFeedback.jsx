// src/components/RatingFeedback.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function RatingFeedback({ reservation, onClose }) {
  const { updateReservation } = useAuth();
  const [rating, setRating] = useState(reservation.rating || 0);
  const [feedback, setFeedback] = useState(reservation.feedback || "");
  const [submitted, setSubmitted] = useState(!!reservation.rating);

  const handleSubmit = e => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    updateReservation({
      id: reservation.id,
      rating,
      feedback,
      status: "Completed",
    });

    setSubmitted(true);
    setTimeout(() => onClose?.(), 1500);
  };

  if (submitted) {
    return (
      <div className="p-6 text-center bg-green-50 rounded-lg">
        <p className="text-green-700 font-bold text-lg">Thank You!</p>
        <p className="text-sm text-green-600">
          Your feedback has been submitted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold text-[#6d4c1b] text-center">
        Rate Your Experience
      </h3>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-4xl transition-transform hover:scale-110 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-[#5C3A2E] font-medium">
          Feedback (optional)
        </span>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Share your thoughts..."
          rows="3"
          className="mt-1 w-full p-3 border border-[#5C3A2E] rounded-lg bg-white"
        />
      </label>

      <button
        type="submit"
        className="w-full bg-[#6D3811] text-white py-3 rounded-lg font-bold hover:bg-[#5a2e0d] transition"
      >
        Submit Review
      </button>
    </form>
  );
}