// src/pages/MyHistory.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTables } from "../contexts/TablesContext";
import RatingFeedback from "../components/RatingFeedback";

export default function MyHistory() {
  const { user, reservations, STATUS } = useAuth();
  const { tables } = useTables();
  const [showFeedback, setShowFeedback] = useState(null);

  if (!user) {
    return <div className="pt-14 p-6 text-center">Please log in.</div>;
  }

  // Include Confirmed, Completed, Canceled
  const history = reservations.filter(
    (r) =>
      r.status === STATUS.CONFIRMED ||
      r.status === STATUS.COMPLETED ||
      r.status === STATUS.CANCELED
  );

  return (
    <div className="pt-14 p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#6d4c1b]">
        My History
      </h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-600">No history yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((res) => (
            <div
              key={res.id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <p>
                    <strong>Date:</strong> {res.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {res.time} – {res.endTime}
                  </p>
                  <p>
                    <strong>Guests:</strong> {res.guests}
                  </p>
                  <p>
                    <strong>Table:</strong>{" "}
                    {tables.find((t) => t.id === res.tableId)?.number || "N/A"}
                  </p>

                  {/* STATUS BADGES */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {/* CONFIRMED BADGE */}
                    {res.status === STATUS.CONFIRMED && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Confirmed
                      </span>
                    )}
                    {/* COMPLETED (RATED) */}
                    {res.status === STATUS.COMPLETED && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        Rated
                      </span>
                    )}
                    {/* CANCELED */}
                    {res.status === STATUS.CANCELED && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        Canceled
                      </span>
                    )}
                  </div>
                </div>

                {/* RATING BUTTON */}
                {res.status === STATUS.CONFIRMED && !res.rating && (
                  <button
                    onClick={() => setShowFeedback(res.id)}
                    className="mt-3 sm:mt-0 text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    Leave a Review
                  </button>
                )}
              </div>

              {/* RATING DISPLAY */}
              {res.rating && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Your Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={`text-lg ${
                            s <= res.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {res.feedback && (
                    <p className="mt-1 text-sm italic text-gray-600">
                      "{res.feedback}"
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <RatingFeedback
              reservation={history.find((r) => r.id === showFeedback)}
              onClose={() => setShowFeedback(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
