"use client";
import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const ForgotPass: React.FC = () => {
  const [loading, setLoading] = useState(false); // State to manage loading spinner

  const onFinish = async (values: any) => {
    setLoading(true); // Start loading spinner
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/passwordOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (response.ok) {
        message.success("Password reset OTP sent to your email.");
      } else {
        if (response.status === 404) {
          message.error("User with this email does not exist.");
        } else {
          message.error("Server error, please try again later.");
        }
      }
    } catch (error) {
      message.error("An unexpected error occurred.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen h-screen w-screen">
      <ToastContainer />
      <div className="flex relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 xs:w-full xs:justify-center">
        <Spin spinning={loading}>
          <Form
            name="resetpassword"
            style={{ maxWidth: 360 }}
            onFinish={onFinish}
          >
            <div className="text flex flex-col gap-8">
              <p className="text-4xl font-bold">Forgot your password?</p>
              <p className="text-lg text-gray-500 pb-6">
                Please enter your e-mail address below to reset your password.
              </p>
            </div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input size="large" prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Reset password
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default ForgotPass;
