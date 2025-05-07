"use client";
import React, { useState, useEffect } from "react"; // Add useEffect
import { Form, Input, Button, Select, DatePicker, Spin } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import moment from "moment";
import OtpVerification from "../OTP/OTPverifivation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Add useRouter for redirect
import "@ant-design/v5-patch-for-react-19";

const { Option } = Select;

const SignUpForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true to avoid hydration issues
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [dob, setDob] = useState<moment.Moment | null>(null);
  const router = useRouter(); // Initialize router

  // Check if user is logged in and redirect
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const redirectPath = decodedToken.role === "ADMIN" ? "/admin" : "/";
        toast.info("You must log out to access this page");
        setTimeout(() => {
          router.push(redirectPath); // Redirect after 1 second
        }, 1000);
      } catch (error) {
        console.error("Invalid token:", error);
        sessionStorage.removeItem("accessToken"); // Clear invalid token
        localStorage.removeItem("accessToken");
        setLoading(false); // Show the form if token is invalid
      }
    } else {
      setLoading(false); // No token, proceed to render form
    }
  }, [router]);

  const validateUsername = (rule: any, value: string) => {
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!value || usernamePattern.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Username must not contain special characters or spaces.");
  };

  const validateDob = (rule: any, value: moment.Moment) => {
    if (!value) {
      return Promise.reject("Please select your date of birth");
    }
    const today = moment();
    const birthDate = value;
    const age = today.year() - birthDate.year();
    const hasHadBirthdayThisYear = today.isSameOrAfter(birthDate.clone().add(age, "years"));
    if (age > 18 || (age === 18 && hasHadBirthdayThisYear)) {
      return Promise.resolve();
    }
    return Promise.reject("You must be at least 18 years old.");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      email,
      password,
      username,
      fullName,
      gender,
      birthDate: dob ? dob.format("YYYY-MM-DD") : undefined,
    };

    try {
      const response = await fetch("https://store-backend-tb6b.onrender.com/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Email is already in use") {
          toast.error("Email is already in use. Please try another one.");
        } else if (errorData.message === "Username is already in use") {
          toast.error("Username is already in use. Please try another one.");
        } else {
          toast.error("Server error. Please try again later.");
        }
        return;
      }

      const result = await response.json();
      //console.log("Signup successful:", result);
      toast.success("Signup successful! Please check your email for the OTP.");
      setIsSubmitted(true);
    } catch (error: any) {
      //console.error("Signup error:", error.message);
      toast.error(error.message || "Something went wrong during signup");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth or during submission
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen h-screen w-screen">
        <ToastContainer />
        <Spin spinning={true}>
          <div>Loading...</div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen h-screen w-screen">
      <ToastContainer />
      <Spin spinning={loading}>
        {!isSubmitted ? (
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 xs:w-full">
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ gender: "male" }}
            >
              <div className="max-w-md mx-auto">
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: "Please enter your full name" }]}
                  >
                    <Input
                      size="large"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input
                      size="large"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      { required: true, message: "Please enter your username" },
                      { validator: validateUsername },
                    ]}
                  >
                    <Input
                      size="large"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: "Please enter your password" },
                      { min: 8, message: "Password must be at least 8 characters long" },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Form.Item
                    label="Date of Birth"
                    name="dob"
                    rules={[{ validator: validateDob }]}
                  >
                    <DatePicker
                      size="large"
                      className="w-full"
                      value={dob}
                      onChange={(date) => setDob(date)}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: "Please select your gender" }]}
                  >
                    <Select
                      size="large"
                      value={gender}
                      onChange={(value) => setGender(value)}
                    >
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full"
                  >
                    Sign up
                  </Button>
                </Form.Item>

                <div className="flex items-center justify-between mt-4">
                  <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                  <Link
                    className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                    href="/signin"
                  >
                    Have an account? Log in
                  </Link>
                  <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                </div>
              </div>
            </Form>
          </div>
        ) : (
          <OtpVerification email={email} />
        )}
      </Spin>
    </div>
  );
};

export default SignUpForm;