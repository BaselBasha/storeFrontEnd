declare module 'react-hcaptcha' {
    import * as React from 'react';
  
    export interface HCaptchaProps {
      sitekey: string;
      onVerify: (token: string) => void;
      ref?: React.RefObject<HCaptcha>;
    }
  
    declare class HCaptcha extends React.Component<HCaptchaProps> {
      resetCaptcha(): void;
    }
  
    export default HCaptcha;
  }