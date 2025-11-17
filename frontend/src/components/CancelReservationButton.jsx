// src/components/CancelReservationButton.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

export default function CancelReservationButton({ reservationId }) {
  const { updateReservation, STATUS } = useAuth();
  const notify = useNotification();

  const handleCancel = () => {
    if (window.confirm("Cancel this reservation?")) {
      updateReservation({ id: reservationId, status: STATUS.CANCELED });
      notify("Reservation canceled.", "error");
    }
  };

  return (
    <button
      onClick={handleCancel}
      className="text-red-600 text-sm underline hover:text-red-800"
    >
      Cancel
    </button>
  );
}