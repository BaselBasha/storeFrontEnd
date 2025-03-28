'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

export default function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/signin');
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.role !== 'ADMIN') {
        router.push('/');
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/signin');
    }
  }, [router]);

  // Show a loading spinner while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Render the children (nested routes) if authorized
  return <>{children}</>;
}