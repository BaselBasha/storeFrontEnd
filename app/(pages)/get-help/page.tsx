'use client';

import Layout from '@/app/components/Layout';
import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { QuestionCircleOutlined, DollarCircleOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const helpTopics = [
  {
    icon: <QuestionCircleOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    title: 'Ordering & Delivery',
    description: 'Learn how to place orders, track deliveries, and manage your purchases.',
  },
  {
    icon: <DollarCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    title: 'Refunds & Cancellations',
    description: 'Understand our refund policy, cancellations, and how to request one.',
  },
  {
    icon: <UserOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    title: 'Account Issues',
    description: 'Manage login problems, account settings, and personal information.',
  },
];

const GetHelpPage: React.FC = () => {
  return (
    <Layout>
      <Card style={{ maxWidth: 1000, margin: '2rem auto', padding: '2rem', borderRadius: '1.5rem' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
          Need Help?
        </Title>
        <Paragraph style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 2rem', fontSize: '1.1rem' }}>
          We are here to assist you. Browse help topics below or contact us directly if you need more support.
        </Paragraph>

        <Row gutter={[24, 24]} justify="center">
          {helpTopics.map((topic, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{ textAlign: 'center', borderRadius: '1rem' }}
                styles={{ body: { padding: '1.5rem' } }}
              >
                <div style={{ marginBottom: 16 }}>{topic.icon}</div>
                <Title level={4}>{topic.title}</Title>
                <Paragraph type="secondary">{topic.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Title level={4}>Still need help?</Title>
          <Paragraph>Our support team is available 24/7 via email.</Paragraph>
          <Button type="primary" size="large" icon={<MailOutlined />}>
            Contact Support
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default GetHelpPage;
