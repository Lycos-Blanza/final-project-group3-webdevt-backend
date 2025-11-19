// src/components/UpdateReservationButton.jsx
import { useState } from "react";
import { useReservation } from "../contexts/ReservationContext";
import { useTables } from "../contexts/TablesContext";
import { useNotification } from "../contexts/NotificationContext";
import { isTimeSlotAvailable } from "../utils/reservationUtils";

const TIME_SLOTS = [
  "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00", "22:30", "23:00", "23:30"
];

export default function UpdateReservationButton({ reservation: originalRes }) {
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(originalRes.date);
  const [time, setTime] = useState(originalRes.timeSlot || originalRes.time);
  const [guests, setGuests] = useState(originalRes.guests);
  const [specialRequest, setSpecialRequest] = useState(originalRes.specialRequest || "");
  const [errorModal, setErrorModal] = useState(false);

  const { reservations = [], refetch } = useReservation();
  const { tables = [] } = useTables();
  const notify = useNotification();

  const today = new Date().toISOString().split("T")[0];

  const handleUpdate = async (e) => {
    e.preventDefault();

    const result = isTimeSlotAvailable(date, time, Number(guests), tables, reservations, originalRes._id || originalRes.id);

    if (!result.isAvailable) {
      setErrorModal(true);
      return;
    }

    const newTable = result.availableTables[0];

    try {
      const res = await fetch(`/api/reservations/${originalRes._id || originalRes.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("diner28_token") || localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date,
          timeSlot: time,
          guests: Number(guests),
          tableNumber: newTable.number,
          specialRequest: specialRequest.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      notify("Reservation updated successfully!", "success");
      setIsEditing(false);
      refetch();
    } catch (err) {
      notify("Failed to update reservation", "error");
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
      >
        Edit Reservation
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl max-h-screen overflow-y-auto">
          <h3 className="text-3xl font-bold text-[#5C3A2E] mb-8 text-center">Update Reservation</h3>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-[#5C3A2E] mb-2">Date</label>
              <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-[#F5E6D3] focus:ring-4 focus:ring-[#5C3A2E]/30" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-[#5C3A2E] mb-2">Time</label>
              <select value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-[#F5E6D3] focus:ring-4 focus:ring-[#5C3A2E]/30" required>
                <option value="">Select time</option>
                {TIME_SLOTS.map(t => {
                  const check = date ? isTimeSlotAvailable(date, t, guests, tables, reservations, originalRes._id || originalRes.id) : {};
                  const disabled = date && !check.isAvailable;
                  return (
                    <option key={t} value={t} disabled={disabled}>
                      {t} {disabled ? "— Booked" : "— Available"}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-[#5C3A2E] mb-2">Guests</label>
              <input type="number" min="1" max="20" value={guests} onChange={(e) => setGuests(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-[#F5E6D3] focus:ring-4 focus:ring-[#5C3A2E]/30" required />
            </div>

            <div>
              <label className="block text-lg font-medium text-[#5C3A2E] mb-2">Special Request</label>
              <textarea value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} rows="3"
                className="w-full px-5 py-4 rounded-xl bg-[#F5E6D3] resize-none focus:ring-4 focus:ring-[#5C3A2E]/30" />
            </div>

            <div className="flex gap-4 pt-6">
              <button type="submit" className="flex-1 py-5 bg-[#5C3A2E] text-white font-bold text-xl rounded-xl hover:bg-[#4a2e24] transition shadow-lg">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)}
                className="flex-1 py-5 bg-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-400 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {errorModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl text-center">
            <div className="text-6xl mb-6">We're sorry</div>
            <h3 className="text-2xl font-bold text-red-600 mb-4">
              No table available for {guests} guests
            </h3>
            <p className="text-gray-700 mb-8">
              We don’t have a table that fits your party at the selected time.
            </p>
            <div className="space-y-4">
              <button onClick={() => setErrorModal(false)} className="w-full py-4 bg-[#5C3A2E] text-white font-bold rounded-xl hover:bg-[#4a2e24]">
                Try Different Time
              </button>
              <button onClick={() => { setSpecialRequest(prev => prev + ` (Need extra chair for ${guests})`); setErrorModal(false); notify("Request added!", "info"); }}
                className="w-full py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700">
                Request Extra Chair
              </button>
              <button onClick={() => setIsEditing(false)} className="w-full py-4 bg-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-400">
                Cancel Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}