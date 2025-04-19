// components/LoadingLink.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Spin } from "antd";

export default function LoadingLink({ href, children, ...props }: React.ComponentProps<typeof Link>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Reset loading state after a timeout (optional, in case navigation fails)
    setTimeout(() => setIsLoading(false), 5000);
  };

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <Link href={href} {...props} onClick={handleClick}>
        {children}
      </Link>
      {isLoading && (
        <Spin
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </span>
  );
}