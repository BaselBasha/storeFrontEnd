"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/CardContext";
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
import Layout from "@/app/components/Layout";

const { Title, Text } = Typography;

interface Laptop {
  id: string;
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
  stock: number;
  imageUrl?: string;
  description: string;
}

const categories: Record<string, string[]> = {
  brand: ["ASUS", "Dell", "Acer", "Lenovo", "MSI", "HP", "Razer", "Google", "Huawei", "Fujitsu", "Samsung", "Toshiba", "VAIO", "Sony"],
  screenSize: ["13.3 inches", "14 inches", "14.2 inches", "15.6 inches", "16 inches", "17 inches"],
  resolution: ["1920x1080", "1920x1200", "2560x1600", "3000x1875", "3120x2080", "3200x2000", "3840x2160", "3840x2400"],
  processor: ["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"],
  ram: ["8GB", "16GB", "32GB", "64GB"],
  storage: ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "4TB SSD"],
  gpu: ["Integrated", "RTX 3050", "RTX 3060", "RTX 3070", "RTX 4050", "RTX 4060", "RTX 4070", "RTX 4080", "RTX 4090"],
  condition: ["New", "Used", "Refurbished"],
};

const LaptopsPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isMounted, setIsMounted] = useState<boolean>(false); // Added to track client-side mounting
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Mark as mounted on client

    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/categories/Laptops");
        if (!response.ok) {
          const text = await response.text();
          console.log("Raw response:", text);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Laptop[] = await response.json();
        setLaptops(data);

        // Initialize quantities
        const initialQuantities = data.reduce((acc, laptop) => {
          acc[laptop.id] = 1;
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

    fetchLaptops();

    return () => setIsMounted(false); // Cleanup
  }, []);

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
  const filteredLaptops = laptops.filter((laptop) => {
    return Object.entries(filters).every(([category, values]) => {
      if (values.length === 0) return true;
      const laptopValue = laptop[category as keyof Laptop]?.toString().toLowerCase();
      return values.some((value) => laptopValue?.includes(value.toLowerCase()));
    });
  });

  // Handle quantity change
  const handleQuantityChange = (id: string, value: number | null) => {
    if (value !== null) {
      setQuantities((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Handle add to cart
  const handleAddToCart = (id: string) => {
    const laptop = laptops.find((l) => l.id === id);
    if (laptop) {
      addToCart({
        sku: laptop.sku,
        name: laptop.name,
        price: laptop.price,
        quantity: quantities[id] || 1,
      } as any);
      message.success(`${laptop.name} added to cart!`);
    }
  };

  // Handle add to favorites (placeholder)
  const handleAddToFavorites = (id: string) => {
    const laptop = laptops.find((l) => l.id === id);
    if (laptop) {
      message.success(`${laptop.name} added to favorites!`);
      // Implement favorites logic here if needed
    }
  };

  // Render nothing until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null; // Or a static placeholder that matches server render
  }

  return (
    <Layout>
    <div className="flex">
      {/* Filters Sidebar (Loads Immediately) */}
      <div className="w-64 bg-gray-900 text-white p-4 border-r border-red-500">
        <h2 className="text-xl font-bold text-red-500 mb-4">Filters</h2>
        {Object.entries(categories).map(([category, options]) => (
          <div key={category} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 capitalize">
              {category.replace(/([A-Z])/g, " $1")}
            </h3>
            {options.map((option) => (
              <label
                key={`${category}-${option}`}
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

      {/* Main Content */}
      <div className="flex-1 container mx-auto md:px-36 px-12 py-12">
        <Link href="/laptops">
          <Title
            level={2}
            style={{
              color: "#1890ff",
              marginBottom: "40px",
              textAlign: "start",
              fontWeight: "bold",
            }}
          >
            Real Laptops <ArrowRightOutlined />
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
        ) : filteredLaptops.length === 0 ? (
          <Text>No laptops found.</Text>
        ) : (
          <Row gutter={[24, 24]} justify="start">
            {filteredLaptops.map((laptop) => (
              <Col xs={24} sm={12} md={8} lg={6} key={laptop.id}>
                <Card
                  hoverable
                  className="rounded-lg shadow-md relative h-full flex flex-col justify-between"
                  style={{ minHeight: "fit-content" }}
                    cover={
                      laptop.imageUrl ? (
                        <Image
                          src={laptop.imageUrl}
                          alt={laptop.name}
                          height={200}
                          className="object-cover rounded-t-lg"
                          preview={true} // Enable preview
                          onClick={(e) => e.stopPropagation()} // Prevent navigation on image click
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
                      handleAddToFavorites(laptop.id);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100"
                  />
                  <div className="flex flex-col justify-between flex-grow"
                    onClick={() => router.push(`/laptops/${laptop.id}`)}

                  >
                    <Card.Meta
                      title={
                        <Text strong className="text-lg text-gray-800 font-semibold">
                          {laptop.name}
                        </Text>
                      }
                      description={
                        <Text className="text-gray-600 text-sm mt-2 block">{laptop.description}</Text>
                      }
                    />
                    <div className="mt-2">
                      <Text className="text-green-600 font-semibold">${laptop.price}</Text>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <InputNumber
                        min={1}
                        max={laptop.stock}
                        value={quantities[laptop.id]}
                        onChange={(value) => handleQuantityChange(laptop.id, value)}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(laptop.id);
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
    </Layout>
  );
};

export default LaptopsPage;