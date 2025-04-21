import { useEffect, useState } from 'react';
import axiosWithAuth from '@/app/lib/axiosWithAuth';
import { message } from 'antd';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: { name: string };
}

interface CheckoutItem {
  product: Product;
  quantity: number;
}

interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

interface User {
  id: string;
  fullName?: string;
  addresses: Address[];
}

const useCheckoutData = (singleProductId: string | null) => {
  const [products, setProducts] = useState<CheckoutItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const userRes = await axiosWithAuth.get('/auth/me');
        setUser(userRes.data);

        let items: CheckoutItem[] = [];

        if (singleProductId) {
          const res = await axiosWithAuth.get(`/products/${singleProductId}`);

          const quantityParam = searchParams.get('quantity');
          const quantity = parseInt(quantityParam || '1', 10);
          const finalQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;

          items = [{ product: res.data, quantity: finalQuantity }];
        } else {
          const res = await axiosWithAuth.get('/cart');
          items = Array.isArray(res.data.items)
            ? res.data.items
                .filter((item: any) => item.product)
                .map((item: any) => ({
                  product: item.product,
                  quantity: item.quantity || 1,
                }))
            : [];
        }

        setProducts(items);
      } catch (error) {
        console.error('Error loading checkout data:', error);
        message.error('Failed to load user or cart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCart();
  }, [singleProductId, searchParams]);

  return { products, user, loading };
};

export default useCheckoutData;
