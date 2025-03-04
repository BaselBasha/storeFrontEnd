"use client";

import React, { useState, useEffect } from "react";

interface GPU {
  name: string;
  edition: string;
  price: string;
  sku: string;
}

const Page: React.FC = () => {
  const [cart, setCart] = useState<GPU[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const removeFromCart = (sku: string) => {
    const updatedCart = cart.filter((item) => item.sku !== sku);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((gpu) => (
            <div key={gpu.sku} className="bg-gray-800 text-white p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{gpu.name}</h3>
                <p className="text-green-400 font-semibold">{gpu.price}</p>
              </div>
              <button
                onClick={() => removeFromCart(gpu.sku)}
                className="bg-red-500 py-1 px-3 rounded hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;