'use client';

import { Image } from 'antd';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Typography, Row, Col, message, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

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
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();

    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-black">
      <Link href="/pages/laptops">
        <Title
          level={2}
          style={{
            color: '#ff4d4f',
            marginBottom: '40px',
            textAlign: 'start',
            fontWeight: 'bold',
          }}
        >
          Laptops <ArrowRightOutlined />
        </Title>
      </Link>

      {loading ? (
        <Row gutter={[24, 24]} justify="center">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  loading
                  style={{
                    background: '#1f1f1f',
                    borderRadius: '12px',
                    border: '1px solid #ff4d4f',
                    width: '100%',
                    height: '100%',
                    minHeight: '450px',
                  }}
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
                style={{
                  background: '#1f1f1f',
                  borderRadius: '12px',
                  border: '1px solid #ff4d4f',
                  width: '100%',
                  height: '100%',
                  minHeight: '450px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                styles={{
                  body: {
                    padding: '16px',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  },
                }}
                cover={
                  laptop.imageUrl ? (
                    <Image
                      src={laptop.imageUrl}
                      alt={laptop.name}
                      width="100%"
                      height={220}
                      style={{
                        objectFit: 'contain',
                        borderRadius: '12px 12px 0 0',
                        backgroundColor: '#ffffff',
                      }}
                      preview={true}
                    />
                  ) : (
                    <div
                      style={{
                        height: 220,
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px 12px 0 0',
                      }}
                    >
                      <Text style={{ color: '#888', fontSize: '16px' }}>
                        No Image
                      </Text>
                    </div>
                  )
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div>
                  <Card.Meta
                    title={
                      <Text strong style={{ color: '#fff', fontSize: '18px' }}>
                        {laptop.name}
                      </Text>
                    }
                    description={
                      <Text style={{ color: '#bbb', fontSize: '14px' }}>
                        {laptop.description}
                      </Text>
                    }
                  />
                  <div
                    style={{
                      marginTop: 16,
                      color: '#ddd',
                      fontSize: '14px',
                      flexGrow: 1,
                    }}
                  >
                    {laptop.specifications?.screenSize && (
                      <Text style={{ display: 'block', marginBottom: 4, color: 'white' }}>
                        <strong>Screen Size:</strong> {laptop.specifications.screenSize}
                      </Text>
                    )}
                    {laptop.specifications?.resolution && (
                      <Text style={{ display: 'block', marginBottom: 4, color: 'white' }}>
                        <strong>Resolution:</strong> {laptop.specifications.resolution}
                      </Text>
                    )}
                    {laptop.specifications?.processor && (
                      <Text style={{ display: 'block', marginBottom: 4, color: 'white' }}>
                        <strong>Processor:</strong> {laptop.specifications.processor}
                      </Text>
                    )}
                    {laptop.specifications?.ram && (
                      <Text style={{ display: 'block', marginBottom: 4, color: 'white' }}>
                        <strong>RAM:</strong> {laptop.specifications.ram}
                      </Text>
                    )}
                    {laptop.specifications?.storage && (
                      <Text style={{ display: 'block', marginBottom: 4, color: 'white' }}>
                        <strong>Storage:</strong> {laptop.specifications.storage}
                      </Text>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text strong style={{ color: '#ff4d4f', fontSize: '22px' }}>
                    ${laptop.price.toFixed(2)} USD
                  </Text>
                  <Link href={`/laptops/${laptop.id}`}>
                    <Button
                      type="primary"
                      style={{
                        background: '#ff4d4f',
                        borderColor: '#ff4d4f',
                        borderRadius: '6px',
                      }}
                    >
                      View Details
                    </Button>
                  </Link>
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
