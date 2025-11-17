// src/components/SidebarMenu.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SidebarMenu({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
    if (onClose) onClose();
  }

  function handleHomeClick() {
    navigate("/");
    if (onClose) onClose();
  }

  return (
    <div className="flex flex-col items-start py-6">
      {/* PROFILE PIC + NAME */}
      <div className="flex items-center gap-3 mb-5 w-full">
        <img
          src={user?.profilePic || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-[#E9D3BE] shadow"
        />
        <div className="flex-1">
          <div className="text-[#333] text-[1.1em] font-bold truncate">
            {user?.name || user?.email}
          </div>
          <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
        </div>
      </div>

      <ul className="list-none p-0 m-0 mb-4 w-full">
        {user?.role === "admin" ? (
          <>
            <li><button className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]" onClick={handleHomeClick}>Home</button></li>
            <li><button className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]" onClick={() => { navigate("/dashboard"); onClose?.(); }}>Dashboard</button></li>
            <li><button className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]" onClick={() => { navigate("/messages"); onClose?.(); }}>Messages</button></li>
            <li><button className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]" onClick={() => { navigate("/admin-tables"); onClose?.(); }}>Manage Tables</button></li>
            {/* MENU BUTTON - ADDED */}
            <li>
              <button
                className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]"
                onClick={() => { navigate("/menu"); onClose?.(); }}
              >
                Menu
              </button>
            </li>
            <li>
              <button
                className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]"
                onClick={() => { navigate("/profile"); onClose?.(); }}
              >
                Profile
              </button>
            </li>
          </>
        ) : (
          <>
            <li><button className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]" onClick={handleHomeClick}>Home</button></li>
            <li><button className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]" onClick={() => { navigate("/my-reservations"); onClose?.(); }}>My Reservations</button></li>
            <li><button className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]" onClick={() => { navigate("/my-history"); onClose?.(); }}>My History</button></li>
            <li><button className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]" onClick={() => { navigate("/contact-us"); onClose?.(); }}>Contact Us</button></li>
            {/* MENU BUTTON - ADDED */}
            <li>
              <button
                className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]"
                onClick={() => { navigate("/menu"); onClose?.(); }}
              >
                Menu
              </button>
            </li>
            <li>
              <button
                className="bg-none border-0 text-[#333] text-[1em] text-left py-2 w-full cursor-pointer hover:text-[#007bff]"
                onClick={() => { navigate("/profile"); onClose?.(); }}
              >
                Profile
              </button>
            </li>
          </>
        )}
      </ul>

      <hr className="w-full border-0 border-t border-[#ddd] my-4" />

      <button
        className="bg-[#6D3811] text-[#E9D3BE] font-bold border-0 py-[10px] px-[18px] rounded cursor-pointer text-[1em] shadow w-full"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}