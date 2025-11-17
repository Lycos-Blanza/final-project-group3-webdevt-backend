// src/pages/CustomerReservations.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTables } from "../contexts/TablesContext";
import { useNavigate } from "react-router-dom";
import CancelReservationButton from "../components/CancelReservationButton";
import UpdateReservationButton from "../components/UpdateReservationButton";

export default function CustomerReservations() {
  const { user, reservations, STATUS } = useAuth();
  const { tables } = useTables();
  const navigate = useNavigate();

  
  // Only show PENDING
  const pendingReservations = reservations.filter(r => r.status === STATUS.PENDING);

  // ONLY show banner if a reservation was changed FROM PENDING → CONFIRMED or CANCELED
  const hasChanges = reservations.some(r =>
    (r.status === STATUS.CONFIRMED || r.status === STATUS.CANCELED) &&
    r.originalStatus === STATUS.PENDING
  );

  return (
    <div className="pt-[56px] mx-auto max-w-[1200px] px-4 bg-[#f6f0e7] min-h-screen">
      <div className="flex justify-center items-start pt-20 pb-20">
        <div className="text-black bg-white px-10 py-8 rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] min-w-[350px] w-full max-w-3xl">
          
          <h2 className="text-black text-2xl font-bold text-center mb-6">
            My Reservations
          </h2>

          {/* CHANGE BANNER */}
          {hasChanges && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-blue-800 font-medium">
                Changes have been made to your reservation.{" "}
                <span
                  onClick={() => navigate("/my-history")}
                  className="underline text-blue-600 hover:text-blue-800 cursor-pointer font-semibold"
                >
                  See History →
                </span>
              </p>
            </div>
          )}

          {/* NO LOGIN */}
          {!user ? (
            <div className="text-black mt-4 text-center">
              You must <b>login</b> to view your reservations.
            </div>
          ) : pendingReservations.length === 0 ? (
            <div className="text-black mt-8 text-[1.1rem] text-center text-gray-600">
              No pending reservations.
            </div>
          ) : (
            <ul className="list-none p-0 space-y-4">
              {pendingReservations.map((res) => (
                <li
                  key={res.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex flex-col gap-2 text-[1.1rem] text-black">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <span><strong>Date:</strong> {res.date}</span>
                      <span><strong>Time:</strong> {res.time} – {res.endTime}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <span><strong>Guests:</strong> {res.guests}</span>
                      <span>
                        <strong>Table:</strong>{" "}
                        {tables.find(t => t.id === res.tableId)?.number || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 font-semibold">Pending</span>
                      <CancelReservationButton reservationId={res.id} />
                      <UpdateReservationButton reservation={res} />
                    </div>
                    {res.note && (
                      <div className="text-sm text-gray-700 mt-2 pl-2 border-l-2 border-gray-300">
                        <span className="font-medium">Note:</span> {res.note}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}