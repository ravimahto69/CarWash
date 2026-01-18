'use client'
import React, { useState } from "react";

const BookingPage = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    brand: "",
    model: "",
    vehicleType: "",
    service: "",
    date: "",
    time: "",
    location: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data?.error || 'Failed to submit booking';
        alert(msg);
        return;
      }

      alert('Your booking has been confirmed!');
      setFormData({
        name: '',
        phone: '',
        email: '',
        brand: '',
        model: '',
        vehicleType: '',
        service: '',
        date: '',
        time: '',
        location: '',
        notes: '',
      });
    } catch (error) {
      console.error('Booking submit error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-black dark:text-white bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Book a Service</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <section>
          <h2 className="text-xl text-black dark:text-white font-bold mb-4">
            Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              required
              placeholder="Phone Number"
              className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            className="input mt-4 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={formData.email}
            onChange={handleChange}
          />
        </section>

        {/* Vehicle Details */}
        <section>
          <h2 className="text-xl text-black dark:text-white font-bold mb-4">
            Vehicle Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="brand"
              required
              placeholder="Car Brand"
              className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.brand}
              onChange={handleChange}
            />
            <input
              type="text"
              name="model"
              required
              placeholder="Car Model"
              className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.model}
              onChange={handleChange}
            />
          </div>

          <select
            name="vehicleType"
            required
            className="input mt-4 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            <option value="">Select Vehicle Type</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Truck</option>
            <option>Bus</option>
          </select>
        </section>

        {/* Service Details */}
        <section>
          <h2 className="text-xl text-black dark:text-white font-bold mb-4">
            Service Details
          </h2>

          <select
            name="service"
            required
            className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={formData.service}
            onChange={handleChange}
          >
            <option value="">Select Wash Package</option>
            <option>Basic Wash – 300</option>
            <option>Premium Wash – 600</option>
            <option>Deluxe Wash – 1000</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Enter Your Location"
            className="input mt-4 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={formData.location}
            onChange={handleChange}
          />

          <textarea
            name="notes"
            rows={3}
            placeholder="Additional Notes"
            className="input mt-4 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={formData.notes}
            onChange={handleChange}
          />
        </section>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition"
        >
          Confirm Booking
        </button>
      </form>
      <style>
        {`
          .input {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #d1d5db;
            outline: none;
          }
          .input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 1px #2563eb;
          }
          .dark .input {
            border-color: #4b5563;
            background-color: #1f2937;
            color: #ffffff;
          }
          .dark .input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 1px #3b82f6;
          }
        `}
      </style>
    </div>
  );
};

export default BookingPage;
