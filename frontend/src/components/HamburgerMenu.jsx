// src/components/HamburgerMenu.jsx
import React from 'react';

export default function HamburgerMenu({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className="flex flex-col items-center justify-center w-10 h-10 p-0 ml-auto bg-transparent border-none cursor-pointer"
    >
      <span className="block w-6 h-0.5 bg-white my-0.5 rounded-sm transition-all duration-300" />
      <span className="block w-6 h-0.5 bg-white my-0.5 rounded-sm transition-all duration-300" />
      <span className="block w-6 h-0.5 bg-white my-0.5 rounded-sm transition-all duration-300" />
    </button>
  );
}