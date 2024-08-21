"use client";
import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

const ForgotPassword = () => {
    const [form] = Form.useForm();

    const validatePasswordMatch = (rule: any, value: string) => {
        const { getFieldValue } = form;
        if (value && value !== getFieldValue('password1')) {
            return Promise.reject('Passwords do not match!');
        }
        return Promise.resolve();
    };

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // Handle form submission, e.g., send data to the server
    };

    return (
        <div className="flex items-center justify-center min-h-screen h-screen w-screen">
            <ToastContainer />
            <div className="flex relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 xs:w-full justify-center">
                <Form
                    form={form}
                    name="resetPassword"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="password1"
                        rules={[{ required: true, message: 'Please input your new Password!' }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="New password"
                            suffix={
                                <EyeTwoTone
                                    onClick={() => console.log('Toggle password visibility')}
                                    icon={<EyeInvisibleOutlined />}
                                />
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="password2"
                        rules={[
                            { required: true, message: 'Please repeat your new password!' },
                            { validator: validatePasswordMatch } // Add custom validation rule
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Repeat your password"
                            suffix={
                                <EyeTwoTone
                                    onClick={() => console.log('Toggle password visibility')}
                                    icon={<EyeInvisibleOutlined />}
                                />
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Reset Password
                        </Button>
                        <div className="mt-4 text-center flex flex-col gap-3 text-base">
                            <span className="text-gray-400">Don't have an account?</span>
                            <Link href="/signup">Register now!</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPassword;
