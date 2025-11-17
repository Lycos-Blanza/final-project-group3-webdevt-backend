// src/components/MenuMarquee.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← ADD THIS

export default function MenuMarquee() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate(); // ← ADD THIS

  useEffect(() => {
    fetch('/food.json')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  if (items.length === 0) {
    return <div className="py-20 text-center text-gray-500">Loading...</div>;
  }

  const duplicated = [...items, ...items]; // for seamless loop

  return (
    <div className="w-full bg-[#f6f0e7] py-12 overflow-hidden">
      <h2 className="text-5xl font-extrabold text-center text-[#6d4c1b] mb-6">
        Menu Preview
      </h2>

      {/* View Full Menu Button – NOW REDIRECTS TO /menu */}
      <div className="text-center mb-10">
        <button
          onClick={() => navigate("/menu")} // ← CHANGED: redirect to /menu
          className="
            inline-block px-8 py-3 bg-[#6D3811] text-white font-bold
            rounded-full shadow-lg hover:bg-[#5a2e0d] hover:scale-105
            transition-all duration-300
          "
        >
          View Full Menu
        </button>
      </div>

      {/* Marquee Container */}
      <div className="relative max-w-screen-2xl mx-auto overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap group">
          {duplicated.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex-shrink-0 mx-4 w-80 md:w-96 group-hover:animation-paused"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all">
                <img
                  src={item.FoodIMG}
                  alt={item.Food}
                  className="w-full h-56 md:h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#6d4c1b] mb-2">
                    {item.Food}
                  </h3>
                  <p className="text-sm text-[#444] line-clamp-2">
                    {item.FoodDes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fade Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f6f0e7] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f6f0e7] to-transparent z-10" />
      </div>
    </div>
  );
}