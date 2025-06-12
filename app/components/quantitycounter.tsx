'use client';
import { useState } from "react";

// Quantity Counter Component
export default function QuantityCounter() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center bg-gray-300 border border-blue-300">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="w-8 h-6 flex items-center justify-center border-r border-blue-300 text-gray-800 hover:bg-gray-400"
      >
        -
      </button>
      <div className="w-10 h-6 text-sm flex items-center justify-center border-r border-blue-300 text-gray-800">
        {quantity}
      </div>
      <button
        onClick={() => setQuantity(quantity + 1)}
        className="w-8 h-6 text-sm flex items-center justify-center text-gray-800 hover:bg-gray-400"
      >
        +
      </button>
    </div>
  );
}