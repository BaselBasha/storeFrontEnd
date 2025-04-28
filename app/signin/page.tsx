"use client";
import React, { Suspense, lazy } from "react";
import { Spin } from "antd";
const AuroraBackground = lazy(() => import('../components/backgrounds/background').then(module => ({ default: module.AuroraBackground })));
const Signin = lazy(() => import('../components/authComponents/Signin'));
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center max-h-fit ">
          <Spin size="large" />
        </div>
      }
    >
      <AuroraBackground>
        <Suspense fallback={<Spin />}>
          <Signin />
        </Suspense>
      </AuroraBackground>
    </Suspense>
  );
}
