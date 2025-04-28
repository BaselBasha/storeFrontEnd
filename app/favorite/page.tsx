'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Button, Tag, Row, Col, Image, Select, Spin } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import { useAddToCart } from '@/app/hooks/useAddToCart';
import { useFavorites } from '@/app/hooks/useAddToFavorite';

const { Text } = Typography;
const { Option } = Select;

const FavoritesPage = () => {
  const { products, loading, favorites, fetchFavorites, toggleFavorite } = useFavorites();
  const { handleAddToCart, cartLoadingId } = useAddToCart();
  const [sortOption, setSortOption] = useState<string>('recent');

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortOption) {
      case 'priceAsc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return sorted;
    }
  }, [products, sortOption]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <Layout>
      <div
        className="p-4"
        style={{
          minHeight: 'calc(100vh - 64px - 64px)', // Adjust based on header/footer height
          position: 'relative',
          overflow: 'hidden', // Prevent content from overflowing
        }}
      >
        <Spin
          spinning={loading}
          tip="Loading favorites..."
          size="large"
          style={{
            minHeight: '200px',
            maxHeight: '100%', // Ensure spinner stays within container
            overflow: 'hidden',
          }}
        >
          <div style={{ minHeight: '200px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 20 }}>
                Your Favorite Products ({products.length})
              </Text>
              <Select
                value={sortOption}
                onChange={setSortOption}
                style={{ width: 200 }}
              >
                <Option value="priceAsc">Price: Low to High</Option>
                <Option value="priceDesc">Price: High to Low</Option>
                <Option value="recent">Recently Added</Option>
                <Option value="nameAsc">Alphabetical (A-Z)</Option>
              </Select>
            </Row>

            <Row gutter={[16, 16]}>
              {sortedProducts.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <div className="relative w-full h-48">
                        <Image
                          alt={product.name}
                          src={
                            product.imageUrl ||
                            'https://via.placeholder.com/300?text=No+Image'
                          }
                          preview
                          width="100%"
                          height={192}
                          style={{ objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                        />
                        <Button
                          type="text"
                          icon={
                            favorites.has(product.id) ? (
                              <HeartFilled style={{ color: '#ff4d4f' }} />
                            ) : (
                              <HeartOutlined style={{ color: '#ff4d4f' }} />
                            )
                          }
                          onClick={() => toggleFavorite(product.id)}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 10,
                          }}
                        />
                      </div>
                    }
                    actions={[
                      <Tag color="blue" key="brand">
                        {product.specifications?.brand || 'N/A'}
                      </Tag>,
                      <Tag color="green" key="processor">
                        {product.specifications?.processor || 'N/A'}
                      </Tag>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Text strong className="line-clamp-1">
                          {product.name}
                        </Text>
                      }
                      description={
                        <>
                          <Text
                            strong
                            className="block text-lg"
                            style={{ color: '#1890ff' }}
                          >
                            ${product.price.toFixed(2)}
                          </Text>
                          <Text type="secondary" className="block line-clamp-2">
                            {product.description || 'No description available.'}
                          </Text>
                          <Button
                            type="primary"
                            block
                            onClick={() => handleAddToCart(product.id)}
                            style={{ marginTop: 8 }}
                            loading={cartLoadingId === product.id}
                          >
                            Add to Cart
                          </Button>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Spin>
      </div>
    </Layout>
  );
};

export default FavoritesPage;