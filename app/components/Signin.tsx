"use client";
import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

const SignUpForm: React.FC = () => {

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="flex items-center justify-center min-h-screen h-screen w-screen">
            <ToastContainer />
            <div className=" flex relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 xs:w-full xs: justify-center">
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
            </div>
        </div>
    );
};

export default SignUpForm;
