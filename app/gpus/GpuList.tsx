'use client';

import { Image, Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Typography, Row, Col, message, Button, InputNumber } from 'antd';
import { ArrowRightOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Product {
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
    architecture?: string;
    coreClock?: string;
    boostClock?: string;
    memory?: string;
    tdp?: string;
    [key: string]: any;
  } | null;
  createdAt: string;
  updatedAt: string;
}

const GpuList = () => {
  const [gpus, setGpus] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  const isLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
  };

  useEffect(() => {
    setIsMounted(true);

    const fetchGpus = async () => {
      try {
        const response = await fetch('http://localhost:4000/products');
        if (!response.ok) throw new Error('Failed to fetch GPUs');
        const data: Product[] = await response.json();
        const gpuProducts = data
          .filter(
            (product) =>
              product.category.name.toLowerCase().includes('gpu') ||
              product.specifications?.architecture ||
              product.specifications?.memory
          )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by createdAt descending
          .slice(0, 4); // Take the last 4 (most recent) products
        setGpus(gpuProducts);

        const initialQuantities = gpuProducts.reduce((acc, product) => {
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

    fetchGpus();

    return () => setIsMounted(false);
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!isLoggedIn()) {
      message.warning('Please sign in to add items to your cart.');
      router.push('/signin');
      return;
    }

    const quantity = quantities[productId] || 1;
    const token = sessionStorage.getItem('token');

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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto md:px-36 px-12 py-12 ">
      <Link href="/gpus">
        <Title
          level={2}
          style={{
            color: '#1890ff',
            marginBottom: '40px',
            textAlign: 'start',
            fontWeight: 'bold',
          }}
        >
          Latest GPUs <ArrowRightOutlined />
        </Title>
      </Link>

      {loading ? (
        <Row gutter={[16, 16]} justify="center">
          {Array(4).fill(null).map((_, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Skeleton
                active
                avatar
                paragraph={{ rows: 4 }}
                style={{ padding: '16px', background: '#fff', borderRadius: '8px' }}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {gpus.map((gpu) => (
            <Col xs={24} sm={12} md={8} lg={6} key={gpu.id}>
              <Card
                hoverable
                className="rounded-lg shadow-md relative h-full flex flex-col justify-between"
                onClick={() => router.push(`/gpus/${gpu.id}`)}
                style={{ minHeight: 'fit-content' }}
                cover={
                  gpu.imageUrl ? (
                    <Image
                      src={gpu.imageUrl}
                      alt={gpu.name}
                      height={200}
                      className="object-cover rounded-t-lg"
                      preview={false}
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
                    handleAddToFavorites(gpu.id);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100"
                />

                {/* Card Content */}
                <div className="flex flex-col justify-between flex-grow">
                  <Card.Meta
                    title={
                      <Text strong className="text-lg text-gray-800 font-semibold">
                        {gpu.name}
                      </Text>
                    }
                    description={
                      <Text className="text-gray-600 text-sm mt-2">{gpu.description}</Text>
                    }
                  />

                  {/* Footer (Quantity Selector + Add to Cart) */}
                  <div className="flex justify-between items-center mt-3">
                    <InputNumber
                      min={1}
                      max={gpu.stock}
                      value={quantities[gpu.id]}
                      onChange={(value) => handleQuantityChange(gpu.id, value)}
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(gpu.id);
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

export default GpuList;