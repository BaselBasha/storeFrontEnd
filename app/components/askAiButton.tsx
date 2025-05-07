'use client';

import React, { useState, useRef, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Cover } from './ui/cover';

interface ChatMessage {
  sender: 'user' | 'bot' | 'loading';
  content: string;
}

interface ChatbotResponse {
  reply: string;
  products: { id: string; name: string; price: number; category?: { name: string } }[] | null;
  categories: { id: string; name: string; description?: string }[] | null;
  clarificationNeeded: boolean;
}

const AskAiButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', content: 'Hello! How can I assist you today? 🎮' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { sender: 'user', content: message }]);
    setMessages((prev) => [...prev, { sender: 'loading', content: '...' }]);

    try {
      const response = await axios.post<ChatbotResponse>(
        'https://store-backend-tb6b.onrender.com/chatbot/message',
        { message },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      const { reply, clarificationNeeded } = response.data;

      let content: string;
      if (clarificationNeeded) {
        content = reply;
      } else {
        try {
          const parsed = await marked.parse(reply);
          content = DOMPurify.sanitize(parsed, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li'],
            ALLOWED_ATTR: ['href', 'target', 'rel'],
          });
          content = content.replace(
            /<a /g,
            '<a class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" '
          );
        } catch (parseError) {
          console.error('Error parsing markdown:', parseError);
          content = 'Error rendering response. Please try again!';
        }
      }

      setMessages((prev) => prev.filter((msg) => msg.sender !== 'loading'));
      animateBotResponse(content);

    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error sending message:', axiosError.message);

      setMessages((prev) => prev.filter((msg) => msg.sender !== 'loading'));
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', content: 'Sorry, something went wrong. Please try again! 😓' },
      ]);
    }
  };

  const animateBotResponse = (fullContent: string) => {
    const words = fullContent.split(' ');
    let index = 0;
    let currentText = '';

    setMessages((prev) => [...prev, { sender: 'bot', content: '' }]);
    setIsTyping(true);

    typingIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index];
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastIndex = updatedMessages.length - 1;
          if (updatedMessages[lastIndex]?.sender === 'bot') {
            updatedMessages[lastIndex].content = currentText;
          }
          return updatedMessages;
        });
        index++;
      } else {
        clearInterval(typingIntervalRef.current!);
        setIsTyping(false);
      }
    }, 80);
  };

  const handleStopTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      { sender: 'bot', content: 'Hello! How can I assist you today? 🎮' },
    ]);
  };

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Cover>Ask our AI</Cover>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-gradient-to-br from-white via-blue-50 to-purple-100 border border-gray-300 rounded-3xl shadow-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-blue-700">AI Chat Assistant</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✖
              </button>
            </div>
          </div>
          <div
            ref={chatContainerRef}
            className="h-96 overflow-y-auto border rounded-xl p-3 text-sm bg-white shadow-inner space-y-2" // <<< bigger height
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm transition-all duration-500 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                      : msg.sender === 'loading'
                      ? 'bg-gray-300 text-gray-700 italic'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.content }}
                />
              </div>
            ))}
          </div>

          <div className="flex mt-3 gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {isTyping ? (
              <button
                onClick={handleStopTyping}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-semibold"
              >
                Send
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AskAiButton;
