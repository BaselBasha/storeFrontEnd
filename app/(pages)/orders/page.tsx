'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, message, Empty, Collapse, Tag, Image } from 'antd';
import axiosWithAuth from '@/app/lib/axiosWithAuth';
import Layout from '@/app/components/Layout';

const { Title, Text } = Typography;

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
  createdAt: string;
  totalPrice?: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const groupOrdersByStatus = (orders: Order[]) => {
    return orders.reduce((acc: Record<string, Order[]>, order) => {
      if (!acc[order.status]) {
        acc[order.status] = [];
      }
      acc[order.status].push(order);
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userRes = await axiosWithAuth.get('/auth/me');
        const userId = userRes.data?.id;

        if (!userId) {
          return message.error('User not found.');
        }

        const ordersRes = await axiosWithAuth.get(`/orders/user/${userId}`);
        setOrders(ordersRes.data);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        message.error('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const groupedOrders = groupOrdersByStatus(orders);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <Title level={2}>My Orders</Title>

        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <Spin size="large" />
          </div>
        ) : orders.length === 0 ? (
          <Empty description="You have no orders yet." />
        ) : (
          Object.entries(groupedOrders).map(([status, orders]) => (
            <Card key={status} title={`Status Group: ${status}`} className="mb-6 shadow-md">
              <Collapse
                accordion
                items={orders.map((order) => ({
                  key: order.id,
                  label: (
                    <div className="flex justify-between items-center w-full">
                      <span>Order #{order.id}</span>
                      <Tag color="blue">{new Date(order.createdAt).toLocaleDateString()}</Tag>
                    </div>
                  ),
                  children: (
                    <div className="space-y-4">
                      <div>
                        <Text strong>Status: </Text>
                        <Tag color="processing">{order.status}</Tag>
                      </div>

                      <div>
                        <Text strong>Shipping Address:</Text>
                        <p>{order.shippingAddress}</p>
                      </div>

                      <div>
                        <Text strong>Items:</Text>
                        {order.items.map((item, idx) => (
                          <Card key={idx} type="inner" className="mb-3">
                            <div className="flex gap-4">
                              <Image
                                src={item.product.imageUrl || '/placeholder-image.jpg'}
                                alt={item.product.name}
                                width={80}
                                height={80}
                                style={{ objectFit: 'cover', borderRadius: 8 }}
                                preview
                              />
                              <div>
                                <Text strong>{item.product.name}</Text>
                                <br />
                                <Text>Quantity: {item.quantity}</Text>
                                <br />
                                <Text>Price: ${item.price.toFixed(2)}</Text>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      <div>
                        <Text strong>Total: </Text>
                        <Text>
                          ${typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : 'N/A'}
                        </Text>
                      </div>
                    </div>
                  ),
                }))}
              />
            </Card>
          ))
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
