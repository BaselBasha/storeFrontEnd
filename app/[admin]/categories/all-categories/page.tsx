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
  allItems: [] as Category[],
  fetched: false,
};

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  parentId?: string; // Optional field to identify subcategories
}

function AllCategories() {
  const [allItems, setAllItems] = useState<Category[]>(cachedData.allItems);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(!cachedData.fetched);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState<string>('');
  const [subcategorySearchTerm, setSubcategorySearchTerm] = useState<string>('');

  useEffect(() => {
    setHydrated(true);

    if (cachedData.fetched) {
      setAllItems(cachedData.allItems);
      const cats = cachedData.allItems.filter(item => !item.parentId);
      const subs = cachedData.allItems.filter(item => item.parentId);
      setCategories(cats);
      setSubcategories(subs);
      setFilteredCategories(cats);
      setFilteredSubcategories(subs);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await response.json();

        cachedData = {
          allItems: data,
          fetched: true,
        };

        const cats = data.filter(item => !item.parentId);
        const subs = data.filter(item => item.parentId);

        setAllItems(data);
        setCategories(cats);
        setSubcategories(subs);
        setFilteredCategories(cats);
        setFilteredSubcategories(subs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle category search
  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setCategorySearchTerm(value);
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(value)
    );
    setFilteredCategories(filtered);
  };

  // Handle subcategory search
  const handleSubcategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSubcategorySearchTerm(value);
    const filtered = subcategories.filter((subcategory) =>
      subcategory.name.toLowerCase().includes(value)
    );
    setFilteredSubcategories(filtered);
  };

  const recentlyAddedCategories = [...categories]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentlyAddedSubcategories = [...subcategories]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Table columns for both categories and subcategories
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

  const CategoryCard = ({ item, isSubcategory }: { item: Category; isSubcategory: boolean }) => (
    <Link href={`/admin/categories/${item.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer w-48">
        {item.imageUrl ? (
          <AntImage
            src={item.imageUrl}
            alt={item.name}
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
          <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
          {isSubcategory && item.parentId && (
            <p className="text-xs text-gray-500">
              Parent: {categories.find(c => c.id === item.parentId)?.name || 'Unknown'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );

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
                {/* Recently Added Categories */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Added Categories</h2>
                  <Table
                    columns={tableColumns}
                    dataSource={recentlyAddedCategories}
                    rowKey="id"
                    pagination={false}
                    bordered
                    size="middle"
                    scroll={{ x: 'max-content' }}
                  />
                </div>

                {/* Recently Added Subcategories */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Recently Added Subcategories</h2>
                  <Table
                    columns={tableColumns}
                    dataSource={recentlyAddedSubcategories}
                    rowKey="id"
                    pagination={false}
                    bordered
                    size="middle"
                    scroll={{ x: 'max-content' }}
                  />
                </div>

                {/* All Categories */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">All Categories</h2>
                  <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                    <Input
                      placeholder="Search by category name"
                      prefix={<SearchOutlined />}
                      value={categorySearchTerm}
                      onChange={handleCategorySearch}
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

                {/* All Subcategories */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">All Subcategories</h2>
                  <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                    <Input
                      placeholder="Search by subcategory name"
                      prefix={<SearchOutlined />}
                      value={subcategorySearchTerm}
                      onChange={handleSubcategorySearch}
                      style={{ width: 200 }}
                    />
                  </Space>
                  <Table
                    columns={tableColumns}
                    dataSource={filteredSubcategories}
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
                        <CategoryCard key={category.id} item={category} isSubcategory={false} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Subcategories Grid */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Subcategories Overview</h2>
                  {subcategories.length === 0 ? (
                    <p className="text-gray-500">No subcategories found.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {subcategories.map((subcategory) => (
                        <CategoryCard key={subcategory.id} item={subcategory} isSubcategory={true} />
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