"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const menus = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Book Now", href: "/book" },
  { label: "Login", href: "/login" },
]

const Header = () => {
  const pathname = usePathname()

  return (
    <nav className="z-[2000] bg-white shadow-lg px-20 sticky top-0 left-0 w-full py-6 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="font-extrabold text-2xl text-blue-600">
        WashHub
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-10 font-bold">
        {menus.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "text-blue-600 font-semibold"
                : "text-black font-normal hover:text-blue-500"
            }
          >
            {item.label}
          </Link>
        ))}

        {/* Signup Button */}
        <Link
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 transition rounded px-10 py-3 text-white"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  )
}

export default Header
