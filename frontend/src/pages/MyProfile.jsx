// src/pages/MyProfile.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import ProfileForm from "../components/ProfileForm";

export default function MyProfile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="pt-14 p-6 text-center text-red-600">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="pt-14 p-4 max-w-2xl mx-auto bg-[#f6f0e7] min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#6d4c1b]">
          My Profile
        </h2>

        <div className="flex items-center gap-4 mb-6 p-4 bg-[#E9D3BE] rounded-lg">
          <img
            src={
              user.profilePic ||
              "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
            }
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
          />
          <div>
            <div className="text-xl font-bold text-[#6d4c1b]">{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
        </div>

        <div className="space-y-2 text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg">
          <div>
            <strong>Contact:</strong> {user.contact || "Not set"}
          </div>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
}
