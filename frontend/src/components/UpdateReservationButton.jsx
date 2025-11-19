// src/components/UpdateReservationButton.jsx
import { useState } from "react";
import { useReservation } from "../contexts/ReservationContext";
import { useTables } from "../contexts/TablesContext";
import { useNotification } from "../contexts/NotificationContext";

const TIME_SLOTS = Array.from({ length: 34 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const RESERVATION_DURATION_MINUTES = 90;

const isOverlapping = (t1, t2) => {
  const toMin = (t) => t.split(":").reduce((h, m) => h * 60 + +m, 0);
  const s1 = toMin(t1), e1 = s1 + RESERVATION_DURATION_MINUTES;
  const s2 = toMin(t2), e2 = s2 + RESERVATION_DURATION_MINUTES;
  return s1 < e2 && s2 < e1;
};

// GET PHILIPPINE TIME (UTC+8)
const getPhilippineTime = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 8 * 3600000); // Philippines = UTC+8
};

export default function UpdateReservationButton({ reservation: originalRes }) {
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(originalRes.date.split("T")[0]);
  const [time, setTime] = useState(originalRes.timeSlot);
  const [guests, setGuests] = useState(originalRes.guests);
  const [specialRequest, setSpecialRequest] = useState(originalRes.specialRequest || "");

  const { allReservations = [], updateReservation, refetchAll } = useReservation();
  const { tables = [] } = useTables();
  const notify = useNotification();

  const today = getPhilippineTime().toISOString().split("T")[0];

  const currentPhTime = () => {
    const ph = getPhilippineTime();
    return `${ph.getHours().toString().padStart(2, "0")}:${ph.getMinutes().toString().padStart(2, "0")}`;
  };

  const isTimeInPast = (timeSlot) => {
    if (date !== today) return false;
    return timeSlot < currentPhTime();
  };

  const findAvailableTable = () => {
    const conflicting = allReservations.filter(r =>
      r._id !== originalRes._id &&
      r.date === date &&
      r.status !== "Cancelled" &&
      isOverlapping(time, r.timeSlot)
    );

    const reservedTables = new Set(conflicting.map(r => r.tableNumber));

    return tables.find(table =>
      table.capacity >= Number(guests) &&
      !reservedTables.has(table.number)
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isTimeInPast(time)) {
      notify("Cannot update to a past time", "error");
      return;
    }

    const availableTable = findAvailableTable();

    if (!availableTable) {
      notify(`No table available for ${guests} guests at ${time} on ${date}`, "error");
      return;
    }

    try {
      await updateReservation(originalRes._id, {
        date,
        timeSlot: time,
        guests: Number(guests),
        tableNumber: availableTable.number,
        specialRequest: specialRequest.trim() || undefined,
        status: "Pending"
      });

      notify("Reservation updated! Waiting for admin approval.", "success");
      setIsEditing(false);
      refetchAll?.();
    } catch (err) {
      notify("Failed to update reservation", "error");
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition shadow-md"
      >
        Edit Reservation
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl">
        <h3 className="text-3xl font-bold text-[#5C3A2E] mb-8 text-center">Update Reservation</h3>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-[#5C3A2E] mb-2">Date</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0] focus:ring-4 focus:ring-[#5C3A2E]/30 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-[#5C3A2E] mb-2">Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0] focus:ring-4 focus:ring-[#5C3A2E]/30 outline-none"
              required
            >
              <option value="">Select time</option>
              {TIME_SLOTS.map(t => {
                const past = isTimeInPast(t);
                const conflicting = allReservations.filter(r =>
                  r._id !== originalRes._id &&
                  r.date === date &&
                  r.status !== "Cancelled" &&
                  isOverlapping(t, r.timeSlot)
                );
                const reserved = new Set(conflicting.map(r => r.tableNumber));
                const hasTable = tables.some(tbl => tbl.capacity >= guests && !reserved.has(tbl.number));
                const disabled = past || !hasTable;

                return (
                  <option key={t} value={t} disabled={disabled}>
                    {t} {past ? "(-)" : !hasTable ? "(No table available)" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-[#5C3A2E] mb-2">Guests</label>
            <input
              type="number"
              min="1"
              max="20"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0] focus:ring-4 focus:ring-[#5C3A2E]/30 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-[#5C3A2E] mb-2">Special Request</label>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              rows="3"
              className="w-full px-5 py-4 rounded-xl bg-[#FFF8F0] resize-none focus:ring-4 focus:ring-[#5C3A2E]/30 outline-none"
              placeholder="Birthday, high chair, etc..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isTimeInPast(time)}
              className={`flex-1 py-5 font-bold text-xl rounded-xl transition shadow-lg ${
                isTimeInPast(time)
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-[#5C3A2E] text-white hover:bg-[#4a2e24]"
              }`}
            >
              {isTimeInPast(time) ? "Cannot Save Past Time" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-5 bg-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}