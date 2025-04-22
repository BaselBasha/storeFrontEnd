import { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import axiosWithAuth from '@/app/lib/axiosWithAuth';

const { confirm } = Modal;

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
  createdAt: string;
  totalPrice?: number;
}

export const useUserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const userRes = await axiosWithAuth.get('/auth/me');
      const userId = userRes.data?.id;

      if (!userId) return message.error('User not found.');

      const ordersRes = await axiosWithAuth.get(`/orders/user/${userId}`);
      setOrders(ordersRes.data);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      message.error('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    const loadingKey = 'cancelOrderLoading';
    confirm({
      title: 'Cancel this order?',
      content: 'Are you sure you want to cancel this order? This action cannot be undone.',
      okText: 'Yes, Cancel',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        message.loading({ content: 'Cancelling order...', key: loadingKey, duration: 0 });
        try {
          await axiosWithAuth.patch(`/orders/${orderId}`);
          message.success({ content: 'Order cancelled successfully.', key: loadingKey });
          fetchOrders();
        } catch (error: any) {
          console.error('Cancel error:', error);
          message.error({ content: error?.response?.data?.message || 'Failed to cancel order.', key: loadingKey });
        }
      },
    });
  };

  return { orders, loading, fetchOrders, handleCancelOrder };
};
