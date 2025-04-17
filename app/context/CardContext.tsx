import { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number) => void;
  incrementCartCount: () => void;
  decrementCartCount: () => void; // 🔥 Added
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState<number>(0);

  const incrementCartCount = () => {
    setCartCount((prev) => prev + 1);
  };

  const decrementCartCount = () => {
    setCartCount((prev) => (prev > 0 ? prev - 1 : 0)); // prevent negative count
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
