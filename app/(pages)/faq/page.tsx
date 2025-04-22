'use client';

import React from 'react';
import { Collapse, Typography, Card } from 'antd';
import Layout from '@/app/components/Layout';

const { Title, Text } = Typography;

const faqData = [
  {
    question: 'How do I purchase a game?',
    answer:
      'Simply browse our store, add the game to your cart, and proceed to checkout. You can pay using a variety of payment methods.',
  },
  {
    question: 'Can I get a refund after purchasing?',
    answer:
      'Refunds are possible within 14 days of purchase if the game has not been downloaded or played for more than 2 hours.',
  },
  {
    question: 'How do I redeem a digital game code?',
    answer:
      'Once purchased, you’ll receive a code via email. Follow the instructions provided to redeem it on the respective platform.',
  },
  {
    question: 'Do you offer pre-orders?',
    answer:
      'Yes! Pre-order your favorite upcoming titles to get early access or exclusive content.',
  },
  {
    question: 'Is customer support available?',
    answer:
      'Absolutely! You can contact us via the Support page or live chat. We’re available 24/7.',
  },
];

// Convert FAQ data into Collapse items format
const collapseItems = faqData.map((faq, index) => ({
  key: String(index),
  label: <Text strong style={{ fontSize: '1.1rem' }}>{faq.question}</Text>,
  children: <Text style={{ fontSize: '1rem' }}>{faq.answer}</Text>,
}));

const FAQPage: React.FC = () => {
  return (
    <Layout>
      <Card style={{ maxWidth: 800, margin: '2rem auto', borderRadius: '1rem' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Frequently Asked Questions
        </Title>
        <Collapse
          accordion
          bordered={false}
          style={{ backgroundColor: 'transparent' }}
          expandIconPosition="end"
          items={collapseItems}
        />
      </Card>
    </Layout>
  );
};

export default FAQPage;
