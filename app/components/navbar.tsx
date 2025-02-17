import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaChevronDown, FaShoppingCart, FaSearch } from "react-icons/fa";

// Define types
type DropdownContent = {
  [key: string]: string[];
};

type MenuItem = keyof typeof dropdownContent;

// Dropdown content
const dropdownContent: DropdownContent = {
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
const DropdownMenu = ({
  item,
  onMouseEnter,
  onMouseLeave,
}: {
  item: MenuItem;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}): JSX.Element => {
  return (
    <div
      role="menu"
      aria-labelledby={item}
      className="absolute left-0 top-full mt-2 w-64 bg-black text-white p-4 z-10 rounded shadow-lg"
      onMouseEnter={onMouseEnter} // Keep dropdown open when hovering over it
      onMouseLeave={onMouseLeave} // Trigger hide delay when leaving
    >
      <h3 id={item} className="text-lg font-bold mb-2">
        {item.toUpperCase()}
      </h3>
      <ul className="space-y-2" role="group">
        {dropdownContent[item]?.map((subItem: string, index: number) => (
          <li key={index} role="menuitem">
            <Link
              href={`/${item}/${subItem.toLowerCase().replace(" ", "-")}`}
              className="block text-gray-300 hover:text-[#FF0000] transition-colors"
            >
              {subItem}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function AmazonNavbar(): JSX.Element {
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Ref to track hover state
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hover on menu item or dropdown
  const handleMouseEnter = (item: MenuItem): void => {
    setHoveredItem(item); // Show the dropdown immediately
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); // Clear any existing timeout
  };

  // Handle mouse leave with extended delay
  const handleMouseLeave = (): void => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); // Clear any existing timeout
    hoverTimeoutRef.current = setTimeout(() => setHoveredItem(null), 500); // Delay hide by 500ms
  };

  // Define menu items dynamically
  const menuItemsLeft: MenuItem[] = ["store", "pc", "console", "mobile", "furniture"];
  const menuItemsRight: MenuItem[] = ["gold", "community", "support"];

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
      <nav className="bg-black relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Left Side - Logo */}
          <Link href="/" className="text-red-500 font-bold text-xl md:text-2xl">
            KRAKEN
          </Link>

          {/* Right Side - Menu Items */}
          <div className="flex items-center space-x-6 order-2 md:space-x-8">
            {/* Language Dropdown */}
            <div
              className="dropdown relative"
              onMouseEnter={() => handleMouseEnter("language" as MenuItem)}
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

          {/* Restored Search Bar After Menu Items */}
          <div className="flex-grow max-w-2xl ml-4 md:ml-8">
            <div className="relative flex-grow bg-gray-800 rounded-md overflow-hidden flex items-center">
              <select
                className="absolute left-0 top-0 h-full bg-gray-800 text-white rounded-l px-2 border-r border-gray-700 focus:outline-none"
              >
                <option>All</option>
                <option>Electronics</option>
                <option>Books</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-20 py-2 rounded-l focus:outline-none text-white bg-gray-800 pr-10"
                placeholder="Search Amazon"
              />
              <FaSearch
                className="absolute right-3 text-white cursor-pointer"
                style={{ fontSize: "1.2rem" }}
              />
            </div>
          </div>
        </div>

        {/* Secondary Navbar */}
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          {/* Left Side - Menu Items */}
          <div className="hidden md:flex items-center space-x-8 relative">
            {menuItemsLeft.map((item: MenuItem) => (
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
                    onMouseEnter={() => handleMouseEnter(item)} // Keep dropdown open when hovering over it
                    onMouseLeave={handleMouseLeave} // Trigger hide delay when leaving
                  />
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Menu Items */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {menuItemsRight.map((item: MenuItem) => (
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
                    onMouseEnter={() => handleMouseEnter(item)} // Keep dropdown open when hovering over it
                    onMouseLeave={handleMouseLeave} // Trigger hide delay when leaving
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