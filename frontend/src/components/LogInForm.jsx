// src/components/LogInForm.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

export default function LogInForm({ onSignUpClick }) {
  const [email, setEmail] = useState("");        // ← FIXED: setEmail
  const [password, setPassword] = useState("");  // ← already correct
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const notify = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    // login() already shows success/error toast via AuthContext
    if (success) {
      // Sidebar will auto-close because user becomes truthy in Sidebar.jsx
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col text-[1rem] text-[#5C3A2E] font-medium">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}   // ← now works
          disabled={loading}
          className="mt-2 p-3 border border-[#5C3A2E] rounded-lg text-[1rem] bg-[#E9D3BE] placeholder-[#5C3A2E]/60 focus:outline-none focus:ring-2 focus:ring-[#5C3A2E]/50"
          placeholder="you@example.com"
        />
      </label>

      <label className="flex flex-col text-[1rem] text-[#5C3A2E] font-medium">
        Password
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="mt-2 p-3 border border-[#5C3A2E] rounded-lg text-[1rem] bg-[#E9D3BE] placeholder-[#5C3A2E]/60 focus:outline-none focus:ring-2 focus:ring-[#5C3A2E]/50"
          placeholder="••••••••"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 py-3.5 bg-[#5C3A2E] text-[#E9D3BE] rounded-lg text-[1.1rem] font-bold hover:bg-[#4a2e24] transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <button
        type="button"
        onClick={onSignUpClick}
        disabled={loading}
        className="py-3 bg-transparent text-[#5C3A2E] rounded-lg font-bold text-[1rem] border-2 border-[#5C3A2E] hover:bg-[#5C3A2E]/5 transition"
      >
        Create Account
      </button>
    </form>
  );
}