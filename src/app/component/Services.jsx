"use client";

import React from "react";
import Link from "next/link";

const PRICING_DATA = {
  '🛵 Bike / Scooter': [
    { type: 'Basic Wash', description: 'Water rinse + shampoo', price: 149 },
    { type: 'Foam Wash', description: 'Foam + pressure wash + dry', price: 199 },
    { type: 'Premium Care', description: 'Foam wash + chain clean + polish', price: 299 },
  ],
  '🚗 Hatchback': [
    { type: 'Basic Wash', description: 'Exterior wash & dry', price: 399 },
    { type: 'Foam Wash', description: 'Foam wash + tyre clean', price: 499 },
    { type: 'Interior + Exterior', description: 'Foam wash + vacuum + dashboard', price: 699 },
  ],
  '🚘 Sedan': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 449 },
    { type: 'Foam Wash', description: 'Foam + tyre & rim clean', price: 599 },
    { type: 'Full Cleaning', description: 'Foam + interior vacuum + polish', price: 899 },
  ],
  '🚙 SUV / MUV': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 599 },
    { type: 'Foam Wash', description: 'Foam wash + tyre cleaning', price: 799 },
    { type: 'Deep Clean', description: 'Exterior + interior + mats', price: 999 },
  ],
  '⚡ Electric Vehicle (EV)': [
    { type: 'Safe Wash', description: 'Low-water exterior wash', price: 499 },
    { type: 'Foam Wash', description: 'EV-safe foam + tyre clean', price: 699 },
    { type: 'Premium EV Care', description: 'Foam + interior vacuum', price: 899 },
  ],
  '🚐 Pickup / Van': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 699 },
    { type: 'Foam Wash', description: 'Foam + tyre cleaning', price: 899 },
    { type: 'Full Service', description: 'Exterior + interior', price: 1199 },
  ],
  '🚚 Truck / Heavy Vehicle': [
    { type: 'Basic Wash', description: 'Exterior water wash', price: 999 },
    { type: 'Foam Wash', description: 'Foam + pressure wash', price: 1299 },
    { type: 'Premium Clean', description: 'Full body + cabin', price: 1599 },
  ],
};

const ServicesPage = () => {
  return (
    <div className="px-6 md:px-20 py-16 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
          Our Car Wash Services & Pricing
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
          Professional car wash packages for all vehicle types. Choose the perfect service for your bike, car, SUV, EV, or truck.
        </p>
        <Link 
          href="/book"
          className="inline-block mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Book Now →
        </Link>
      </div>

      {/* Pricing Tables by Vehicle Type */}
      <div className="space-y-12">
        {Object.entries(PRICING_DATA).map(([vehicleType, packages]) => (
          <div key={vehicleType} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {vehicleType}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Wash Type</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">What's Included</th>
                    <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="py-4 px-4 font-semibold text-gray-800 dark:text-white">{pkg.type}</td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{pkg.description}</td>
                      <td className="py-4 px-4 text-right font-bold text-blue-600 dark:text-blue-400 text-lg">₹{pkg.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
          Ready to give your vehicle the care it deserves?
        </p>
        <Link 
          href="/book"
          className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          Book Your Wash Now
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage
      