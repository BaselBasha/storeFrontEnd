'use client';

import Layout from '@/app/components/Layout';
import React from 'react';
import { Typography, Card, Row, Col, Avatar, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const teamMembers = [
  {
    name: 'Basel Basha',
    role: 'Founder & CEO',
    avatar: 'https://res.cloudinary.com/dd6e2ekvf/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1745342046/BIOMITRIK_pfndrm.jpg',
  },
  {
    name: 'Samantha Lee',
    role: 'Lead Developer',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Daniel Kim',
    role: 'UX Designer',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const AboutUsPage: React.FC = () => {
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
        <Title level={2} style={{ textAlign: 'center', color: '#2c3e50' }}>
          About Us
        </Title>
        <Paragraph
          style={{
            fontSize: '1.2rem',
            textAlign: 'center',
            maxWidth: 800,
            margin: '0 auto',
            color: '#555',
          }}
        >
          We’re a passionate team of gamers and developers committed to bringing you the best digital game
          buying experience. Whether youre into high-octane shooters, immersive RPGs, or casual indie titles,
          we’ve got something for everyone.
        </Paragraph>

        <Divider style={{ margin: '2rem 0', borderColor: '#ddd' }} />

        {/* Mission Section */}
        <Title level={3} style={{ marginBottom: '1rem', color: '#2c3e50' }}>
          Our Mission
        </Title>
        <Paragraph
          style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#555',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          Our mission is to make gaming more accessible, affordable, and exciting. We aim to create a seamless
          platform where gamers can discover, purchase, and enjoy digital games with ease and confidence.
        </Paragraph>

        <Divider style={{ margin: '2rem 0', borderColor: '#ddd' }} />

        {/* Team Section */}
        <Title level={3} style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
          Meet the Team
        </Title>
        <Row gutter={[32, 32]} justify="center">
          {teamMembers.map((member, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  borderRadius: '1.2rem',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
                bodyStyle={{ padding: '1.5rem' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Avatar
                  size={120}
                  src={member.avatar}
                  style={{
                    marginBottom: '1rem',
                    border: '4px solid #f0f0f0',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Title level={4} style={{ margin: 0, color: '#2c3e50' }}>
                  {member.name}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginTop: '0.5rem' }}>
                  {member.role}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </Layout>
  );
};

export default AboutUsPage;