'use client';

import React, { useState, useEffect } from 'react';
import ProtectedAdmin from '@/app/components/ProtectedAdmin';
import { Sidebar } from '@/app/components/sidebar';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Image, Popconfirm, message, Upload, Row, Col } from 'antd';
import { EditOutlined, SaveOutlined, DeleteOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  subcategories?: Category[];
}

export default function CategoryEditPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [mainForm] = Form.useForm();
  const [subForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [subFileLists, setSubFileLists] = useState<{ [key: string]: UploadFile[] }>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`https://store-backend-tb6b.onrender.com/categories/id/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch category');
        const mainData: Category = await response.json();
        
        const subResponse = await fetch(`https://store-backend-tb6b.onrender.com/categories/${params.id}/subcategories`);
        if (!subResponse.ok) throw new Error('Failed to fetch subcategories');
        const subData: Category[] = await subResponse.json();
        
        const data = { ...mainData, subcategories: subData };
        setCategory(data);
        mainForm.setFieldsValue({
          name: data.name,
          description: data.description,
          imageUrl: data.imageUrl || null,
        });
        setFileList(data.imageUrl ? [{ uid: '-1', name: 'image', status: 'done', url: data.imageUrl }] : []);
        
        const initialSubFileLists: { [key: string]: UploadFile[] } = {};
        subData.forEach((sub: Category) => {
          initialSubFileLists[sub.id] = sub.imageUrl
            ? [{ uid: '-1', name: 'image', status: 'done', url: sub.imageUrl }]
            : [];
        });
        setSubFileLists(initialSubFileLists);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, mainForm]);

  const handleUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('https://store-backend-tb6b.onrender.com/images/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    const data = await response.json();
    return data.url;
  };

  const mainUploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
      mainForm.setFieldsValue({ imageUrl: null });
    },
    beforeUpload: (file) => {
      handleUpload(file)
        .then((url) => {
          setFileList([{ uid: file.uid, name: file.name, status: 'done', url }]);
          mainForm.setFieldsValue({ imageUrl: url });
        })
        .catch(() => {
          setFileList([{ uid: file.uid, name: file.name, status: 'error' }]);
        });
      return false;
    },
    fileList,
    disabled: !isEditing,
  };

  const getSubUploadProps = (subId: string): UploadProps => ({
    onRemove: () => {
      setSubFileLists(prev => ({ ...prev, [subId]: [] }));
      subForm.setFieldsValue({ imageUrl: null });
    },
    beforeUpload: (file) => {
      handleUpload(file)
        .then((url) => {
          setSubFileLists(prev => ({
            ...prev,
            [subId]: [{ uid: file.uid, name: file.name, status: 'done', url }],
          }));
          subForm.setFieldsValue({ imageUrl: url });
        })
        .catch(() => {
          setSubFileLists(prev => ({
            ...prev,
            [subId]: [{ uid: file.uid, name: file.name, status: 'error' }],
          }));
        });
      return false;
    },
    fileList: subFileLists[subId] || [],
    disabled: editingSubcategory !== subId,
  });

  const saveMainChanges = async (values: Partial<Category>) => {
    setIsSaving(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl || null,
      };
      const response = await fetch(`https://store-backend-tb6b.onrender.com/categories/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update category');
      const updatedCategory = await response.json();
      setCategory(prev => ({ ...prev!, ...updatedCategory }));
      setFileList(updatedCategory.imageUrl ? [{ uid: '-1', name: 'image', status: 'done', url: updatedCategory.imageUrl }] : []);
      setIsEditing(false);
      message.success('Category updated successfully');
    } catch (err) {
      message.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const saveSubcategory = async (subId: string, values: Partial<Category>) => {
    setIsSaving(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl || null,
        parentId: params.id,
      };
      const response = await fetch(`https://store-backend-tb6b.onrender.com/categories/${subId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update subcategory');
      const updatedSub = await response.json();
      setCategory(prev => ({
        ...prev!,
        subcategories: prev!.subcategories!.map(sub => sub.id === subId ? updatedSub : sub),
      }));
      setSubFileLists(prev => ({
        ...prev,
        [subId]: updatedSub.imageUrl ? [{ uid: '-1', name: 'image', status: 'done', url: updatedSub.imageUrl }] : [],
      }));
      setEditingSubcategory(null);
      subForm.resetFields(); // Reset form after saving
      message.success('Subcategory updated successfully');
    } catch (err) {
      message.error('Failed to save subcategory');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSubcategory = async (subId: string) => {
    try {
      const response = await fetch(`https://store-backend-tb6b.onrender.com/categories/${subId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete subcategory');
      setCategory(prev => ({
        ...prev!,
        subcategories: prev!.subcategories!.filter(sub => sub.id !== subId),
      }));
      setSubFileLists(prev => {
        const newLists = { ...prev };
        delete newLists[subId];
        return newLists;
      });
      message.success('Subcategory deleted successfully');
    } catch (err) {
      message.error('Failed to delete subcategory');
    }
  };

  const handleMainEditToggle = async () => {
    if (isEditing) {
      try {
        const values = await mainForm.validateFields();
        await saveMainChanges(values);
      } catch (err) {
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSubEditToggle = async (subId: string, subcategory?: Category) => {
    if (editingSubcategory === subId) {
      try {
        const values = await subForm.validateFields();
        await saveSubcategory(subId, values);
      } catch (err) {
        return;
      }
    } else {
      if (subcategory) {
        // Explicitly set the form fields for the new subcategory being edited
        subForm.setFieldsValue({
          name: subcategory.name,
          description: subcategory.description || '', // Ensure empty string if null
          imageUrl: subcategory.imageUrl || null,
        });
      }
      setEditingSubcategory(subId);
    }
  };

  if (loading) return <ProtectedAdmin><div className="flex flex-col md:flex-row h-screen w-full mx-auto"><Sidebar initialOpen={false} /><Card loading={true} className="m-auto" style={{ width: 600 }} /></div></ProtectedAdmin>;

  if (error || !category) return <ProtectedAdmin><div className="flex flex-col md:flex-row h-screen w-full mx-auto"><Sidebar initialOpen={false} /><Card className="m-auto" style={{ width: 600 }}><p className="text-red-500 text-center">{error || 'Category not found'}</p></Card></div></ProtectedAdmin>;

  return (
    <ProtectedAdmin>
      <div className="flex flex-col md:flex-row h-screen w-full mx-auto">
        <Sidebar initialOpen={false} />
        <div className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-center">
              <Card
                title={isEditing ? 'Edit Category' : 'Category Details'}
                style={{ width: '100%', maxWidth: 600 }}
                actions={[
                  <Button
                    key="edit"
                    type={isEditing ? 'primary' : 'default'}
                    icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                    onClick={handleMainEditToggle}
                    loading={isEditing && isSaving}
                    style={isEditing && !isSaving ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Category'}
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="Are you sure you want to delete this category?"
                    onConfirm={() => router.push('/admin/categories/all-categories')}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="default" danger icon={<DeleteOutlined />}>
                      Delete Category
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Form form={mainForm} layout="vertical" disabled={!isEditing}>
                  <Form.Item name="imageUrl" label="Category Image">
                    <Upload {...mainUploadProps} listType="picture" maxCount={1}>
                      <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                  </Form.Item>
                  {fileList.length > 0 && fileList[0].url && !isEditing && (
                    <div className="flex justify-center mb-4">
                      <Image src={fileList[0].url} alt={category.name} width={300} height={200} style={{ objectFit: 'cover', borderRadius: '8px' }} />
                    </div>
                  )}
                  <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                </Form>
              </Card>
            </div>

            <Card
              title="Subcategories"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => router.push(`/admin/categories/create?parentId=${params.id}`)}
                >
                  Add Subcategory
                </Button>
              }
            >
              <Row gutter={[24, 24]}>
                {category && category.subcategories && category.subcategories.length > 0 ? (
                  category.subcategories.map((sub, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      key={sub.id}
                      style={{
                        borderRight: index % 3 !== 2 ? '1px solid #f0f0f0' : 'none',
                        paddingRight: index % 3 !== 2 ? 12 : 0,
                      }}
                    >
                      <Card
                        size="small"
                        title={editingSubcategory !== sub.id ? sub.name : undefined}
                        actions={[
                          <Button
                            key={`edit-${sub.id}`}
                            size="small"
                            type={editingSubcategory === sub.id ? 'primary' : 'default'}
                            icon={editingSubcategory === sub.id ? <SaveOutlined /> : <EditOutlined />}
                            onClick={() => handleSubEditToggle(sub.id, sub)}
                            loading={editingSubcategory === sub.id && isSaving}
                            style={editingSubcategory === sub.id && !isSaving ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
                          >
                            {editingSubcategory === sub.id ? 'Save' : 'Edit'}
                          </Button>,
                          <Popconfirm
                            key={`delete-${sub.id}`}
                            title="Are you sure you want to delete this subcategory?"
                            onConfirm={() => deleteSubcategory(sub.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button size="small" type="default" danger icon={<DeleteOutlined />} />
                          </Popconfirm>,
                        ]}
                      >
                        <Form
                          form={subForm}
                          layout="vertical"
                          disabled={editingSubcategory !== sub.id}
                        >
                          <Form.Item name="imageUrl" label="Image">
                            <Upload {...getSubUploadProps(sub.id)} listType="picture" maxCount={1}>
                              <Button size="small" icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                          </Form.Item>
                          {subFileLists[sub.id]?.length > 0 && subFileLists[sub.id][0].url && editingSubcategory !== sub.id && (
                            <div className="flex justify-center mb-2">
                              <Image src={subFileLists[sub.id][0].url} alt={sub.name} width={100} height={100} style={{ objectFit: 'cover', borderRadius: '4px' }} />
                            </div>
                          )}
                          {editingSubcategory === sub.id && (
                            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                              <Input size="small" />
                            </Form.Item>
                          )}
                          {editingSubcategory === sub.id ? (
                            <Form.Item name="description" label="Description">
                              <Input.TextArea rows={2} size="small" />
                            </Form.Item>
                          ) : (
                            <p className="text-gray-600">{sub.description || 'No description'}</p>
                          )}
                        </Form>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <p className="text-center text-gray-500">No subcategories found</p>
                  </Col>
                )}
              </Row>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedAdmin>
  );
}