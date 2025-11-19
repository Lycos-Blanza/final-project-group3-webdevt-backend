// src/pages/ContactUs.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";

export default function ContactUs() {
  const { user, addMessage } = useAuth();
  const notify = useNotification();
  const [form, setForm] = useState({ message: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!form.message.trim()) err.message = "Message is required.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      notify("Please fill in the message.", "error");
      return;
    }
    addMessage({
      email: user?.email || "",
      message: form.message,
    });
    notify("Message sent to admin!", "success");
    setForm({ message: "" });
    setErrors({});
  };

  return (
    <div className="pt-14 p-4 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#6d4c1b]">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className={`w-full p-3 border rounded-lg bg-[#E9D3BE] resize-none ${
                errors.message ? "border-red-500" : "border-[#5C3A2E]"
              }`}
            />
            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#6D3811] text-white py-3 rounded-lg font-bold hover:bg-[#5a2e0d]"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}