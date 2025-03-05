"use client";
import HeroSection from './components/heroSec';
import Layout from './components/Layout';
import '@ant-design/v5-patch-for-react-19';
import dynamic from 'next/dynamic';

const MonitorList = dynamic(() => import("./monitors/MonitoList"), { ssr: false });
const LaptopsList = dynamic(() => import("./latops/LaptopList"), { ssr: false });
const GpuList = dynamic(() => import("./gpus/GpuList"), { ssr: false });
const PrebuiltPcList = dynamic(() => import("./pc/PcList"), { ssr: false });


export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <MonitorList />
      <LaptopsList />
      <GpuList />
      <PrebuiltPcList />
    </Layout>
  );
}