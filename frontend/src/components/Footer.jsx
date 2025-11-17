// src/components/Footer.jsx
import React, { useState, useEffect } from "react";

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show button after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Spacer */}
      <div className="h-4 bg-[#f6f0e7]" aria-hidden="true" />

      <footer className="bg-[#6d4c1b] py-8 text-white relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-black mb-4 tracking-tight">DINER28 Team</h1>
          <p className="opacity-70 mb-6 text-sm">Click to see our GitHub accounts!</p>

          <ul className="space-y-3 text-lg">
            <li>
              <a
                href="https://github.com/Lycos-Blanza"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#E9D3BE] transition-colors duration-200"
              >
                Lycos Blanza
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Zogratis2"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#E9D3BE] transition-colors duration-200"
              >
                Niño Casanova
              </a>
            </li>
            <li>
              <a
                href="https://github.com/ollymt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#E9D3BE] transition-colors duration-200"
              >
                Justin Guirre
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Francis-Medrano"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-[#E9D3BE] transition-colors duration-200"
              >
                Francis Medrano
              </a>
            </li>
          </ul>

          <p className="mt-8 text-xs opacity-50">
            © {new Date().getFullYear()} DINER28 • All Rights Reserved
          </p>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-[#E9D3BE] text-[#6d4c1b] p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 z-50 flex items-center justify-center"
            aria-label="Back to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </footer>
    </>
  );
}