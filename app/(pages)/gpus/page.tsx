"use client";
import Layout from '@/app/components/Layout';
import { useCart } from '@/app/context/CardContext';
import React, { useState } from "react";

interface GPU {
  name: string;
  edition: string;
  brand: string; // AMD, NVIDIA, or Intel
  architecture: string;
  coreClock: string;
  boostClock: string;
  memory: string;
  memoryType: string;
  tdp: string;
  price: string;
  discount?: string;
  sku: string;
  condition: string;
  coprocessor: string;
  quantity?: number;
}

const gpuData: GPU[] = [{
    name: "Gigabyte GeForce RTX 3050 OC",
    edition: "GV-N3050OC-6GL",
    brand: "GIGABYTE",
    architecture: "Ampere",
    coreClock: "1395 MHz",
    boostClock: "1830 MHz",
    memory: "6GB",
    memoryType: "GDDR6",
    tdp: "130W",
    price: "140 USD",
    discount: "10% off with Banque Misr cards",
    sku: "GV-N3050OC-6GL",
    condition: "New",
    coprocessor: "NVIDIA GeForce RTX 3050",
  },
  {
    name: "ASUS TUF Gaming GeForce RTX 3060",
    edition: "TUF-GAMING-RTX3060-12G",
    brand: "ASUS",
    architecture: "Ampere",
    coreClock: "1320 MHz",
    boostClock: "1777 MHz",
    memory: "12GB",
    memoryType: "GDDR6",
    tdp: "170W",
    price: "329 USD",
    discount: "15% off with Citibank cards",
    sku: "TUF-GAMING-RTX3060-12G",
    condition: "New",
    coprocessor: "NVIDIA GeForce RTX 3060",
  },]

  const categories = {
    price: ["0-100", "100-500", "500-1000", "1000-2000", "2000+"],
    brand: ["ASUS", "GIGABYTE", "XFX", "MSI", "Sapphire", "PNY", "VisionTek"],
    architecture: ["Ada Lovelace", "Ampere", "RDNA 3", "RDNA 2", "Turing"],
    memory: ["6GB", "8GB", "12GB", "16GB", "24GB"],
    memoryType: ["GDDR6", "GDDR6X"],
    tdp: ["130W", "170W", "200W", "220W", "300W", "350W", "450W"],
    condition: ["Renewed", "New", "Used"],
    coprocessor: [
      "NVIDIA GeForce GTX 1650", "NVIDIA GeForce RTX 3050", "NVIDIA GeForce RTX 3060", "NVIDIA GeForce RTX 3070", "NVIDIA GeForce RTX 3080", "NVIDIA GeForce RTX 3090", "NVIDIA GeForce RTX 4060", "NVIDIA GeForce RTX 4070", "NVIDIA GeForce RTX 4080", "NVIDIA GeForce RTX 4090", "NVIDIA GeForce GT 1030", "NVIDIA GeForce GT 730",
      "AMD Radeon RX 550", "AMD Radeon RX 560", "AMD Radeon RX 570", "AMD Radeon RX 580", "AMD Radeon RX 6500 XT", "AMD Radeon RX 6600 XT", "AMD Radeon RX 6700 XT", "AMD Radeon RX 6800 XT", "AMD Radeon RX 6900 XT", "AMD Radeon RX 7600", "AMD Radeon RX 7700 XT", "AMD Radeon RX 7800 XT", "AMD Radeon RX 7900 XT", "AMD Radeon RX 7900 XTX",
      "Intel Arc A310", "Intel Arc A380", "Intel Arc A750", "Intel Arc A770"
    ],
  };

  const Page: React.FC = () => {
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const { addToCart } = useCart();
    const handleFilterChange = (category: string, value: string) => {
      setFilters((prev) => {
        const updatedFilters = { ...prev };
        if (!updatedFilters[category]) {
          updatedFilters[category] = [];
        }
        if (updatedFilters[category].includes(value)) {
          updatedFilters[category] = updatedFilters[category].filter(
            (item) => item !== value
          );
        } else {
          updatedFilters[category] = [...updatedFilters[category], value];
        }
        return updatedFilters;
      });
    };
  
    const filteredGPUs = gpuData.filter((gpu) => {
      return Object.entries(filters).every(([category, values]) => {
        if (values.length === 0) return true;
  
        if (category === "price") {
          const gpuPrice = parseFloat(gpu.price.replace(/[^0-9.]/g, ""));
          return values.some((range) => {
            const [min, max] = range.split("-").map(Number);
            return gpuPrice >= min && (!max || gpuPrice <= max);
          });
        }
  
        return values.includes((gpu as any)[category]);
      });
    });
  
    return (
      <Layout>
      <div className="flex">
        {/* Filters */}
        <div className="w-64 bg-gray-900 text-white p-4 border-r border-red-500">
          <h2 className="text-xl font-bold text-red-500 mb-4">Filters</h2>
          {Object.entries(categories).map(([category, options]) => (
            <div key={category} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer text-sm"
                >
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
        </div>
  
        {/* GPU Cards */}
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Real GPUs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGPUs.map((gpu) => (
              <div
                key={gpu.sku}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-700 ">{gpu.name}</h3>
                <p className="text-gray-700">
                   {gpu.brand}, {gpu.architecture}, {gpu.memory} {gpu.memoryType}, {gpu.tdp},{gpu.edition}
                </p>
                <p className="text-red-500 font-bold">${gpu.price}</p>
                {gpu.discount && <p className="text-gray-500 line-through">{gpu.discount}</p>}
  
                {/* Add to Cart Button */}
                <button 
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => addToCart({ sku: gpu.sku, name: gpu.name, price: gpu.price, quantity: 1 } as any)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      </Layout>
    );
  };
  
  
  
  export default Page;