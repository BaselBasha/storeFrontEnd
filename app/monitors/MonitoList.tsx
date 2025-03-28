'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  Typography,
  Row,
  Col,
  message,
  Button,
  Image,
  Skeleton,
  Space,
  InputNumber,
} from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ArrowRightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  createdAt: string;
}

const MonitorList = () => {
  const [monitors, setMonitors] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  useEffect(() => {
    setIsMounted(true);

    const fetchMonitors = async () => {
      try {
        const response = await fetch('http://localhost:4000/products');
        if (!response.ok) throw new Error('Failed to fetch monitors');
        const data: Product[] = await response.json();

        const sortedMonitors = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const lastFourMonitors = sortedMonitors.slice(0, 4);

        setMonitors(lastFourMonitors);
        const initialQuantities = lastFourMonitors.reduce((acc, product) => {
          acc[product.id] = 1;
          return acc;
        }, {} as { [key: string]: number });
        setQuantities(initialQuantities);
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMonitors();
    return () => setIsMounted(false);
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!isLoggedIn()) {
      message.warning('Please sign in to add items to your cart.');
      router.push('/signin');
      return;
    }

    const quantity = quantities[productId] || 1;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      message.success('Item added to cart successfully!');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  const handleAddToFavorites = (productId: string) => {
    if (!isLoggedIn()) {
      message.warning('Please sign in to add items to your favorites.');
      router.push('/signin');
      return;
    }
    message.success('Added to favorites!');
  };

  const handleQuantityChange = (productId: string, value: number | null) => {
    if (value !== null && value > 0) {
      setQuantities((prev) => ({ ...prev, [productId]: value }));
    }
  };

  if (!isMounted) return null;

  return (
    <div className="px-6 md:px-32 lg:px-32 py-10 bg-gray-100">
      <Link href="/monitors">
        <Title
          level={2}
          style={{
            color: '#1890ff',
            marginBottom: '40px',
            textAlign: 'start',
            fontWeight: 'bold',
          }}
        >
          Monitors
          <ArrowRightOutlined />
        </Title>
      </Link>

      {loading ? (
        <Row gutter={[16, 16]} justify="center">
          {Array(4).fill(null).map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Skeleton active avatar paragraph={{ rows: 4 }} style={{ padding: '16px', background: '#fff', borderRadius: '8px' }} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]} justify="start">
          {monitors.map((monitor) => (
            <Col xs={24} sm={12} md={8} lg={6} key={monitor.id}>
              <Card
                hoverable
                className="rounded-lg shadow-md relative h-full flex flex-col justify-between"
                onClick={() => router.push(`/products/${monitor.id}`)} // Re-added card click navigation
                style={{ minHeight: 'fit-content' }}
                cover={
                  monitor.imageUrl ? (
                    <Image
                      src={monitor.imageUrl}
                      alt={monitor.name}
                      height={200}
                      className="object-cover rounded-t-lg"
                      preview={false} // Disabled image preview
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
                <div className="flex flex-col justify-between flex-grow">
                  <Card.Meta
                    title={
                      <Text strong className="text-lg text-gray-800 font-semibold">
                        {monitor.name}
                      </Text>
                    }
                    description={
                      <Text className="text-gray-600 text-sm mt-2">{monitor.description}</Text>
                    }
                  />

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
                      size="middle"
                      className="bg-blue-500 border-blue-500 text-white rounded-md"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MonitorList;