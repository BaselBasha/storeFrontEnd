"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography, Card, Checkbox, Row, Col, Spin, Empty, Divider, Drawer, Button, Select, message } from "antd";
import { FilterOutlined, MenuOutlined, ShoppingOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

interface PrebuiltPC {
  id: string;
  name: string;
  description: string;
  price: number;
  category: { id: string; name: string };
  categoryId: string;
  stock: number;
  imageUrl?: string;
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

const Page: React.FC = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [pcs, setPcs] = useState<PrebuiltPC[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<Record<string, string[]>>({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPrebuiltPCs = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/categories/Pc");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data: PrebuiltPC[] = await response.json();
        console.log("Fetched Data:", data);

        const specKeys = {
          cpu: "CPU",
          gpu: "GPU",
          ram: "RAM",
          nvme: "NVMe M.2",
          nvmeSize: "NVMe Size",
          hdd: "HDD",
          hddSize: "HDD Size",
        };

        const categories: Record<string, Set<string>> = {
          category: new Set(["Gaming", "Workstation", "Budget"]),
          priceRange: new Set(["Under $500", "$500-$1000", "$1000-$1500", "$1500-$2000", "Over $2000"]),
          cpu: new Set(["i3", "i5", "i7", "i9"]),
          gpu: new Set([
            "GTX 1050 Ti",
            "GTX 1660",
            "RTX 2060",
            "RTX 3060",
            "RTX 3070",
            "RTX 3080",
            "RTX 3090",
            "RTX 4060",
            "RTX 4070",
            "RTX 4080",
            "RX 580",
            "RX 6600",
            "RX 6700 XT",
            "RX 6800",
            "RX 7900 XT",
          ]),
          ram: new Set(["8GB", "16GB", "32GB", "64GB"]),
          nvme: new Set(["Yes", "No"]),
          nvmeSize: new Set(["256GB", "512GB", "1TB", "2TB"]),
          hdd: new Set(["Yes", "No"]),
          hddSize: new Set(["500GB", "1TB", "2TB", "4TB"]),
        };

        data.forEach((pc) => {
          categories.category.add(pc.category?.name || "Unknown");
          if (pc.specifications) {
            Object.entries(pc.specifications).forEach(([key, value]) => {
              const normalizedKey = key.toLowerCase();
              if (normalizedKey in specKeys && value && normalizedKey !== "cpu") {
                categories[normalizedKey].add(value);
              }
            });
          }
        });

        setDynamicCategories(
          Object.fromEntries(
            Object.entries(categories).map(([key, value]) => [
              key,
              Array.from(value).sort(),
            ])
          )
        );
        setPcs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrebuiltPCs();
  }, []);

  const priceRangeOptions: Record<string, { min: number; max: number }> = {
    "Under $500": { min: 0, max: 500 },
    "$500-$1000": { min: 500, max: 1000 },
    "$1000-$1500": { min: 1000, max: 1500 },
    "$1500-$2000": { min: 1500, max: 2000 },
    "Over $2000": { min: 2000, max: Infinity },
  };

  const handleFilterChange = (category: string, value: string | string[]) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (category === "gpu") {
        updated[category] = value ? [value as string] : [];
      } else {
        const currentValues = updated[category] || [];
        updated[category] = Array.isArray(value)
          ? value
          : currentValues.includes(value as string)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value as string];
      }
      return updated;
    });
  };

  const filteredPCs = pcs.filter((pc) => {
    const categoryMatch = Object.entries(filters).every(([category, values]) => {
      if (!values.length) return true;
      if (category === "priceRange") return true;
      if (category === "category") {
        return values.some((v) => v === pc.category?.name);
      }
      if (pc.specifications && category in pc.specifications) {
        const pcValue = pc.specifications[category];
        if (category === "cpu") {
          return values.some((v) => pcValue?.toLowerCase().startsWith(v.toLowerCase()));
        }
        return values.some((v) => v === pcValue);
      }
      return false;
    });

    const priceMatch = filters.priceRange?.length
      ? filters.priceRange.some((rangeLabel) => {
          const { min, max } = priceRangeOptions[rangeLabel];
          return pc.price && pc.price >= min && pc.price <= max;
        })
      : true;

    return categoryMatch && priceMatch;
  });

  const renderFilters = () => (
    <>
      {Object.entries(dynamicCategories).map(([category, options]) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <Text strong style={{ textTransform: "capitalize", display: "block", marginBottom: 8 }}>
            {category === "category"
              ? "Category"
              : category === "priceRange"
              ? "Price Range"
              : category === "cpu"
              ? "CPU"
              : category === "gpu"
              ? "GPU"
              : category === "ram"
              ? "RAM"
              : category === "nvme"
              ? "NVMe M.2"
              : category === "nvmeSize"
              ? "NVMe Size"
              : category === "hdd"
              ? "HDD"
              : category === "hddSize"
              ? "HDD Size"
              : category.replace(/([A-Z])/g, " $1")}
          </Text>
          {category === "gpu" ? (
            <Select
              style={{ width: "100%" }}
              placeholder="Select GPU"
              allowClear
              value={filters[category]?.[0] || undefined}
              onChange={(value) => handleFilterChange(category, value)}
            >
              {options.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          ) : (
            <Checkbox.Group
              options={options.map((option) => ({ label: option, value: option }))}
              value={filters[category] || []}
              onChange={(checkedValues) => handleFilterChange(category, checkedValues)}
            />
          )}
          <Divider style={{ margin: "12px 0" }} />
        </div>
      ))}
    </>
  );

  const handleCardClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  const addToCart = async (pc: PrebuiltPC) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.error("Please log in to add items to your cart");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/cart/add", { // Changed to 4000
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: pc.id, quantity: 1, userToken: token }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add to cart");
      }
      message.success(`${pc.name} added to cart`);
    } catch (err) {
      console.error("Add to cart error:", err);
      message.error(`Error adding to cart: ${(err as Error).message}`);
    }
  };

  const handleBuyNow = async (pc: PrebuiltPC) => {
    await addToCart(pc);
    router.push("/cart");
  };

  return (
    <Row gutter={16} style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Desktop Filter Sidebar (Thinner) */}
      <Col xs={0} md={4}>
        <Card
          title={
            <Title level={4} style={{ margin: 0 }}>
              <FilterOutlined /> Filters
            </Title>
          }
          style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          {renderFilters()}
        </Card>
      </Col>

      {/* Mobile Filter Drawer */}
      <Col xs={24} md={0}>
        <Button
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Filters
        </Button>
        <Drawer
          title={
            <Title level={4} style={{ margin: 0 }}>
              <FilterOutlined /> Filters
            </Title>
          }
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width="80%"
        >
          {renderFilters()}
        </Drawer>
      </Col>

      {/* Product Listing */}
      <Col xs={24} md={20}>
        <Title level={2} style={{ marginBottom: 24, color: "#1a1a1a" }}>
          Prebuilt PCs
        </Title>
        {loading ? (
          <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: 50 }} />
        ) : error ? (
          <Text type="danger">{error}</Text>
        ) : filteredPCs.length === 0 ? (
          <Empty description="No prebuilt PCs found matching your criteria" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredPCs.map((pc) => (
              <Col xs={24} sm={12} md={8} lg={6} key={pc.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={pc.name || "Prebuilt PC"}
                      src={pc.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                      style={{ height: 200, objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                    />
                  }
                  style={{
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    height: "400px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  bodyStyle={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onClick={() => handleCardClick(pc.id)}
                >
                  <Card.Meta
                    title={<Text strong>{pc.name || "Unnamed PC"}</Text>}
                    description={
                      <>
                        <Text ellipsis={{ rows: 2 }}>{pc.description || "No description available"}</Text>
                        <br />
                        <Text strong style={{ color: "#52c41a" }}>
                          ${pc.price ? pc.price.toFixed(2) : "N/A"}
                        </Text>
                      </>
                    }
                  />
                  <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                    <Button
                      type="primary"
                      icon={<ShoppingOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyNow(pc);
                      }}
                    >
                      Buy Now
                    </Button>
                    <Button
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(pc);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default Page;