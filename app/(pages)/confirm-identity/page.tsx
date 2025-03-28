// pages/confirm-identity.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Input, Button, message, Spin, Typography } from 'antd';

const { Title } = Typography;

const ConfirmIdentity = () => {
  const [token, setToken] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      verifyToken(tokenParam);
    } else {
      message.error('Invalid or missing token');
      router.push('/login');
    }
  }, [searchParams, router]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:4000/users/find-user-by-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify token');
      }

      const data = await response.json();
      if (!data.pendingAction) {
        throw new Error('No pending action found for this token');
      }
      setPendingAction(data.pendingAction);
    } catch (error) {
      console.error('Error verifying token:', error.message);
      message.error(`Failed to verify token: ${error.message}`);
      router.push('/login');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      message.error('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      message.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      message.success('Password changed successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error changing password:', error.message);
      message.error(`Failed to change password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToEditProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/users/clear-password-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear token');
      }

      message.success('Identity verified successfully');
      // Store the token in sessionStorage to ensure the user remains authenticated
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        message.error('Please log in to continue');
        router.push('/login');
        return;
      }
      router.push('/admin/profile/edit-profile');
    } catch (error) {
      console.error('Error proceeding to edit profile:', error.message);
      message.error(`Failed to proceed: ${error.message}`);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (!token || !pendingAction) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card style={{ width: 400 }} title={<Title level={3}>Confirm Identity</Title>}>
        <Spin spinning={loading}>
          {pendingAction === 'changePassword' ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <Input.Password
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <Input.Password
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="primary" onClick={handleChangePassword} block>
                Change Password
              </Button>
            </>
          ) : pendingAction === 'editProfile' ? (
            <>
              <p>Your identity has been verified. Click the button below to proceed to edit your profile.</p>
              <Button type="primary" onClick={handleProceedToEditProfile} block>
                Proceed to Edit Profile
              </Button>
            </>
          ) : (
            <p>Invalid action. Please try again.</p>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default ConfirmIdentity;