// src/components/UpdateReservationButton.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function UpdateReservationButton({ reservation }) {
  const { updateReservation } = useAuth();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(reservation.date);
  const [time, setTime] = useState(reservation.time);
  const [guests, setGuests] = useState(reservation.guests);
  const [note, setNote] = useState(reservation.note || "");

  const addOneAndHalfHours = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date(0, 0, 0, h, m);
    d.setMinutes(d.getMinutes() + 90);
    return d.toTimeString().slice(0, 5);
  };

  const today = new Date().toISOString().split("T")[0];
  const canUpdate = !["Confirmed", "Canceled"].includes(reservation.status);

  const handleUpdate = (e) => {
    e.preventDefault();
    updateReservation({
      ...reservation,
      date,
      time,
      endTime: addOneAndHalfHours(time),
      guests: Number(guests),
      note,
    });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={!canUpdate}
        title={canUpdate ? "Update reservation" : "Cannot update after confirmation"}
        className="ml-4 w-16 rounded bg-[#6D3811] px-3 py-1 text-white transition hover:bg-[#5a2e0d] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h3 className="mb-4 text-lg font-bold">Update Reservation</h3>

            <label className="block">
              Date:
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1 w-full rounded border p-2"
              />
            </label>

            <label className="mt-3 block">
              Time:
              <input
                type="time"
                value={time}
                min="07:30"
                max="21:00"
                onChange={(e) => setTime(e.target.value)}
                required
                className="mt-1 w-full rounded border p-2"
              />
              {time && (
                <p className="mt-1 text-xs text-gray-600">
                  Block: {time} – {addOneAndHalfHours(time)}
                </p>
              )}
            </label>

            <label className="mt-3 block">
              Guests:
              <input
                type="number"
                min="1"
                max="20"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                required
                className="mt-1 w-full rounded border p-2"
              />
            </label>

            <label className="mt-3 block">
              Note:
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Special requests..."
                className="mt-1 w-full resize-none rounded border p-2"
              />
            </label>

            <div className="mt-5 flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded bg-[#6D3811] py-2 font-semibold text-white"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded bg-gray-300 px-4 py-2 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}