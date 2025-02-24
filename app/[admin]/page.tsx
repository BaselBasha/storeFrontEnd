'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import HeroSection from '../components/heroSec';

export default function Admin() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
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

  // Always render a loading state initially (server and client match)
  if (isAuthorized === null) {
    return <div>Loading...</div>; // Consistent on server and client
  }

  // Render the admin dashboard if authorized
  return (
    <Layout>
      <HeroSection />
    </Layout>
  );
}