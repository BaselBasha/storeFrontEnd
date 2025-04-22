'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Spin,
  message,
  Empty,
  Collapse,
  Tag,
  Image,
  Button,
  notification,
  Modal,
  Input,
} from 'antd';
import Layout from '@/app/components/Layout';
import { useUserOrders, Order } from '@/app/hooks/useUserOrder';
import axiosWithAuth from '@/app/lib/axiosWithAuth';

const { Title, Text } = Typography;
const { confirm } = Modal;

const statusColorMap: Record<string, string> = {
  pending: '#fa8c16',
  processing: '#1890ff',
  shipped: '#2f54eb',
  delivered: '#52c41a',
  cancelled: '#ff4d4f',
};

const OrdersPage: React.FC = () => {
  const { orders, loading, fetchOrders, handleCancelOrder } = useUserOrders();
  const [feedback, setFeedback] = useState<string>(''); // Store user feedback

  useEffect(() => {
    notification.info({
      message: 'Cancellation Policy',
      description: 'You can only cancel orders that are currently in "pending" status.',
      duration: 5,
    });
  }, []);

  const groupOrdersByStatus = (orders: Order[]) => {
    const grouped = orders.reduce((acc: Record<string, Order[]>, order) => {
      if (!acc[order.status]) acc[order.status] = [];
      acc[order.status].push(order);
      return acc;
    }, {});

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      return statusOrder.indexOf(a) - statusOrder.indexOf(b);
    });

    return sortedKeys.map((status) => ({
      status,
      orders: grouped[status],
    }));
  };

  const groupedOrders = groupOrdersByStatus(orders);

  // Modal for providing feedback after cancellation
  const showFeedbackModal = (orderId: string) => {
    Modal.confirm({
      title: 'Order Cancelled Successfully',
      content: (
        <div>
          <p>Your refund will be processed and returned to your bank account soon.</p>
          <p>Please provide feedback for why you cancelled your order:</p>
          <Input.TextArea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            placeholder="Your feedback"
          />
        </div>
      ),
      okText: 'Submit Feedback',
      cancelText: 'Cancel',
      onOk: async () => {
        if (feedback) {
          try {
            await axiosWithAuth.post(`/orders/${orderId}/feedback`, { feedback });
            message.success('Thank you for your feedback!');
            setFeedback(''); // Reset feedback after submission
          } catch (error: any) {
            message.error('Failed to submit feedback.');
          }
        }
      },
    });
  };

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
          groupedOrders.map(({ status, orders }) => (
            <Card key={status} title={`Orders: ${status.toUpperCase()}`} className="mb-6 shadow-md">
              <Collapse
                accordion
                items={orders.map((order) => ({
                  key: order.id,
                  label: (
                    <div className="flex justify-between items-center w-full">
                      <span>Order #{order.id}</span>
                      <Tag color={statusColorMap[order.status.toLowerCase()] || 'default'}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Tag>
                    </div>
                  ),
                  children: (
                    <div className="space-y-4">
                      <div>
                        <Text strong>Status: </Text>
                        <Tag color={statusColorMap[order.status.toLowerCase()] || 'default'}>
                          {order.status.toUpperCase()}
                        </Tag>
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

                      <div className="flex justify-between items-center">
                        <div>
                          <Text strong>Total: </Text>
                          <Text>
                            ${typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : 'N/A'}
                          </Text>
                        </div>
                        {order.status === 'PENDING' ? (
                          <Button
                            danger
                            onClick={async () => {
                              await handleCancelOrder(order.id);
                              showFeedbackModal(order.id); // Show feedback modal after successful cancellation
                            }}
                          >
                            Cancel Order
                          </Button>
                        ) : (
                          <Text type="secondary">Cancellation not available for {order.status} orders</Text>
                        )}
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
