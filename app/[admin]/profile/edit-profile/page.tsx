'use client'

import ProtectedAdmin from '@/app/components/ProtectedAdmin'
import { Sidebar } from '@/app/components/sidebar'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { jwtDecode } from 'jwt-decode'
import { 
  Layout, 
  Card, 
  Table, 
  Input, 
  Button, 
  Select, 
  Space, 
  Typography, 
  message, 
  Spin 
} from 'antd'
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'

const { Content } = Layout
const { Title } = Typography
const { Option } = Select

interface User {
  id: string;
  fullName?: string;
  email: string;
  username: string;
  gender?: string;
  birthDate?: string;
  createdAt?: string;
  role?: string;
}

const EditProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initial data fetch loading
  const [loadingUpdate, setLoadingUpdate] = useState(false); // Update submission loading
  const [isMounted, setIsMounted] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null); // Track which field is being edited
  const [editValue, setEditValue] = useState<any>(null); // Store the value being edited

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No access token found');
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.sub;
        if (!userId) {
          throw new Error('No user ID found in token');
        }

        const response = await fetch(`http://localhost:4000/users/id/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        message.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isMounted]);

  const checkFieldUniqueness = async (field: string, value: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`http://localhost:4000/users/check-${field}/${value}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check ${field} uniqueness`);
      }

      const data = await response.json();
      return data.exists; // Return true if the field value exists, false otherwise
    } catch (error) {
      console.error(`Error checking ${field} uniqueness:`, error);
      message.error(`Failed to check ${field} uniqueness. Please try again.`);
      return false; // Allow the update to proceed if the check fails
    }
  };

  const handleEdit = (field: string, value: any) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSave = async (field: string) => {
    // Skip uniqueness check if the value hasn't changed
    if (user && editValue === user[field as keyof User]) {
      setEditingField(null);
      setEditValue(null);
      return;
    }

    // Check uniqueness for username and email
    if (field === 'username' || field === 'email') {
      const exists = await checkFieldUniqueness(field, editValue);
      if (exists) {
        message.error(`${field.charAt(0).toUpperCase() + field.slice(1)} is already taken. Please choose a different one.`);
        return;
      }
    }

    setLoadingUpdate(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const updatedData = { [field]: editValue };
      const response = await fetch(`http://localhost:4000/users/updateUser`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      message.success(`${field} updated successfully`);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      message.error(`Failed to update ${field}: ${error.message}`);
    } finally {
      setLoadingUpdate(false);
      setEditingField(null);
      setEditValue(null);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue(null);
  };

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error: Unable to load user data</div>;
  }

  const dataSource = [
    { key: 'fullName', label: 'Full Name', value: user.fullName || '' },
    { key: 'username', label: 'Username', value: user.username },
    { key: 'email', label: 'Email', value: user.email },
    { key: 'gender', label: 'Gender', value: user.gender || '' },
    { key: 'birthDate', label: 'Birth Date', value: user.birthDate || '' },
    { key: 'role', label: 'Role', value: user.role || '' },
    { key: 'createdAt', label: 'Account Created', value: user.createdAt || '' },
  ];

  const columns = [
    {
      title: 'Field',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text: string, record: any) => {
        if (editingField === record.key) {
          if (record.key === 'gender') {
            return (
              <Select
                value={editValue}
                onChange={(value) => setEditValue(value)}
                style={{ width: 120 }}
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            );
          } else if (record.key === 'birthDate') {
            return (
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={editValue || ''}
                onChange={(e) => setEditValue(e.target.value)}
              />
            );
          } else if (record.key === 'role') {
            return (
              <Select
                value={editValue}
                onChange={(value) => setEditValue(value)}
                style={{ width: 120 }}
              >
                <Option value="ADMIN">ADMIN</Option>
                <Option value="USER">USER</Option>
              </Select>
            );
          } else {
            return (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            );
          }
        }
        return <span>{text}</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => {
        const isEditing = editingField === record.key;
        // Allow editing of 'role' only if the user is an admin
        const isEditable = user.role === 'ADMIN' 
          ? ['fullName', 'username', 'email', 'gender', 'birthDate', 'role'].includes(record.key)
          : ['fullName', 'username', 'email', 'gender', 'birthDate'].includes(record.key);

        return (
          <Space>
            {isEditing ? (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => handleSave(record.key)}
                  disabled={loadingUpdate}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  disabled={loadingUpdate}
                />
              </>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEdit(record.key, record.value)}
                disabled={!isEditable || loadingUpdate}
              />
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <ProtectedAdmin>
      <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
        <Sidebar initialOpen={false} />
        
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24 }}>
            <Card
              title={<Title level={2}>Edit Profile</Title>}
              style={{ maxWidth: 800, margin: '0 auto' }}
              variant="outlined"
              hoverable
            >
              <Spin spinning={loadingUpdate}>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  bordered
                />
              </Spin>
            </Card>
          </Content>
        </Layout>
      </div>
    </ProtectedAdmin>
  );
};

export default EditProfile;