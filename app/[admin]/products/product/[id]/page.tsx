'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, InputNumber, Button, Image, Space, Popconfirm, message, Upload } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string | null; // This will now store Base64 strings (e.g., "data:image/jpeg;base64,...")
  specifications?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function ProductPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:4000/products/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data: Product = await response.json();
        setProduct(data);
        form.setFieldsValue({
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          imageUrl: data.imageUrl,
        });
        if (data.imageUrl) {
          setFileList([{ uid: '-1', name: 'image', status: 'done', url: data.imageUrl }]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, form]);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const values = await form.validateFields();
        saveChanges(values);
      } catch (err) {
        return; // Don't toggle if validation fails
      }
    }
    setIsEditing(!isEditing);
  };

  const handleUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:4000/images/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      return data.base64; // Return the Base64 string directly
    } catch (err) {
      message.error('Image upload failed');
      throw err;
    }
  };

  const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
      form.setFieldsValue({ imageUrl: null });
    },
    beforeUpload: (file) => {
      handleUpload(file)
        .then((base64) => {
          setFileList([{ uid: file.uid, name: file.name, status: 'done', url: base64 }]);
          form.setFieldsValue({ imageUrl: base64 });
        })
        .catch(() => {
          setFileList([{ uid: file.uid, name: file.name, status: 'error' }]);
        });
      return false; // Prevent default upload behavior
    },
    fileList,
    disabled: !isEditing,
  };

  const saveChanges = async (values: Partial<Product>) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        imageUrl: values.imageUrl, // Base64 string or null
        categoryId: product?.categoryId,
      };

      const response = await fetch(`http://localhost:4000/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      setProduct(updatedProduct);
      form.setFieldsValue(updatedProduct);
      setIsEditing(false);
      message.success('Product updated successfully');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/products/${params.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      message.success('Product deleted successfully');
      router.push('/admin/products/all-products');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <ProtectedAdmin>
        <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-50 overflow-auto flex items-center justify-center">
            <Card loading={true} style={{ width: 600 }} />
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  if (error || !product) {
    return (
      <ProtectedAdmin>
        <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-50 overflow-auto flex items-center justify-center">
            <Card style={{ width: 600 }}>
              <p className="text-red-500 text-center">{error || 'Product not found'}</p>
            </Card>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
        <Sidebar initialOpen={false} />
        <div className="flex-1 p-6 bg-gray-50 overflow-auto flex items-center justify-center">
          <Card
            title={isEditing ? 'Edit Product' : 'Product Details'}
            style={{ width: 600 }}
            actions={[
              <Button
                key="edit"
                type={isEditing ? 'primary' : 'default'}
                icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                onClick={handleEditToggle}
                style={isEditing ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
              >
                {isEditing ? 'Save Changes' : 'Edit Product'}
              </Button>,
              <Popconfirm
                key="delete"
                title="Are you sure you want to delete this product?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button type="default" danger icon={<DeleteOutlined />}>
                  Delete Product
                </Button>
              </Popconfirm>,
            ]}
          >
            <Form form={form} layout="vertical" disabled={!isEditing}>
              <Form.Item name="imageUrl" label="Product Image">
                <Upload {...uploadProps} listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>

              {fileList.length > 0 && fileList[0].url && !isEditing && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={fileList[0].url}
                    alt={product.name}
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}

              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                <Input size="large" style={{ textAlign: 'center' }} />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} style={{ textAlign: 'center' }} />
              </Form.Item>

              <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Price is required' }]}>
                <InputNumber
                  size="large"
                  step={0.01}
                  min={0}
                  style={{ width: '100%', textAlign: 'center' }}
                  formatter={(value) => `$ ${value}`}
                  parser={(value) => value?.replace('$ ', '') as any}
                />
              </Form.Item>

              <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Stock is required' }]}>
                <InputNumber size="large" min={0} style={{ width: '100%', textAlign: 'center' }} />
              </Form.Item>
            </Form>

            {product.category && (
              <div className="mt-4">
                <p>
                  <strong>Category:</strong> {product.category.name}
                </p>
                <p>
                  <strong>Category Description:</strong> {product.category.description}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ProtectedAdmin>
  );
}