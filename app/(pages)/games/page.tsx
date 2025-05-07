"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spin,
  Row,
  Col,
  Button,
  Divider,
  Tag,
  message,
} from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/app/components/Layout";
import { useAddToCart } from '@/app/hooks/useAddToCart';

const { Title, Text } = Typography;

interface SubcategorySummary {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  sellings: number;
  imageUrl?: string;
  specifications?: {
    platform?: string;
    genre?: string;
    releaseDate?: string;
    developer?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  parentId: string;
  products: Product[];
}

const Games: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const checkLoginStatus = () => {
    return !!localStorage.getItem("accessToken");
  };

  const toggleFavorite = async (productId: string) => {
    if (!checkLoginStatus()) {
      message.error("Please log in to add items to your favorites.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    try {
      if (favorites.has(productId)) {
        await axios.delete(`https://store-backend-tb6b.onrender.com/favorites/${productId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setFavorites((prev) => {
          const newFavorites = new Set(prev);
          newFavorites.delete(productId);
          return newFavorites;
        });
        message.success("Removed from favorites");
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
        message.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      message.error("Something went wrong while updating favorites.");
    }
  };

  useEffect(() => {
    setIsMounted(true);

    const fetchSubcategoriesAndProducts = async () => {
      try {
        const subcategoriesResponse = await axios.get<SubcategorySummary[]>(
          "https://store-backend-tb6b.onrender.com/categories/67f6d1d7c0dec2f87edd1ad6/subcategories"
        );

        const subcategoriesWithProducts = await Promise.all(
          subcategoriesResponse.data.map(async (subcat) => {
            const productsResponse = await axios.get<Subcategory>(
              `https://store-backend-tb6b.onrender.com/categories/id/${subcat.id}`
            );
            return productsResponse.data;
          })
        );

        setSubcategories(subcategoriesWithProducts);
      } catch (error) {
        console.error("Error fetching subcategories or products:", error);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (!checkLoginStatus()) return;

      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await axios.get<Product[]>("https://store-backend-tb6b.onrender.com/favorites", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const productIds = res.data.map((product) => product.id);
        setFavorites(new Set(productIds));
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      }
    };

    fetchSubcategoriesAndProducts();
    fetchFavorites();
  }, []);

  const { handleAddToCart, cartLoadingId } = useAddToCart();
  
  if (!isMounted || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <Title level={2} className="text-center mb-8 text-primary">
          Explore Our Games Collection
        </Title>

        {subcategories.map((subcategory) => (
          <div key={subcategory.id} className="mb-12">
            <Row justify="space-between" align="middle" className="mb-4">
              <Col>
                <Link
                  href={`/games/${subcategory.name.toLowerCase().replace(/ /g, "-")}`}
                  className="text-2xl font-semibold text-blue-600 hover:text-blue-800"
                >
                  {subcategory.name}
                </Link>
              </Col>
              <Col>
                <Button type="link" className="text-blue-600 hover:text-blue-800">
                  <Link
                    href={`/games/${subcategory.name.toLowerCase().replace(/ /g, "-")}`}
                  >
                    View All
                  </Link>
                </Button>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              {subcategory.products.slice(0, 4).map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    hoverable
                    cover={
                      <div className="relative w-full h-48">
                        <Image
                          alt={product.name}
                          src={
                            product.imageUrl ||
                            "https://via.placeholder.com/300?text=No+Image"
                          }
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                        <Button
                          type="text"
                          icon={
                            favorites.has(product.id) ? (
                              <HeartFilled style={{ color: "#ff4d4f" }} />
                            ) : (
                              <HeartOutlined style={{ color: "#ff4d4f" }} />
                            )
                          }
                          onClick={() => toggleFavorite(product.id)}
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 10,
                          }}
                        />
                      </div>
                    }
                    actions={[
                      <Tag color="blue" key="platform">
                        {product.specifications?.platform || "N/A"}
                      </Tag>,
                      <Tag color="green" key="genre">
                        {product.specifications?.genre || "N/A"}
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
                            style={{ color: "#1890ff" }}
                          >
                            ${product.price.toFixed(2)}
                          </Text>
                          <Text type="secondary" className="block line-clamp-2">
                            {product.description || "No description available."}
                          </Text>
                          <Button
                            type="primary"
                            block
                            loading={cartLoadingId === product.id}
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
            <Divider />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Games;
