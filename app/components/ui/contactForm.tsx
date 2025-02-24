import { Input, Button, Form, message } from 'antd';
import HCaptcha from 'react-hcaptcha';
import { useState, useRef, useEffect } from 'react';
import { Oxanium, Bebas_Neue, Rajdhani } from 'next/font/google';
const { TextArea } = Input;

// Configure the fonts
const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const ContactForm: React.FC = () => {
  const [form] = Form.useForm();
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const hcaptchaRef = useRef<HCaptcha>(null);

  // Handle form submission
  const handleSubmit = (values: any) => {
    if (isCaptchaVerified && isFormValid) {
      message.success('Message sent successfully!');
      form.resetFields();
      setIsCaptchaVerified(false);
      hcaptchaRef.current?.resetCaptcha();
    } else {
      message.error('Please complete the captcha and fill the form correctly.');
    }
  };

  // Handle hCaptcha verification
  const handleCaptchaVerify = (token: string) => {
    setIsCaptchaVerified(true);
  };

  // Handle form value changes
  const handleFormChange = () => {
    const fields = form.getFieldsValue();
    const isEmailValid = form.getFieldError('email').length === 0;
    const isMessageValid = form.getFieldError('message').length === 0;
    setIsFormValid(isEmailValid && isMessageValid);
  };

  return (
    <div className="w-full md:w-1/3 mt-8 md:mt-0">
      <Form
        form={form}
        onFinish={handleSubmit}
        className={`bg-white p-6 rounded-lg shadow-md ${rajdhani.className}`}
        initialValues={{
          email: '',
          message: '',
        }}
        onFieldsChange={handleFormChange}
      >
        <h3 className={`text-2xl font-semibold mb-4 text-[#FF4500] ${bebasNeue.className}`}>
          Get in touch with Kraken!
        </h3>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input
            placeholder="Enter your email"
            className={`w-full px-4 py-2 mb-4 text-[#333333] rounded-md border border-[#FF4500] ${oxanium.className}`}
            style={{ backgroundColor: '#FFFFFF' }}
          />
        </Form.Item>
        <Form.Item
          name="message"
          rules={[
            { required: true, message: 'Please enter your message!' },
            { min: 5, message: 'Message must be at least 5 characters long!' },
            { max: 500, message: 'Message cannot exceed 500 characters!' },
          ]}
        >
          <TextArea
            placeholder="Enter your message"
            rows={4}
            maxLength={500}
            className={`w-full px-4 py-2 mb-4 text-[#333333] rounded-md border border-[#FF4500] ${oxanium.className}`}
            style={{ backgroundColor: '#FFFFFF' }}
          />
        </Form.Item>
        <div className="mb-4">
          {/* Responsive hCaptcha */}
          <div className="w-full">
            <HCaptcha
              sitekey={process.env.REACT_APP_SITE_KEY || 'd58cab32-cf2a-4334-b154-ca48429caf74'}
              onVerify={handleCaptchaVerify}
              ref={hcaptchaRef}
              size="normal" // Default size
              theme="light"
              className="w-full"
              style={{
                width: '100%', // Force full width
                maxWidth: '100%',
                margin: '0 auto', // Center align
              }}
            />
          </div>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={`w-full bg-[#FF4500] text-white py-2 rounded-md transition-colors ${rajdhani.className}`}
            style={{
              borderColor: '#FF4500',
              opacity: isCaptchaVerified && isFormValid ? 1 : 0.5,
              cursor: isCaptchaVerified && isFormValid ? 'pointer' : 'not-allowed',
            }}
            disabled={!isCaptchaVerified || !isFormValid}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContactForm;