"use client";
import React, { Suspense, lazy } from "react";
import { Spin } from "antd";
import { AuroraBackground } from "../components/backgrounds/background";
const ForgotPassword = lazy(() => import("../components/authComponents/forgot-password-email"));
export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center max-h-fit ">
          <Spin size="large" />
        </div>
      }
    >
      <AuroraBackground>
        <ForgotPassword />
      </AuroraBackground>
    </Suspense>
  );
}
