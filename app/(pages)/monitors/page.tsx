"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CardContext"; // Assuming typo; should be CartContext
import { Image, Skeleton, Card, Typography, Row, Col, message, Button, InputNumber } from "antd";
import { ShoppingCartOutlined, HeartOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";

const { Title, Text } = Typography;

interface Monitor {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    name: string;
  };
  categoryId: string;
  stock: number;
  imageUrl?: string | null;
  specifications?: {
    screenSize?: string;
    resolution?: string;
    refreshRate?: string;
    panelType?: string;
    responseTime?: string;
    brand?: string; // Added as optional in case your API includes it here
    [key: string]: any;
  } | null;
  createdAt: string;
  updatedAt: string;
}

const categories: Record<string, string[]> = {
  brand: ["ASUS", "LG", "Acer", "Dell", "BenQ", "MSI", "Samsung"],
  screenSize: ["24 inches", "27 inches", "32 inches", "34 inches", "49 inches"],
  resolution: ["1920x1080", "2560x1440", "3440x1440", "3840x2160"],
  refreshRate: ["60Hz", "120Hz", "144Hz", "165Hz", "240Hz"],
  panelType: ["IPS", "VA", "TN"],
  responseTime: ["1ms", "2ms", "5ms"],
  // Removed condition since it’s not in the Product model
};

const MonitorsPage: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [price, setPrice] = useState<number>(1000);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addToCart } = useCart();
  const router = useRouter();

  const isLoggedIn = () => {
    const token = sessionStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    setIsMounted(true);

    const fetchMonitors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/products"); // Adjust to your API
        if (!response.ok) {
          const text = await response.text();
          console.log("Raw response:", text);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: Monitor[] = await response.json();
        const monitorProducts = data.filter((product) =>
          product.category.name.toLowerCase().includes("monitor")
        );
        setMonitors(monitorProducts);

        const initialQuantities = monitorProducts.reduce((acc, product) => {
          acc[product.id] = 1;
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

    fetchMonitors();

    return () => setIsMounted(false);
  }, []);

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

  const handleAddToCart = async (monitorId: string) => {
    if (!isLoggedIn()) {
      message.warning("Please sign in to add items to your cart.");
      router.push("/signin");
      return;
    }

    const quantity = quantities[monitorId] || 1;
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: monitorId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      message.success("Item added to cart successfully!");
      addToCart({
        id: monitorId,
        name: monitors.find((m) => m.id === monitorId)!.name,
        price: monitors.find((m) => m.id === monitorId)!.price,
        quantity,
      });
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  const handleAddToFavorites = (monitorId: string) => {
    if (!isLoggedIn()) {
      message.warning("Please sign in to add items to your favorites.");
      router.push("/signin");
      return;
    }
    message.success("Added to favorites!");
  };

  const handleQuantityChange = (monitorId: string, value: number | null) => {
    if (value !== null && value > 0) {
      setQuantities((prev) => ({ ...prev, [monitorId]: value }));
    }
  };

  const filteredMonitors = monitors.filter((monitor) => {
    return (
      monitor.price >= minPrice &&
      monitor.price <= price &&
      Object.entries(filters).every(([category, values]) => {
        if (values.length === 0) return true; // No filter applied for this category
        if (category === "brand") {
          // Check brand in specifications or name/description as fallback
          const brandValue = monitor.specifications?.brand || monitor.name.toLowerCase();
          return values.some((value) => brandValue?.toLowerCase().includes(value.toLowerCase()));
        }
        // Check other categories in specifications
        const specValue = monitor.specifications?.[category];
        return specValue && values.includes(specValue);
      })
    );
  });

  if (!isMounted) {
    return null;
  }

  return (
    <Layout>
    <div className="flex">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 container mx-auto md:px-36 px-12 py-12">
        <Link href="/monitors">
          <Title
            level={2}
            style={{
              color: "#1890ff",
              marginBottom: "40px",
              textAlign: "start",
              fontWeight: "bold",
            }}
          >
            Real Monitors <ArrowRightOutlined />
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
        ) : filteredMonitors.length === 0 ? (
          <Text>No monitors found.</Text>
        ) : (
          <Row gutter={[24, 24]} justify="start">
            {filteredMonitors.map((monitor) => (
              <Col xs={24} sm={12} md={8} lg={6} key={monitor.id}>
                <Card
                  hoverable
                  className="rounded-lg shadow-md relative h-full flex flex-col justify-between"
                  style={{ minHeight: "fit-content" }}
                  cover={
                    monitor.imageUrl ? (
                      <Image
                        src={monitor.imageUrl}
                        alt={monitor.name}
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
                  {/* Favorites Button */}
                  <Button
                    type="text"
                    icon={<HeartOutlined className="text-red-500 text-xl" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToFavorites(monitor.id);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100"
                  />

                  {/* Card Content */}
                  <div className="flex flex-col justify-between flex-grow"
                    onClick={() => router.push(`/monitors/${monitor.id}`)}
                  >
                    <Card.Meta
                      title={
                        <Text strong className="text-lg text-gray-800 font-semibold">
                          {monitor.name}
                        </Text>
                      }
                      description={
                        <>
                          <Text className="text-gray-600 text-sm mt-2 block">{monitor.description}</Text>
                        </>
                      }
                    />
                    <div className="mt-2">
                      <Text className="text-green-600 font-semibold">${monitor.price}</Text>
                    </div>

                    {/* Footer (Quantity Selector + Add to Cart) */}
                    <div className="flex justify-between items-center mt-3">
                      <InputNumber
                        min={1}
                        max={monitor.stock}
                        value={quantities[monitor.id]}
                        onChange={(value) => handleQuantityChange(monitor.id, value)}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(monitor.id);
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

export default MonitorsPage;