// "use client"; // Ensure this is at the top of the file

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { Form, Input, Button } from 'antd';

// const OtpVerification: React.FC = () => {
//   const router = useRouter();
//   const [otp, setOtp] = useState<string>('');

//   useEffect(() => {
//     // Ensure the router is available only when the component is mounted
//     if (!router.isReady) return;

//     // Other client-side logic here
//   }, [router.isReady]);

//   const handleOtpSubmit = async () => {
//     try {
//       const response = await fetch('/api/verify-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: router.query.email, otp }),
//       });

//       if (response.ok) {
//         router.push('/dashboard');
//       } else {
//         console.error('OTP verification failed');
//       }
//     } catch (error) {
//       console.error('An error occurred:', error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
//         <Form layout="vertical" onFinish={handleOtpSubmit}>
//           <div className="max-w-md mx-auto">
//             <Form.Item
//               label="Enter OTP"
//               name="otp"
//               rules={[{ required: true, message: 'Please enter the OTP sent to your email' }]}
//             >
//               <Input
//                 size="large"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//               />
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit" className="w-full">
//                 Verify OTP
//               </Button>
//             </Form.Item>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default OtpVerification;
