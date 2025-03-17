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
  categories: [] as Category[],
  fetched: false,
};

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

function AllCategories() {
  const [categories, setCategories] = useState<Category[]>(cachedData.categories);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(!cachedData.fetched);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setHydrated(true);

    if (cachedData.fetched) {
      setCategories(cachedData.categories);
      setFilteredCategories(cachedData.categories);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch('http://localhost:4000/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData: Category[] = await categoriesResponse.json();

        cachedData = {
          categories: categoriesData,
          fetched: true,
        };

        setCategories(categoriesData);
        setFilteredCategories(categoriesData);
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
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(value)
    );
    setFilteredCategories(filtered);
  };

  const recentlyAdded = [...categories]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Explicitly type tableColumns as TableColumnsType<Category>
  const tableColumns: TableColumnsType<Category> = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: '10%',
      render: (imageUrl: string | null) =>
        imageUrl ? (
          <AntImage
            src={imageUrl}
            alt="Category"
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
      width: '25%',
      ellipsis: true,
      render: (text: string, record: Category) => (
        <Link href={`/admin/categories/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '50%',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Category, b: Category) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
              <p className="mt-4 text-lg text-gray-600">Loading Categories Dashboard...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories Dashboard</h1>

            {error && <p className="text-red-500">{error}</p>}

            {!error && (
              <div className="space-y-12">
                {/* Recently Added Categories Table */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Added Categories</h2>
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

                {/* All Categories Table with Search Bar */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">All Categories</h2>
                  <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                    <Input
                      placeholder="Search by category name"
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: 200 }}
                    />
                  </Space>
                  <Table
                    columns={tableColumns}
                    dataSource={filteredCategories}
                    rowKey="id"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    bordered
                    size="middle"
                    scroll={{ x: 'max-content' }}
                  />
                </div>

                {/* Categories Grid */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories Overview</h2>
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

export default AllCategories;