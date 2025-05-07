import { useState, useCallback } from 'react';
import axios from '../lib/axiosWithAuth';
import { message } from 'antd';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  specifications?: {
    brand?: string;
    processor?: string;
  };
};

export const useFavorites = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Product[]>('https://store-backend-tb6b.onrender.com/favorites', { withCredentials: true });
      setProducts(res.data);
      setFavorites(new Set(res.data.map((item) => item.id)));
    } catch (err) {
      message.error('Failed to load favorites.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (productId: string, product?: Product) => {
      try {
        if (favorites.has(productId)) {
          await axios.delete(`https://store-backend-tb6b.onrender.com/favorites/${productId}`, { withCredentials: true });
          setFavorites((prev) => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          setProducts((prev) => prev.filter((p) => p.id !== productId));
          message.success('Removed from favorites');
        } else {
          await axios.post('https://store-backend-tb6b.onrender.com/favorites', { productId }, { withCredentials: true });
          setFavorites((prev) => {
            const newSet = new Set(prev);
            newSet.add(productId);
            return newSet;
          });
          if (product) {
            setProducts((prev) => {
              if (prev.some((p) => p.id === productId)) {
                return prev;
              }
              return [...prev, product];
            });
          }
          message.success('Added to favorites');
        }
      } catch (err) {
        message.error('Failed to update favorites');
        console.error(err);
      }
    },
    [favorites]
  );

  return { products, loading, favorites, fetchFavorites, toggleFavorite };
};
