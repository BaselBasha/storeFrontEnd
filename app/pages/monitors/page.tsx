"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CardContext";
interface Monitor {
  name: string;
  brand: string;
  screenSize: string;
  resolution: string;
  refreshRate: string;
  panelType: string;
  responseTime: string;
  price: number;
  discount?: string;
  sku: string;
  condition: string;
}

const monitorData: Monitor[] = [
  {
    name: "ASUS TUF Gaming VG27AQ",
    brand: "ASUS",
    screenSize: "27 inches",
    resolution: "2560x1440",
    refreshRate: "165Hz",
    panelType: "IPS",
    responseTime: "1ms",
    price: 350,
    discount: "5% off with VISA cards",
    sku: "VG27AQ",
    condition: "New",
  },
  {
    name: "LG UltraGear 32GN650-B",
    brand: "LG",
    screenSize: "32 inches",
    resolution: "2560x1440",
    refreshRate: "165Hz",
    panelType: "VA",
    responseTime: "1ms",
    price: 299,
    discount: "10% off with Mastercard",
    sku: "32GN650-B",
    condition: "New",
  },
  {
    name: "Dell S2721DGF",
    brand: "Dell",
    screenSize: "27 inches",
    resolution: "2560x1440",
    refreshRate: "165Hz",
    panelType: "IPS",
    responseTime: "1ms",
    price: 380,
    sku: "S2721DGF",
    condition: "New",
  },
  {
    name: "Acer Nitro XV272U",
    brand: "Acer",
    screenSize: "27 inches",
    resolution: "2560x1440",
    refreshRate: "144Hz",
    panelType: "IPS",
    responseTime: "1ms",
    price: 320,
    sku: "XV272U",
    condition: "New",
  },
  {
    name: "Samsung Odyssey G7",
    brand: "Samsung",
    screenSize: "32 inches",
    resolution: "2560x1440",
    refreshRate: "240Hz",
    panelType: "VA",
    responseTime: "1ms",
    price: 550,
    discount: "$50 off for students",
    sku: "G7-32",
    condition: "New",
  },
];

const categories: Record<string, string[]> = {
  brand: ["ASUS", "LG", "Acer", "Dell", "BenQ", "MSI", "Samsung"],
  screenSize: ["24 inches", "27 inches", "32 inches", "34 inches", "49 inches"],
  resolution: ["1920x1080", "2560x1440", "3440x1440", "3840x2160"],
  refreshRate: ["60Hz", "120Hz", "144Hz", "165Hz", "240Hz"],
  panelType: ["IPS", "VA", "TN"],
  responseTime: ["1ms", "2ms", "5ms"],
  condition: ["New", "Used", "Renewed"],
};

const Page: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [price, setPrice] = useState<number>(1000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const { addToCart } = useCart();
  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      updatedFilters[category] = updatedFilters[category]?.includes(value)
        ? updatedFilters[category].filter((item) => item !== value)
        : [...(updatedFilters[category] || []), value];
      return updatedFilters;
    });
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(Number(event.target.value));
  };

  const filteredMonitors = monitorData.filter((monitor) => {
    return (
      monitor.price >= minPrice &&
      monitor.price <= price &&
      Object.entries(filters).every(([category, values]) =>
        values.length === 0 || values.includes((monitor as any)[category])
      )
    );
  });
  return (
    <div className="flex">
      <div className="w-64 bg-gray-900 text-white p-4 border-r border-red-500">
        <h2 className="text-xl font-bold text-red-500 mb-4">Filters</h2>
        {Object.entries(categories).map(([category, options]) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={filters[category]?.includes(option) || false}
                  onChange={() => handleFilterChange(category, option)}
                  className="form-checkbox text-red-500 bg-gray-700 border-gray-500 rounded focus:ring-red-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Monitors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMonitors.map((monitor) => (
            <div key={monitor.sku} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Image</span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-bold text-gray-800">{monitor.name}</h3>
                <p className="text-sm text-gray-600">{monitor.screenSize}</p>
                <p className="text-sm text-gray-500">{monitor.brand}, {monitor.resolution}, {monitor.refreshRate}, {monitor.responseTime}, {monitor.condition}</p>
                <p className="text-green-600 font-semibold">${monitor.price}</p>
                {monitor.discount && <p className="text-yellow-600 font-medium">{monitor.discount}</p>}
                <button 
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => addToCart({ sku: monitor.sku, name: monitor.name, price: monitor.price, quantity: 1 } as any)}
              >
                Add to Cart
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;