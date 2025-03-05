'use client';

import { Image, Skeleton } from 'antd'; // Added Skeleton import
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
    screenSize?: string;
    resolution?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    [key: string]: any;
  } | null;
  createdAt: string;
  updatedAt: string;
}

const LaptopList = () => {
  const [laptops, setLaptops] = useState<Product[]>([]);
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

    const fetchLaptops = async () => {
      try {
        const response = await fetch('http://localhost:4000/products');
        if (!response.ok) throw new Error('Failed to fetch laptops');
        const data: Product[] = await response.json();
        const laptopProducts = data.filter((product) =>
          product.category.name.toLowerCase().includes('laptop')
        );
        setLaptops(laptopProducts);

        const initialQuantities = laptopProducts.reduce((acc, product) => {
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

    fetchLaptops();

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
    <div className="container mx-auto md:px-36 px-12 py-12">
      <Link href="/laptops">
        <Title
          level={2}
          style={{
            color: '#1890ff',
            marginBottom: '40px',
            textAlign: 'start',
            fontWeight: 'bold',
          }}
        >
          Laptops <ArrowRightOutlined />
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
                style={{ padding: '16px', background: '#fff', borderRadius: '8px', backgroundColor: '#fff' }}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {laptops.map((laptop) => (
            <Col xs={24} sm={12} md={8} lg={6} key={laptop.id}>
              <Card
                hoverable
                className="rounded-lg shadow-md relative h-full flex flex-col justify-between"
                onClick={() => router.push(`/laptops/${laptop.id}`)}
                style={{ minHeight: 'fit-content' }}
                cover={
                  laptop.imageUrl ? (
                    <Image
                      src={laptop.imageUrl}
                      alt={laptop.name}
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
                    handleAddToFavorites(laptop.id);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100"
                />

                {/* Card Content */}
                <div className="flex flex-col justify-between flex-grow">
                  <Card.Meta
                    title={
                      <Text strong className="text-lg text-gray-800 font-semibold">
                        {laptop.name}
                      </Text>
                    }
                    description={
                      <Text className="text-gray-600 text-sm mt-2">{laptop.description}</Text>
                    }
                  />

                  {/* Footer (Quantity Selector + Add to Cart) */}
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

export default LaptopList;