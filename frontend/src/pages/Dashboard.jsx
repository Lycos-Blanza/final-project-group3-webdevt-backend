// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTables } from "../contexts/TablesContext";
import { useNotification } from "../contexts/NotificationContext";

export default function Dashboard() {
  const { user, getAllReservations, updateReservation, STATUS } = useAuth();
  const { tables } = useTables();
  const notify = useNotification();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  if (!user || user.role !== "admin") {
    return (
      <div className="pt-14 p-6 text-center text-red-600">
        Access denied. Admins only.
      </div>
    );
  }

  const all = getAllReservations();
  const filtered = all.filter((r) => {
    const matchesSearch =
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.date.includes(search);
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pending = filtered.filter((r) => r.status === STATUS.PENDING);
  const confirmed = filtered.filter((r) => r.status === STATUS.CONFIRMED || r.status === STATUS.COMPLETED);
  const canceled = filtered.filter((r) => r.status === STATUS.CANCELED);
  const completed = filtered.filter((r) => r.status === STATUS.COMPLETED);

  const avgRating =
    completed.length > 0
      ? (
          completed.reduce((sum, r) => sum + (r.rating || 0), 0) /
          completed.filter((r) => r.rating).length
        ).toFixed(1)
      : "N/A";

  const handleConfirm = (id) => {
    updateReservation({ id, status: STATUS.CONFIRMED });
    notify("Reservation confirmed!", "success");
  };

  const handleCancel = (id) => {
    updateReservation({ id, status: STATUS.CANCELED });
    notify("Reservation canceled.", "error");
  };

  return (
    <div className="pt-14 p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#6d4c1b]">
        Admin Dashboard
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by email or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border border-[#5C3A2E] rounded-lg bg-[#E9D3BE]"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 border border-[#5C3A2E] rounded-lg bg-[#E9D3BE]"
        >
          <option value="all">All</option>
          <option value={STATUS.PENDING}>Pending</option>
          <option value={STATUS.CONFIRMED}>Confirmed</option>
          <option value={STATUS.CANCELED}>Canceled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-5 rounded-xl text-center shadow">
          <p className="text-3xl font-bold text-blue-700">{filtered.length}</p>
          <p className="text-sm text-gray-600">Filtered</p>
        </div>
        <div className="bg-green-50 p-5 rounded-xl text-center shadow">
          <p className="text-3xl font-bold text-green-700">{confirmed.length}</p>
          <p className="text-sm text-gray-600">Confirmed / Rated</p>
        </div>
        <div className="bg-yellow-50 p-5 rounded-xl text-center shadow">
          <p className="text-3xl font-bold text-yellow-700">{avgRating} Stars</p>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold text-[#6d4c1b] mb-4">
          Pending ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No pending.</p>
        ) : (
          <div className="space-y-4">
            {pending.map((res) => (
              <div key={res.id} className="bg-white p-5 rounded-xl shadow-md border">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <p className="font-medium">{res.email}</p>
                    <p><strong>Date:</strong> {res.date} | <strong>Time:</strong> {res.time}</p>
                    <p><strong>Guests:</strong> {res.guests}</p>
                    <p><strong>Table:</strong> {tables.find(t => t.id === res.tableId)?.number || "N/A"}</p>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleConfirm(res.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg">Confirm</button>
                    <button onClick={() => handleCancel(res.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Cancel</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-[#6d4c1b] mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {filtered.slice(0, 5).map((res) => (
            <div key={res.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">{res.email}</p>
                <p className="text-sm text-gray-600">{res.date} {res.time} • {res.guests} guests</p>
                {res.rating && <p className="text-sm text-yellow-600">Rated {res.rating} Stars</p>}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                res.status === STATUS.CONFIRMED || res.status === STATUS.COMPLETED ? "bg-green-100 text-green-800"
                : res.status === STATUS.CANCELED ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
              }`}>
                {res.status === STATUS.COMPLETED ? "Rated" : res.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}