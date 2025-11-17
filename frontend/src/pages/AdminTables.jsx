// src/pages/AdminTables.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTables } from "../contexts/TablesContext";

export default function AdminTables() {
  const { user } = useAuth();
  const { tables, addTable, updateTable, deleteTable } = useTables();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ number: "", capacity: "" });

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-red-600">Access denied. Admins only.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateTable(editingId, {
        number: form.number,
        capacity: Number(form.capacity),
      });
      setEditingId(null);
    } else {
      addTable({ number: form.number, capacity: Number(form.capacity) });
    }
    setForm({ number: "", capacity: "" });
  };

  const startEdit = (table) => {
    setEditingId(table.id);
    setForm({ number: table.number, capacity: table.capacity });
  };

  return (
    <div className="pt-[56px] p-6 max-w-4xl mx-auto mt-[64px]">
      <h2 className="text-2xl font-bold mb-6">Manage Tables</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 bg-white rounded shadow"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Table Number (e.g. T1)"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            min="1"
            required
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-[#6D3811] text-white rounded cursor-pointer"
        >
          {editingId ? "Update" : "Add"} Table
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ number: "", capacity: "" });
            }}
            className="ml-2 mt-4 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <div
            key={table.id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">Table {table.number}</div>
              <div className="text-sm text-gray-600">
                {table.capacity} seats
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(table)}
                className="text-[#6D3811] hover:underline cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTable(table.id)}
                className="text-red-600 hover:underline cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
