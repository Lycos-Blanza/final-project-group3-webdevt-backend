// src/components/Topbar.jsx
import React, { useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // ADD: Scroll to Menu with Topbar offset
  const scrollToMenu = () => {
    const menuSection = document.getElementById("menu-section");
    if (menuSection) {
      const topbarHeight = 56; // h-14 = 56px
      const offset = menuSection.getBoundingClientRect().top + window.pageYOffset - topbarHeight - 16;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] flex h-14 items-center bg-[#6d4c1b] px-4 text-white">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold tracking-wider bg-transparent border-none cursor-pointer"
        >
          DINER28
        </button>
        <div className="flex-1" />
        <HamburgerMenu onClick={() => setSidebarOpen(true)} />
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}