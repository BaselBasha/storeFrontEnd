import React, { useState } from 'react';
import { Form, Input, message, Button, Spin, GetProps } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import './OTP.css';
import '@ant-design/v5-patch-for-react-19';

interface OtpVerificationProps {
  email: string;
}
type OTPProps = GetProps<typeof Input.OTP>;

const OtpVerification: React.FC<OtpVerificationProps> = ({ email }) => {
  const [loading, setLoading] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const router = useRouter(); // Initialize useRouter
  
  const handleSubmit = async () => {
    //console.log('OTP Value:', otpValue); // Log the OTP value here

    setLoading(true);
  
    const dataToSend = {
      otp: otpValue, // Ensure otpValue contains the correct OTP
      email,
    };
  
    //console.log('Data to be sent:', dataToSend); // Log the data to verify correctness
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        message.success('OTP verified successfully. Account created!');
        router.push('/signin'); // Redirect to the login page after successful OTP verification
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        message.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const onValuesChange = (changedValues: any, allValues: any) => {
    //console.log('onValuesChange triggered with values:', allValues);
    if (allValues.otp && allValues.otp.length === 6) {
      setOtpValue(allValues.otp);  // Store the OTP value in state
      handleSubmit();
    }
  };

  const onChange: OTPProps['onChange'] = (text:any) => {
    setOtpValue(text);
    //console.log('OTP:', text);
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 flex flex-col items-center">
        <Spin spinning={loading}>
          <Form layout="vertical" onValuesChange={onValuesChange}>
            <div className="flex flex-col items-center gap-10 mb-11">
              <p className="text-gray-400 text-center text-xl">Verify your account</p>
              <Image
                src="/images/password.png"
                alt="OTP"
                className="text-center"
                width={170}
                height={100}
              />
            </div>
            <Form.Item
              name="otp"
              className="w-full"
            >
              <p className="text-gray-400 text-lg pb-5 text-center">
                Please enter the code that has been sent to your email address
              </p>
              <Input.OTP {...sharedProps} />
            </Form.Item>
            <Button
              type="primary"
              className="w-full"
              onClick={handleSubmit}
              loading={loading} // Disable the button and show a spinner
            >
              Verify email
            </Button>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default OtpVerification;
