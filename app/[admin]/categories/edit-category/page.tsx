'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { Table, Button, message, Image, Popconfirm, Space, Input, Spin, TableColumnsType } from 'antd';
import { useRouter } from 'next/navigation';
import { PlusOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error('Fetch error:', error);
        message.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(value)
    );
    setFilteredCategories(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete category: ${errorText}`);
      }

      const updatedCategories = categories.filter((category) => category.id !== id);
      setCategories(updatedCategories);
      setFilteredCategories(
        filteredCategories.filter((category) => category.id !== id)
      );
      message.success('Category deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      message.error(
        `Failed to delete category: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/categories/${id}/edit`);
  };

  const handleAddNew = () => {
    router.push('/admin/categories/add-category');
  };

  const columns: TableColumnsType<Category> = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      // Removed width: '10%' to let it fit the image content
      render: (imageUrl: string | null) =>
        imageUrl ? (
          <Image
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
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
      ellipsis: true,
      render: (text: string) => (
        <span
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '25%',
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const customLoadingIcon = (
    <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />
  );

  if (loading) {
    return (
      <ProtectedAdmin>
        <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-100 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <Spin indicator={customLoadingIcon} />
              <p className="mt-4 text-lg text-gray-600">Loading Category List...</p>
            </div>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
        <Sidebar initialOpen={false} />
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <div className="w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Category List</h1>
              <Space>
                <Input
                  placeholder="Search by category name"
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 200 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddNew}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Add New Category
                </Button>
              </Space>
            </div>
            <div className="overflow-x-auto w-full">
              <Table
                columns={columns}
                dataSource={filteredCategories}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                bordered
                size="middle"
                className="shadow-sm rounded-lg w-full"
                rowClassName="hover:bg-gray-50"
                scroll={{ x: 'max-content' }}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}