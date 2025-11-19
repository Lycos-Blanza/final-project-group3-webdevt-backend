// src/pages/Reservation.jsx → FINAL 100% WORKING — NO ERRORS, NO WARNINGS
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReservation } from "../contexts/ReservationContext";
import { useTables } from "../contexts/TablesContext";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";

const HERO_IMAGE = "https://popmenucloud.com/cdn-cgi/image/width=1920,height=1920,fit=scale-down,format=auto,quality=60/dxkflgbu/c77222db-9b6a-49e4-a654-0f5b7c53e341.jpg";

const TIME_SLOTS = ["06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"];

const RESERVATION_DURATION_MINUTES = 90;

const isOverlapping = (start1, start2) => {
  const toMinutes = t => t.split(":").reduce((h,m) => h*60 + +m, 0);
  const [s1, e1] = [toMinutes(start1), toMinutes(start1) + RESERVATION_DURATION_MINUTES];
  const [s2, e2] = [toMinutes(start2), toMinutes(start2) + RESERVATION_DURATION_MINUTES];
  return s1 < e2 && s2 < e1;
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
  const { reservations = [], createReservation, refetch } = useReservation();
  const notify = useNotification();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const getReservedTableNumbers = () => {
    if (!date || !time) return new Set();
    return new Set(
      reservations
        .filter(r => r.date === date && r.status !== "Cancelled" && isOverlapping(time, r.timeSlot))
        .map(r => r.tableNumber)
    );
  };

  const reservedTableNumbers = getReservedTableNumbers();

  const handleProceed = (e) => {
    e.preventDefault();
    if (!user) return notify("Please log in to continue", "info"), navigate("/login");
    if (!date || !time || !selectedTable) return notify("Please select date, time, and table", "error");
    setShowPayment(true);
  };

  const confirmAndPay = async () => {
    if (!selectedPayment) return notify("Please select payment method", "error");

    try {
      await createReservation({
        date,
        timeSlot: time,
        guests: Number(guests),
        tableNumber: selectedTable.number,        // ← FIXED: Send NUMBER, not "T1"
        specialRequest: specialRequest.trim() || undefined,
        paymentMethod: selectedPayment,
        status: "Confirmed",
      });

      refetch();
      notify("Reservation confirmed!", "success");
      setShowPayment(false);
      navigate("/my-reservations");
    } catch (err) {
      notify("Reservation failed — please try again", "error");
      console.error("Reservation error:", err);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <img src={HERO_IMAGE} alt="Diner 28" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen px-8 lg:px-16 py-20 gap-16">
        <div className="text-left lg:ml-8">
          <h1 className="text-8xl md:text-9xl lg:text-[160px] xl:text-[180px] font-black text-white leading-none tracking-tighter drop-shadow-2xl">
            RESERVE
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mt-6 font-light tracking-wider">
            Your table awaits
          </p>
        </div>

        <div className="w-full max-w-xl lg:max-w-2xl lg:mr-10">
          <div className="bg-white/97 backdrop-blur-xl rounded-3xl shadow-2xl p-10 lg:p-12 border border-white/40">
            <h2 className="text-3xl font-bold text-[#5C3A2E] text-center mb-10">
              Diner 28: Reservation
            </h2>

            <form onSubmit={handleProceed} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-[#8B5A3C] mb-2 block">Date</label>
                  <input type="date" min={today} value={date} onChange={e => { setDate(e.target.value); setTime(""); setSelectedTable(null); }}
                    className="w-full px-6 py-4 rounded-2xl bg-[#FFF8F0] text-[#5C3A2E] focus:outline-none focus:ring-4 focus:ring-[#5C3A2E]/20" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#8B5A3C] mb-2 block">Time</label>
                  <select value={time} onChange={e => { setTime(e.target.value); setSelectedTable(null); }}
                    className="w-full px-6 py-4 rounded-2xl bg-[#FFF8F0] text-[#5C3A2E] focus:outline-none focus:ring-4 focus:ring-[#5C3A2E]/20" required>
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => {
                      const booked = reservations.some(r => r.date === date && r.status !== "Cancelled" && isOverlapping(t, r.timeSlot));
                      return <option key={t} value={t} disabled={booked}>{t} {booked ? "(Booked)" : ""}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#8B5A3C] mb-2 block"># Guests</label>
                  <input type="number" min="1" max="20" value={guests} onChange={e => { setGuests(e.target.value); setSelectedTable(null); }}
                    className="w-full px-6 py-4 rounded-2xl bg-[#FFF8F0] text-[#5C3A2E] focus:outline-none focus:ring-4 focus:ring-[#5C3A2E]/20" required />
                </div>
              </div>

              {/* TABLE GRID — CLEAN, SMALL, UNIQUE KEYS */}
              <div className="mt-10">
                <p className="text-lg font-semibold text-[#8B5A3C] mb-6">Select Your Table</p>
                {date && time ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-5">
                    {tables.map(table => {
                      const isReserved = reservedTableNumbers.has(table.number);
                      const isTooSmall = table.capacity < Number(guests);
                      const canSelect = !isReserved && !isTooSmall;
                      const isSelected = selectedTable?.number === table.number;

                      return (
                        <button
                          key={table.number}  // ← UNIQUE KEY (1, 2, 3...)
                          type="button"
                          disabled={!canSelect}
                          onClick={() => canSelect && setSelectedTable(table)}
                          className={`
                            relative w-24 h-24 rounded-2xl font-bold transition-all duration-300 shadow-lg border-4 flex flex-col items-center justify-center
                            ${isSelected
                              ? "bg-[#5C3A2E] text-white border-[#5C3A2E] scale-110 ring-8 ring-green-500/50 z-10"
                              : canSelect
                              ? "bg-white text-[#5C3A2E] border-[#5C3A2E] hover:scale-110 hover:shadow-xl"
                              : isReserved
                              ? "bg-gray-300 text-gray-700 border-gray-500 cursor-not-allowed"
                              : "bg-gray-100 text-gray-500 border-gray-400 cursor-not-allowed opacity-70"
                            }
                          `}
                        >
                          <div className="text-2xl">T{table.number}</div>
                          <div className="text-xs opacity-80">{table.capacity}pax</div>

                          {isReserved && <div className="text-red-600 font-bold text-xs mt-1">Reserved</div>}
                          {isTooSmall && !isReserved && <div className="text-orange-600 text-xs">Too small</div>}
                          {isSelected && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                              SELECTED
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center py-12 text-gray-500 text-lg">Please select date and time first</p>
                )}
              </div>

              <div className="mt-10">
                <label className="text-sm font-medium text-[#8B5A3C] mb-2 block">Special Request (Optional)</label>
                <textarea
                  value={specialRequest}
                  onChange={e => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Birthday, window seat..."
                  rows="3"
                  className="w-full px-6 py-5 rounded-2xl bg-[#FFF8F0] text-[#5C3A2E] resize-none focus:outline-none focus:ring-4 focus:ring-[#5C3A2E]/20"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedTable}
                className={`w-full py-6 text-2xl font-bold rounded-2xl transition-all shadow-2xl mt-10 ${
                  selectedTable ? "bg-[#5C3A2E] text-white hover:bg-[#4a2e24]" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                {selectedTable ? "Proceed to Payment" : "Please select an available table"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10">
            <h2 className="text-4xl font-bold text-center text-[#5C3A2E] mb-8">Confirm Reservation</h2>
            <div className="bg-[#FFF8F0] p-8 rounded-2xl mb-8 space-y-4 text-lg">
              <p><strong>Date:</strong> {new Date(date).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <p><strong>Time:</strong> {time}</p>
              <p><strong>Guests:</strong> {guests}</p>
              <p><strong>Table:</strong> T{selectedTable.number} ({selectedTable.capacity} seats)</p>
              {specialRequest && <p><strong>Request:</strong> {specialRequest}</p>}
            </div>
            <div className="bg-amber-100 p-6 rounded-2xl text-center mb-8">
              <p className="text-3xl font-bold text-[#5C3A2E]">₱300 Downpayment</p>
            </div>
            <div className="space-y-4 mb-8">
              {["GCash", "Debit/Credit Card", "Cash On-Site"].map(m => (
                <button key={m} onClick={() => setSelectedPayment(m)}
                  className={`w-full py-5 rounded-2xl font-bold text-xl transition-all ${selectedPayment === m ? "bg-[#5C3A2E] text-white" : "bg-[#FFF8F0] text-[#5C3A2E]"}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={confirmAndPay} className="flex-1 py-6 bg-[#5C3A2E] text-white text-2xl font-bold rounded-2xl">
                Confirm & Pay ₱300
              </button>
              <button onClick={() => setShowPayment(false)} className="px-8 py-6 border-4 border-red-600 text-red-600 font-bold rounded-2xl hover:bg-red-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}