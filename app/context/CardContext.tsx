import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosWithAuth from '@/app/lib/axiosWithAuth'; // Adjust the import path as necessary

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cartCount, default to 0
  const [cartCount, setCartCount] = useState<number>(0);

  // Sync cart count with database
  const syncCartWithDB = async () => {
    try {
      const response = await axiosWithAuth.get('/cart');
      const dbCartCount = response.data.items.length; // Use items array from backend response
      setCartCount(dbCartCount);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  // Handle token changes and initial token state
  useEffect(() => {
    const handleAuthChange = (event: Event) => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        // Token was removed (sign-out)
        setCartCount(0);
      } else {
        // Token was added or updated (sign-in)
        syncCartWithDB();
      }
    };

    // Listen for custom authChange event
    window.addEventListener('authChange', handleAuthChange);

    // Check initial token state
    const token = localStorage.getItem('accessToken');
    if (token) {
      syncCartWithDB();
    } else {
      setCartCount(0);
    }

    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const incrementCartCount = () => {
    setCartCount((prev) => prev + 1);
    // Optionally sync with DB after increment
    // axiosWithAuth.post('/cart/add', { productId }).catch((err) => console.error(err));
  };

  const decrementCartCount = () => {
    setCartCount((prev) => (prev > 0 ? prev - 1 : 0));
    // Optionally sync with DB after decrement
    // axiosWithAuth.delete('/cart/productId').catch((err) => console.error(err));
  };

  return (
    <CartContext.Provider
      value={{ cartCount, setCartCount, incrementCartCount, decrementCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};