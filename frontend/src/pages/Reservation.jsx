// src/pages/Reservation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // ← ADDED Link
import { useAuth } from "../contexts/AuthContext";
import { useTables } from "../contexts/TablesContext";
import { useAvailability } from "../hooks/useAvailability";
import { useNotification } from "../contexts/NotificationContext";
import PaymentModal from "../components/PaymentModal";

export default function Reservation() {
  const navigate = useNavigate();
  const { user, addReservation, STATUS } = useAuth();
  const { tables } = useTables();
  const { isSlotAvailable, suggestTable } = useAvailability();
  const notify = useNotification();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [tableId, setTableId] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [pendingRes, setPendingRes] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false); // for success redirect

  const [fieldErrors, setFieldErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];
  const minTime = "07:30",
    maxTime = "21:00";

  // Calculate minimum allowed time for today (current time + 1 hour)
  const getMinAllowedTime = () => {
    if (date !== today) return minTime;
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60);
    // Round up to next 5 minutes for input compatibility
    const minutes = Math.ceil(now.getMinutes() / 5) * 5;
    now.setMinutes(minutes);
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const addOneAndHalfHours = (t) => {
    const [h, m] = t.split(":").map(Number);
    const d = new Date(0, 0, 0, h, m);
    d.setMinutes(d.getMinutes() + 90);
    return d.toTimeString().slice(0, 5);
  };

  // Auto‑suggest table
  useEffect(() => {
    if (date && time && guests && !tableId) {
      const suggested = suggestTable(date, time, Number(guests));
      if (suggested) setTableId(String(suggested.id));
    }
  }, [date, time, guests, tableId, suggestTable]);

  // Real-time validation on input change
  const handleDateChange = (e) => {
    setDate(e.target.value);
    setFieldErrors(
      validateFields({ date: e.target.value, time, guests, tableId })
    );
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    setFieldErrors(
      validateFields({ date, time: e.target.value, guests, tableId })
    );
  };

  const handleGuestsChange = (e) => {
    setGuests(e.target.value);
    setFieldErrors(
      validateFields({ date, time, guests: e.target.value, tableId })
    );
  };

  const handleTableIdChange = (e) => {
    setTableId(e.target.value);
    setFieldErrors(
      validateFields({ date, time, guests, tableId: e.target.value })
    );
  };

  // Update validateFields to accept values
  const validateFields = (values) => {
    const v = values || { date, time, guests, tableId };
    const errors = {};
    const guestsNum = Number(v.guests);
    const tableIdNum = Number(v.tableId);

    if (v.date && v.date < today) errors.date = "Cannot select past dates.";
    // Time must be at least 1 hour in the future if reserving for today
    if (v.time) {
      if (v.time < minTime || v.time > maxTime)
        errors.time = "Time must be between 07:30 and 21:00.";
      if (v.date === today) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 60);
        const minFutureTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        if (v.time < minFutureTime) {
          errors.time = "Reservation time must be at least 1 hour in the future.";
        }
      }
    }
    if (guestsNum < 1) errors.guests = "At least 1 guest required.";
    if (guestsNum > 20) errors.guests = "Maximum 20 guests allowed.";
    if (v.tableId) {
      const table = tables.find((t) => t.id === tableIdNum);
      if (table && guestsNum > table.capacity) {
        errors.tableId = `Table ${table.number} only seats ${table.capacity}.`;
      }
      if (
        v.date &&
        v.time &&
        table &&
        !isSlotAvailable(v.date, v.time, guestsNum, null, tableIdNum)
      ) {
        errors.tableId = "The number of guests cannot exceed the table capacity.";
      }
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      notify("Please log in to make a reservation.", "error");
      return;
    }

    if (!date || !time || !guests || !tableId) {
      notify("Please fill in all required fields.", "error");
      return;
    }

    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      notify("Please fix the errors below.", "error");
      return;
    }

    const endTime = addOneAndHalfHours(time);
    const res = {
      date,
      time,
      endTime,
      guests: Number(guests),
      note,
      tableId: Number(tableId),
      status: STATUS.PENDING,
    };

    setPendingRes(res);
    setShowPayment(true);
  };

  // SUCCESS – save & flag redirect
  const handlePaymentSuccess = () => {
    const newRes = { ...pendingRes, id: Date.now() };
    addReservation(newRes);
    notify("Reservation confirmed! Payment received.", "success");
    setShowPayment(false);
    setPendingRes(null);
    setShouldRedirect(true);
  };

  // CLEAN CLOSE
  const handlePaymentClose = () => {
    setShowPayment(false);
    setPendingRes(null);
    notify("Payment canceled.", "info");
  };

  // REDIRECT AFTER SUCCESS
  useEffect(() => {
    if (shouldRedirect) {
      setDate("");
      setTime("");
      setGuests(1);
      setNote("");
      setTableId("");
      setShouldRedirect(false);
      navigate("/my-reservations");
    }
  }, [shouldRedirect, navigate]);

  if (!user) {
    return (
      <div className="pt-14 p-8 text-center text-red-600 text-lg">
        Please log in to make a reservation.
      </div>
    );
  }

  const hasErrors = Object.keys(fieldErrors).length > 0;

  // KEY FORCES REMOUNT → any navigation works instantly
  const contentKey = showPayment ? "modal" : "form";

  return (
    <div key={contentKey} className="pt-14 p-4 max-w-2xl mx-auto">
      {/* BACK BUTTON – works even if modal is open */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-block text-[#6D3811] hover:underline text-sm"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#6d4c1b]">
          Make a Reservation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date */}
          <div>
            <label className="block font-medium text-[#5C3A2E]">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              min={today}
              required
              className={`mt-1 w-full p-3 border rounded-lg bg-[#E9D3BE] ${
                fieldErrors.date ? "border-red-500" : "border-[#5C3A2E]"
              }`}
            />
            {fieldErrors.date && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block font-medium text-[#5C3A2E]">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              min={getMinAllowedTime()}
              max={maxTime}
              required
              className={`mt-1 w-full p-3 border rounded-lg bg-[#E9D3BE] ${
                fieldErrors.time ? "border-red-500" : "border-[#5C3A2E]"
              }`}
            />
            {time && !fieldErrors.time && (
              <p className="text-xs text-gray-600 mt-1">
                Ends at: {addOneAndHalfHours(time)}
              </p>
            )}
            {fieldErrors.time && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.time}</p>
            )}
          </div>

          {/* Guests */}
          <div>
            <label className="block font-medium text-[#5C3A2E]">
              Guests <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={guests}
              onChange={handleGuestsChange}
              min="1"
              max="20"
              required
              className={`mt-1 w-full p-3 border rounded-lg bg-[#E9D3BE] ${
                fieldErrors.guests ? "border-red-500" : "border-[#5C3A2E]"
              }`}
            />
            {fieldErrors.guests && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.guests}</p>
            )}
          </div>

          {/* Table */}
          <div>
            <label className="block font-medium text-[#5C3A2E]">
              Table <span className="text-red-500">*</span>
            </label>
            <select
              value={tableId}
              onChange={handleTableIdChange}
              required
              className={`mt-1 w-full p-3 border rounded-lg bg-[#E9D3BE] ${
                fieldErrors.tableId ? "border-red-500" : "border-[#5C3A2E]"
              }`}
            >
              <option value="">Select a table</option>
              {tables.map((t) => {
                const available =
                  date && time
                    ? isSlotAvailable(date, time, Number(guests), null, t.id)
                    : true;
                return (
                  <option
                    key={t.id}
                    value={t.id}
                    disabled={!available}
                    className={!available ? "text-gray-400" : ""}
                  >
                    Table {t.number} ({t.capacity} seats)
                    {!available}
                  </option>
                );
              })}
            </select>
            {tableId && !fieldErrors.tableId && (
              <p className="text-sm text-green-600 mt-1">
                Selected: Table{" "}
                {tables.find((t) => t.id === Number(tableId))?.number}
              </p>
            )}
            {fieldErrors.tableId && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.tableId}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block font-medium text-[#5C3A2E]">
              Special Request
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1 w-full p-3 border border-[#5C3A2E] rounded-lg bg-[#E9D3BE] resize-none"
              placeholder="e.g. Window seat, birthday..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={hasErrors || !date || !time || !guests || !tableId}
            className={`w-full py-3 rounded-lg font-bold text-lg transition ${
              hasErrors || !date || !time || !guests || !tableId
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-[#6D3811] text-white hover:bg-[#5a2e0d]"
            }`}
          >
            {hasErrors ? "Fix Errors Above" : "Reserve & Pay"}
          </button>
        </form>
      </div>

      {/* Payment Modal */}
      {showPayment && pendingRes && (
        <PaymentModal
          reservation={pendingRes}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
      )}
    </div>
  );
}
