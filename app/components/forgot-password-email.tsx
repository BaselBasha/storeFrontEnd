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
                    name="resetpassord"
                    style={{ maxWidth: 360 }}
                    onFinish={onFinish}
                >
                    <div className="text flex flex-col gap-8">
                        <p className="text-4xl font-bold ">Forgot your password?</p>
                        <p className=" text-lg text-gray-500 pb-6">Please enter your e-mail address bellow to reset your password.</p>
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
            </div>
        </div>
    );
};

export default SignUpForm;
