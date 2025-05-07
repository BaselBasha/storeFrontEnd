// app/admin/orders/page.tsx
"use client"; // Mark as Client Component

import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import {
  Tabs,
  Card,
  List,
  Typography,
  Avatar,
  Spin,
  Alert,
  Select,
  Space,
  Tag,
  message,
} from "antd";
import Link from "next/link";
import ProtectedAdmin from "@/app/components/ProtectedAdmin";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/app/components/sidebar";

const { Title, Text } = Typography;
const { Option } = Select;

interface Product {
  id: string;
  name: string;
  imageUrl: string | null;
}

interface OrderItem {
  quantity: number;
  price: number;
  product: Product;
}

interface User {
  id: string;
  fullName: string | null;
  email: string;
}

interface Order {
  id: string;
  shippingAddress: string;
  totalPrice: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  user: User;
  items: OrderItem[];
}

// Component
const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const statusOptions: Order["status"][] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  useEffect(() => {
    setIsMounted(true);
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://store-backend-tb6b.onrender.com/orders"); // Adjust URL if needed
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 404) {
          setError("Orders endpoint not found. Please check the backend server.");
        } else {
          setError(`Failed to fetch orders: ${axiosError.message}`);
        }
        console.error("Fetch error:", axiosError);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder) return;

    // Prevent modification if current status is CANCELLED or DELIVERED
    if (currentOrder.status === "CANCELLED" || currentOrder.status === "DELIVERED") {
      message.warning("Cannot modify status of a cancelled or delivered order.");
      return;
    }

    try {
      const response = await axios.put(`https://store-backend-tb6b.onrender.com/orders/${orderId}`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: response.data.status } : order
        )
      );
      message.success(`Order #${orderId.slice(0, 8)} status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Failed to update order status. Please try again.");
    }
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <a href="https://store-backend-tb6b.onrender.com/orders" target="_blank" rel="noopener noreferrer">
              Test Endpoint
            </a>
          }
        />
      </div>
    );
  }

  const groupedOrders = orders.reduce((acc: Record<string, Order[]>, order) => {
    const status = order.status;
    if (!acc[status]) acc[status] = [];
    acc[status].push(order);
    return acc;
  }, {});

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING": return "orange";
      case "PROCESSING": return "blue";
      case "SHIPPED": return "purple";
      case "DELIVERED": return "green";
      case "CANCELLED": return "red";
      default: return "default";
    }
  };

  return (
    <ProtectedAdmin>
      <div className={cn("flex min-h-screen w-full bg-gray-50")}>
        <div className="h-screen">
          <Sidebar initialOpen={false} />
        </div>
        <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Title level={2} className="mb-6 text-center md:text-left">
            Admin Orders
          </Title>

          <Tabs
            defaultActiveKey="PENDING"
            type="card"
            className="w-full"
            tabBarStyle={{ marginBottom: 24 }}
            items={statusOptions.map((status) => ({
              key: status,
              label: (
                <span>
                  {status} <Tag color={getStatusColor(status)}>{groupedOrders[status]?.length || 0}</Tag>
                </span>
              ),
              children: groupedOrders[status]?.length > 0 ? (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
                  dataSource={groupedOrders[status]}
                  renderItem={(order: Order) => (
                    <List.Item>
                      <Card
                        title={`Order #${order.id.slice(0, 8)}...`}
                        hoverable
                        className="w-full shadow-sm"
                        styles={{ header: { fontSize: "16px", borderBottom: "1px solid #f0f0f0" } }}
                      >
                        <Space direction="vertical" size="small" style={{ width: "100%" }}>
                          <div>
                            <Text strong>User: </Text>
                            <Text>{order.user.fullName || "Unknown"} ({order.user.email})</Text>
                          </div>
                          <div>
                            <Text strong>Shipping: </Text>
                            <Text>{order.shippingAddress}</Text>
                          </div>
                          <div>
                            <Text strong>Total: </Text>
                            <Text type="success">${order.totalPrice.toFixed(2)}</Text>
                          </div>
                          <div>
                            <Text strong>Created: </Text>
                            <Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
                          </div>
                          <div>
                            <Text strong>Status: </Text>
                            <Select
                              value={order.status}
                              onChange={(value) => handleStatusChange(order.id, value)}
                              style={{ width: 140 }}
                              dropdownStyle={{ minWidth: 140 }}
                              disabled={order.status === "CANCELLED" || order.status === "DELIVERED"}
                            >
                              {statusOptions.map((statusOption) => (
                                <Option key={statusOption} value={statusOption}>
                                  <Tag color={getStatusColor(statusOption)}>{statusOption}</Tag>
                                </Option>
                              ))}
                            </Select>
                          </div>
                          <div>
                            <Text strong>Items: </Text>
                            <List
                              dataSource={order.items}
                              renderItem={(item: OrderItem) => (
                                <List.Item className="py-1">
                                  <List.Item.Meta
                                    avatar={
                                      item.product.imageUrl ? (
                                        <Avatar
                                          src={item.product.imageUrl}
                                          size={{ xs: 48, sm: 64, md: 80, lg: 96, xl: 96 }} // Bigger image
                                          shape="square"
                                        />
                                      ) : (
                                        <Avatar
                                          size={{ xs: 48, sm: 64, md: 80, lg: 96, xl: 96 }} // Bigger image
                                          shape="square"
                                        >
                                          N/A
                                        </Avatar>
                                      )
                                    }
                                    title={
                                      <Link href={`products/product/${item.product.id}`}>
                                        {`${item.quantity}x ${item.product.name}`}
                                      </Link>
                                    }
                                    description={<Text type="secondary">${item.price.toFixed(2)}</Text>}
                                  />
                                </List.Item>
                              )}
                            />
                          </div>
                        </Space>
                      </Card>
                    </List.Item>
                  )}
                />
              ) : (
                <Text type="secondary" className="p-4 block text-center">
                  No orders in this status.
                </Text>
              ),
            }))}
          />
        </div>
      </div>
    </ProtectedAdmin>
  );
};

export default AdminOrders;