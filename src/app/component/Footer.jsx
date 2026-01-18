"use client"

const Footer = () => {
  return (
    <footer className="bg-gray-950 dark:bg-gray-950 text-gray-300 dark:text-gray-400 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white dark:text-white mb-2">
            WashHub 
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Professional car wash services delivered at your doorstep.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white dark:text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/services" className="hover:text-white dark:hover:text-gray-200 transition">
                Services
              </a>
            </li>
            <li>
              <a href="/book" className="hover:text-white dark:hover:text-gray-200 transition">
                Book Now
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white dark:hover:text-gray-200 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white dark:text-white mb-3">
            Contact Us
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Need help or want to book instantly?
          </p>
          <a
            href="/contact"
            className="inline-block mt-3 text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300"
          >
            Get in touch →
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} WashHub. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
