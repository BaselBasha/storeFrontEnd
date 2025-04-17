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
import { HeartFilled, HeartOutlined, ShoppingCartOutlined, ShoppingOutlined } from '@ant-design/icons';

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
    brand?: string;
    connectivity?: string;
    color?: string;
    features?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

const AccessoriesItem: React.FC = () => {
  const params = useParams();
  const accessoriesItem = params.accessoriesItems;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string | undefined>();
  const [featureFilter, setFeatureFilter] = useState<string | undefined>();

  // Custom hook for adding to cart
  const { handleAddToCart, cartLoadingId } = useAddToCart();


  const formattedAccessoriesItem =
    typeof accessoriesItem === 'string' ? accessoriesItem.replace(/-/g, ' ') : '';

  const checkLoginStatus = () => !!localStorage.getItem('accessToken');

  const fetchFavorites = async () => {
    if (!checkLoginStatus()) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await axios.get<Product[]>('http://localhost:4000/favorites', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const favIds = res.data.map((item) => item.id);
      setFavorites(new Set(favIds));
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!checkLoginStatus()) {
      message.error('Please log in to manage favorites.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    try {
      if (favorites.has(productId)) {
        await axios.delete(`http://localhost:4000/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setFavorites((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
        message.success('Removed from favorites');
      } else {
        await axios.post(
          `http://localhost:4000/favorites`,
          { productId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setFavorites((prev) => new Set(prev).add(productId));
        message.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      message.error('Error updating favorites.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      let categoryId = '';

      switch (formattedAccessoriesItem) {
        case 'keyboards': categoryId = '67f6d5923b3f610de38473dc'; break;
        case 'mouses': categoryId = '67fd41b4b6b00176b85cf5eb'; break;
        case 'headsets': categoryId = '67f6d5a63b3f610de38473dd'; break;
        case 'microphones': categoryId = '67fd41e4b6b00176b85cf5ed'; break;
        case 'streaming gear': categoryId = '67f6d5d13b3f610de38473e0'; break;
        case 'controllers': categoryId = '67f6d5b53b3f610de38473de'; break;
        case 'mousepads': categoryId = '67f6d5c03b3f610de38473df'; break;
        default: return;
      }

      setLoading(true);
      try {
        const response = await axios.get<{ products: Product[] }>(
          `http://localhost:4000/categories/id/${categoryId}`
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

    fetchProducts();
    fetchFavorites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedAccessoriesItem]);

  useEffect(() => {
    let updated = [...products];

    if (searchTerm) {
      updated = updated.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (brandFilter) {
      updated = updated.filter(
        item => item.specifications?.brand?.toLowerCase() === brandFilter.toLowerCase()
      );
    }

    if (featureFilter) {
      updated = updated.filter(
        item =>
          item.specifications?.features?.some(f =>
            f.toLowerCase().includes(featureFilter.toLowerCase())
          ) ?? false
      );
    }

    switch (sortOption) {
      case 'priceLowHigh': updated.sort((a, b) => a.price - b.price); break;
      case 'priceHighLow': updated.sort((a, b) => b.price - a.price); break;
      case 'mostSold': updated.sort((a, b) => (b.sellings || 0) - (a.sellings || 0)); break;
      case 'newest':
        updated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredProducts(updated);
  }, [sortOption, searchTerm, brandFilter, featureFilter, products]);
  
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
        <h1 className="text-2xl font-semibold mb-4 capitalize">{formattedAccessoriesItem}</h1>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select placeholder="Sort by" onChange={setSortOption} className="w-48" allowClear>
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

          <Select placeholder="Filter by Brand" onChange={setBrandFilter} className="w-48" allowClear>
            {[...new Set(products.map(p => p.specifications?.brand))]
              .filter(Boolean)
              .map(brand => (
                <Option key={brand} value={brand!}>{brand}</Option>
              ))}
          </Select>

          <Select placeholder="Filter by Feature" onChange={setFeatureFilter} className="w-48" allowClear>
            {[...new Set(products.flatMap(p => p.specifications?.features ?? []))]
              .filter(Boolean)
              .map(feature => (
                <Option key={feature} value={feature}>{feature}</Option>
              ))}
          </Select>
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
                    <div className="relative">
                      <AntdImage
                        alt={product.name}
                        src={product.imageUrl || 'https://via.placeholder.com/300?text=No+Image'}
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
                        style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                      />
                    </div>
                  }
                  actions={[
                    <Tag color="blue" key="brand">
                      {product.specifications?.brand || 'N/A'}
                    </Tag>,
                  ]}
                >
                  <Meta
                    title={<Text strong className="line-clamp-1">{product.name}</Text>}
                    description={
                      <>
                        <Title level={4} className="text-blue-600">${product.price.toFixed(2)}</Title>
                        <Text type="secondary" className="block line-clamp-2 mb-2">
                          {product.description || 'No description available.'}
                        </Text>
                        <div className="flex justify-between gap-2">
                        <Button
                          type="default"
                          icon={<ShoppingCartOutlined />}
                          block
                          loading={cartLoadingId === product.id}
                          onClick={() => handleAddToCart(product.id)}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          type="primary"
                          icon={<ShoppingOutlined />}
                          block
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

        {formattedAccessoriesItem === 'streaming gear' && (
          <div className="mt-10 p-4 bg-yellow-50 border-l-4 border-yellow-500">
            <h2 className="text-xl font-semibold">Make Your Own Custom PC Now!</h2>
            <p className="text-gray-700">This feature is coming soon! Stay tuned.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AccessoriesItem;
