'use client';

import React, { useMemo, Suspense } from 'react';
import {
  Card,
  Typography,
  Spin,
  Image,
  Space,
  message,
  Empty,
  Row,
  Col,
} from 'antd';
import { useSearchParams } from 'next/navigation';
import axiosWithAuth from '@/app/lib/axiosWithAuth';
import Layout from '@/app/components/Layout';
import ShippingAddressCard from '@/app/components/cardsUI/shippingAdressCard';
import PaymentCard from '@/app/components/cardsUI/paymentCard';
import Swal from 'sweetalert2';
import useCheckoutData from '@/app/hooks/useCheckoutData';

const { Title, Text } = Typography;

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

// Fallback component for Suspense
const CheckoutFallback = () => {
  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <Title level={2}>Checkout</Title>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spin size="large" />
        </div>
      </div>
    </Layout>
  );
};

// Main checkout content component
const CheckoutContent: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = React.useState('visa');
  const [addressOption, setAddressOption] = React.useState<'default' | 'new'>('default');
  const [newAddress, setNewAddress] = React.useState<Address>({});
  const searchParams = useSearchParams();
  const singleProductId = searchParams.get('product');
  const [isEditingAddress, setIsEditingAddress] = React.useState(true);
  const [cardDetails, setCardDetails] = React.useState({ cardNumber: '', expiryDate: '', cvv: '' });
  const [paypalEmail, setPaypalEmail] = React.useState('');
  const { products, user, loading } = useCheckoutData(singleProductId);

  const defaultAddress = useMemo(() => {
    return user?.addresses?.find((addr) => addr.isDefault) || user?.addresses?.[0];
  }, [user]);

  const isAddressComplete = (address?: Address) => {
    const requiredFields: (keyof Address)[] = [
      'addressLine1',
      'city',
      'state',
      'postalCode',
      'country',
    ];
    return requiredFields.every((key) => typeof address?.[key] === 'string' && !!address[key]?.trim());
  };

  const total = useMemo(() => {
    return products
      .reduce((sum, { product, quantity }) => sum + (product.price || 0) * (quantity || 1), 0)
      .toFixed(2);
  }, [products]);

  const handlePayment = async () => {
    const selectedAddress = addressOption === 'default' ? defaultAddress : newAddress;

    if (!selectedAddress || !isAddressComplete(selectedAddress)) {
      return message.error('Please provide a complete address.');
    }

    try {
      const userId = user?.id;

      if (!userId) {
        return message.error('User not found.');
      }

      const shippingAddress = [
        selectedAddress.addressLine1,
        selectedAddress.addressLine2,
        selectedAddress.city,
        selectedAddress.state,
        selectedAddress.postalCode,
        selectedAddress.country,
      ]
        .filter(Boolean)
        .join(', ');

      const orderPayload = {
        userId,
        items: products.map(({ product, quantity }) => ({
          productId: product.id,
          quantity: quantity,
          price: product.price,
        })),
        shippingAddress,
      };

      const orderResponse = await axiosWithAuth.post('/orders', orderPayload);

      Swal.fire({
        icon: 'success',
        title: 'Thank you for your purchase!',
        text: 'Your order has been placed successfully.',
      });

      console.log('Order response:', orderResponse.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Payment error:', errorMessage);
      message.error((error as any)?.response?.data?.message || 'Payment failed.');
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <Title level={2}>Checkout</Title>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No items to checkout."
          />
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <Card title="Review Items" className="shadow-md">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {products.map(({ product, quantity }) => (
                    <Card key={product.id} type="inner">
                      <Row gutter={16}>
                        <Col span={6}>
                          <Image
                            src={product.imageUrl || '/placeholder-image.jpg'}
                            alt={product.name}
                            width="100%"
                            height={120}
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                          />
                        </Col>
                        <Col span={18}>
                          <Space direction="vertical" size="small">
                            <Title level={5}>{product.name}</Title>
                            <Text type="secondary">
                              Category: {product.category.name}
                            </Text>
                            <Text>Quantity: {quantity}</Text>
                            <Text strong type="danger">
                              ${(product.price * quantity).toFixed(2)}
                            </Text>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              </Card>

              <ShippingAddressCard
                addressOption={addressOption}
                setAddressOption={setAddressOption}
                defaultAddress={defaultAddress}
                newAddress={newAddress}
                setNewAddress={setNewAddress}
                isEditingAddress={isEditingAddress}
                setIsEditingAddress={setIsEditingAddress}
                isAddressComplete={isAddressComplete}
              />
            </Col>

            <Col xs={24} md={8}>
              <PaymentCard
                total={parseFloat(total)}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                handlePayment={handlePayment}
                cardDetails={cardDetails}
                setCardDetails={setCardDetails}
                paypalEmail={paypalEmail}
                setPaypalEmail={setPaypalEmail}
              />
            </Col>
          </Row>
        )}
      </div>
    </Layout>
  );
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}