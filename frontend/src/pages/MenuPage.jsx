// src/pages/MenuPage.jsx
import React, { useEffect, useState } from 'react';

export default function MenuPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/food.json')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  if (items.length === 0) {
    return (
      <div className="pt-14 p-6 text-center text-gray-500">
        Loading menu...
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-[#f6f0e7]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold text-center text-[#6d4c1b] mb-12 tracking-tight">
          Full Menu
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={item.FoodIMG}
                alt={item.Food}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#6d4c1b] mb-3">
                  {item.Food}
                </h3>
                <p className="text-[#444] text-sm leading-relaxed">
                  {item.FoodDes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}