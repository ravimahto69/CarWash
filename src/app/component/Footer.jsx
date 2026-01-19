"use client"

import Link from "next/link"
import { LinkedinOutlined, TwitterOutlined, InstagramOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 mt-20 transition-colors">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🧼</span>
              </div>
              <h2 className="text-2xl font-bold text-white">WashHub</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional car wash & detailing services at your doorstep. Fast, reliable, and eco-friendly.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="https://www.linkedin.com/in/ravimahto-india/" className="w-9 h-9 bg-white/10 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 text-white">
                <LinkedinOutlined className="text-sm" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-sky-400 rounded-full flex items-center justify-center transition-all duration-300 text-white">
                <TwitterOutlined className="text-sm" />
              </a>
              <a href="https://www.instagram.com/ravimhto.69/" className="w-9 h-9 bg-white/10 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all duration-300 text-white">
                <InstagramOutlined className="text-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              📍 Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Book Now", href: "/book" },
                { label: "Find Nearby", href: "/nearby-stores" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    <span className="w-1 h-1 bg-blue-400 rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🚗 Popular Services
            </h3>
            <ul className="space-y-3">
              {[
                "Bike Foam Wash",
                "SUV Deep Clean",
                "Interior Spa",
                "Ceramic Prep",
                "Express Wash",
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="/services"
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center gap-2 text-sm"
                  >
                    <span className="w-1 h-1 bg-green-400 rounded-full" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              📞 Contact Us
            </h3>
            <div className="space-y-3">
              <a 
                href="tel:+919876543210"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 group"
              >
                <div className="w-8 h-8 bg-white/10 group-hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300">
                  <PhoneOutlined className="text-xs" />
                </div>
                <span className="text-sm">+91 987-654-3210</span>
              </a>
              <a 
                href="mailto:support@washhub.com"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 group"
              >
                <div className="w-8 h-8 bg-white/10 group-hover:bg-green-500 rounded-full flex items-center justify-center transition-all duration-300">
                  <MailOutlined className="text-xs" />
                </div>
                <span className="text-sm">support@washhub.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <EnvironmentOutlined className="text-xs" />
                </div>
                <span className="text-sm">Available in major Indian cities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-400">
              © {currentYear} <span className="font-bold text-white">WashHub</span>. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4 justify-start md:justify-end flex-wrap">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <span className="text-gray-600">•</span>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
    </footer>
  )
}

export default Footer
