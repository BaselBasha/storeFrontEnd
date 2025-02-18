'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { FaChevronDown, FaShoppingCart, FaSearch, FaBell, FaUser } from 'react-icons/fa';

// Define types
type DropdownContent = Record<string, string[]>;
type MenuItem = keyof typeof dropdownContent;

// Dropdown content
const dropdownContent: DropdownContent = {
  store: ['Gaming Gear', 'Accessories', 'Merchandise'],
  pc: ['PC Games', 'Hardware', 'Software'],
  console: ['PlayStation', 'Xbox', 'Nintendo'],
  mobile: ['iOS Games', 'Android Games', 'Apps'],
  furniture: ['Gaming Chairs', 'Desks', 'Lifestyle Products'],
  gold: ['Membership Plans', 'Rewards', 'Benefits'],
  community: ['Forums', 'Events', 'Tournaments'],
  support: ['FAQ', 'Contact Us', 'Help Center'],
};

// Dropdown Menu Component
const DropdownMenu = ({
  item,
  onMouseEnter,
  onMouseLeave,
}: {
  item: MenuItem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) => (
  <div
    role="menu"
    aria-labelledby={item}
    className="absolute left-0 top-full mt-2 w-64 bg-black text-white p-4 z-20 rounded shadow-lg border border-red-500"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <h3 id={item} className="text-lg font-bold mb-2 text-red-500">
      {item.toUpperCase()}
    </h3>
    <ul className="space-y-2" role="group">
      {dropdownContent[item]?.map((subItem, index) => (
        <li key={index} role="menuitem">
          <Link
            href={`/${item}/${subItem.toLowerCase().replace(/\s+/g, '-')}`}
            className="block text-gray-300 hover:text-red-500 transition-colors"
          >
            {subItem}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function AmazonNavbar() {
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (item: MenuItem) => {
    setHoveredItem(item);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setHoveredItem(null), 500);
  };

  const menuItemsLeft: MenuItem[] = ['store', 'pc', 'console', 'mobile', 'furniture'];
  const menuItemsRight: MenuItem[] = ['gold', 'community', 'support'];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-red-800 text-white text-center py-2 px-4 text-sm">
        For a limited time, all orders will enjoy free shipping.{' '}
        <span className="font-bold cursor-pointer hover:underline">Shop Now</span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-black sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-red-500 font-bold text-xl md:text-2xl hover:scale-110 transition-transform">
            KRAKEN
          </Link>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl mx-4 relative">
            <div className="bg-gray-800 rounded-md flex items-center overflow-hidden w-full border border-red-500">
              <select className="h-full bg-gray-800 text-white px-2 border-r border-gray-700 focus:outline-none">
                <option>All</option>
                <option>Electronics</option>
                <option>Books</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white focus:outline-none"
                placeholder="Search for games, gear, and more..."
              />
              <button className="p-2 bg-gray-800 hover:bg-red-700">
                <FaSearch className="text-white text-lg" />
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6 md:space-x-8">
            <Link href="signin" className="text-white hover:text-red-500 transition-colors">
              <FaUser className="inline mr-2" /> Account
            </Link>
            <Link href="pc/pc-games.tsx" className="text-white hover:text-red-500 transition-colors">
              Orders
            </Link>
            <Link href="/cart" className="flex items-center text-white hover:text-red-500 transition-colors">
              <FaShoppingCart className="h-6 w-6" />
              <span className="ml-1 font-bold">0</span>
            </Link>
            <Link href="/notifications" className="relative text-white hover:text-red-500 transition-colors">
              <FaBell className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
            </Link>
          </div>
        </div>

        {/* Secondary Navbar */}
        <div className="container mx-auto px-4 py-2 flex justify-between">
          {/* Left Menu Items */}
          <div className="hidden md:flex space-x-8">
            {menuItemsLeft.map((item) => (
              <div
                key={item}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/${item}`}
                  className="text-gray-300 hover:text-red-500 transition-colors hover:underline"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
                {hoveredItem === item && <DropdownMenu item={item} onMouseEnter={() => handleMouseEnter(item)} onMouseLeave={handleMouseLeave} />}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
