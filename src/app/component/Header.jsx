"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Dropdown } from "antd";
import { useTheme } from "../context/ThemeContext";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggleTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          const user = JSON.parse(authUser);
          setIsLoggedIn(true);
          setUserName(user?.name || 'User');
          setUserRole(user?.role || '');
        } else {
          setIsLoggedIn(false);
          setUserName('');
          setUserRole('');
        }
      } catch (_) {
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
      }
    };
    
    checkAuth();
    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', checkAuth);
    // Listen for custom login event (for same-tab updates)
    window.addEventListener('user-login', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('user-login', checkAuth);
    };
  }, []);

  const menus = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Book Now", href: "/book" },
    ...(isLoggedIn 
      ? [{ label: "My Bookings", href: "/dashboard" }] 
      : [{ label: "Login", href: "/login" }]
    ),
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem('auth_user');
      setIsLoggedIn(false);
      setOpen(false);
      router.push('/login');
    } catch (_) {}
  };

  return (
    <nav className="z-[2000] bg-white dark:bg-gray-900 shadow-lg sticky top-0 left-0 w-full transition-colors">
      <div className="px-6 md:px-20 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-2xl text-blue-600 dark:text-blue-400">
          WashHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 font-bold">
          {menus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-black dark:text-gray-300 font-normal hover:text-blue-500 dark:hover:text-blue-400 transition"
              }
            >
              {item.label}
            </Link>
          ))}

          {mounted && (
            <button
              onClick={() => {
                console.log('Theme toggle clicked, current isDark:', isDark);
                toggleTheme();
              }}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <SunOutlined className="text-xl" /> : <MoonOutlined className="text-xl" />}
            </button>
          )}

          {isLoggedIn && (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: 'My Profile',
                    onClick: () => router.push('/profile'),
                  },
                  {
                    key: 'bookings',
                    label: 'My Bookings',
                    onClick: () => router.push('/dashboard'),
                  },
                  ...(userRole === 'admin' ? [{
                    key: 'admin',
                    label: 'Admin Dashboard',
                    onClick: () => router.push('/admin'),
                  }] : []),
                  {
                    key: 'logout',
                    label: 'Logout',
                    onClick: handleLogout,
                  },
                ],
              }}
              trigger={['click']}
              styles={{ root: { zIndex: 9999 } }}
            >
              <button className="text-gray-700 dark:text-gray-300 font-semibold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                {userName} ▼
              </button>
            </Dropdown>
          )}

          {!isLoggedIn && (
            <Link
              href="/register"
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 transition rounded px-8 py-3 text-white"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => {
                console.log('Mobile theme toggle clicked, current isDark:', isDark);
                toggleTheme();
              }}
              className="text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <SunOutlined className="text-xl" /> : <MoonOutlined className="text-xl" />}
            </button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className="w-6 h-[2px] bg-black dark:bg-white" />
            <span className="w-6 h-[2px] bg-black dark:bg-white" />
            <span className="w-6 h-[2px] bg-black dark:bg-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-gray-900 shadow-md transition-all duration-300 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4 gap-4 font-semibold">
          {menus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-black dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              }
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn && (
            <div className="mt-2 border-t dark:border-gray-700 pt-4">
              <Dropdown
                menu={{
                  items: [
                    ...(userRole === 'admin' ? [{
                      key: 'admin',
                      label: 'Admin Dashboard',
                      onClick: () => {
                        router.push('/admin');
                        setOpen(false);
                      },
                    }] : []),
                    {
                      key: 'logout',
                      label: 'Logout',
                      onClick: () => {
                        handleLogout();
                        setOpen(false);
                      },
                    },
                  ],
                }}
                trigger={['click']}
                overlayStyle={{ zIndex: 9999 }}
              >
                <button className="text-gray-700 dark:text-gray-300 font-semibold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer w-full text-left">
                  {userName} ▼
                </button>
              </Dropdown>
            </div>
          )}

          {!isLoggedIn && (
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-2 text-center bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 transition rounded py-3 text-white"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
