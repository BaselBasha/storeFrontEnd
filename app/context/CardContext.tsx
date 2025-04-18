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
  // Initialize cartCount from localStorage, default to 0 if not present
  const [cartCount, setCartCount] = useState<number>(() => {
    const storedCount = localStorage.getItem('cartCount');
    return storedCount ? parseInt(storedCount, 10) : 0;
  });

  // Update localStorage whenever cartCount changes
  useEffect(() => {
    localStorage.setItem('cartCount', cartCount.toString());
  }, [cartCount]);

  // Sync cart count with database
  const syncCartWithDB = async () => {
    try {
      const response = await axiosWithAuth.get('/cart');
      const dbCartCount = response.data.items.length; // Adjust based on your API response
      setCartCount(dbCartCount);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  // Handle token changes and initial token state
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'accessToken') {
        if (!event.newValue) {
          // Token was removed (sign-out)
          setCartCount(0);
          localStorage.removeItem('cartCount');
        } else {
          // Token was added (sign-in)
          syncCartWithDB();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check initial token state
    const token = localStorage.getItem('accessToken');
    if (token) {
      syncCartWithDB();
    } else {
      setCartCount(0);
      localStorage.removeItem('cartCount');
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  const incrementCartCount = () => {
    setCartCount((prev) => prev + 1);
    // Optionally sync with DB after increment
    // axiosWithAuth.post('/cart', { itemId }).catch((err) => console.error(err));
  };

  const decrementCartCount = () => {
    setCartCount((prev) => (prev > 0 ? prev - 1 : 0));
    // Optionally sync with DB after decrement
    // axiosWithAuth.delete('/cart/itemId').catch((err) => console.error(err));
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