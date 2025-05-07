'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Layout from '@/app/components/Layout';
import { useAddToCart } from '@/app/hooks/useAddToCart';
import {
  Card,
  Tag,
  Typography,
  Row,
  Col,
  Spin,
  Button,
  Image as AntdImage,
  Select,
  Input,
  message,
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

const { Meta } = Card;
const { Text, Title } = Typography;
const { Option } = Select;
const { Search } = Input;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  sellings: number;
  imageUrl: string;
  specifications?: {
    platform?: string;
    genre?: string;
    releaseDate?: string;
    developer?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const GamesItem: React.FC = () => {
  const params = useParams();
  const gamesItem = params.gamesItem;
  const formattedGamesItem =
    typeof gamesItem === 'string' ? gamesItem.replace(/-/g, ' ') : '';

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string | undefined>();
  const [platformFilter, setPlatformFilter] = useState<string | undefined>();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const checkLoginStatus = () => {
    return !!localStorage.getItem('accessToken');
  };

  const toggleFavorite = async (productId: string) => {
    if (!checkLoginStatus()) {
      message.error('Please log in to add items to your favorites.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    try {
      if (favorites.has(productId)) {
        await axios.delete(`https://store-backend-tb6b.onrender.com/favorites/${productId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFavorites((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
        message.success('Removed from favorites');
      } else {
        await axios.post(
          `https://store-backend-tb6b.onrender.com/favorites`,
          { productId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFavorites((prev) => new Set(prev).add(productId));
        message.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      message.error('Something went wrong while updating favorites.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      let categoryId = '';
      switch (formattedGamesItem) {
        case 'pc games':
          categoryId = '67f6d42e3b3f610de38473d2';
          break;
        case 'console games':
          categoryId = '67f6d46e3b3f610de38473d3';
          break;
        case 'digital game codes':
          categoryId = '67f6d4963b3f610de38473d4';
          break;
        default:
          return;
      }

      setLoading(true);
      try {
        const response = await axios.get<{ products: Product[] }>(
          `https://store-backend-tb6b.onrender.com/categories/id/${categoryId}`
        );
        const items = response.data.products || [];
        setProducts(items);
        setFilteredProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (!checkLoginStatus()) return;

      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.get<Product[]>(
          'https://store-backend-tb6b.onrender.com/favorites',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const productIds = res.data.map((p) => p.id);
        setFavorites(new Set(productIds));
      } catch (error) {
        console.error('Failed to fetch favorites', error);
      }
    };

    fetchProducts();
    fetchFavorites();
  }, [formattedGamesItem]);

  useEffect(() => {
    let updated = [...products];

    if (searchTerm) {
      updated = updated.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genreFilter) {
      updated = updated.filter(
        (item) =>
          item.specifications?.genre?.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    if (formattedGamesItem === 'console games' && platformFilter) {
      updated = updated.filter(
        (item) =>
          item.specifications?.platform?.toLowerCase() ===
          platformFilter.toLowerCase()
      );
    }

    switch (sortOption) {
      case 'priceLowHigh':
        updated.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        updated.sort((a, b) => b.price - a.price);
        break;
      case 'mostSold':
        updated.sort((a, b) => (b.sellings || 0) - (a.sellings || 0));
        break;
      case 'newest':
        updated.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    setFilteredProducts(updated);
  }, [sortOption, searchTerm, genreFilter, platformFilter, products, formattedGamesItem]);


  const { handleAddToCart, cartLoadingId } = useAddToCart();
  
  const handleBuyNow = (productId: string) => {
    if (!checkLoginStatus()) {
      message.error('Please log in to proceed with the purchase.');
      return;
    }
  
    // TODO: Implement actual "Buy Now" logic
    message.success('Redirecting to checkout...');
  };
  

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4 capitalize">
          {formattedGamesItem}
        </h1>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            placeholder="Sort by"
            onChange={(value) => setSortOption(value)}
            className="w-48"
            allowClear
          >
            <Option value="priceLowHigh">Price: Low to High</Option>
            <Option value="priceHighLow">Price: High to Low</Option>
            <Option value="mostSold">Most Sold</Option>
            <Option value="newest">Newest</Option>
          </Select>

          <Search
            placeholder="Search by name"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
            allowClear
          />

          <Select
            placeholder="Filter by Genre"
            onChange={(value) => setGenreFilter(value)}
            className="w-48"
            allowClear
          >
            {[...new Set(products.map((p) => p.specifications?.genre))].map(
              (genre) =>
                genre ? (
                  <Option key={genre} value={genre}>
                    {genre}
                  </Option>
                ) : null
            )}
          </Select>

          {formattedGamesItem === 'console games' && (
            <Select
              placeholder="Filter by Platform"
              onChange={(value) => setPlatformFilter(value)}
              className="w-48"
              allowClear
            >
              {[...new Set(products.map((p) => p.specifications?.platform))].map(
                (platform) =>
                  platform ? (
                    <Option key={platform} value={platform}>
                      {platform}
                    </Option>
                  ) : null
              )}
            </Select>
          )}
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <AntdImage.PreviewGroup>
                      <div className="relative">
                        <AntdImage
                          alt={product.name}
                          src={
                            product.imageUrl ||
                            'https://via.placeholder.com/300?text=No+Image'
                          }
                          fallback="https://via.placeholder.com/300?text=No+Image"
                          preview={true}
                          width="100%"
                          height={192}
                          style={{
                            objectFit: 'cover',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                          }}
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
                    </AntdImage.PreviewGroup>
                  }
                  actions={[
                    <Tag color="blue" key="platform">
                      {product.specifications?.platform || 'N/A'}
                    </Tag>,
                    <Tag color="green" key="genre">
                      {product.specifications?.genre || 'N/A'}
                    </Tag>,
                  ]}
                >
                  <Meta
                    title={
                      <Text strong className="line-clamp-1">
                        {product.name}
                      </Text>
                    }
                    description={
                      <>
                        <Title level={4} className="text-blue-600">
                          ${product.price?.toFixed(2) || '0.00'}
                        </Title>
                        <Text
                          type="secondary"
                          className="block line-clamp-2 mb-2"
                        >
                          {product.description || 'No description available.'}
                        </Text>
                        <div className="flex justify-between gap-2">
                          <Button
                            type="primary"
                            block
                            icon={<ShoppingCartOutlined />}
                            loading={cartLoadingId === product.id}
                            onClick={() => handleAddToCart(product.id)}
                          >
                            Add to Cart
                          </Button>
                          <Button
                            type="default"
                            block
                            icon={<ShoppingOutlined />}
                            onClick={() => handleBuyNow(product.id)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Layout>
  );
};

export default GamesItem;