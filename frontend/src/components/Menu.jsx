import React, { useEffect, useState } from 'react';

export default function Menu() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/food.json')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div
      id="menu-section"
      className="
        w-full max-w-[1100px]
        mx-auto mt-12
        px-4
        flex flex-col items-center
      "
    >
      <h2
        className="
          text-[2.2rem] font-extrabold text-[#6d4c1b]
          mb-8 tracking-[1px] text-center
        "
      >
        Menu
      </h2>

      <div
        className="
          flex flex-wrap gap-8 justify-center w-full
          max-[700px]:gap-4
        "
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="
              bg-white rounded-2xl
              shadow-[0_2px_16px_rgba(0,0,0,0.07)]
              overflow-hidden
              w-[300px] flex flex-col
              transition-transform transition-shadow duration-150
              hover:-translate-y-[6px] hover:scale-[1.03]
              hover:shadow-[0_6px_24px_rgba(0,0,0,0.13)]
              max-[700px]:w-[98vw] max-[700px]:max-w-[340px]
            "
          >
            <img
              src={item.FoodIMG}
              alt={item.Food}
              className="
                w-full h-[180px] object-cover bg-[#eee]
                max-[700px]:h-[140px]
              "
            />

            <div
              className="
                p-[1.2rem] pb-[1.5rem]
                flex flex-col gap-[0.7rem]
              "
            >
              <div
                className="
                  text-[1.15rem] font-bold text-[#6d4c1b]
                  mb-[0.2rem]
                "
              >
                {item.Food}
              </div>

              <div
                className="
                  text-[1rem] text-[#444]
                  leading-[1.5]
                "
              >
                {item.FoodDes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
