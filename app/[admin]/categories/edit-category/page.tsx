'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import {
  Table,
  Button,
  message,
  Image,
  Popconfirm,
  Space,
  Input,
  Spin,
  TableColumnsType,
  Card,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import {
  PlusOutlined,
  SearchOutlined,
  LoadingOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  parentId?: string | null;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [filteredMain, setFilteredMain] = useState<Category[]>([]);
  const [filteredSub, setFilteredSub] = useState<Category[]>([]);
  const [mainSearchTerm, setMainSearchTerm] = useState('');
  const [subSearchTerm, setSubSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get<Category[]>('https://store-backend-tb6b.onrender.com/categories');
        const mains = data.filter((cat) => !cat.parentId);
        const subs = data.filter((cat) => !!cat.parentId);
        setCategories(data);
        setMainCategories(mains);
        setSubCategories(subs);
        setFilteredMain(mains);
        setFilteredSub(subs);
      } catch (error) {
        console.error('Fetch error:', error);
        message.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMainSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setMainSearchTerm(value);
    setFilteredMain(
      mainCategories.filter((cat) => cat.name.toLowerCase().includes(value))
    );
  };

  const handleSubSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSubSearchTerm(value);
    setFilteredSub(
      subCategories.filter((cat) => cat.name.toLowerCase().includes(value))
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://store-backend-tb6b.onrender.com/categories/${id}`);
      const updated = categories.filter((cat) => cat.id !== id);
      const updatedMain = updated.filter((cat) => !cat.parentId);
      const updatedSub = updated.filter((cat) => !!cat.parentId);
      setCategories(updated);
      setMainCategories(updatedMain);
      setSubCategories(updatedSub);
      setFilteredMain(updatedMain.filter((cat) => cat.name.toLowerCase().includes(mainSearchTerm)));
      setFilteredSub(updatedSub.filter((cat) => cat.name.toLowerCase().includes(subSearchTerm)));
      message.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      message.error(`Failed to delete category: ${error?.response?.data || error.message}`);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/categories/${id}/edit`);
  };

  const handleAddNew = () => {
    router.push('/admin/categories/add-category');
  };

  const getColumns = (): TableColumnsType<Category> => [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: '10%',
      render: (imageUrl: string | null) =>
        imageUrl ? (
          <Image
            src={imageUrl}
            alt="Category"
            width={40}
            height={40}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <Text type="secondary">No Image</Text>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '45%',
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
      width: '15%',
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            style={{
              color: '#1890ff',
              borderRadius: '4px',
              padding: '4px 8px',
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{
                borderRadius: '4px',
                padding: '4px 8px',
              }}
            >
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
        <div className="flex flex-col md:flex-row h-screen w-full">
          <Sidebar initialOpen={false}  />
          <div className="flex-1 p-6 bg-[#f0f2f5] overflow-auto flex items-center justify-center">
            <Card className="shadow-md p-8 text-center">
              <Spin indicator={customLoadingIcon} />
              <Text className="mt-4 block text-lg text-gray-600">
                Loading Category List...
              </Text>
            </Card>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className="flex flex-col md:flex-row h-screen w-full">
        <Sidebar initialOpen={false}  />
        <div className="flex-1 p-6 bg-[#f0f2f5] overflow-auto">
          <Card className="mb-6 shadow-sm">
            <Title level={3} className="text-gray-800">
              Categories
            </Title>
          </Card>

          {/* Main Categories */}
          <Card className="mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} className="text-gray-700">
                Main Categories
              </Title>
              <Space>
                <Input
                  placeholder="Search main categories"
                  prefix={<SearchOutlined />}
                  value={mainSearchTerm}
                  onChange={handleMainSearch}
                  style={{ width: 300 }}
                  allowClear
                />
                <Button
                  type="primary"
                  size="middle"
                  icon={<PlusOutlined />}
                  onClick={handleAddNew}
                  style={{
                    borderRadius: '4px',
                  }}
                >
                  Add New
                </Button>
              </Space>
            </div>
            <Table
              columns={getColumns()}
              dataSource={filteredMain}
              rowKey="id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
              bordered
              size="middle"
              className="rounded-lg"
              rowClassName="hover:bg-gray-50"
            />
          </Card>

          {/* Subcategories */}
          <Card className="shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} className="text-gray-700">
                Subcategories
              </Title>
              <Space>
                <Input
                  placeholder="Search subcategories"
                  prefix={<SearchOutlined />}
                  value={subSearchTerm}
                  onChange={handleSubSearch}
                  style={{ width: 300 }}
                  allowClear
                />
                <Button
                  type="primary"
                  size="middle"
                  icon={<PlusOutlined />}
                  onClick={() => router.push('/admin/categories/add-subcategory')}
                  style={{
                    borderRadius: '4px',
                  }}
                >
                  Add New
                </Button>
              </Space>
            </div>
            <Table
              columns={getColumns()}
              dataSource={filteredSub}
              rowKey="id"
              pagination={{ pageSize: 5, showSizeChanger: false }}
              bordered
              size="middle"
              className="rounded-lg"
              rowClassName="hover:bg-gray-50"
            />
          </Card>
        </div>
      </div>
    </ProtectedAdmin>
  );
}