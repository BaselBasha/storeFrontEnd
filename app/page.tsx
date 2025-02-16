"use client";
import React, { Suspense, lazy } from 'react';
import Layout from './components/Layout';
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
