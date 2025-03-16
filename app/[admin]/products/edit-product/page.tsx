'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { Form, Input, InputNumber, Button, message, Select, Image } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';

interface Category {
  value: string;
  label: string;
}

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

interface ProductFormValues {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  stock: number;
  specifications?: string;
  imageUrl?: string | null;
}

export default function EditSingleProduct({ params }: { params: { id: string } }) {
  const [form] = Form.useForm<ProductFormValues>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(`http://localhost:4000/products/${params.id}`);
        if (!productResponse.ok) throw new Error('Failed to fetch product');
        const product: Product = await productResponse.json();
        form.setFieldsValue({
          ...product,
          specifications: product.specifications ? JSON.stringify(product.specifications) : undefined,
        });
        setImagePreview(product.imageUrl || null);

        const categoriesResponse = await fetch('http://localhost:4000/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData: { id: string; name: string }[] = await categoriesResponse.json();
        const formattedCategories: Category[] = categoriesData.map(category => ({
          value: category.id,
          label: category.name,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Fetch error:', error);
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    reader.onload = () => setImagePreview(reader.result as string);
    reader.onerror = () => message.error('Failed to process image preview');
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:4000/images/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image upload failed: ${errorText}`);
    }
    const data = await response.json();
    return data.url;
  };

  const onFinish = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      let imageUrl = values.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const updatedProduct = {
        ...values,
        imageUrl,
        specifications: values.specifications ? JSON.parse(values.specifications) : null,
      };

      const response = await fetch(`http://localhost:4000/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Product update failed: ${errorText}`);
      }

      message.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error in onFinish:', error);
      message.error(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedAdmin>
      <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
        <Sidebar initialOpen={false} />
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                className="space-y-2"
              >
                <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please enter a product name' }]}>
                  <Input size="middle" placeholder="Enter product name" />
                </Form.Item>

                <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter a price' }]}>
                  <InputNumber<number>
                    size="middle"
                    min={0}
                    step={0.01}
                    formatter={value => `$ ${value}`}
                    parser={value => parseFloat(value?.replace('$ ', '') || '0')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
                  <TextArea rows={3} placeholder="Enter product description" />
                </Form.Item>

                <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'Please select a category' }]}>
                  <Select size="middle" placeholder="Select category" options={categories} />
                </Form.Item>

                <Form.Item label="Stock" name="stock" rules={[{ required: true, message: 'Please enter stock quantity' }]}>
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
                    {submitting ? 'Updating Product...' : 'Update Product'}
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}