'use client';

import React, { useState } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { Form, Input, Button, Upload, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';
import type { UploadFile, UploadProps } from 'antd';

interface CategoryFormValues {
  name: string;
  description: string;
  image?: UploadFile[];
}

export default function AddCategory() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Handle form submission
  const onFinish = async (values: CategoryFormValues) => {
    setLoading(true);

    let imageUrl: string | undefined;

    // Step 1: Upload the image if provided
    if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
      const imageFile = values.image[0].originFileObj;
      const formData = new FormData();
      formData.append('file', imageFile);

      try {
        const uploadResponse = await fetch('http://localhost:4000/images/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(`Image upload failed: ${errorText}`);
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url; // Cloudinary URL from backend
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

    // Step 2: Prepare and submit category data with the Cloudinary URL
    const categoryData = {
      name: values.name,
      description: values.description,
      imageUrl, // Optional, undefined if no image was uploaded
    };

    try {
      const response = await fetch('http://localhost:4000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add category: ${errorText}`);
      }

      message.success('Category added successfully!');
      form.resetFields();
      setFileList([]);
      setPreviewImage(null); // Reset preview
    } catch (error) {
      console.error('Error adding category:', error);
      message.error(
        `Failed to add category: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload changes
  const uploadProps: UploadProps = {
    onRemove: (file) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      setPreviewImage(null);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
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
      reader.readAsDataURL(file);

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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h1>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <Form.Item
                label="Category Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter the category name!' },
                  { min: 2, message: 'Name must be at least 2 characters!' },
                ]}
              >
                <Input placeholder="Enter category name" disabled={loading} />
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
                  placeholder="Enter category description"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Category Image"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
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
                      Adding Category...
                    </div>
                  ) : (
                    'Add Category'
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