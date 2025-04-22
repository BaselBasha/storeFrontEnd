'use client';

import React from 'react';
import { Cover } from './ui/cover';

const AskAiButton = () => {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 cursor-pointer shadow-lg"
      onClick={() => {
        console.log('Ask AI button clicked!');
      }}
    >
      <Cover>
        Ask our AI
      </Cover>
    </div>
  );
};

export default AskAiButton;
