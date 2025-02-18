import React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaChevronDown, FaShoppingCart, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Select, Input, Button } from 'antd';

const { Option } = Select;
const { Search } = Input;

// Dropdown content
const dropdownContent = {
  store: ["Gaming Gear", "Accessories", "Merchandise"],
  pc: ["PC Games", "Hardware", "Software"],
  console: ["PlayStation", "Xbox", "Nintendo"],
  mobile: ["iOS Games", "Android Games", "Apps"],
  furniture: ["Gaming Chairs", "Desks", "Lifestyle Products"],
  gold: ["Membership Plans", "Rewards", "Benefits"],
  community: ["Forums", "Events", "Tournaments"],
  support: ["FAQ", "Contact Us", "Help Center"],
};

// Reusable DropdownMenu Component
const DropdownMenu = ({ item, onMouseEnter, onMouseLeave }) => {
  return (
    <div
      role="menu"
      aria-labelledby={item}
      className="absolute left-0 top-full mt-2 w-44 bg-[#2A0A07]  text-white p-4 z-10 rounded shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h3 id={item} className="text-lg font-bold mb-2">
        {item.toUpperCase()}
      </h3>
      <ul className="space-y-2" role="group">
  {dropdownContent[item]?.map((subItem, index) => (
    <li key={index} role="menuitem">
      <Link
        href={`/${item}/${subItem.toLowerCase().replace(' ', '-')}`}
        className="block text-gray-300 hover:text-[#FF0000] text-xs ml-3 transition-colors relative"
      >
        <span className="absolute left-[-12px] top-[50%] transform -translate-y-1/2 w-1 h-1 bg-gray-300 rounded-full"></span>
        {subItem}
      </Link>
    </li>
  ))}
</ul>
    </div>
  );
};

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Ref to track hover state
  const hoverTimeoutRef = useRef(null);

  // Handle hover on menu item or dropdown
  const handleMouseEnter = (item) => {
    setHoveredItem(item); // Show the dropdown immediately
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); // Clear any existing timeout
  };

  // Handle mouse leave with extended delay
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); // Clear any existing timeout
    hoverTimeoutRef.current = setTimeout(() => setHoveredItem(null), 500); // Delay hide by 500ms
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define menu items dynamically
  const menuItemsLeft = ["store", "pc", "console", "mobile", "furniture"];
  const menuItemsRight = ["gold", "community", "support"];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#8B0000] text-white text-center py-2 px-4">
        <p className="text-sm">
          For a limited time, all orders will enjoy free shipping to You.{" "}
          <span className="font-bold cursor-pointer">Shop Now</span>
        </p>
      </div>

      {/* Main Navbar */}
      <nav className="bg-black relative pb-96">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Mobile Menu Toggle */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link href="/" className="text-red-500 font-bold text-xl md:text-2xl">
              KRAKEN
            </Link>
            <button onClick={toggleMobileMenu} className="md:hidden text-white">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl mt-4 md:mt-0 md:ml-4">
  <div className="relative flex-grow bg-gray-800 rounded-md overflow-hidden">
    <Search
      placeholder="Search Amazon"
      allowClear
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onSearch={(value) => console.log(value)}
      className="w-full text-white bg-customColor border-none rounded-md" // Use Tailwind classes
      style={{ 
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
      }}
      enterButton={
<Button
    style={{ backgroundColor: '#fff', borderColor: 'white', borderLeft: '2px solid #4A0707'}}
  >
    <FaSearch className="text-black" />
  </Button>
      }
      addonBefore={
        <Select
          defaultValue="All"
          className="w-24 border-none text-white bg-white" // Use Tailwind classes
          onChange={(value) => console.log(value)}
        >
          <Option value="All">All</Option>
          <Option value="Electronics">Electronics</Option>
          <Option value="Books">Books</Option>
        </Select>
      }
    />
  </div>
</div>

          {/* Right Side - Menu Items for Desktop */}
          <div className="hidden md:flex items-center space-x-6 order-2 md:order-3">
            {/* Language Dropdown */}
            <div
              className="dropdown relative"
              onMouseEnter={() => handleMouseEnter("language")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-white hover:text-red-500 transition-colors duration-300">
                <span className="flex items-center">
                  EN <FaChevronDown className="ml-1" />
                </span>
              </button>
              {hoveredItem === "language" && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white p-2 rounded shadow-lg border border-gray-700">
                  <ul>
                    <li className="hover:bg-gray-700 p-1 cursor-pointer">English</li>
                    <li className="hover:bg-gray-700 p-1 cursor-pointer">French</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Account & Lists */}
            <Link
              href="/account"
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              <div className="text-xs">
                <p className="text-gray-400">Hello, sign in</p>
                <p className="font-bold">Account & Lists</p>
              </div>
            </Link>

            {/* Returns & Orders */}
            <Link
              href="/orders"
              className="text-white hover:text-red-500 transition-colors duration-300"
            >
              <div className="text-xs">
                <p>Returns</p>
                <p className="font-bold">& Orders</p>
              </div>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center text-white hover:text-red-500 transition-colors duration-300"
            >
              <FaShoppingCart className="h-6 w-6" />
              <span className="ml-1 font-bold">0</span>
            </Link>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4">
              <div className="flex flex-col space-y-4">
                {/* Left Side - Menu Items for Mobile */}
                {menuItemsLeft.map((item) => (
                  <div
                    key={item}
                    className="relative"
                    onClick={toggleMobileMenu}
                  >
                    <Link
                      href={`/${item}`}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Link>
                  </div>
                ))}
                {/* Right Side - Menu Items for Mobile */}
                {menuItemsRight.map((item) => (
                  <div
                    key={item}
                    className="relative"
                    onClick={toggleMobileMenu}
                  >
                    <Link
                      href={`/${item}`}
                      className="text-white hover:text-red-500 transition-colors"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Link>
                  </div>
                ))}
                {/* Additional Mobile Menu Items */}
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/account"
                    className="text-white hover:text-red-500 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Account & Lists
                  </Link>
                  <Link
                    href="/orders"
                    className="text-white hover:text-red-500 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Returns & Orders
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center text-white hover:text-red-500 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <FaShoppingCart className="h-6 w-6 mr-2" />
                    Cart
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Secondary Navbar */}
        <div className="container mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center">
          {/* Left Side - Menu Items */}
          <div className="hidden md:flex items-center space-x-8 relative">
            {menuItemsLeft.map((item) => (
              <div
                key={item}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Menu Item */}
                <Link
                  href={`/${item}`}
                  className={`text-gray-300 hover:text-[#FF0000] transition-colors ${
                    hoveredItem === item ? "underline decoration-[#FF0000] decoration-2" : ""
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
                {/* Dropdown Content */}
                {hoveredItem === item && (
                  <DropdownMenu
                    item={item}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Menu Items */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {menuItemsRight.map((item) => (
              <div
                key={item}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Menu Item */}
                <Link
                  href={`/${item}`}
                  className={`text-gray-300 hover:text-[#FF0000] transition-colors ${
                    hoveredItem === item ? "underline decoration-[#FF0000] decoration-2" : ""
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
                {/* Dropdown Content */}
                {hoveredItem === item && (
                  <DropdownMenu
                    item={item}
                    onMouseEnter={() => handleMouseEnter(item)}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}