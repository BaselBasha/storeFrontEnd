'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Typography, Row, Col, message, Image, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await response.json();
        const pcProducts = data.filter(
          (product) => product.category.name.toLowerCase().includes('pc')
        );
        setProducts(pcProducts);
      } catch (err) {
        message.error(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900 text-white">
      <Link href="/pages/pc">
        <Title
          level={2}
          style={{
            color: '#ff4d4f',
            marginBottom: '40px',
            textAlign: 'start',
            fontWeight: 'bold',
          }}
        >
          Prebuilt PCs <ArrowRightOutlined />
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
                    minHeight: '450px', // Fixed minimum height for consistency
                  }}
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
                  pc.imageUrl ? (
                    <Image
                      src={pc.imageUrl}
                      alt={pc.name}
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
                        {pc.name}
                      </Text>
                    }
                    description={
                      <Text style={{ color: '#bbb', fontSize: '14px' }}>
                        {pc.description}
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
                    {pc.specifications && (
                      <>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>Processor:</strong>{' '}
                          {pc.specifications.processor || 'N/A'}
                        </Text>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>GPU:</strong> {pc.specifications.gpu || 'N/A'}
                        </Text>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>RAM:</strong> {pc.specifications.ram || 'N/A'}
                        </Text>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>Storage:</strong>{' '}
                          {pc.specifications.storage || 'N/A'}
                        </Text>
                        <Text style={{ display: 'block', marginBottom: 4, color: "white" }}>
                          <strong>Power Supply:</strong>{' '}
                          {pc.specifications.powerSupply || 'N/A'}
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
                    ${pc.price.toFixed(2)}
                  </Text>
                  <Link href={`/products/${pc.id}`}>
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

export default PrebuiltPcList;