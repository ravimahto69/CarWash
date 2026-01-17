"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menus = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Book Now", href: "/book" },
  { label: "Login", href: "/login" },
];

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 transition rounded px-8 py-3 text-white"
          >
            Sign Up
          </Link>
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

          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="mt-2 text-center bg-blue-600 hover:bg-blue-700 transition rounded py-3 text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
