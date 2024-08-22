/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ForgotPassword: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Check if the two passwords are the same
    const validatePasswordMatch = (rule: any, value: string) => {
        const { getFieldValue } = form;
        if (value && value !== getFieldValue("password1")) {
            return Promise.reject("Passwords do not match!");
        }
        return Promise.resolve();
    };

    // Handle form submission
    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Get the token from url
            const token = new URLSearchParams(window.location.search).get("token");
            if (!token) {
                message.error("Invalid or missing reset token.");
                setLoading(false);
                return;
            }

            // Send post request to reset the password
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetPassword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password: values.password1 }),
            });

            if (response.ok) {
                message.success("Password reset successfully.");
                router.push("/signin");
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Failed to reset password.");
            }
        } catch (error) {
            message.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen h-screen w-screen">
            <ToastContainer />
            <div className="flex relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 xs:w-full justify-center">
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        name="resetPassword"
                        initialValues={{ remember: true }}
                        style={{ maxWidth: 360 }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="password1"
                            rules={[{ required: true, message: "Please input your new Password!" }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="New password"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password2"
                            rules={[
                                { required: true, message: "Please repeat your new password!" },
                                { validator: validatePasswordMatch }
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Repeat your password"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button block type="primary" htmlType="submit" disabled={loading}>
                                Reset Password
                            </Button>
                            <div className="mt-4 text-center flex flex-col gap-3 text-base">
                                <span className="text-gray-400">Don't have an account?</span>
                                <Link href="/signup">Register now!</Link>
                            </div>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    );
};

export default ForgotPassword;
