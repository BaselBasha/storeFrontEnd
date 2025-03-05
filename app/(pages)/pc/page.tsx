"use client";

import React, { useState } from "react";
import Image from "next/image";

interface PrebuiltPC {
  name: string;
  brand: string;
  processor: string;
  ramSize: string;
  ramType: string;
  storageType: string;
  storageSize: string;
  graphicsCard: string;
  price: number;
  discount?: string;
  sku: string;
  condition: string;
  os: string;
 
}

const pcData: PrebuiltPC[] = [
    {
        name: "Alienware Aurora R15",
        brand: "Alienware",
        processor: "Intel Core i9 13900K",
        ramSize: "32GB",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageSize: "2TB",
        graphicsCard: "NVIDIA RTX 4090",
        price: 2500,
        discount: "Originally $2,800",
        sku: "ALW-AURORA-R15",
        condition: "New",
        os: "Windows 11",
        
      },
      {
        name: "Origin PC EON17-SLX",
        brand: "Origin PC",
        processor: "AMD Ryzen 9 7945HX",
        ramSize: "64GB",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageSize: "4TB",
        graphicsCard: "NVIDIA RTX 4090",
        price: 3200,
        sku: "ORIGIN-EON17-SLX",
        condition: "New",
        os: "Windows 11",
        
      },
      {
        name: "Digital Storm Icon",
        brand: "Digital Storm",
        processor: "Intel Core i7 13700K",
        ramSize: "16GB",
        ramType: "DDR4",
        storageType: "SSD",
        storageSize: "1TB",
        graphicsCard: "NVIDIA RTX 3060",
        price: 1200,
        sku: "DS-ICON-2023",
        condition: "New",
        os: "Windows 10",
        
      },
      {
        name: "CyberPowerPC Gamer Supreme",
        brand: "CyberPowerPC",
        processor: "AMD Ryzen 7 7800X",
        ramSize: "16GB",
        ramType: "DDR4",
        storageType: "SSD",
        storageSize: "512GB",
        graphicsCard: "NVIDIA RTX 3070",
        price: 1800,
        sku: "CPP-GS-RTX3070",
        condition: "New",
        os: "Windows 11",
        
      },
      {
        name: "NZXT H5 Flow",
        brand: "NZXT",
        processor: "Intel Core i5 13400F",
        ramSize: "16GB",
        ramType: "DDR4",
        storageType: "NVMe SSD",
        storageSize: "1TB",
        graphicsCard: "NVIDIA RTX 4070 Ti",
        price: 2200,
        sku: "NZXT-H5-Ti",
        condition: "New",
        os: "Windows 11",
       
      },
      {
        name: "Lenovo Legion Tower 5i",
        brand: "Lenovo",
        processor: "AMD Ryzen 7 7800",
        ramSize: "32GB",
        ramType: "DDR4",
        storageType: "HDD+SSD",
        storageSize: "2TB+512GB",
        graphicsCard: "NVIDIA RTX 4060 Ti",
        price: 1500,
        sku: "LENOVO-LEGION-5I",
        condition: "New",
        os: "Windows 11",
       
      },
      {
        name: "HP Omen 30L",
        brand: "HP",
        processor: "Intel Core i7 12700",
        ramSize: "16GB",
        ramType: "DDR4",
        storageType: "SSD",
        storageSize: "512GB",
        graphicsCard: "NVIDIA RTX 3060",
        price: 1100,
        sku: "HP-OMEN-30L",
        condition: "New",
        os: "Windows 11",
       
      },
      {
        name: "Dell Alienware Aurora R13",
        brand: "Dell",
        processor: "Intel Core i9 12900K",
        ramSize: "64GB",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageSize: "4TB",
        graphicsCard: "NVIDIA RTX 3090",
        price: 2800,
        discount: "Originally $3,100",
        sku: "DELL-AURORA-R13",
        condition: "Refurbished",
        os: "Windows 10",
      
      },
      {
        name: "Vexel V271 Basic",
        brand: "Vexel",
        processor: "Intel Core i5 12600",
        ramSize: "8GB",
        ramType: "DDR4",
        storageType: "SSD",
        storageSize: "256GB",
        graphicsCard: "Integrated GPU",
        price: 600,
        sku: "VEX-V271-BASIC",
        condition: "New",
        os: "Windows 10",
       
      },
      {
        name: "Maingear Shift 4.0",
        brand: "Maingear",
        processor: "AMD Ryzen 9 7950X",
        ramSize: "64GB",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageSize: "2TB",
        graphicsCard: "NVIDIA RTX 4080",
        price: 3000,
        sku: "MAINGEAR-SHIFT-4",
        condition: "New",
        os: "Windows 11",
      
      },
      {
        name: "System76 Pangolin Pro",
        brand: "System76",
        processor: "Intel Core i7 13700",
        ramSize: "32GB",
        ramType: "DDR4",
        storageType: "NVMe SSD",
        storageSize: "1TB",
        graphicsCard: "NVIDIA RTX 4060",
        price: 1300,
        sku: "SYS76-PANGOLIN-PRO",
        condition: "New",
        os: "Pop!_OS",
       
      },
      {
        name: "Puget Systems Velocity",
        brand: "Puget Systems",
        processor: "AMD Ryzen 9 7900",
        ramSize: "64GB",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageSize: "4TB",
        graphicsCard: "NVIDIA RTX 4070",
        price: 2000,
        sku: "PUGET-VELOCITY",
        condition: "New",
        os: "Windows 11",
      
      },
      {
        name: "Falcon Northwest Talon",
        brand: "Falcon Northwest",
        processor: "Intel Core i9 13900K",
        ramSize: "32GB",
        ramType: "DDR5",
        storageType: "NVMe SSD",
        storageSize: "2TB",
        graphicsCard: "NVIDIA RTX 4080",
        price: 2900,
        sku: "FALCON-TALON",
        condition: "New",
        os: "Windows 11",
       
      },
      {
        name: "Velocity Micro Edge",
        brand: "Velocity Micro",
        processor: "AMD Ryzen 7 5800G",
        ramSize: "16GB",
        ramType: "DDR4",
        storageType: "SSD",
        storageSize: "512GB",
        graphicsCard: "NVIDIA RTX 3070",
        price: 1700,
        sku: "VM-EDGE-RTX3070",
        condition: "New",
        os: "Windows 10",
       
      },
      {
        name: "MSI Modern MD34",
        brand: "MSI",
        processor: "Intel Core i5 12400",
        ramSize: "8GB",
        ramType: "DDR4",
        storageType: "SSD",
        storageSize: "512GB",
        graphicsCard: "Integrated GPU",
        price: 900,
        sku: "MSI-MODERN-MD34",
        condition: "New",
        os: "Windows 11",
      
      }
];

const categories: Record<string, string[]> = {
  brand: ["Alienware", "Origin PC", "Digital Storm", "CyberPowerPC", "Vexel", "NZXT", "System76", "Puget Systems", "Velocity Micro", "Falcon Northwest", "Maingear", "HP Omen", "Lenovo Legion", "MSI Modern"],
  processor: ["Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"],
  ramType: ["DDR4", "DDR5"],
  ramSize: ["8GB", "16GB", "32GB", "64GB"],
  storageType: ["HDD", "SSD", "NVMe"],
  storageSize: ["256GB", "512GB", "1TB", "2TB", "4TB"],
  graphicsCard: ["RTX 3060", "RTX 3070", "RTX 4060", "RTX 4060 Ti", "RTX 4070", "RTX 4070 Ti", "RTX 4080", "RTX 4090", "GTX 1660 Ti", "Integrated GPU"],
  os: ["Windows 10", "Windows 11", "Linux"],
  condition: ["New", "Refurbished"],
  priceRange: ["Under $500", "$500-$1000", "$1000-$1500", "$1500-$2000", "Over $2000"]
};

const priceRangeOptions: Record<string, { min: number; max: number }> = {
  "Under $500": { min: 0, max: 500 },
  "$500-$1000": { min: 500, max: 1000 },
  "$1000-$1500": { min: 1000, max: 1500 },
  "$1500-$2000": { min: 1500, max: 2000 },
  "Over $2000": { min: 2000, max: Infinity }
};

const Page: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      const currentValues = updated[category] || [];
      const newValue = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...updated, [category]: newValue };
    });
  };

  const filteredPCs = pcData.filter((pc) => {
    const categoryMatch = Object.entries(filters).every(([category, values]) => {
      if (!values.length) return true;
      const pcValue = pc[category as keyof PrebuiltPC];
      return values.some(v => v === pcValue);
    });

    const priceMatch = filters.priceRange?.length
      ? filters.priceRange.some(rangeLabel => {
          const { min, max } = priceRangeOptions[rangeLabel];
          return pc.price >= min && pc.price <= max;
        })
      : true;

    return categoryMatch && priceMatch;
  });

  return (
    <div className="flex">
      <div className="w-64 bg-gray-900 text-white p-4 border-r border-red-500">
        <h2 className="text-xl font-bold text-red-500 mb-4">Filters</h2>
        {Object.entries(categories).map(([category, options]) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">{category.replace(/([A-Z])/g, " $1")}</h3>
            {options.map(option => (
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
      </div>
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Prebuilt PCs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPCs.map(pc => (
            <div 
              key={pc.sku}
              className="bg-black shadow-md rounded-lg border border-gray-200 overflow-hidden"
            >
             
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 ">{pc.name}</h3>
                <p className="text-gray-400 mb-1">Processor: {pc.processor}</p>
                <p className="text-gray-400 mb-1">RAM: {pc.ramSize} {pc.ramType}</p>
                <p className="text-gray-400 mb-1">Storage: {pc.storageType} {pc.storageSize}</p>
                <p className="text-gray-400 mb-2">GPU: {pc.graphicsCard}</p>
                <p className="text-red-500 font-bold text-lg mb-1">${pc.price.toFixed(2)}</p>
                {pc.discount && (
                  <p className="text-gray-500 line-through mb-2">{pc.discount}</p>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="bg-gray-700 px-2 py-1 rounded">{pc.os}</span>
                  <span className="bg-gray-700 px-2 py-1 rounded">{pc.condition}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;