"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Spin, Modal } from "antd"; // Added Modal
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@ant-design/v5-patch-for-react-19";

const SignUpForm: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' }); // State for modal content
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const redirectPath = decodedToken.role === "ADMIN" ? "/admin" : "/";
        Modal.info({
          title: "Already Logged In",
          content: "You are already logged in. Redirecting...",
          okText: "OK",
          onOk: () => router.push(redirectPath),
        });
      } catch (error) {
        console.error("Invalid token:", error);
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [router]);

  const showNotifyModal = (title: string, message: string, type: 'error' | 'warning') => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  const handleModalOk = () => {
    setModalVisible(false);
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        if (token) {
          localStorage.setItem("accessToken", token);
          // Dispatch custom authChange event
          window.dispatchEvent(new Event('authChange'));
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          Modal.success({
            title: decodedToken.role === "ADMIN" ? "Welcome Back, Admin" : "Login Successful",
            content: decodedToken.role === "ADMIN" ? "Redirecting to admin dashboard..." : "Redirecting to home...",
            okText: "OK",
            onOk: () => {
              if (decodedToken.role === "ADMIN") {
                router.push("/admin");
              } else {
                router.push("/");
              }
            },
          });
        } else {
          Modal.error({
            title: "Login Failed",
            content: "No token received from server",
            okText: "I Understand",
          });
        }
      } else {
        const errorData = await response.json();
        console.log('Error Data:', errorData);
  
        if (response.status === 401) {
          const errorMessage = errorData.message;
          if (typeof errorMessage === 'object' && errorMessage !== null) {
            if (errorMessage.isBanned) {
              showNotifyModal(
                "Account Banned",
                "Your account has been baned due to a violation of our policies. As a result, you no longer have access to our services. If you believe this action was taken in error, please contact our support team for further assistance.",
                "error"
              );
            } else if (errorMessage.suspensionEndDate && new Date(errorMessage.suspensionEndDate) > new Date()) {
              const endDate = new Date(errorMessage.suspensionEndDate).toLocaleDateString();
              showNotifyModal(
                "Account Suspended",
                `Your account is suspended until ${endDate}. Please try again later.`,
                "warning"
              );
            } else {
              Modal.error({
                title: "Login Failed",
                content: "Incorrect email or password",
                okText: "I Understand",
              });
            }
          } else {
            Modal.error({
              title: "Login Failed",
              content: "Incorrect email or password",
              okText: "I Understand",
            });
          }
        } else if (response.status === 404) {
          Modal.error({
            title: "User Not Found",
            content: "No user found with this email",
            okText: "I Understand",
          });
        } else {
          Modal.error({
            title: "Server Error",
            content: "Server error, please try again later",
            okText: "I Understand",
          });
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Modal.error({
        title: "Unexpected Error",
        content: "An unexpected error occurred",
        okText: "I Understand",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !modalVisible) {
    return (
      <div className="flex items-center justify-center min-h-screen h-screen w-screen">
        <Spin spinning={true}>
          <div>Loading...</div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen h-screen w-screen">
      <ToastContainer />
      <div className="flex relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 xs:w-full xs:justify-center">
        <Spin spinning={loading}>
          <Form
            name="signin"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input size="large" prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your Password!" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-between items-center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="/forgot-password">Forgot password</a>
              </div>
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Log in
              </Button>
              <div className="mt-4 text-center flex flex-col gap-3 text-base">
                <span className="text-gray-400">Do not have an account?</span>
                <Link href="/signup">Register now!</Link>
              </div>
            </Form.Item>
          </Form>
        </Spin>
      </div>

      {/* Custom Notify Modal */}
      <Modal
        title={modalContent.title}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk} // Allow closing via cancel/X
        okText="I Understand"
        cancelButtonProps={{ style: { display: 'none' } }} // Hide cancel button
        centered
        styles={{
          mask: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, // Replaces maskStyle
          body: {
            padding: '20px',
            textAlign: 'center',
            ...(modalContent.type === 'error' ? { color: '#ff4d4f' } : { color: '#faad14' }), // Replaces bodyStyle
          },
        }}
        okButtonProps={{
          style: {
            backgroundColor: modalContent.type === 'error' ? '#ff4d4f' : '#faad14',
            borderColor: modalContent.type === 'error' ? '#ff4d4f' : '#faad14',
          },
        }}
      >
        <p>{modalContent.message}</p>
      </Modal>
    </div>
  );
};

export default SignUpForm;