'use client';

import Layout from '@/app/components/Layout';
import React from 'react';
import { Typography, Card, Divider } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const PrivacyPolicyPage: React.FC = () => {
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
          Privacy Policy
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
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
        </Paragraph>

        {/* Section 1: Information We Collect */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          1. Information We Collect
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          We collect information you provide when you register, make a purchase, or interact with our services. This includes your name, email address, payment details, and usage data.
        </Paragraph>

        {/* Section 2: How We Use Your Information */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          2. How We Use Your Information
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          Your data helps us process transactions, improve our services, and communicate with you. We may also use it to personalize your experience and show relevant content.
        </Paragraph>

        {/* Section 3: Data Security */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          3. Data Security
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          We use industry-standard encryption and security practices to protect your data. However, no method of transmission over the internet is 100% secure.
        </Paragraph>

        {/* Section 4: Sharing of Information */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          4. Sharing of Information
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          We do not sell your personal data. We may share your data with trusted third parties for payment processing, hosting, and analytics — only when necessary and under strict confidentiality.
        </Paragraph>

        {/* Section 5: Your Rights */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          5. Your Rights
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          You have the right to access, correct, or delete your personal data at any time. Contact our support team if you need assistance.
        </Paragraph>

        {/* Section 6: Cookies */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          6. Cookies
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          We use cookies to improve site functionality, personalize content, and analyze traffic. You can manage your cookie preferences in your browser settings.
        </Paragraph>

        {/* Section 7: Changes to This Policy */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          7. Changes to This Policy
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555', marginBottom: '1.5rem' }}>
          We may update this policy from time to time. We’ll notify you of significant changes via email or a prominent notice on our site.
        </Paragraph>

        {/* Section 8: Contact Us */}
        <Title level={4} style={{ color: '#2c3e50', marginBottom: '1rem' }}>
          8. Contact Us
        </Title>
        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
          If you have any questions or concerns about our privacy practices, feel free to contact us at{' '}
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

export default PrivacyPolicyPage;