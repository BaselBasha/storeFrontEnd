'use client'
import dynamic from 'next/dynamic';
import { BackgroundBeams } from './backgrounds/background-beams'
import React, { Suspense } from 'react';
import WhyChooseUs from './whyus';


const Carousel = dynamic(() => import('./ui/carousel'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[70vmin] flex items-center justify-center bg-black">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-red-900 rounded-full animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          Loading...
        </span>
      </div>
    </div>
  ),
});

const slides = [
  { title: "Battlefield 2042", button: "Explore", src: "/images/battlefield.jpg" },
  { title: "20% DISCOUNT", button: "Explore", src: "/images/helldivers.avif" },
  { title: "Slide Three", button: "Explore", src: "/images/ghostrunner.jpg" },
];

export default function HeroSection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        {/* <BackgroundBeams/> */}
            <div className="w-full max-w-7xlc h-fit mx-auto overflow-hidden bg-black pt-5">
                <h1 className="text-lg font-bold text-center my-8 text-white px-4 sm:text-sm sm:pb-4 sm:px-6 md:text-3xl md:px-24 lg:px-24 xl:px-32 md:pb-28">
                    Dive into <span className='text-red-900'>KRAKEN</span>, your go-to online games store! Discover top titles, exclusive deals, and fast downloads at great prices. Join now and conquer your next adventure!
                </h1>
              <div className="flex justify-center pb-16 flex-col">
                <Carousel slides={slides} />
                <WhyChooseUs />

              </div>
            </div>
    </Suspense>
  )
}
