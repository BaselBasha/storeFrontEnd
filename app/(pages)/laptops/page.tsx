"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CardContext";

interface Laptop {
  name: string;
  brand: string;
  screenSize: string;
  resolution: string;
  processor: string;
  ram: string;
  storage: string;
  gpu: string;
  price: number;
  discount?: string;
  sku: string;
  condition: string;
}

const laptopData: Laptop[] = [
  {
    name: "MSI GS77 Ghost",
    brand: "MSI",
    screenSize: "17 inches",
    resolution: "3840x2400",
    processor: "Intel i9-13950HX",
    ram: "64GB DDR5",
    storage: "4TB SSD",
    gpu: "RTX 4090",
    price: 4299,
    discount: "Limited stock offer",
    sku: "MSI-GS77-Ghost",
    condition: "New",
    
  },
  {
    name: "Google Pixelbook Go",
    brand: "Google",
    screenSize: "13.3 inches",
    resolution: "1920x1080",
    processor: "Intel i5-1240P",
    ram: "8GB LPDDR4x",
    storage: "128GB SSD",
    gpu: "Integrated",
    price: 699,
    discount: "Chrome OS upgrade kit",
    sku: "PixelbookGo",
    condition: "New",
    
  },
  {
    name: "Acer Swift X",
    brand: "Acer",
    screenSize: "14 inches",
    resolution: "1920x1200",
    processor: "AMD Ryzen 7 7840U",
    ram: "16GB LPDDR5",
    storage: "1TB SSD",
    gpu: "Integrated",
    price: 1199,
    discount: "3-year warranty",
    sku: "SwiftX-7840U",
    condition: "New",
    
  },
  {
    name: "Huawei MateBook X Pro",
    brand: "Huawei",
    screenSize: "14.2 inches",
    resolution: "3120x2080",
    processor: "Intel i7-1360P",
    ram: "16GB LPDDR5",
    storage: "1TB SSD",
    gpu: "Integrated",
    price: 1799,
    discount: "Free stylus included",
    sku: "MateBookXPro-2023",
    condition: "New",
   
  },
  {
    name: "ASUS ZenBook Pro 16X",
    brand: "ASUS",
    screenSize: "16 inches",
    resolution: "3200x2000",
    processor: "AMD Ryzen 9 7945HX",
    ram: "32GB DDR5",
    storage: "2TB SSD",
    gpu: "RTX 4070",
    price: 2599,
    discount: "Student bundle offer",
    sku: "ZenBookPro16X",
    condition: "New",
    
  },
  {
    name: "Fujitsu LIFEBOOK U938",
    brand: "Fujitsu",
    screenSize: "13.3 inches",
    resolution: "1920x1080",
    processor: "Intel i5-1240P",
    ram: "16GB LPDDR4x",
    storage: "512GB SSD",
    gpu: "Integrated",
    price: 1399,
    discount: "Business discount",
    sku: "FujitsuU938",
    condition: "New",
    
  },
  {
    name: "Samsung Galaxy Book3 Pro 16",
    brand: "Samsung",
    screenSize: "16 inches",
    resolution: "3000x1875",
    processor: "Intel i9-13900H",
    ram: "16GB LPDDR5",
    storage: "512GB SSD",
    gpu: "RTX 4050",
    price: 1999,
    discount: "Free S Pen",
    sku: "GalaxyBook3-16",
    condition: "New",
    
  },
  {
    name: "Toshiba dynabook R74/W",
    brand: "Toshiba",
    screenSize: "14 inches",
    resolution: "1920x1080",
    processor: "AMD Ryzen 5 5625U",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    gpu: "Integrated",
    price: 799,
    discount: "Refurbished - 1 year warranty",
    sku: "ToshibaR74W",
    condition: "Refurbished",
   
  },
  {
    name: "VAIO Pro 15 Gen 7",
    brand: "VAIO",
    screenSize: "15.6 inches",
    resolution: "1920x1080",
    processor: "Intel i7-1360P",
    ram: "16GB LPDDR5",
    storage: "512GB SSD",
    gpu: "Integrated",
    price: 1499,
    discount: "Japanese design edition",
    sku: "VAIOPro15-Gen7",
    condition: "New",
    
  },
  {
    name: "Sony VGN-Z54BN",
    brand: "Sony",
    screenSize: "13.3 inches",
    resolution: "1920x1080",
    processor: "Intel i5-1240P",
    ram: "8GB LPDDR4x",
    storage: "256GB SSD",
    gpu: "Integrated",
    price: 1199,
    discount: "Vintage design special",
    sku: "SonyVGN-Z54BN",
    condition: "New",
    
  },

];const categories: Record<string, string[]> = {
  brand: ["ASUS", "Dell", "Acer", "Lenovo", "MSI", "HP", "Razer"],
  screenSize: ["13 inches", "14 inches", "15.6 inches", "16 inches", "17 inches"],
  resolution: ["1920x1080", "2560x1600", "3840x2160"],
  processor: ["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"],
  ram: ["8GB", "16GB", "32GB", "64GB"],
  storage: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"],
  gpu: ["RTX 3050", "RTX 3060", "RTX 3070", "RTX 4060", "RTX 4070", "RTX 4080", "RTX 4090"],
  condition: ["New", "Used", "Refurbished"],
};

const Page: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const { addToCart } = useCart();

  // Handle filter changes
  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      if (!updatedFilters[category]) {
        updatedFilters[category] = [];
      }
      if (updatedFilters[category].includes(value)) {
        updatedFilters[category] = updatedFilters[category].filter((item) => item !== value);
      } else {
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      return updatedFilters;
    });
  };

  // Apply filters to laptops
  const filteredLaptops = laptopData.filter((laptop) => {
    return Object.entries(filters).every(([category, values]) => {
      if (values.length === 0) return true; // No filter applied for this category
      const laptopValue = laptop[category as keyof Laptop]?.toString().toLowerCase(); // Get laptop property value
      return values.some((value) => laptopValue?.includes(value.toLowerCase())); // Check if any filter matches
    });
  });

  return (
    <div className="flex">
      {/* Filters Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 border-r border-red-500">
        <h2 className="text-xl font-bold text-red-500 mb-4">Filters</h2>
        {Object.entries(categories).map(([category, options]) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">{category.replace(/([A-Z])/g, " $1")}</h3>
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={filters[category]?.includes(option) || false}
                  onChange={() => handleFilterChange(category, option)}
                  className="form-checkbox text-red-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ))}
      </div>{/* Laptops List */}
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Laptops</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredLaptops.map((laptop) => (
            <div
              key={laptop.sku}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 overflow-hidden"
            >
              <h3 className="text-lg font-semibold text-gray-700">{laptop.name}</h3>
              <p className="text-gray-700">
                {laptop.screenSize}, {laptop.resolution}
              </p>
              <p className="text-gray-700">
                {laptop.processor}, {laptop.ram}, {laptop.storage}, {laptop.gpu}, {laptop.condition}
              </p>
              <p className="text-red-500 font-bold">${laptop.price.toFixed(2)}</p>
              {laptop.discount && <p className="text-gray-500 line-through">{laptop.discount}</p>}
              <button
                onClick={() =>
                  addToCart({ sku: laptop.sku, name: laptop.name, price: laptop.price, quantity: 1 } as any)
                }
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;