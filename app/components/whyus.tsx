'use client';

import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import { DollarOutlined, LockOutlined, RocketOutlined, DollarCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <RocketOutlined style={{ fontSize: '2.5rem', color: '#1890ff' }} />,
    title: 'Fast Delivery',
    description: 'Experience lightning-fast order processing and shipping, straight to your door.',
  },
  {
    icon: <LockOutlined style={{ fontSize: '2.5rem', color: '#52c41a' }} />,
    title: 'Top-Notch Security',
    description: 'Your personal and payment data are protected with enterprise-grade encryption.',
  },
  {
    icon: <DollarOutlined style={{ fontSize: '2.5rem', color: '#fa541c' }} />,
    title: 'Exclusive Discounts',
    description: 'Unlock amazing deals and unbeatable prices on your favorite games.',
  },
  {
    icon: <DollarCircleOutlined style={{ fontSize: '2.5rem', color: '#f0b90b' }} />,
    title: 'Crypto Payments (Coming Soon)',
    description: 'Get ready to purchase with Bitcoin and more — fast, secure, and decentralized.',
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section style={{ padding: '5rem 1rem', background: 'transparent' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Why Choose Us?
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  borderRadius: 16,
                  padding: '2rem 1rem',
                  height: '100%',
                }}
              >
                <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph type="secondary">{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default WhyChooseUs;
