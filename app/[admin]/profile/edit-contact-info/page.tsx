'use client'

import ProtectedAdmin from '@/app/components/ProtectedAdmin'
import { Sidebar } from '@/app/components/sidebar'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Layout, Card, Table, Input, Button, Space, Typography, message, Spin } from 'antd'
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'

const { Content } = Layout
const { Title } = Typography

interface Address {
  id: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  isDefault: boolean;
  createdAt: string;
}

interface User {
  id: string;
  fullName?: string;
  email: string;
  username: string;
  gender?: string;
  birthDate?: string;
  role: string;
  phoneNumber?: string;
  createdAt?: string;
  addresses?: Address[];
}

export const EditContactInfo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [primaryAddress, setPrimaryAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true); // Initial data fetch loading
  const [loadingUpdate, setLoadingUpdate] = useState(false); // Update submission loading
  const [isMounted, setIsMounted] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null); // Track which field is being edited
  const [editValue, setEditValue] = useState<any>(null); // Store the value being edited
  const router = useRouter();

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
        const primaryAddr = data.addresses?.find((addr: Address) => addr.isDefault) || data.addresses?.[0];
        setUser(data);
        setPrimaryAddress(primaryAddr || null);
      } catch (error) {
        console.error('Error fetching user:', error);
        message.error('Failed to load contact info');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isMounted]);

  const handleEdit = (field: string, value: any) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSave = async (field: string) => {
    setLoadingUpdate(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      let payload: any = {};
      if (field === 'phoneNumber') {
        payload = { phoneNumber: editValue };
      } else {
        // Construct the address object with the edited field
        const addressPayload: any = {
          addressLine1: primaryAddress?.addressLine1,
          addressLine2: primaryAddress?.addressLine2,
          city: primaryAddress?.city,
          state: primaryAddress?.state,
          postalCode: primaryAddress?.postalCode,
          country: primaryAddress?.country,
          isDefault: primaryAddress?.isDefault ?? true,
          [field]: editValue,
        };

        payload = { address: addressPayload };
      }

      const response = await fetch(`http://localhost:4000/users/updateUser`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update contact info');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setPrimaryAddress(updatedUser.addresses?.find((addr: Address) => addr.isDefault) || updatedUser.addresses?.[0] || null);
      message.success(`${field} updated successfully`);
    } catch (error: any) {
      console.error('Error updating contact info:', error);
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
    { key: 'phoneNumber', label: 'Phone Number', value: user.phoneNumber || '' },
    { key: 'addressLine1', label: 'Address Line 1', value: primaryAddress?.addressLine1 || '' },
    { key: 'addressLine2', label: 'Address Line 2', value: primaryAddress?.addressLine2 || '' },
    { key: 'city', label: 'City', value: primaryAddress?.city || '' },
    { key: 'state', label: 'State/Province', value: primaryAddress?.state || '' },
    { key: 'postalCode', label: 'Postal Code', value: primaryAddress?.postalCode || '' },
    { key: 'country', label: 'Country', value: primaryAddress?.country || '' },
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
          return (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          );
        }
        return <span>{text}</span>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => {
        const isEditing = editingField === record.key;
        const isEditable = [
          'phoneNumber',
          'addressLine1',
          'addressLine2',
          'city',
          'state',
          'postalCode',
          'country',
        ].includes(record.key);

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
              title={<Title level={2}>Edit Contact Information</Title>}
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
                <Space style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    onClick={() => router.push('profile')}
                  >
                    Back to Profile
                  </Button>
                </Space>
              </Spin>
            </Card>
          </Content>
        </Layout>
      </div>
    </ProtectedAdmin>
  );
};

export default EditContactInfo;