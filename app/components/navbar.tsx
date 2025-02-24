'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState, useEffect } from 'react';
import { FaChevronDown, FaShoppingCart, FaSearch, FaBell, FaUser, FaBars, FaSignOutAlt, FaUserCircle, FaBoxOpen } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

type DropdownContent = Record<string, string[]>;
type MenuItem = keyof typeof dropdownContent | 'account';

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
  account: [
    'Profile',
    'Orders',
    'Logout',
  ],
};

export default function AmazonNavbar() {
  const router = useRouter(); // Initialize useRouter
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      setIsSignedIn(true);
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Invalid token:', error);
        sessionStorage.removeItem('accessToken');
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
    }, 500);
    setHideTimeout(timeout);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    setIsSignedIn(false);
    setIsAdmin(false);
    router.push('/signin'); // Redirect to sign-in page
  };

  const handleCartClick = () => {
    if (!isSignedIn) {
      toast.error('You need to sign in to access the cart page.'); // Notify the user
      router.push('/signin'); // Redirect to sign-in page
    } else {
      router.push('/cart'); // Redirect to cart page
    }
  };

  const menuItemsLeft: MenuItem[] = ['games', 'PCs', 'monitors', 'accessories', 'furniture'];

  return (
    <>
      <div className="bg-red-800 text-white text-center py-2 px-4 text-sm">
        For a limited time, all orders will enjoy free shipping.{' '}
        <span className="font-bold cursor-pointer hover:underline">Shop Now</span>
      </div>

      <nav className="bg-black sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
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

          <div className="hidden md:flex items-center space-x-6 mt-4 md:mt-0">
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('account')}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-white hover:text-red-500 transition-colors flex items-center cursor-pointer">
                <FaUser className="inline mr-2" /> Account <FaChevronDown className="ml-1" />
              </span>
              {hoveredItem === 'account' && (
                <div
                  role="menu"
                  aria-labelledby="account"
                  className="absolute right-0 top-full mt-2 w-48 bg-black text-white p-4 z-20 rounded shadow-lg border border-red-500"
                >
                  {isSignedIn ? (
                    <>
                      <h3 id="account" className="text-lg font-bold mb-2 text-red-500">
                        ACCOUNT
                      </h3>
                      <ul className="space-y-2" role="group">
                        <li role="menuitem">
                          <Link href="/profile" className="block text-gray-300 hover:text-red-500 transition-colors flex items-center">
                            <FaUserCircle className="mr-2" /> Profile
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link href="/orders" className="block text-gray-300 hover:text-red-500 transition-colors flex items-center">
                            <FaBoxOpen className="mr-2" /> Orders
                          </Link>
                        </li>
                        <li role="menuitem">
                          <button
                            onClick={handleLogout}
                            className="block text-gray-300 hover:text-red-500 transition-colors w-full text-left flex items-center"
                          >
                            <FaSignOutAlt className="mr-2" /> Logout
                          </button>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <h3 id="account" className="text-lg font-bold mb-2 text-red-500">
                        ACCOUNT
                      </h3>
                      <ul className="space-y-2" role="group">
                        <li role="menuitem">
                          <Link href="/signin" className="block text-gray-300 hover:text-red-500 transition-colors flex items-center">
                            Log in
                          </Link>
                        </li>
                        <li role="menuitem">
                          <Link href="/signup" className="block text-gray-300 hover:text-red-500 transition-colors flex items-center">
                            Make an account
                          </Link>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-white hover:text-red-500 transition-colors">
                Dashboard
              </Link>
            )}
            <button
              onClick={handleCartClick} // Use handleCartClick instead of Link
              className="flex items-center text-white hover:text-red-500 transition-colors"
            >
              <FaShoppingCart className="h-6 w-6" />
              <span className="ml-1 font-bold">0</span>
            </button>
            <Link href="/notifications" className="relative text-white hover:text-red-500 transition-colors">
              <FaBell className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
            </Link>
          </div>
        </div>

        {/* Rest of the code remains the same */}
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black text-white p-4 space-y-4">
          <div className="flex flex-col space-y-2">
            {menuItemsLeft.map((item) => (
              <Link
                key={item}
                href={`/${item}`}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="text-gray-300 hover:text-red-500 transition-colors">
                Dashboard
              </Link>
            )}
            {isSignedIn ? (
              <>
                <Link href="/personal-information" className="text-gray-300 hover:text-red-500 transition-colors">
                  Profile information
                </Link>
                <Link href="/orders" className="text-gray-300 hover:text-red-500 transition-colors">
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-500 transition-colors text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="text-gray-300 hover:text-red-500 transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="text-gray-300 hover:text-red-500 transition-colors">
                  Make an account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}