// src/components/ProfileForm.jsx
import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext"; // ← ADDED

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const notify = useNotification(); // ← ADDED
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    contact: user?.contact || "",
    password: "",
    confirmPassword: "",
  });
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password && form.password !== form.confirmPassword) {
      notify("Passwords do not match", "error");
      setLoading(false);
      return;
    }
    if (form.password && form.password.length < 4) {
      notify("Password must be at least 4 characters", "error");
      setLoading(false);
      return;
    }
    if (form.contact && !/^\d{10,11}$/.test(form.contact.replace(/\D/g, ""))) {
      notify("Contact must be 10-11 digits", "error");
      setLoading(false);
      return;
    }

    const updates = {
      name: form.name,
      contact: form.contact,
    };
    if (form.password) updates.password = form.password;
    if (profilePic) updates.profilePic = profilePic;

    updateProfile(updates);
    notify("Profile updated!", "success");
    setForm({ ...form, password: "", confirmPassword: "" });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Please select an image file", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={
              profilePic ||
              "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
            }
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-[#E9D3BE] shadow-md"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-[#6D3811] text-white p-2 rounded-full shadow-lg hover:bg-[#5a2e0d] transition text-xs"
          >
            Edit
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <h3 className="text-xl font-bold text-[#6d4c1b]">Edit Profile</h3>

      <label className="block">
        <span className="text-[#5C3A2E] font-medium">Name</span>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="mt-1 w-full p-3 border border-[#5C3A2E] rounded-lg bg-white"
        />
      </label>

      <label className="block">
        <span className="text-[#5C3A2E] font-medium">Contact Number</span>
        <input
          type="tel"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          placeholder="09171234567"
          className="mt-1 w-full p-3 border border-[#5C3A2E] rounded-lg bg-white"
        />
      </label>

      <div className="space-y-3 pt-4 border-t border-gray-300">
        <h4 className="font-semibold text-[#6d4c1b]">Change Password</h4>
        <label className="block">
          <span className="text-[#5C3A2E] font-medium">New Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Leave blank to keep current"
            className="mt-1 w-full p-3 border border-[#5C3A2E] rounded-lg bg-white"
          />
        </label>
        <label className="block">
          <span className="text-[#5C3A2E] font-medium">Confirm Password</span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            placeholder="Repeat new password"
            className="mt-1 w-full p-3 border border-[#5C3A2E] rounded-lg bg-white"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold transition ${
          loading
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-[#6D3811] text-white hover:bg-[#5a2e0d]"
        }`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
