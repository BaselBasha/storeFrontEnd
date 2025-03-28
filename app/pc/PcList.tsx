'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Typography, Row, Col, message, Image, Button, InputNumber, Skeleton } from 'antd'; // Added Skeleton import
import { ArrowRightOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string | null;
  specifications?: {
    processor?: string;
    gpu?: string;
    ram?: string;
    storage?: string;
    powerSupply?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

const PrebuiltPcList = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await response.json();
        const pcProducts = data.filter(
          (product) => product.category.name.toLowerCase().includes('pc')
        );
        setProducts(pcProducts);

        const initialQuantities = pcProducts.reduce((acc, product) => {
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

    fetchProducts();

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

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto md:px-36 px-12 py-12">
      <Link href="/pc">
        <Title
          level={2}
          style={{
            color: '#1890ff',
            marginBottom: '40px',
            textAlign: 'start',
            fontWeight: 'bold',
          }}
        >
          Prebuilt PCs <ArrowRightOutlined />
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
          {products.map((pc) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pc.id}>
              <Card
                hoverable
                className="rounded-lg shadow-md relative h-full flex flex-col justify-between"
                onClick={() => router.push(`/products/${pc.id}`)}
                style={{ minHeight: 'fit-content' }}
                cover={
                  pc.imageUrl ? (
                    <Image
                      src={pc.imageUrl}
                      alt={pc.name}
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
                    handleAddToFavorites(pc.id);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100"
                />

                {/* Card Content */}
                <div className="flex flex-col justify-between flex-grow">
                  <Card.Meta
                    title={
                      <Text strong className="text-lg text-gray-800 font-semibold">
                        {pc.name}
                      </Text>
                    }
                    description={
                      <Text className="text-gray-600 text-sm mt-2">{pc.description}</Text>
                    }
                  />

                  {/* Footer (Quantity Selector + Add to Cart) */}
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

export default PrebuiltPcList;