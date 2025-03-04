"use client";
import HeroSection from './components/heroSec';
import Layout from './components/Layout';
import '@ant-design/v5-patch-for-react-19';
import MonitorList from "./monitors/MonitoList";
import LaptopsList from "./latops/LaptopList";
import GpuList from "./gpus/GpuList";
import PrebuiltPcList from "./pc/PcList";
import { useCart } from "@/app/context/CardContext";


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