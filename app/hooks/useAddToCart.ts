// hooks/useAddToCart.ts
import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import axiosWithAuth from '@/app/lib/axiosWithAuth';
import { useCart } from '@/app/context/CardContext'; // Adjust the import path as necessary


export const useAddToCart = () => {
  const [cartLoadingId, setCartLoadingId] = useState<string | null>(null);
  const { incrementCartCount } = useCart(); // Get incrementCartCount from context

  const handleAddToCart = async (productId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      message.error('Please log in to add products to your cart.');
      return;
    }

    setCartLoadingId(productId);

    try {
      const res = await axiosWithAuth.post('/cart/add', {
        productId,
        quantity: 1,
      });

      if (res.data?.message?.toLowerCase().includes('already')) {
        message.warning('This product is already in your cart.');
      } else {
        message.success('Product added to cart!');
        incrementCartCount(); // Increment cart count on successful addition
      }
    } catch (error: any) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.message?.toLowerCase().includes('already')
      ) {
        message.warning('This product is already in your cart.');
      } else {
        console.error('Error adding to cart:', error);
        message.error('Failed to add product to cart.');
      }
    } finally {
      setCartLoadingId(null);
    }
  };

  return { handleAddToCart, cartLoadingId };
};
