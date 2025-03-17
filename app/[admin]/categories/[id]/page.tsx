'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Image, Popconfirm, message, Upload } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryEditPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:4000/categories/id/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch category');
        const data: Category = await response.json();
        setCategory(data);
        form.setFieldsValue({
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl || null,
        });
        if (data.imageUrl) {
          setFileList([{ uid: '-1', name: 'image', status: 'done', url: data.imageUrl }]);
        } else {
          setFileList([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, form]);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const values = await form.validateFields();
        await saveChanges(values);
      } catch (err) {
        return;
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
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload image: ${errorText}`);
      }
      const data = await response.json();
      return data.url;
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
        .then((url) => {
          setFileList([{ uid: file.uid, name: file.name, status: 'done', url }]);
          form.setFieldsValue({ imageUrl: url });
        })
        .catch(() => {
          setFileList([{ uid: file.uid, name: file.name, status: 'error' }]);
        });
      return false;
    },
    fileList,
    disabled: !isEditing,
  };

  const saveChanges = async (values: Partial<Category>) => {
    setIsSaving(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl || null,
      };

      const response = await fetch(`http://localhost:4000/categories/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update category');
      const updatedCategory = await response.json();
      setCategory(updatedCategory);
      form.setFieldsValue({
        name: updatedCategory.name,
        description: updatedCategory.description,
        imageUrl: updatedCategory.imageUrl || null,
      });
      if (updatedCategory.imageUrl) {
        setFileList([{ uid: '-1', name: 'image', status: 'done', url: updatedCategory.imageUrl }]);
      } else {
        setFileList([]);
      }
      setIsEditing(false);
      message.success('Category updated successfully');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/categories/${params.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete category');
      message.success('Category deleted successfully');
      router.push('/admin/categories/all-categories');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to delete category');
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

  if (error || !category) {
    return (
      <ProtectedAdmin>
        <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
          <Sidebar initialOpen={false} />
          <div className="flex-1 p-6 bg-gray-50 overflow-auto flex items-center justify-center">
            <Card style={{ width: 600 }}>
              <p className="text-red-500 text-center">{error || 'Category not found'}</p>
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
            title={isEditing ? 'Edit Category' : 'Category Details'}
            style={{ width: 600 }}
            actions={[
              <Button
                key="edit"
                type={isEditing ? 'primary' : 'default'}
                icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                onClick={handleEditToggle}
                loading={isEditing && isSaving}
                style={isEditing && !isSaving ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
              >
                {isEditing ? 'Save Changes' : 'Edit Category'}
              </Button>,
              <Popconfirm
                key="delete"
                title="Are you sure you want to delete this category?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button type="default" danger icon={<DeleteOutlined />}>
                  Delete Category
                </Button>
              </Popconfirm>,
            ]}
          >
            <Form form={form} layout="vertical" disabled={!isEditing}>
              <Form.Item name="imageUrl" label="Category Image">
                <Upload {...uploadProps} listType="picture" maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>

              {fileList.length > 0 && fileList[0].url && !isEditing && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={fileList[0].url}
                    alt={category.name}
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}

              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input size="large" style={{ textAlign: 'center' }} />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} style={{ textAlign: 'center' }} />
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </ProtectedAdmin>
  );
}