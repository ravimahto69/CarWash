"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircleOutlined, FireOutlined, LoadingOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import ReviewSection from "./ReviewSection";

const PRICING_DATA = {
  '🛵 Bike / Scooter': [
    { type: 'Basic Wash', description: 'Water rinse + shampoo', price: 149, popular: false },
    { type: 'Foam Wash', description: 'Foam + pressure wash + dry', price: 199, popular: true },
    { type: 'Premium Care', description: 'Foam wash + chain clean + polish', price: 299, popular: false },
  ],
  '🚗 Hatchback': [
    { type: 'Basic Wash', description: 'Exterior wash & dry', price: 399, popular: false },
    { type: 'Foam Wash', description: 'Foam wash + tyre clean', price: 499, popular: true },
    { type: 'Interior + Exterior', description: 'Foam wash + vacuum + dashboard', price: 699, popular: false },
  ],
  '🚘 Sedan': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 449, popular: false },
    { type: 'Foam Wash', description: 'Foam + tyre & rim clean', price: 599, popular: true },
    { type: 'Full Cleaning', description: 'Foam + interior vacuum + polish', price: 899, popular: false },
  ],
  '🚙 SUV / MUV': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 599, popular: false },
    { type: 'Foam Wash', description: 'Foam wash + tyre cleaning', price: 799, popular: true },
    { type: 'Deep Clean', description: 'Exterior + interior + mats', price: 999, popular: false },
  ],
  '⚡ Electric Vehicle (EV)': [
    { type: 'Safe Wash', description: 'Low-water exterior wash', price: 499, popular: false },
    { type: 'Foam Wash', description: 'EV-safe foam + tyre clean', price: 699, popular: true },
    { type: 'Premium EV Care', description: 'Foam + interior vacuum', price: 899, popular: false },
  ],
  '🚐 Pickup / Van': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 699, popular: false },
    { type: 'Foam Wash', description: 'Foam + tyre cleaning', price: 899, popular: true },
    { type: 'Full Service', description: 'Exterior + interior', price: 1199, popular: false },
  ],
  '🚚 Truck / Heavy Vehicle': [
    { type: 'Basic Wash', description: 'Exterior water wash', price: 999, popular: false },
    { type: 'Foam Wash', description: 'Foam + pressure wash', price: 1299, popular: true },
    { type: 'Premium Clean', description: 'Full body + cabin', price: 1599, popular: false },
  ],
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    loadServicesAndRatings();
  }, []);

  const loadServicesAndRatings = async () => {
    try {
      setLoadingRatings(true);
      const res = await fetch('/api/services');
      const data = await res.json();
      
      if (data.success) {
        setServices(data.data || []);
        
        // Load ratings for each service
        const ratingsMap = {};
        for (const service of data.data || []) {
          try {
            const ratingRes = await fetch(`/api/reviews?serviceId=${service._id}`);
            const ratingData = await ratingRes.json();
            if (ratingData.success) {
              ratingsMap[service._id] = {
                average: ratingData.averageRating,
                total: ratingData.totalReviews,
              };
            }
          } catch (err) {
            console.error(`Failed to load ratings for service ${service._id}:`, err);
          }
        }
        setRatings(ratingsMap);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoadingRatings(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarFilled key={i} className="text-yellow-500 text-sm" />);
      } else {
        stars.push(<StarOutlined key={i} className="text-gray-300 dark:text-gray-600 text-sm" />);
      }
    }
    return stars;
  };
  return (
    <div className="px-4 md:px-20 py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 mb-4">
          🧼 Our Car Wash Services
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mt-4 max-w-3xl mx-auto text-lg leading-relaxed">
          Professional car wash packages for all vehicle types. Choose the perfect service for your bike, car, SUV, EV, or truck.
        </p>
        <Link 
          href="/book"
          className="inline-block mt-8 px-10 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-base"
        >
          📅 Book Now
        </Link>
      </div>

      {/* Pricing Cards by Vehicle Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {Object.entries(PRICING_DATA).map(([vehicleType, packages], idx) => (
          <div 
            key={vehicleType} 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
          >
            {/* Vehicle Type Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-6 text-white">
              <h2 className="text-2xl font-bold">{vehicleType}</h2>
              <p className="text-blue-100 text-sm mt-1">Premium cleaning services</p>
            </div>

            {/* Pricing Options */}
            <div className="p-6 space-y-4">
              {packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 border-amber-300 dark:border-amber-600 ring-2 ring-amber-200 dark:ring-amber-700 shadow-md'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="flex items-center gap-1 mb-2 text-amber-600 dark:text-amber-300 text-xs font-bold">
                      <FireOutlined className="text-sm" />
                      MOST POPULAR
                    </div>
                  )}

                  {/* Service Name and Description */}
                  <div className="mb-3">
                    <h4 className="font-bold text-gray-800 dark:text-white text-lg mb-1">
                      {pkg.type}
                    </h4>
                    <div className="flex items-start gap-2">
                      <CheckCircleOutlined className="text-green-500 dark:text-green-400 text-sm mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {pkg.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline justify-between mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">STARTING FROM</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{pkg.price}</span>
                  </div>
                </div>
              ))}

              {/* Book Button for this vehicle */}
              <Link
                href="/book"
                className="block w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg text-center transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Book Now →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-3xl p-12 text-white text-center shadow-xl">
        <h3 className="text-3xl font-bold mb-4">Ready for Premium Car Care?</h3>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
          Get your vehicle sparkling clean with our professional washing services. Book your appointment now!
        </p>
        <Link 
          href="/book"
          className="inline-block px-12 py-4 bg-white text-blue-600 font-bold text-lg rounded-full hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Schedule Your Wash Today
        </Link>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-center shadow-md hover:shadow-lg transition-all">
          <div className="text-4xl mb-4">⭐</div>
          <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-lg">Quality Service</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Professional-grade cleaning for all vehicle types</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-center shadow-md hover:shadow-lg transition-all">
          <div className="text-4xl mb-4">⏱️</div>
          <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-lg">Quick & Efficient</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Fast turnaround without compromising quality</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-center shadow-md hover:shadow-lg transition-all">
          <div className="text-4xl mb-4">💰</div>
          <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-lg">Best Prices</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Affordable rates for premium car washing</p>
        </div>
      </div>

      {/* Top Rated Services Section */}
      {services.length > 0 && (
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 mb-2">
              ⭐ Customer Favorites
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check out our highest-rated services based on customer reviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services
              .filter(s => ratings[s._id] && ratings[s._id].total > 0)
              .sort((a, b) => (ratings[b._id]?.average || 0) - (ratings[a._id]?.average || 0))
              .slice(0, 6)
              .map(service => (
                <Link key={service._id} href={`/services/${service._id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-500 cursor-pointer h-full">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                      <p className="text-yellow-100 text-sm">{service.description}</p>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {renderStars(ratings[service._id]?.average || 0)}
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {(ratings[service._id]?.average || 0).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full font-bold">
                          {ratings[service._id]?.total || 0} reviews
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {service.durationMin} min service for {service.vehicleTags?.length || 0} vehicle types
                      </p>

                      <div className="text-center py-2 px-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">STARTING FROM</p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ₹{Math.min(...Object.values(service.prices || {1: 0}))}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
