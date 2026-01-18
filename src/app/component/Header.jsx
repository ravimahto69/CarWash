"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          const user = JSON.parse(authUser);
          setIsLoggedIn(true);
          setUserName(user?.name || 'User');
        } else {
          setIsLoggedIn(false);
          setUserName('');
        }
      } catch (_) {
        setIsLoggedIn(false);
        setUserName('');
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
    ...(isLoggedIn ? [] : [{ label: "Login", href: "/login" }]),
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
    <nav className="z-[2000] bg-white shadow-lg sticky top-0 left-0 w-full">
      <div className="px-6 md:px-20 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-2xl text-blue-600">
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
                  ? "text-blue-600 font-semibold"
                  : "text-black font-normal hover:text-blue-500 transition"
              }
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn && (
            <span className="text-gray-700 font-semibold">
              {userName}
            </span>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 transition rounded px-8 py-3 text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 transition rounded px-8 py-3 text-white"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1"
          aria-label="Toggle Menu"
        >
          <span className="w-6 h-[2px] bg-black" />
          <span className="w-6 h-[2px] bg-black" />
          <span className="w-6 h-[2px] bg-black" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-md transition-all duration-300 overflow-hidden ${
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
                  ? "text-blue-600"
                  : "text-black hover:text-blue-500"
              }
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn && (
            <span className="text-gray-700 font-semibold">
              {userName}
            </span>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="mt-2 text-center bg-red-600 hover:bg-red-700 transition rounded py-3 text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="mt-2 text-center bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white"
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
