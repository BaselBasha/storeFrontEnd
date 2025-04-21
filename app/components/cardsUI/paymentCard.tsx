'use client';

import React from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Divider,
  Input,
  message,
  Row,
  Col,
} from 'antd';
import {
  CreditCardOutlined,
  PayCircleOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { Select } from 'antd';

const { Text } = Typography;

interface Props {
  total: number;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  handlePayment: () => void;
  cardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  setCardDetails: (value: { cardNumber: string; expiryDate: string; cvv: string }) => void;
  paypalEmail: string;
  setPaypalEmail: (email: string) => void;
}

const getCardType = (number: string) => {
  const digitOnly = number.replace(/\s/g, '');
  if (/^4\d{12}(\d{3})?$/.test(digitOnly)) return 'visa';
  if (/^5[1-5]\d{14}$/.test(digitOnly)) return 'mastercard';
  if (/^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)\d{12}$/.test(digitOnly)) return 'mastercard';
  return null;
};

const PaymentCard: React.FC<Props> = ({
  total,
  paymentMethod,
  setPaymentMethod,
  handlePayment,
  cardDetails,
  setCardDetails,
  paypalEmail,
  setPaypalEmail,
}) => {
  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvv } = cardDetails;
    const digitsOnly = cardNumber.replace(/\s/g, '');

    if (!/^\d{16}$/.test(digitsOnly)) {
      message.error('Card number must be 16 digits.');
      return false;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryDate)) {
      message.error('Expiry date must be in MM/YY format.');
      return false;
    }

    const [month, year] = expiryDate.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      message.error('Card is expired.');
      return false;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      message.error('CVV must be 3 or 4 digits.');
      return false;
    }

    return true;
  };

  const validatePaypalEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paypalEmail)) {
      message.error('Please enter a valid PayPal email.');
      return false;
    }
    return true;
  };

  const handlePaymentWithValidation = () => {
    if (paymentMethod === 'visa' && !validateCardDetails()) return;
    if (paymentMethod === 'paypal' && !validatePaypalEmail()) return;
    handlePayment();
  };

  const paymentOptions = [
    {
      key: 'visa',
      label: 'Visa / MasterCard',
      icon: <CreditCardOutlined style={{ fontSize: 24 }} />,
    },
    {
      key: 'paypal',
      label: 'PayPal',
      icon: <PayCircleOutlined style={{ fontSize: 24 }} />,
    },
    {
      key: 'crypto',
      label: 'Crypto (Coming Soon)',
      icon: <DollarCircleOutlined style={{ fontSize: 24 }} />,
      disabled: true,
    },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) => (currentYear + i).toString().slice(-2));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  const cardType = getCardType(cardDetails.cardNumber);

  return (
    <Card
      title="Payment"
      className="shadow-md sticky top-6"
      actions={[
        <Button
          key="pay"
          type="primary"
          size="large"
          block
          onClick={handlePaymentWithValidation}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Pay ${total}
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>Total:</Text>
          <Text style={{ float: 'right' }}>${total}</Text>
        </div>

        <Divider />

        <Text strong>Select Payment Method:</Text>
        <Row gutter={16}>
          {paymentOptions.map((method) => (
            <Col span={8} key={method.key}>
              <Card
                hoverable={!method.disabled}
                onClick={() => !method.disabled && setPaymentMethod(method.key)}
                style={{
                  border:
                    paymentMethod === method.key
                      ? '2px solid #1890ff'
                      : '1px solid #d9d9d9',
                  opacity: method.disabled ? 0.5 : 1,
                  textAlign: 'center',
                  borderRadius: 8,
                  cursor: method.disabled ? 'not-allowed' : 'pointer',
                }}
              >
                {method.icon}
                <div style={{ marginTop: 8 }}>{method.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {paymentMethod === 'visa' && (
          <div className="space-y-3 mt-4">
            <div>
              <Input
                placeholder="Card Number (16 digits)"
                value={cardDetails.cardNumber}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                  const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                  setCardDetails({ ...cardDetails, cardNumber: formatted });
                }}
              />
              {cardDetails.cardNumber && !/^\d{4} \d{4} \d{4} \d{4}$/.test(cardDetails.cardNumber) && (
                <Text type="danger">Card number must be 16 digits</Text>
              )}
              {cardType && (
                <div className="mt-2">
                  <Text type="secondary">Detected: {cardType.toUpperCase()}</Text>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Select
                placeholder="MM"
                value={cardDetails.expiryDate.split('/')[0] || undefined}
                onChange={(month) => {
                  const [, year = ''] = cardDetails.expiryDate.split('/');
                  setCardDetails({ ...cardDetails, expiryDate: `${month}/${year}` });
                }}
                style={{ width: '50%' }}
              >
                {months.map((month) => (
                  <Select.Option key={month} value={month}>
                    {month}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="YY"
                value={cardDetails.expiryDate.split('/')[1] || undefined}
                onChange={(year) => {
                  const [month = ''] = cardDetails.expiryDate.split('/');
                  setCardDetails({ ...cardDetails, expiryDate: `${month}/${year}` });
                }}
                style={{ width: '50%' }}
              >
                {years.map((year) => (
                  <Select.Option key={year} value={year}>
                    {year}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div>
              <Input
                placeholder="CVV (3 or 4 digits)"
                value={cardDetails.cvv}
                onChange={(e) => {
                  const cvv = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setCardDetails({ ...cardDetails, cvv });
                }}
              />
              {cardDetails.cvv && !/^\d{3,4}$/.test(cardDetails.cvv) && (
                <Text type="danger">CVV must be 3 or 4 digits</Text>
              )}
            </div>
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div className="space-y-3 mt-4">
            <Input
              placeholder="PayPal Email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
            />
          </div>
        )}
      </Space>
    </Card>
  );
};

export default PaymentCard;
