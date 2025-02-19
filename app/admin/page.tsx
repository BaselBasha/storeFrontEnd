'use client'; // Mark this component as a client component
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for the app directory

export default function Admin() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null); // Explicitly define the type

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
      if (decodedToken.role !== 'ADMIN') {
        // Redirect to home page if not an admin
        router.push('/');
      } else {
        // Set authorized status to true if the user is an admin
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/signin'); // Redirect to login if token is invalid
    }
  }, [router]);

  // Render nothing while checking authorization
  if (isAuthorized === null) {
    return null; // Or you can return a loading spinner if desired
  }

  // Render the admin dashboard only if authorized
  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>
      {/* Your admin page content */}
    </div>
  );
}