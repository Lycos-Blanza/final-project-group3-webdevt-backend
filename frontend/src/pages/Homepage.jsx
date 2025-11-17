// src/pages/Homepage.jsx
import React from "react";
import MenuMarquee from "../components/MenuMarquee"; // FIXED: was MenuSlideshow
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const handleExploreClick = () => {
    const menuSection = document.getElementById("menu-section");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <div
        className="
          w-full h-[700px]
          flex items-center justify-center
          relative
          bg-cover bg-center bg-no-repeat
          overflow-hidden
          max-[700px]:h-[280px]
        "
        style={{
          backgroundImage:
            "url('https://popmenucloud.com/cdn-cgi/image/width%3D1920%2Cheight%3D1920%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/dxkflgbu/c77222db-9b6a-49e4-a654-0f5b7c53e341.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[rgba(40,30,10,0.55)]"></div>

        <div className="relative z-[2] text-center px-4">
          <div
            className="
              font-['Staatliches']
              text-white text-[6rem]
              tracking-[3px]
              leading-[0.9]
              drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]
              max-[700px]:text-[3rem]
            "
          >
            WELCOME TO
            <br />
            DINER28
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleExploreClick}
              className="
                py-[0.7rem] px-[2.2rem]
                text-[1.15rem] font-bold
                text-[#222222]
                bg-[#E9D3BE] rounded-[32px]
                shadow-md
                hover:scale-[1.05]
                transition-all
              "
            >
              EXPLORE MENU
            </button>

            <button
              onClick={() => navigate("/reserve")}
              className="
                py-[0.7rem] px-[2.2rem]
                text-[1.15rem] font-bold
                bg-[#6D3811] rounded-[32px]
                text-[#FFFFFF]
                shadow-md
                hover:scale-[1.05]
                transition-all
              "
            >
              RESERVE NOW
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full flex flex-col items-center bg-[#f6f0e7]">
        {/* Tagline */}
        <div
          className="
            text-[1.15rem] text-[#222]
            mb-8 text-center max-w-[800px]
            px-10 pt-10 pb-8 mt-10
            max-[700px]:px-[1rem]
          "
        >
          <div
            className="
              text-[1.15rem] font-bold italic text-[#6d4c1b]
              text-center mb-[1.2rem]
            "
          >
            ”Diner28: Where gastronomy transcends dining.”
          </div>

          <div className="text-[#222] text-[1.08rem] leading-[1.7] text-center">
            <b>Diner28</b> is an elevated culinary sanctuary where innovation meets timeless elegance...
          </div>
        </div>

        {/* MARQUEE MENU */}
        <div id="menu-section" className="-mt-8 pt-8 bg-[#f6f0e7]">
          <MenuMarquee />
        </div>
      </div>
    </>
  );
}