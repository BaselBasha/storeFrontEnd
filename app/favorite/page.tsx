'use client'

import React, { useEffect, useState, useMemo } from 'react'
import axios from '../lib/axiosWithAuth'
import { Card, Typography, Button, Tag, Row, Col, Image, Select, message, Spin } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import Layout from '../components/Layout'

const { Text } = Typography
const { Option } = Select

type Product = {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  createdAt: string
  specifications?: {
    brand?: string
    processor?: string
  }
}

const FavoritesPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [sortOption, setSortOption] = useState<string>('recent')

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const res = await axios.get<Product[]>('http://localhost:4000/favorites', { withCredentials: true })
      setProducts(res.data)
      setFavorites(new Set(res.data.map((item) => item.id)))
    } catch (err) {
      message.error('Failed to load favorites.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (productId: string) => {
    // TODO: hook this to your cart logic
    message.success('Added to cart!')
  }

  const toggleFavorite = async (productId: string) => {
    try {
      if (favorites.has(productId)) {
        await axios.delete(`http://localhost:4000/favorites/${productId}`, { withCredentials: true })
        setFavorites((prev) => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
        setProducts((prev) => prev.filter((p) => p.id !== productId))
        message.success('Removed from favorites')
      } else {
        await axios.post(
          'http://localhost:4000/favorites',
          { productId },
          { withCredentials: true }
        )
        fetchFavorites()
        message.success('Added to favorites')
      }
    } catch (err) {
      message.error('Failed to update favorites')
      console.error(err)
    }
  }

  const sortedProducts = useMemo(() => {
    const sorted = [...products]
    switch (sortOption) {
      case 'priceAsc':
        return sorted.sort((a, b) => a.price - b.price)
      case 'priceDesc':
        return sorted.sort((a, b) => b.price - a.price)
      case 'nameAsc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      default:
        return sorted
    }
  }, [products, sortOption])

  useEffect(() => {
    fetchFavorites()
  }, [])

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
                Your Favorite Products
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
  )
}

export default FavoritesPage