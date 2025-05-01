'use client'

import ProtectedAdmin from '@/app/components/ProtectedAdmin'
import { Sidebar } from '@/app/components/sidebar'
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Layout, Card, Descriptions, Button, Space, Typography, Modal, message } from 'antd'
import { UserOutlined, EditOutlined, LockOutlined } from '@ant-design/icons'
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

export default function AdminProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<'editProfile' | 'changePassword' | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
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
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isMounted]);

  const handleEditProfile = () => {
    setModalAction('editProfile');
    setIsModalVisible(true);
  };

  const handleChangePassword = () => {
    setModalAction('changePassword');
    setIsModalVisible(true);
  };

  const handleSendConfirmation = async () => {
    setSendingEmail(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      // Store the intended action in sessionStorage
      sessionStorage.setItem('pendingAction', modalAction || '');

      const response = await fetch(`http://localhost:4000/users/request-identity-confirmation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: modalAction }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send confirmation email');
      }

      message.success('A confirmation email has been sent to your email address. Please check your inbox and follow the link to proceed.');
      setIsModalVisible(false);
    } catch (error: any) {
      console.error('Error sending confirmation email:', error);
      message.error(`Failed to send confirmation email: ${error.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setModalAction(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('pendingAction'); // Clear pending action on logout
    router.push('/login');
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

  const primaryAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];

  return (
    <ProtectedAdmin>
      <div className={cn("flex flex-col md:flex-row h-screen w-full mx-auto")}>
        <Sidebar initialOpen={false} />
        
        <Layout>
          <Content style={{ margin: '24px 16px', padding: 24 }}>
            <Card>
              <Title level={2}>Admin Profile</Title>
              
              {/* Profile Information Section */}
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                title="Profile Information"
                extra={
                  <Space>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      icon={<LockOutlined />}
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </Button>
                  </Space>
                }
              >
                <Descriptions.Item label="Full Name">
                  {user.fullName || 'Not set'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Username">
                  {user.username}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {user.gender || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Birth Date">
                  {user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Not set'}
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  {user.role}
                </Descriptions.Item>
                <Descriptions.Item label="Account Created">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="User ID">
                  {user.id}
                </Descriptions.Item>
              </Descriptions>

              {/* Contact Information Section with Edit Button */}
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                title="Contact Information"
                style={{ marginTop: 24 }}
                extra={
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => router.push('/admin/profile/edit-contact-info')}
                  >
                    Edit Contact Info
                  </Button>
                }
              >
                <Descriptions.Item label="Phone Number">
                  {user.phoneNumber || 'Not set'}
                </Descriptions.Item>
                <Descriptions.Item label="Address Line 1">
                  {primaryAddress?.addressLine1 || 'Not set'}
                </Descriptions.Item>
                <Descriptions.Item label="Address Line 2">
                  {primaryAddress?.addressLine2 || 'Not set'}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {primaryAddress?.city || 'Not set'}
                </Descriptions.Item>
                <Descriptions.Item label="State">
                  {primaryAddress?.state || 'Not set'}
                </Descriptions.Item>
                <Descriptions.Item label="Postal Code">
                  {primaryAddress?.postalCode || 'Not set'}
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {primaryAddress?.country || 'Not set'}
                </Descriptions.Item>
              </Descriptions>

              {/* Account Actions Section */}
              <Card
                title="Account Actions"
                style={{ marginTop: 24 }}
                type="inner"
              >
                <Space direction="vertical">
                  <Button 
                    type="primary" 
                    icon={<UserOutlined />}
                    onClick={() => console.log('View full profile')}
                  >
                    View Full Profile
                  </Button>
                  <Button 
                    danger
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Space>
              </Card>
            </Card>
          </Content>
        </Layout>
      </div>

      {/* Modal for Identity Confirmation */}
      <Modal
        title="Confirm Your Identity"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button key="send" type="primary" onClick={handleSendConfirmation} loading={sendingEmail}>
            Send
          </Button>,
        ]}
      >
        <p>
          For your security, we need to verify your identity before you can {modalAction === 'editProfile' ? 'edit your profile' : 'change your password'}. 
          A confirmation email will be sent to <strong>{user?.email}</strong>. 
          Please click the link in the email to proceed with your request.
        </p>
      </Modal>
    </ProtectedAdmin>
  );
}