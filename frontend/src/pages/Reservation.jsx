// src/pages/Reservation.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReservation } from "../contexts/ReservationContext";
import { useTables } from "../contexts/TablesContext";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";

const HERO_IMAGE =
  "https://popmenucloud.com/cdn-cgi/image/width=1920,height=1920,fit=scale-down,format=auto,quality=60/dxkflgbu/c77222db-9b6a-49e4-a654-0f5b7c53e341.jpg";

const TIME_SLOTS = Array.from({ length: 34 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const RESERVATION_DURATION_MINUTES = 90;

const isOverlapping = (t1, t2) => {
  const toMin = (t) => t.split(":").reduce((h, m) => h * 60 + +m, 0);
  const s1 = toMin(t1),
    e1 = s1 + RESERVATION_DURATION_MINUTES;
  const s2 = toMin(t2),
    e2 = s2 + RESERVATION_DURATION_MINUTES;
  return s1 < e2 && s2 < e1;
};

// GET PHILIPPINE TIME (UTC+8)
const getPhilippineTime = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 8 * 3600000);
};

export default function Reservation() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const { user } = useAuth();
  const { tables = [] } = useTables();
  const {
    allReservations = [],
    createReservation,
    refetchAll,
  } = useReservation();
  const notify = useNotification();
  const navigate = useNavigate();

  const today = getPhilippineTime().toISOString().split("T")[0];

  const currentPhTime = () => {
    const ph = getPhilippineTime();
    return `${ph.getHours().toString().padStart(2, "0")}:${ph
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const isTimeInPast = (timeSlot) => {
    if (date !== today) return false;
    return timeSlot < currentPhTime();
  };

  const isTimeSlotAvailable = (testTime) => {
    if (!date || !testTime || isTimeInPast(testTime)) return false;

    const conflicting = allReservations.filter(
      (r) =>
        r.date === date &&
        r.status !== "Cancelled" &&
        isOverlapping(testTime, r.timeSlot)
    );

    const reservedTables = new Set(conflicting.map((r) => r.tableNumber));

    return tables.some(
      (table) =>
        table.capacity >= Number(guests) && !reservedTables.has(table.number)
    );
  };

  const getReservedTablesForSelectedTime = () => {
    if (!date || !time || isTimeInPast(time)) return new Set();

    return new Set(
      allReservations
        .filter(
          (r) =>
            r.date === date &&
            r.status !== "Cancelled" &&
            isOverlapping(time, r.timeSlot)
        )
        .map((r) => r.tableNumber)
    );
  };

  const reservedTables = getReservedTablesForSelectedTime();

  const handleProceed = (e) => {
    e.preventDefault();
    if (!user) {
      notify("Please log in to make a reservation", "info");
      return navigate("/login");
    }
    if (!date || !time || !selectedTable) {
      return notify("Please select date, time and table", "error");
    }
    if (isTimeInPast(time)) {
      return notify("Cannot book a past time", "error");
    }
    setShowPayment(true);
  };

  const confirmReservation = async () => {
    if (!selectedPayment) return notify("Select a payment method", "error");

    try {
      await createReservation({
        date,
        timeSlot: time,
        guests: Number(guests),
        tableNumber: selectedTable.number,
        specialRequest: specialRequest.trim() || undefined,
        paymentMethod: selectedPayment,
        status: "Pending",
      });

      notify("Reservation successful! Waiting for approval.", "success");
      refetchAll?.();
      navigate("/my-reservations");
    } catch (err) {
      notify("Reservation failed. Please try again.", "error");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Diner28"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen px-8 lg:px-20 py-24 gap-20">
        <div className="text-center lg:text-left">
          <h1 className="text-8xl lg:text-9xl xl:text-[200px] font-black text-white leading-none tracking-tighter drop-shadow-2xl">
            RESERVE
          </h1>
          <p className="text-3xl text-white/90 mt-8 font-light">
            Your table awaits
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/30">
            <h2 className="text-4xl font-bold text-center text-[#5C3A2E] mb-12">
              Book Your Table
            </h2>

            <form onSubmit={handleProceed} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#8B5A3C] mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setTime("");
                      setSelectedTable(null);
                    }}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-[#FFF8F0] text-[#5C3A2E] focus:ring-4 focus:ring-[#5C3A2E]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8B5A3C] mb-2">
                    Time
                  </label>
                  <select
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      setSelectedTable(null);
                    }}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-[#FFF8F0] text-[#5C3A2E] focus:ring-4 focus:ring-[#5C3A2E]/20 outline-none"
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((t) => {
                      const past = isTimeInPast(t);
                      const available = isTimeSlotAvailable(t);
                      const disabled = past || !available;

                      return (
                        <option key={t} value={t} disabled={disabled}>
                          {t}{" "}
                          {past ? "(-)" : !available ? "(Fully Booked)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8B5A3C] mb-2">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={guests}
                    onChange={(e) => {
                      setGuests(e.target.value);
                      setSelectedTable(null);
                    }}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-[#FFF8F0] text-[#5C3A2E] focus:ring-4 focus:ring-[#5C3A2E]/20 outline-none"
                  />
                </div>
              </div>

              {/* TABLE GRID */}
              {date && time && !isTimeInPast(time) && (
                <div>
                  <p className="text-lg font-semibold text-[#8B5A3C] mb-6">
                    Choose Your Table
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-5">
                    {tables.map((table) => {
                      const isReserved = reservedTables.has(table.number);
                      const tooSmall = table.capacity < Number(guests);
                      const canBook = !isReserved && !tooSmall;
                      const isSelected = selectedTable?.number === table.number;

                      return (
                        <button
                          key={table.numberNumber}
                          type="button"
                          onClick={() => canBook && setSelectedTable(table)}
                          disabled={!canBook}
                          className={`
                            relative w-24 h-24 rounded-2xl font-bold transition-all border-4 flex flex-col items-center justify-center shadow-lg
                            ${
                              isSelected
                                ? "bg-[#5C3A2E] text-white border-[#5C3A2E] scale-110 ring-8 ring-green-400/50"
                                : canBook
                                ? "bg-white text-[#5C3A2E] border-[#5C3A2E] hover:scale-110"
                                : "bg-gray-200 text-gray-500 border-gray-400 cursor-not-allowed"
                            }
                          `}
                        >
                          <div className="text-2xl">{table.number}</div>
                          <div className="text-xs">{table.capacity}p</div>
                          {isReserved && (
                            <div className="text-xs text-red-600 font-bold">
                              Reserved
                            </div>
                          )}
                          {tooSmall && !isReserved && (
                            <div className="text-xs text-orange-600">
                              Too small
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute -top-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                              SELECTED
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#8B5A3C] mb-2">
                  Special Request (Optional)
                </label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Birthday, window seat, etc..."
                  rows="3"
                  className="w-full px-5 py-4 rounded-2xl bg-[#FFF8F0] resize-none focus:ring-4 focus:ring-[#5C3A2E]/20 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTable || isTimeInPast(time)}
                className={`w-full py-6 text-2xl font-bold rounded-2xl transition-all shadow-xl ${
                  selectedTable && !isTimeInPast(time)
                    ? "bg-[#5C3A2E] text-white hover:bg-[#4a2e24]"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                {selectedTable && !isTimeInPast(time)
                  ? "Proceed to Payment"
                  : "Select a valid time & table"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL — SAME AS BEFORE */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10">
            <h2 className="text-4xl font-bold text-center text-[#5C3A2E] mb-8">
              Confirm & Pay
            </h2>
            <div className="bg-[#FFF8F0] p-8 rounded-2xl space-y-4 mb-8">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <strong>Time:</strong> {time}
              </p>
              <p>
                <strong>Guests:</strong> {guests}
              </p>
              <p>
                <strong>Table:</strong> {selectedTable.number} (
                {selectedTable.capacity} seats)
              </p>
              {specialRequest && (
                <p>
                  <strong>Request:</strong> {specialRequest}
                </p>
              )}
            </div>
            <div className="bg-amber-100 p-6 rounded-2xl text-center mb-8">
              <p className="text-3xl font-bold text-[#5C3A2E]">
                ₱300 Downpayment
              </p>
            </div>
            <div className="space-y-4">
              {["GCash", "Debit/Credit Card", "Cash On-Site"].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedPayment(m)}
                  className={`w-full py-5 rounded-2xl font-bold text-xl transition-all ${
                    selectedPayment === m
                      ? "bg-[#5C3A2E] text-white"
                      : "bg-[#FFF8F0] text-[#5C3A2E]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={confirmReservation}
                className="flex-1 py-6 bg-[#5C3A2E] text-white text-2xl font-bold rounded-2xl"
              >
                Confirm & Pay ₱300
              </button>
              <button
                onClick={() => setShowPayment(false)}
                className="px-8 py-6 border-4 border-red-600 text-red-600 font-bold rounded-2xl hover:bg-red-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
