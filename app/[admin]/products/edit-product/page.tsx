'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { Table, Button, message, Image, Popconfirm, Space, Input, Spin, TableColumnsType } from 'antd';
import { useRouter } from 'next/navigation';
import { PlusOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string | null;
  specifications?: Record<string, any> | null;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://store-backend-tb6b.onrender.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initially, filteredProducts matches products
      } catch (error) {
        console.error('Fetch error:', error);
        message.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`https://store-backend-tb6b.onrender.com/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete product: ${errorText}`);
      }

      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(
        filteredProducts.filter((product) => product.id !== id)
      );
      message.success('Product deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      message.error(
        `Failed to delete product: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/products/product/${id}`);
  };

  const handleAddNew = () => {
    router.push('/admin/products/add-product');
  };

  // Explicitly type columns as TableColumnsType<Product>
  const columns: TableColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: '10%',
      render: (imageUrl: string | null) =>
        imageUrl ? (
          <Image
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
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      ellipsis: true, // Basic ellipsis for single-line truncation
      render: (text: string) => (
        <span
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2, // Limits to 2 lines
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
      width: '10%',
      sorter: (a: Product, b: Product) => a.stock - b.stock,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
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

  // Custom loading spinner
  const customLoadingIcon = (
    <LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />
  );

  // Show loading state until data is fetched
  if (loading) {
    return (
      <ProtectedAdmin>
        <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-100 overflow-auto flex items-center justify-center">
            <div className="text-center">
              <Spin indicator={customLoadingIcon} />
              <p className="mt-4 text-lg text-gray-600">Loading Product List...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Product List</h1>
              <Space>
                <Input
                  placeholder="Search by product name"
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
                  Add New Product
                </Button>
              </Space>
            </div>
            <div className="overflow-x-auto w-full">
              <Table
                columns={columns}
                dataSource={filteredProducts}
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