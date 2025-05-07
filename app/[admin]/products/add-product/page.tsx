'use client';

import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/app/components/sidebar';
import { cn } from '@/lib/utils';
import { Form, Input, InputNumber, Button, message, TreeSelect } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Image from 'next/image';
import axios, { AxiosResponse } from 'axios';

interface Category {
  value: string;
  title: string;
  parentId?: string | null;
  children?: Category[];
  disabled?: boolean;
  style?: React.CSSProperties;
}

interface RawCategory {
  id: string;
  name: string;
  parentId?: string;
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

interface ImageUploadResponse {
  url: string;
}

export default function AddProduct() {
  const [form] = Form.useForm<ProductFormValues>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    const fetchCategories = async () => {
      try {
        const response: AxiosResponse<RawCategory[]> = await axios.get('https://store-backend-tb6b.onrender.com/categories');
        const data: RawCategory[] = response.data;

        const categoryMap = new Map<string, Category>();
        const tree: Category[] = [];

        // First pass: Create category nodes
        data.forEach((category) => {
          categoryMap.set(category.id, {
            value: category.id,
            title: category.name,
            parentId: category.parentId,
            children: [],
            disabled: !category.parentId,
          });
        });

        // Second pass: Build the tree
        categoryMap.forEach((category) => {
          if (category.parentId) {
            const parent = categoryMap.get(category.parentId);
            if (parent) {
              parent.children = parent.children || [];
              parent.children.push(category);
            }
          } else {
            tree.push(category);
          }
        });

        // Third pass: Add padding-bottom to the last main category
        if (tree.length > 0) {
          const lastMainCategory = tree[tree.length - 1]; // Last main category (e.g., "Accessories")
          lastMainCategory.style = { paddingBottom: '16px' }; // Add padding-bottom only
        }

        setCategories(tree);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) {
      message.error('No file selected');
      return;
    }

    if (!file.type.startsWith('image/')) {
      message.error('Invalid image format. Please upload a PNG, JPG, or GIF.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error('Error generating preview:', error);
      message.error('Failed to process image preview');
    };
  };

  const onFinish = async (values: ProductFormValues): Promise<void> => {
    if (!imageFile) {
      message.error('Please upload an image');
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Upload image to Cloudinary via NestJS backend
      const formData = new FormData();
      formData.append('file', imageFile);

      const uploadResponse: AxiosResponse<ImageUploadResponse> = await axios.post(
        'https://store-backend-tb6b.onrender.com/images/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const imageUrl: string = uploadResponse.data.url;

      // Step 2: Prepare product data
      let specificationsObj: Record<string, any> = {};
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
        imageUrl: imageUrl,
      };

      // Step 3: Submit product data to backend
      await axios.post('https://store-backend-tb6b.onrender.com/products', productData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

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

  if (!isClient) {
    return (
      <ProtectedAdmin>
        <div className={cn('flex flex-col md:flex-row h-screen w-full mx-auto')}>
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-4 bg-gray-50 overflow-auto">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-xl font-bold text-gray-900 mb-4">Add Product</h1>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className={cn('flex flex-col md:flex-row h-screen w-full mx-auto')}>
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
                  formatter={(value) => `$ ${value}`}
                  parser={(value) => parseFloat(value?.replace('$ ', '') || '0')}
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
                rules={[
                  { required: true, message: 'Please select a subcategory' },
                  {
                    validator: async (_: any, value: string) => {
                      if (!value) return Promise.reject('Please select a subcategory');
                      const selectedCategory = categories
                        .flatMap((c) => [c, ...(c.children || [])])
                        .find((c) => c.value === value);
                      if (!selectedCategory?.parentId) {
                        return Promise.reject('Please select a subcategory, not a main category');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <TreeSelect
                  size="middle"
                  placeholder="Select subcategory"
                  treeData={categories}
                  showSearch
                  dropdownStyle={{
                    padding: '8px',
                    paddingBottom: '24px',
                    minHeight: '150px',
                    maxHeight: '300px',
                    overflow: 'auto',
                  }}
                  filterTreeNode={(input: string, node: any) =>
                    node.title.toLowerCase().includes(input.toLowerCase())
                  }
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
                rules={[
                  {
                    validator: (_: any, value?: string) => {
                      if (!value) return Promise.resolve();
                      try {
                        JSON.parse(value);
                        return Promise.resolve();
                      } catch {
                        return Promise.reject('Please enter valid JSON');
                      }
                    },
                  },
                ]}
              >
                <TextArea rows={3} placeholder='e.g., {"cpu": "Intel i7", "ram": "16GB"}' />
              </Form.Item>

              <Form.Item
                label="Product Image"
                name="imageUrl"
                rules={[{ required: true, message: 'Please upload an image' }]}
              >
                <div className="space-y-1">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
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