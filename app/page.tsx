"use client";
import React, { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import '@ant-design/v5-patch-for-react-19';
export default function Home() {
  return (
    <>
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
      </Suspense>
    </Layout>
    </>

  );
}
