'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Spin, Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  price?: number;
}

interface Subcategory {
  id: string;
  name: string;
  products: Product[];
}

const MainPageProducts = () => {
  const [data, setData] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/categories/subcategories`);
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  if (loading) {
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
              <Link href={`/products/subcategory/${subcategory.id}`}>
                {subcategory.name}
              </Link>
            </Title>
            <Link href={`/products/subcategory/${subcategory.id}`} className="text-blue-500 hover:underline">
              View all
            </Link>
          </div>

          <Row gutter={[16, 16]}>
            {subcategory.products.map((product) => (
              <Col xs={24} sm={12} md={6} key={product.id}>
                <Card
                  hoverable
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="cursor-pointer"
                  cover={
                    <div className="relative w-full h-[250px]">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
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
