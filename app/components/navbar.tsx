'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaChevronDown, FaShoppingCart, FaSearch, FaBell, FaUser, FaBars } from 'react-icons/fa';

// Define types
type DropdownContent = Record<string, string[]>;
type MenuItem = keyof typeof dropdownContent;

// Dropdown content
const dropdownContent: DropdownContent = {
  games: [
    'PC Games',
    'Console Games (PlayStation, Xbox, Nintendo)',
    'Mobile Games (iOS, Android)',
    'VR Games',
    'Digital Game Codes',
  ],
  PCs: [
    'Gaming Laptops',
    'Prebuilt Gaming PCs',
    'Custom PC Builds',
    'Mini Gaming PCs',
  ],
  monitors: [
    'Gaming Monitors',
    '4K & Ultrawide Monitors',
    'High Refresh Rate Monitors (144Hz, 240Hz)',
    'Curved & OLED Monitors',
  ],
  accessories: [
    'Keyboards',
    'Mice & Mousepads',
    'Headsets & Microphones',
    'Controllers & Gamepads',
    'VR Headsets',
    'Streaming Equipment',
  ],
  furniture: [
    'Gaming Chairs',
    'Desks & Tables',
    'Monitor Stands',
    'RGB Lighting & Decor',
  ],
  components: [
    'Graphics Cards (GPUs)',
    'Processors (CPUs)',
    'RAM & Storage (SSDs/HDDs)',
    'Motherboards',
    'Power Supplies (PSUs)',
    'Cooling Systems (Air & Liquid Cooling)',
    'PC Cases',
    'Capture Cards',
  ],
  consoles: [
    'PlayStation Consoles & Accessories',
    'Xbox Consoles & Accessories',
    'Nintendo Consoles & Accessories',
  ],
  mobilegaming: [
    'Gaming Phones',
    'Mobile Controllers',
    'Power Banks & Cooling Fans',
  ],
  deals: [
    'Game Pass & Subscriptions',
    'Gift Cards',
    'Special Bundles',
  ],
};

export default function AmazonNavbar() {
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (item: MenuItem) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 500);
    setHideTimeout(timeout);
  };

  const menuItemsLeft: MenuItem[] = ['games', 'gamingpcs', 'monitors', 'accessories', 'furniture'];
  const menuItemsRight: MenuItem[] = ['components', 'consoles', 'mobilegaming', 'deals'];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-red-800 text-white text-center py-2 px-4 text-sm">
        For a limited time, all orders will enjoy free shipping.{' '}
        <span className="font-bold cursor-pointer hover:underline">Shop Now</span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-black sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Hamburger Menu */}
          <div className="flex justify-between w-full mb-4 md:mb-0 md:w-auto">
            <Link href="/" className="text-red-500 font-bold text-xl md:text-2xl hover:scale-110 transition-transform">
              KRAKEN
            </Link>
            <button
              className="md:hidden text-white hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="w-full flex justify-center">
            <div className="bg-gray-800 rounded-md flex items-center overflow-hidden max-w-3xl w-full border border-red-500">
              <select className="h-full bg-gray-800 text-white px-4 py-3 border-r border-gray-700 focus:outline-none">
                <option>All</option>
                <option>Electronics</option>
                <option>Books</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 bg-gray-800 text-white focus:outline-none"
                placeholder="Search for games, gear, and more..."
              />
              <button className="p-3 bg-gray-800 hover:bg-red-700">
                <FaSearch className="text-white text-xl" />
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="signin" className="text-white hover:text-red-500 transition-colors flex items-center">
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
        <div className="container mx-auto px-4 py-2 flex justify-between hidden md:flex">
          <div className="flex space-x-8">
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
                {hoveredItem === item && (
                  <div
                    role="menu"
                    aria-labelledby={item}
                    className="absolute left-0 top-full mt-2 w-64 bg-black text-white p-4 z-20 rounded shadow-lg border border-red-500"
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
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black text-white p-4 space-y-4">
          <div className="flex flex-col space-y-2">
            {menuItemsLeft.concat(menuItemsRight).map((item) => (
              <Link
                key={item}
                href={`/${item}`}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}