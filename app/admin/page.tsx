'use client'; // Mark this component as a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for the app directory

export default function Admin() {
  const router = useRouter();

  useEffect(() => {
    // Get the access token from sessionStorage
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      // Redirect to login page if no token
      router.push('/signin');
      return;
    }

    try {
      // Decode the JWT to check the role
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
       console.log(decodedToken)

      if (decodedToken.role !== 'ADMIN') {
        // Redirect to home page if not an admin
        router.push('/');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login'); // Redirect to login if token is invalid
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>
      {/* Your admin page content */}
    </div>
  );
}