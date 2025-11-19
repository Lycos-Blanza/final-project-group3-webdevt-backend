// src/pages/CustomerReservations.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useReservation } from "../contexts/ReservationContext";
import { useTables } from "../contexts/TablesContext";
import { useNavigate } from "react-router-dom";
import CancelReservationButton from "../components/CancelReservationButton";
import UpdateReservationButton from "../components/UpdateReservationButton";

export default function CustomerReservations() {
  const { user } = useAuth();
  const { reservations = [], loading: loadingMy, refetch } = useReservation();
  const { tables } = useTables();
  const navigate = useNavigate();

  // Refetch on mount just in case
  React.useEffect(() => {
    if (user) refetch();
  }, [user]);

  if (loadingMy) {
    return (
      <div className="pt-[56px] min-h-screen bg-[#f6f0e7] flex items-center justify-center">
        <p className="text-2xl text-[#5C3A2E] font-bold">Loading reservations...</p>
      </div>
    );
  }

  // SHOW ALL UPCOMING RESERVATIONS (Pending or Confirmed)
  const activeReservations = reservations.filter(r =>
    r.status !== "Cancelled" && r.status !== "Completed"
  );

  return (
    <div className="pt-[56px] mx-auto max-w-[1200px] px-4 bg-[#f6f0e7] min-h-screen">
      <div className="flex justify-center items-start pt-20 pb-20">
        <div className="bg-white px-10 py-12 rounded-2xl shadow-2xl w-full max-w-4xl">

          <h2 className="text-4xl font-bold text-center mb-10 text-[#5C3A2E]">
            My Reservations
          </h2>

          {!user ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <p className="text-xl text-gray-700 mb-6">Please log in to view your reservations</p>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-[#5C3A2E] text-white rounded-xl font-bold hover:bg-[#4a2e24] transition"
              >
                Log In Now
              </button>
            </div>
          ) : activeReservations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600 mb-8">No upcoming reservations</p>
              <button
                onClick={() => navigate("/reserve")}
                className="px-10 py-5 bg-[#5C3A2E] text-white text-xl rounded-xl font-bold hover:bg-[#4a2e24] transition shadow-lg"
              >
                Reserve a Table Now
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {activeReservations.map((res) => {
                const table = tables.find(t =>
                  t.number === res.tableNumber || t.id === res.tableNumber
                );

                return (
                  <div
                    key={res._id}
                    className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-md"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                      <div>
                        <strong className="text-[#5C3A2E]">Date:</strong>{" "}
                        {new Date(res.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div><strong className="text-[#5C3A2E]">Time:</strong> {res.timeSlot}</div>
                      <div><strong className="text-[#5C3A2E]">Guests:</strong> {res.guests}</div>
                      <div>
                        <strong className="text-[#5C3A2E]">Table:</strong>{" "}
                        {table?.number || res.tableNumber} {table && `(up to ${table.capacity} seats)`}
                      </div>
                    </div>

                    {res.specialRequest && (
                      <div className="mt-6 p-4 bg-white/80 rounded-xl border-l-4 border-amber-400">
                        <strong>Note:</strong> {res.specialRequest}
                      </div>
                    )}

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <span className={`px-6 py-3 rounded-full font-bold text-sm ${
                        res.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {res.status === "Confirmed" ? "Confirmed" : "Pending Approval"}
                      </span>
                      <CancelReservationButton reservationId={res._id} />
                      <UpdateReservationButton reservation={res} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}