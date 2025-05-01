"use client";
import HeroSection from './components/heroSec';
import Layout from './components/Layout';
import '@ant-design/v5-patch-for-react-19';
import MainPageProducts from './products/mainPageProducts';



export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <MainPageProducts />
    </Layout>
  );
}