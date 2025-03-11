"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  Button,
  InputNumber,
  Skeleton,
  Typography,
  message,
  Image,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface PrebuiltPC {
  id: string;
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
  stock: number;
  imageUrl?: string;
  description?: string;
}

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
  const [pcs, setPcs] = useState<PrebuiltPC[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchPrebuiltPCs = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/categories/PrebuiltPCs");
        if (!response.ok) {
          const text = await response.text();
          console.log("Raw response:", text);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: PrebuiltPC[] = await response.json();
        console.log("Fetched Prebuilt PCs:", data);
        setPcs(data);

        const initialQuantities = data.reduce((acc, pc) => {
          acc[pc.id] = 1;
          return acc;
        }, {} as { [key: string]: number });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Fetch error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrebuiltPCs();
  }, []);

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev) => {
      const updated = { ...prev };
      const currentValues = updated[category] || [];
      const newValue = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...updated, [category]: newValue };
    });
  };

  const filteredPCs = pcs.filter((pc) => {
    const categoryMatch = Object.entries(filters).every(([category, values]) => {
      if (!values.length) return true;
      if (category === "priceRange") return true;
      const pcValue = pc[category as keyof PrebuiltPC];
      return values.some((v) => v === pcValue);
    });

    const priceMatch = filters.priceRange?.length
      ? filters.priceRange.some((rangeLabel) => {
          const { min, max } = priceRangeOptions[rangeLabel];
          return pc.price >= min && pc.price <= max;
        })
      : true;

    return categoryMatch && priceMatch;
  });

  const handleQuantityChange = (id: string, value: number | null) => {
    if (value !== null && value > 0) {
      setQuantities((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleAddToCart = (id: string) => {
    const pc = pcs.find((p) => p.id === id);
    if (pc) {
      const quantity = quantities[id] || 1;
      message.success(`${pc.name} added to cart!`);
      // Add to cart logic here if you have a context like useCart
    }
  };

  const handleAddToFavorites = (id: string) => {
    const pc = pcs.find((p) => p.id === id);
    if (pc) {
      message.success(`${pc.name} added to favorites!`);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/prebuilt-pcs/${id}`);
  };

  return (
    <div className="flex">
      <div className="w-64 bg-gray-900 text-white p-4 border-r border-red-500">
        <h2 className="text-xl font-bold text-red-500 mb-4">Filters</h2>
        {Object.entries(categories).map(([category, options]) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">
              {category.replace(/([A-Z])/g, " $1")}
            </h3>
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
      </div>

      <div className="flex-1 container mx-auto md:px-36 px-12 py-12">
        <Link href="/prebuilt-pcs">
          <Title
            level={2}
            style={{
              color: "#1890ff",
              marginBottom: "40px",
              textAlign: "start",
              fontWeight: "bold",
            }}
          >
            Real Prebuilt PCs <ArrowRightOutlined />
          </Title>
        </Link>

        {loading ? (
          <Row gutter={[24, 24]} justify="start">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Skeleton
                    active
                    avatar
                    paragraph={{ rows: 4 }}
                    style={{ padding: "16px", background: "#fff", borderRadius: "8px" }}
                  />
                </Col>
              ))}
          </Row>
        ) : error ? (
          <Text className="text-red-500">{error}</Text>
        ) : filteredPCs.length === 0 ? (
          <Text>No Prebuilt PCs found.</Text>
        ) : (
          <Row gutter={[24, 24]} justify="start">
            {filteredPCs.map((pc) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pc.id}>
                <Card
                  hoverable
                  className="rounded-lg shadow-md relative h-full flex flex-col justify-between"
                  style={{ minHeight: "fit-content" }}
                  cover={
                    pc.imageUrl ? (
                      <Image
                        src={pc.imageUrl}
                        alt={pc.name}
                        height={200}
                        className="object-cover rounded-t-lg"
                        preview={true}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="h-52 bg-gray-200 flex items-center justify-center rounded-t-lg">
                        <Text type="secondary">No Image Available</Text>
                      </div>
                    )
                  }
                >
                  <Button
                    type="text"
                    icon={<HeartOutlined className="text-red-500 text-xl" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToFavorites(pc.id);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100"
                  />
                  <div
                    className="flex flex-col justify-between flex-grow"
                    onClick={() => handleCardClick(pc.id)}
                  >
                    <Card.Meta
                      title={
                        <Text strong className="text-lg text-gray-800 font-semibold">
                          {pc.name}
                        </Text>
                      }
                      description={
                        <Text className="text-gray-600 text-sm mt-2 block">
                          {pc.description || `${pc.processor}, ${pc.graphicsCard}, ${pc.ramSize} ${pc.ramType}`}
                        </Text>
                      }
                    />
                    <div className="mt-2">
                      <Text className="text-green-600 font-semibold">${pc.price.toFixed(2)}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <InputNumber
                        min={1}
                        max={pc.stock}
                        value={quantities[pc.id]}
                        onChange={(value) => handleQuantityChange(pc.id, value)}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(pc.id);
                        }}
                        size="small"
                        className="bg-blue-500 border-blue-500 text-white rounded-md px-3"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Page;