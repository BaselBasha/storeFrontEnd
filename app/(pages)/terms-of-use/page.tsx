'use client';

import React from 'react';
import Layout from '@/app/components/Layout';
import { Typography, Card, Divider } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const TermsOfUsePage: React.FC = () => {
  return (
    <Layout>
      <Card
        style={{
          maxWidth: 1200,
          margin: '2rem auto',
          padding: '2rem',
          borderRadius: '2rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        {/* Title Section */}
        <Title level={2} style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '2rem' }}>
          Terms of Use
        </Title>

        {/* Introduction Paragraph */}
        <Paragraph
          style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#555',
            maxWidth: 900,
            margin: '0 auto',
            marginBottom: '2rem',
          }}
        >
          By accessing or using our platform, you agree to be bound by the terms outlined below. Please read them carefully.
        </Paragraph>

        {/* Section 1: Acceptance of Terms */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          1. Acceptance of Terms
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          Your use of our services is conditioned upon your acceptance of these Terms. If you do not agree, please do not use the platform.
        </Paragraph>

        {/* Section 2: User Responsibilities */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          2. User Responsibilities
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          You are responsible for maintaining the confidentiality of your account. You agree not to misuse our platform, interfere with its operation, or violate any laws while using our services.
        </Paragraph>

        {/* Section 3: Intellectual Property */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          3. Intellectual Property
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          All content, trademarks, and materials on this site are the property of our company or licensors. You may not reproduce, distribute, or use them without written permission.
        </Paragraph>

        {/* Section 4: Purchases and Payments */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          4. Purchases and Payments
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          All purchases made through our platform are subject to our payment policies. We reserve the right to change pricing or cancel orders under specific conditions.
        </Paragraph>

        {/* Section 5: Limitation of Liability */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          5. Limitation of Liability
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          We are not liable for any indirect, incidental, or consequential damages resulting from your use of our services.
        </Paragraph>

        {/* Section 6: Termination */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          6. Termination
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          We may suspend or terminate your access at any time for any breach of these Terms or misuse of the platform.
        </Paragraph>

        {/* Section 7: Changes to Terms */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          7. Changes to Terms
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          We may update these Terms from time to time. Continued use after such changes constitutes your agreement to the new Terms.
        </Paragraph>

        {/* Section 8: Contact */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          8. Contact
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
          If you have any questions about these Terms, feel free to contact us at{' '}
          <Link href="mailto:support@example.com" style={{ color: '#1890ff', fontWeight: 500 }}>
            <MailOutlined style={{ marginRight: '0.5rem' }} /> support@example.com
          </Link>
          .
        </Paragraph>

        {/* Divider at the End */}
        <Divider style={{ marginTop: '2rem', borderColor: '#ddd' }} />
      </Card>
    </Layout>
  );
};

export default TermsOfUsePage;