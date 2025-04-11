'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { Form, Input, Button, Upload, message, Image, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';
import type { UploadFile, UploadProps } from 'antd';
import axios, { AxiosResponse } from 'axios';

interface MainCategory {
  id: string;
  name: string;
  parentId: string;
}

interface SubCategoryFormValues {
  name: string;
  description: string;
  parentId: string;
  image?: UploadFile[];
}

interface ImageUploadResponse {
  url: string;
}

export default function AddSubCategory() {
  const [form] = Form.useForm<SubCategoryFormValues>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);

  // Fetch main categories (categories with parentId: null)
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response: AxiosResponse<MainCategory[]> = await axios.get('http://localhost:4000/categories');
        const data: MainCategory[] = response.data;

        // Filter for main categories (parentId: null)
        const mainCats = data.filter((category) => !category.parentId);
        setMainCategories(mainCats);
      } catch (error) {
        console.error('Error fetching main categories:', error);
        message.error('Failed to load main categories');
      }
    };

    fetchMainCategories();
  }, []);

  // Handle form submission
  const onFinish = async (values: SubCategoryFormValues): Promise<void> => {
    setLoading(true);

    let imageUrl: string | undefined;

    // Step 1: Upload the image if provided
    if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
      const imageFile = values.image[0].originFileObj;
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const uploadResponse: AxiosResponse<ImageUploadResponse> = await axios.post(
          'http://localhost:4000/images/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        imageUrl = uploadResponse.data.url; // Cloudinary URL from backend
      } catch (error) {
        console.error('Image upload error:', error);
        message.error(
          `Image upload failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
        setLoading(false);
        return; // Exit if image upload fails
      }
    }

    // Step 2: Prepare and submit subcategory data with the Cloudinary URL
    const subCategoryData = {
      name: values.name,
      description: values.description,
      parentId: values.parentId, // Main category ID
      imageUrl, // Optional, undefined if no image was uploaded
    };

    try {
      await axios.post('http://localhost:4000/categories', subCategoryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      message.success('Subcategory added successfully!');
      form.resetFields();
      setFileList([]);
      setPreviewImage(null); // Reset preview
    } catch (error) {
      console.error('Error adding subcategory:', error);
      message.error(
        `Failed to add subcategory: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload changes
  const uploadProps: UploadProps = {
    onRemove: (file: UploadFile) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      setPreviewImage(null);
    },
    beforeUpload: (file: UploadFile) => {
      const isImage = file.type?.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file as any);

      setFileList([file]); // Only allow one file
      return false; // Prevent automatic upload since we handle it in onFinish
    },
    fileList,
    maxCount: 1, // Limit to one file
  };

  return (
    <ProtectedAdmin>
      <div className={cn('flex flex-col md:flex-row h-screen w-full mx-auto')}>
        <Sidebar initialOpen={false} />
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Subcategory</h1>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <Form.Item
                label="Main Category"
                name="parentId"
                rules={[{ required: true, message: 'Please select a main category!' }]}
              >
                <Select
                  placeholder="Select a main category"
                  disabled={loading || mainCategories.length === 0}
                >
                  {mainCategories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Subcategory Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter the subcategory name!' },
                  { min: 2, message: 'Name must be at least 2 characters!' },
                ]}
              >
                <Input placeholder="Enter subcategory name" disabled={loading} />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: 'Please enter a description!' },
                  { min: 10, message: 'Description must be at least 10 characters!' },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Enter subcategory description"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Subcategory Image"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e && e.fileList)}
              >
                <Upload {...uploadProps} accept="image/*" disabled={loading}>
                  <Button icon={<UploadOutlined />} disabled={loading}>
                    Upload Image
                  </Button>
                </Upload>
              </Form.Item>

              {previewImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Image Preview:</p>
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={150}
                    height={150}
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full relative"
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Adding Subcategory...
                    </div>
                  ) : (
                    'Add Subcategory'
                  )}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}