"use client";
import React, { Suspense, lazy } from "react";
import { Spin } from "antd";
import Signin  from '../components/authComponents/Signin'
import { AuroraBackground } from "../components/backgrounds/background";
const SignUpForm = lazy(() => import("../components/authComponents/SignUp"));
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
        <Signin />
      </AuroraBackground>
    </Suspense>
  );
}
