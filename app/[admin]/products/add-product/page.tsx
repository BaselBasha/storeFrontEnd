'use client';

import ProtectedAdmin from '@/app/components/ProtectedAdmin'; // Double-check this path
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
  const [submitting, setSubmitting] = useState<boolean>(false);

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Invalid image format. Please upload a PNG, JPG, or GIF.');
      return;
    }

    // Set the file for upload and create a preview
    setImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result as string); // For preview only
    };
    reader.onerror = (error) => {
      console.error('Error generating preview:', error);
      message.error('Failed to process image preview');
    };
  };

  const onFinish = async (values: ProductFormValues) => {
    if (!imageFile) {
      message.error('Please upload an image');
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Upload image to Cloudinary via NestJS backend
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadResponse = await fetch('http://localhost:4000/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Image upload failed: ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.url; // Cloudinary URL from backend

      // Step 2: Prepare product data with the Cloudinary URL
      let specificationsObj = {};
      if (values.specifications) {
        try {
          specificationsObj = JSON.parse(values.specifications);
        } catch (error) {
          message.error('Invalid specifications JSON format');
          setSubmitting(false);
          return;
        }
      }

      const productData = {
        ...values,
        specifications: values.specifications ? specificationsObj : undefined,
        imageUrl: imageUrl, // Use Cloudinary URL instead of Base64
      };

      // Step 3: Submit product data to backend
      const response = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add product: ${errorText}`);
      }

      message.success('Product added successfully!');
      form.resetFields();
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting product:', error);
      message.error('Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedAdmin>
      <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
        <Sidebar initialOpen={false} />
        
        <div className="flex-1 p-4 bg-gray-50 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900 mb-4">Add Product</h1>
            
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              initialValues={{ stock: 0 }}
              className="space-y-2"
            >
              <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input size="middle" placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber<number>
                  size="middle"
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
                <TextArea rows={3} placeholder="Enter product description" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="categoryId"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select
                  size="middle"
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
                  size="middle"
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
                <TextArea rows={3} placeholder='e.g., {"cpu": "Intel i7", "ram": "16GB"}' />
              </Form.Item>

              <Form.Item
                label="Product Image"
                name="imageUrl"
                rules={[{ required: true, message: 'Please upload an image' }]}
              >
                <div className="space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Uploaded Image"
                      width={150}
                      height={150}
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
                  size="middle"
                  block
                  loading={submitting}
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