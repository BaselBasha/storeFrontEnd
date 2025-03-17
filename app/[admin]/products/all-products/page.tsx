'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { cn } from '@/lib/utils';
import { Table, Input, Space, Image as AntImage, Spin, TableColumnsType } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';

// Centralized state (simple in-memory cache)
let cachedData = {
  products: [] as Product[],
  categories: [] as Category[],
  fetched: false,
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string | null;
  specifications?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  salesCount?: number;
}

interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
}

function AllProducts() {
  const [products, setProducts] = useState<Product[]>(cachedData.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(cachedData.categories);
  const [loading, setLoading] = useState<boolean>(!cachedData.fetched);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setHydrated(true);

    if (cachedData.fetched) {
      setProducts(cachedData.products);
      setFilteredProducts(cachedData.products);
      setCategories(cachedData.categories);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const productsResponse = await fetch('http://localhost:4000/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData: Product[] = await productsResponse.json();

        const categoriesResponse = await fetch('http://localhost:4000/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData: Category[] = await categoriesResponse.json();

        cachedData = {
          products: productsData,
          categories: categoriesData,
          fetched: true,
        };

        setProducts(productsData);
        setCategories(categoriesData);
        setFilteredProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  const recentlyAdded = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const mostSelling = [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5);

  // Explicitly type tableColumns as TableColumnsType<Product>
  const tableColumns: TableColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: '10%',
      render: (imageUrl: string | null) =>
        imageUrl ? (
          <AntImage
            src={imageUrl}
            alt="Product"
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ellipsis: true,
      render: (text: string, record: Product) => (
        <Link href={`/admin/products/product/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: '15%',
      sorter: (a: Product, b: Product) => a.stock - b.stock,
    },
  ];

  const CategoryCard = ({ category }: { category: Category }) => (
    <Link href={`/admin/categories/${category.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer w-48">
        {category.imageUrl ? (
          <AntImage
            src={category.imageUrl}
            alt={category.name}
            width={192}
            height={128}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        <div className="p-2 text-center">
          <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
        </div>
      </div>
    </Link>
  );

  // Custom loading spinner
  const customLoadingIcon = (
    <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />
  );

  if (!hydrated || loading) {
    return (
      <ProtectedAdmin>
        <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-50 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <Spin indicator={customLoadingIcon} />
              <p className="mt-4 text-lg text-gray-600">Loading Products Dashboard...</p>
            </div>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
        <Sidebar initialOpen={false} />
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Products Dashboard</h1>

            {error && <p className="text-red-500">{error}</p>}

            {!error && (
              <div className="space-y-12">
                {/* Recently Added Products Table */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Added Products</h2>
                  <Table
                    columns={tableColumns}
                    dataSource={recentlyAdded}
                    rowKey="id"
                    pagination={false}
                    bordered
                    size="middle"
                    scroll={{ x: 'max-content' }}
                  />
                </div>

                {/* Most Selling Products Table */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Most Selling Products</h2>
                  <Table
                    columns={tableColumns}
                    dataSource={mostSelling}
                    rowKey="id"
                    pagination={false}
                    bordered
                    size="middle"
                    scroll={{ x: 'max-content' }}
                  />
                </div>

                {/* All Products Table with Search Bar */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">All Products</h2>
                  <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                    <Input
                      placeholder="Search by product name"
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: 200 }}
                    />
                  </Space>
                  <Table
                    columns={tableColumns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    bordered
                    size="middle"
                    scroll={{ x: 'max-content' }}
                  />
                </div>

                {/* Categories */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
                  {categories.length === 0 ? (
                    <p className="text-gray-500">No categories found.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}

export default AllProducts;