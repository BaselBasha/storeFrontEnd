'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Typography, Row, Col, message, Button, Image } from 'antd';
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
    size?: string;
    resolution?: string;
    refreshRate?: string;
    responseTime?: string;
    [key: string]: any;
  } | null;
  createdAt: string;
  updatedAt: string;
}

const MonitorList = () => {
  const [monitors, setMonitors] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchMonitors = async () => {
      try {
        const response = await fetch('http://localhost:4000/products');
        if (!response.ok) throw new Error('Failed to fetch monitors');
        const data: Product[] = await response.json();
        const monitorProducts = data.filter(
          (product) =>
            product.category.name.toLowerCase().includes('monitor') ||
            product.specifications?.size ||
            product.specifications?.resolution
        );
        setMonitors(monitorProducts);
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMonitors();
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-black">
      <Link href="/pages/monitors">
        <Title
          level={2}
          style={{
            color: '#ff4d4f',
            marginBottom: '40px',
            textAlign: 'start',
            fontWeight: 'bold',
          }}
        >
          Monitors <ArrowRightOutlined />
        </Title>
      </Link>

      {loading ? (
        <Row gutter={[24, 24]} justify="center">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card loading style={{ background: '#1f1f1f', borderRadius: '12px', border: '1px solid #ff4d4f', width: '100%', height: '100%', minHeight: '450px' }} />
              </Col>
            ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]} justify="center">
          {monitors.map((monitor) => (
            <Col xs={24} sm={12} md={8} lg={6} key={monitor.id}>
              <Card
                hoverable
                style={{
                  background: '#1f1f1f',
                  borderRadius: '12px',
                  border: '1px solid #ff4d4f',
                  width: '100%',
                  height: '100%',
                  minHeight: '450px', // Fixed minimum height for consistency
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1px'
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
                  monitor.imageUrl ? (
                    <Image
                      src={monitor.imageUrl}
                      alt={monitor.name}
                      width="100%"
                      height={220}
                      style={{
                        objectFit: 'contain',
                        borderRadius: '12px 12px 0 0',
                        backgroundColor: "#ffffff"
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
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'translateY(-5px)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'translateY(0)')
                }
              >
                <div>
                  <Card.Meta
                    title={
                      <Text
                        strong
                        style={{ color: '#fff', fontSize: '18px' }}
                      >
                        {monitor.name}
                      </Text>
                    }
                    description={
                      <Text style={{ color: '#bbb', fontSize: '14px' }}>
                        {monitor.description}
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
                    {monitor.specifications && (
                      <>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>GPU:</strong> {monitor.specifications?.responseTime || 'N/A'}
                        </Text>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>RAM:</strong> {monitor.specifications?.size || 'N/A'}
                        </Text>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>Storage:</strong>{' '}
                          {monitor.specifications?.resolution || 'N/A'}
                        </Text>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>Power Supply:</strong>{' '}
                          {monitor.specifications?.refreshRate || 'N/A'}
                        </Text>
                      </>
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
                  <Text
                    strong
                    style={{ color: '#ff4d4f', fontSize: '22px' }}
                  >
                    ${monitor.price.toFixed(2)}
                  </Text>
                  <Link href={`/products/${monitor.id}`}>
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

export default MonitorList;
