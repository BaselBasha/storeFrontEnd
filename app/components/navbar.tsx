"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaSearch, FaBell, FaUser, FaBars, FaSignOutAlt, FaGamepad, FaLaptop, FaKeyboard, FaBoxOpen, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "@/app/context/CardContext";


type DropdownContent = Record<string, string[]>;
type MenuItem = keyof typeof dropdownContent | "account";

const dropdownContent: DropdownContent = {
  games: [
    "PC Games",
    "Console Games",
    "Digital Game Codes",
  ],
  consoles: [
    "PlayStation Consoles",
    "Xbox Consoles",
    "Nintendo Switch",
    "Console Accessories",
  ],
  pcs: [
    "Gaming Laptops",
    "Prebuilt Gaming PCs",
    "Custom PC Builds",
  ],
  accessories: [
    "Keyboards",
    "Headsets",
    "Microphones",
    "Mouses",
    "Controllers",
    "Mousepads",
    "Streaming Gear",
  ],
};

export default function GamingStoreNavbar() {
  const router = useRouter();
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { cartCount } = useCart();
  

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsSignedIn(true);
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        if (decodedToken.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("accessToken");
        setIsSignedIn(false);
      }
    }
  }, []);

  const handleMouseEnter = (item: MenuItem) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredItem(null);
    }, 300);
    setHideTimeout(timeout);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem('cartCount');
    setIsSignedIn(false);
    setIsAdmin(false);
    router.push("/signin");
    toast.success("Logged out successfully!");
  };

  const handleCartClick = () => {
    if (!isSignedIn) {
      toast.error("You need to sign in to access the cart page.");
      router.push("/signin");
    } else {
      router.push("/cart");
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Redirect to a search results page with the query
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear the input after search
    }
  };

  const menuItemsLeft: MenuItem[] = ["games", "consoles", "pcs", "accessories"];

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-red-600 text-white text-center py-2 px-4 text-sm font-semibold">
        Free Shipping on Orders Over $50!{" "}
        <Link href="/shop" className="underline hover:text-yellow-300">
          Shop Now
        </Link>
      </div>

      {/* Navbar */}
      <nav className="bg-gray-900 sticky top-0 z-30 shadow-xl border-b border-red-500">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex justify-between w-full md:w-auto mb-3 md:mb-0">
            <Link href="/" className="text-2xl font-extrabold text-red-500 hover:text-red-400 transition-colors flex items-center">
              <FaGamepad className="mr-2" /> KRAKEN GAMING
            </Link>
            <button
              className="md:hidden text-white hover:text-red-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full py-2 px-4 pr-12 bg-gray-800 text-white rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400"
                placeholder="Search games, consoles, accessories..."
              />
              <button
                onClick={() => searchQuery.trim() && router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:text-red-500 transition-colors"
              >
                <FaSearch className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-6 mt-3 md:mt-0">
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("account")}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-white hover:text-red-500 transition-colors flex items-center cursor-pointer">
                <FaUser className="mr-2" /> Account
              </span>
              {hoveredItem === "account" && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-red-500 z-20">
                  {isSignedIn ? (
                    <>
                      <h3 className="text-lg font-bold text-red-500 mb-2">ACCOUNT</h3>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/profile" className="flex items-center text-gray-300 hover:text-red-500 transition-colors">
                            <FaUser className="mr-2" /> Profile
                          </Link>
                        </li>
                        <li>
                          <Link href="/orders" className="flex items-center text-gray-300 hover:text-red-500 transition-colors">
                            <FaBoxOpen className="mr-2" /> Orders
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="flex items-center text-gray-300 hover:text-red-500 transition-colors w-full text-left"
                          >
                            <FaSignOutAlt className="mr-2" /> Logout
                          </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-red-500 mb-2">ACCOUNT</h3>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/signin" className="flex items-center text-gray-300 hover:text-red-500 transition-colors">
                            Sign In
                          </Link>
                        </li>
                        <li>
                          <Link href="/signup" className="flex items-center text-gray-300 hover:text-red-500 transition-colors">
                            Sign Up
                          </Link>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-white hover:text-red-500 transition-colors flex items-center">
                <FaKeyboard className="mr-1" /> Dashboard
              </Link>
            )}
            <div className="relative group">
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    toast.error("You need to sign in to access your favorites.");
                  } else {
                    router.push("/favorite");
                  }
                }}
                className="flex items-center text-white hover:text-red-500 transition-colors relative"
              >
                <FaHeart className="h-6 w-6" />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Favorites
              </span>
            </div>

            <button
              onClick={handleCartClick}
              className="flex items-center text-white hover:text-red-500 transition-colors relative"
            >
              <FaShoppingCart className="h-6 w-6" />
              <span className="ml-1 font-bold">{cartCount}</span>
            </button>
            <Link href="/notifications" className="relative text-white hover:text-red-500 transition-colors">
              <FaBell className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
            </Link>
          </div>
        </div>

        {/* Secondary Nav (Categories) */}
        <div className="hidden md:flex bg-gray-800 py-2 border-t border-gray-700">
          <div className="container mx-auto px-4 flex space-x-6">
            {menuItemsLeft.map((item) => (
              <div
                key={item}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              >
                <Link href={`/${item}`} className="text-gray-300 hover:text-red-500 transition-colors flex items-center">
                  {item === "games" && <FaGamepad className="mr-1" />}
                  {item === "consoles" && <FaGamepad className="mr-1" />}
                  {item === "pcs" && <FaLaptop className="mr-1" />}
                  {item === "accessories" && <FaKeyboard className="mr-1" />}
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
                {hoveredItem === item && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-red-500 z-20">
                    <ul className="space-y-2">
                      {dropdownContent[item].map((subItem) => (
                        <li key={subItem}>
                          <Link
                            href={`/${item}/${subItem.toLowerCase().replace(/ /g, "-")}`}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 text-white p-4 space-y-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              {menuItemsLeft.map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  className="text-gray-300 hover:text-red-500 transition-colors flex items-center"
                >
                  {item === "games" && <FaGamepad className="mr-2" />}
                  {item === "consoles" && <FaGamepad className="mr-2" />}
                  {item === "pcs" && <FaLaptop className="mr-2" />}
                  {item === "accessories" && <FaKeyboard className="mr-2" />}
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin/dashboard" className="text-gray-300 hover:text-red-500 transition-colors flex items-center">
                  <FaKeyboard className="mr-2" /> Dashboard
                </Link>
              )}
              {isSignedIn ? (
                <>
                  <Link href="/profile" className="text-gray-300 hover:text-red-500 transition-colors flex items-center">
                    <FaUser className="mr-2" /> Profile
                  </Link>
                  <Link href="/orders" className="text-gray-300 hover:text-red-500 transition-colors flex items-center">
                    <FaBoxOpen className="mr-2" /> Orders
                  </Link>
                  <Link
                    href="/favorite"
                    onClick={(e) => {
                      if (!isSignedIn) {
                        e.preventDefault();
                        toast.error("You need to sign in to access your favorites.");
                        router.push("/signin");
                      }
                    }}
                    className="text-gray-300 hover:text-red-500 transition-colors flex items-center"
                  >
                    <FaHeart className="mr-2" /> Favorites
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-500 transition-colors text-left flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-gray-300 hover:text-red-500 transition-colors">Sign In</Link>
                  <Link href="/signup" className="text-gray-300 hover:text-red-500 transition-colors">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}