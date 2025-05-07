'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Spin, Typography, Button, Tooltip, message } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { useAddToCart } from '@/app/hooks/useAddToCart';
import { useFavorites } from '@/app/hooks/useAddToFavorite';

const { Title, Paragraph } = Typography;

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  price?: number;
}

interface ParentCategory {
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  parent: ParentCategory;
  products: Product[];
}

// Utility function to format names for URLs
const formatForUrl = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
};

const MainPageProducts = () => {
  const { favorites, toggleFavorite, fetchFavorites, loading: favoritesLoading } = useFavorites();
  const { handleAddToCart, cartLoadingId } = useAddToCart();
  const [data, setData] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [loadingFavoriteIds, setLoadingFavoriteIds] = useState<Set<string>>(new Set());


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://store-backend-tb6b.onrender.com/categories/subcategories`);
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    fetchFavorites();
  }, []); // Empty dependency array! No fetchFavorites inside dependency
  

  // Check if user is logged in
  const isLoggedIn = (): boolean => {
    return !!localStorage.getItem('accessToken');
  };

  const handleToggleFavorite = async (product: Product) => {
    if (!isLoggedIn()) {
      notifyLoginRequired();
      return;
    }
  
    setLoadingFavoriteIds((prev) => new Set(prev).add(product.id));
  
    try {
      await toggleFavorite(product.id, {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        description: product.description || '',
        price: product.price || 0,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      message.error('Failed to update favorite. Please try again.');
    } finally {
      setLoadingFavoriteIds((prev) => {
        const updated = new Set(prev);
        updated.delete(product.id);
        return updated;
      });
    }
  };
  

  // Notify user to log in and optionally redirect
  const notifyLoginRequired = () => {
    message.warning({
      content: 'Please log in to perform this action.',
      duration: 3,
    });
    // Optionally redirect to login page
    // router.push('/login');
  };

  // Buy now action
  const buyNow = (productId: string) => {
    if (!isLoggedIn()) {
      notifyLoginRequired();
      return;
    }
    console.log(`Initiating buy now for product ${productId}`);
    router.push(`/checkout?product=${productId}&quantity=1`);
  };

  if (loading || favoritesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-12">
      {data.map((subcategory) => (
        <div key={subcategory.id}>
          <div className="flex justify-between items-center mb-4">
            <Title level={3}>
              <Link
                href={`/${formatForUrl(subcategory.parent.name)}/${formatForUrl(subcategory.name)}`}
                className="text-blue-500 hover:underline"
              >
                {subcategory.name}
              </Link>
            </Title>
            <Link
              href={`/${formatForUrl(subcategory.parent.name)}/${formatForUrl(subcategory.name)}`}
              className="text-blue-500 hover:underline"
            >
              View all
            </Link>
          </div>

          <Row gutter={[16, 16]}>
            {subcategory.products.map((product) => (
              <Col xs={24} sm={12} md={6} key={product.id}>
                <Card
                  hoverable
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="cursor-pointer relative"
                  cover={
                    <div className="relative w-full h-[250px]">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                      {/* Favorite Icon */}
                      <Tooltip title={favorites.has(product.id) ? 'Remove from Favorites' : 'Add to Favorites'}>
  <Button
    type="text"
    icon={
      loadingFavoriteIds.has(product.id) ? (
        <Spin size="small" />
      ) : favorites.has(product.id) ? (
        <HeartFilled style={{ color: 'red' }} />
      ) : (
        <HeartOutlined />
      )
    }
    onClick={(e) => {
      e.stopPropagation();
      handleToggleFavorite(product);
    }}
    className="absolute top-2 right-2"
  />
</Tooltip>

                    </div>
                  }
                >
                  <Title level={5}>{product.name}</Title>
                  {product.price !== undefined && (
                    <Paragraph strong className="text-green-600">
                      ${product.price.toFixed(2)}
                    </Paragraph>
                  )}
                  {product.description && (
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {product.description}
                    </Paragraph>
                  )}
                  {/* Action Buttons */}
                  <div className="flex justify-between mt-4">
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleAddToCart(product.id);
                      }}
                      loading={cartLoadingId === product.id}
                      disabled={cartLoadingId === product.id}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      type="default"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        buyNow(product.id);
                      }}
                    >
                      Buy Now
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default MainPageProducts;