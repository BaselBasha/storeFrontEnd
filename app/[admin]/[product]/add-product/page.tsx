'use client';

import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/sidebar';
import { cn } from '@/lib/utils';
import { Form, Input, InputNumber, Button, message, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Image from 'next/image';

interface Category {
  value: string;
  label: string;
}

interface ProductFormValues {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  stock: number;
  specifications?: string;
  imageUrl: string;
}

export default function AddProduct() {
  const [form] = Form.useForm<ProductFormValues>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false); // Added submitting state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:4000/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: { id: string; name: string }[] = await response.json();
        const formattedCategories: Category[] = data.map(category => ({
          value: category.id,
          label: category.name,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      message.error('No file selected');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      if (!base64String.startsWith('data:image')) {
        message.error('Invalid image format. Please upload a PNG, JPG, or GIF.');
        return;
      }

      setImageFile(file);
      setImagePreview(base64String);
      form.setFieldsValue({ imageUrl: base64String });
    };
    reader.onerror = (error) => {
      console.error('Error converting image to Base64:', error);
      message.error('Failed to process image');
    };
  };

  const onFinish = async (values: ProductFormValues) => {
    if (!values.imageUrl || !values.imageUrl.startsWith('data:image')) {
      message.error('Please upload a valid image');
      return;
    }

    const productData = {
      ...values,
      imageUrl: values.imageUrl,
    };

    setSubmitting(true); // Start loading

    try {
      const response = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to add product');

      message.success('Product added successfully!');
      form.resetFields();
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting product:', error);
      message.error('Failed to add product');
    } finally {
      setSubmitting(false); // Stop loading
    }
  };

  return (
    <ProtectedAdmin>
      <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
        <Sidebar initialOpen={false} />
        
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h1>
            
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              initialValues={{
                stock: 0,
              }}
            >
              <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input size="large" placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber<number>
                  size="large"
                  min={0}
                  step={0.01}
                  formatter={value => `$ ${value}`}
                  parser={value => parseFloat(value?.replace('$ ', '') || '0')}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <TextArea rows={4} placeholder="Enter product description" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select
                  size="large"
                  placeholder="Select category"
                  options={categories}
                />
              </Form.Item>

              <Form.Item
                label="Stock"
                name="stock"
                rules={[{ required: true, message: 'Please enter stock' }]}
              >
                <InputNumber<number>
                  size="large"
                  min={0}
                  placeholder="Stock"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                label="Specifications (JSON format, optional)"
                name="specifications"
                rules={[{
                  validator: (_, value: string | undefined) => {
                    if (!value) return Promise.resolve();
                    try {
                      JSON.parse(value);
                      return Promise.resolve();
                    } catch {
                      return Promise.reject('Please enter valid JSON');
                    }
                  },
                }]}
              >
                <TextArea
                  rows={4}
                  placeholder='e.g., {"cpu": "Intel i7", "ram": "16GB"}'
                />
              </Form.Item>

              <Form.Item
                label="Product Image"
                name="imageUrl"
                rules={[{ required: true, message: 'Please upload an image' }]}
              >
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Uploaded Image"
                      width={200}
                      height={200}
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting} // Show loading spinner on button
                  style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                  {submitting ? 'Adding Product...' : 'Add Product'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}