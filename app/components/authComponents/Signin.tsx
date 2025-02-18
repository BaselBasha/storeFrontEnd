"use client";
import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Spin, message } from "antd";
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import { useRouter } from "next/navigation";
import '@ant-design/v5-patch-for-react-19';

const SignUpForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter(); 

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
    
            if (response.ok) {
                const data = await response.json();
                
                // Assuming the server returns the token in the 'token' field
                const token = data.access_token;
                console.log(token)
    
                // Store the token in sessionStorage
                if (token) {
                    sessionStorage.setItem('accessToken', token);
                    message.success('Login successful');
                    router.push('/');
                } else {
                    message.error('No token received from server');
                }
            } else {
                if (response.status === 401) {
                    message.error('Incorrect email or password');
                } else if (response.status === 404) {
                    message.error('No user found with this email');
                } else {
                    message.error('Server error, please try again later');
                }
            }
        } catch (error) {
            message.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen h-screen w-screen">
            <ToastContainer />
            <div className=" flex relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 xs:w-full xs: justify-center">
                <Spin spinning={loading}>
                    <Form
                        name="signup"
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
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                                suffix={
                                    <EyeTwoTone
                                        onClick={() => console.log('Toggle password visibility')}
                                        icon={<EyeInvisibleOutlined />}
                                    />
                                }
                            />
                        </Form.Item>
                        <Form.Item>
                            <div className="flex justify-between items-center">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <a href="reset-password">Forgot password</a>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button block type="primary" htmlType="submit">
                                Log in
                            </Button>
                            <div className="mt-4 text-center flex flex-col gap-3 text-base">
                                <span className="text-gray-400">Dont have an account?</span> <Link href="/signup">Register now!</Link>
                            </div>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    );
};

export default SignUpForm;
