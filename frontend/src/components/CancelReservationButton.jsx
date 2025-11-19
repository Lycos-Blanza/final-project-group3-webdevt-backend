// src/components/CancelReservationButton.jsx
import { useReservation } from "../contexts/ReservationContext";
import { useNotification } from "../contexts/NotificationContext";

export default function CancelReservationButton({ reservationId }) {
  const { cancelReservation, refetch } = useReservation();
  const notify = useNotification();

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this reservation?\nThis action cannot be undone.")) return;

    try {
      await cancelReservation(reservationId);
      notify("Reservation cancelled successfully", "success");
      refetch?.();
    } catch (err) {
      notify("Failed to cancel reservation", "error");
    }
  };

  return (
    <button
      onClick={handleCancel}
      className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition shadow-md"
    >
      Cancel Reservation
    </button>
  );
}