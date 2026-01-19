'use client'
import React, { useMemo, useState } from "react";
import { useRouter } from 'next/navigation';

// Static pricing data structure - all vehicles and wash types
const PRICING_DATA = {
  'Bike / Scooter': [
    { type: 'Basic Wash', description: 'Water rinse + shampoo', price: 149 },
    { type: 'Foam Wash', description: 'Foam + pressure wash + dry', price: 199 },
    { type: 'Premium Care', description: 'Foam wash + chain clean + polish', price: 299 },
  ],
  'Hatchback': [
    { type: 'Basic Wash', description: 'Exterior wash & dry', price: 399 },
    { type: 'Foam Wash', description: 'Foam wash + tyre clean', price: 499 },
    { type: 'Interior + Exterior', description: 'Foam wash + vacuum + dashboard', price: 699 },
  ],
  'Sedan': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 449 },
    { type: 'Foam Wash', description: 'Foam + tyre & rim clean', price: 599 },
    { type: 'Full Cleaning', description: 'Foam + interior vacuum + polish', price: 899 },
  ],
  'SUV': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 599 },
    { type: 'Foam Wash', description: 'Foam wash + tyre cleaning', price: 799 },
    { type: 'Deep Clean', description: 'Exterior + interior + mats', price: 999 },
  ],
  'Electric (EV)': [
    { type: 'Safe Wash', description: 'Low-water exterior wash', price: 499 },
    { type: 'Foam Wash', description: 'EV-safe foam + tyre clean', price: 699 },
    { type: 'Premium EV Care', description: 'Foam + interior vacuum', price: 899 },
  ],
  'Pickup / Van': [
    { type: 'Basic Wash', description: 'Exterior wash', price: 699 },
    { type: 'Foam Wash', description: 'Foam + tyre cleaning', price: 899 },
    { type: 'Full Service', description: 'Exterior + interior', price: 1199 },
  ],
  'Truck': [
    { type: 'Basic Wash', description: 'Exterior water wash', price: 999 },
    { type: 'Foam Wash', description: 'Foam + pressure wash', price: 1299 },
    { type: 'Premium Clean', description: 'Full body + cabin', price: 1599 },
  ],
};

const vehicleTypes = Object.keys(PRICING_DATA);

const BookingPage = () => {
  const router = useRouter();
  
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
  const [selectedPrice, setSelectedPrice] = useState(0);

  const filteredServices = useMemo(() => {
    if (!formData.vehicleType) return [];
    return PRICING_DATA[formData.vehicleType] || [];
  }, [formData.vehicleType]);

  const selectServiceOption = (washType, price) => {
    setFormData((prev) => ({ ...prev, service: washType }));
    setSelectedPrice(price);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));    
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    const matchedService = filteredServices.find((s) => s.type === value);
    setSelectedPrice(matchedService?.price || 0);
    setFormData((prev) => ({ ...prev, service: value }));
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

      // Extract amount from selected service
      const servicePrice = selectedPrice || formData.service.match(/\d+/)?.[0] || 600;
      const bookingId = data.data?.id || data.data?._id;

      // Redirect to payment page
      router.push(`/payment?bookingId=${bookingId}&amount=${servicePrice}&service=${encodeURIComponent(formData.service)}`);
      
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
              placeholder="Vehicle Brand (e.g., Honda, Bajaj, Maruti)"
              className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.brand}
              onChange={handleChange}
            />
            <input
              type="text"
              name="model"
              required
              placeholder="Model (e.g., Activa, City, Creta)"
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
            {vehicleTypes.map((v) => (
              <option key={v}>{v}</option>
            ))}
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
            onChange={handleServiceChange}
          >
            <option value="">Select Wash Package</option>
            {filteredServices.map((svc) => (
              <option key={svc.type} value={svc.type}>
                {svc.type} — ₹{svc.price}
              </option>
            ))}
          </select>

          {/* Category-specific recommendations */}
          {formData.vehicleType && filteredServices.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">Recommended Packages for {formData.vehicleType}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredServices.map((svc) => (
                  <div key={svc.type} className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-bold text-lg text-black dark:text-white">{svc.type}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{svc.description}</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-4">₹{svc.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectServiceOption(svc.type, svc.price)}
                      className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!formData.vehicleType && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Please select a vehicle type to see available packages.</p>
          )}
        </section>

        {/* Booking Details */}
        <section>
          <h2 className="text-xl text-black dark:text-white font-bold mb-4">
            Booking Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              required
              className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.date}
              onChange={handleChange}
            />
            <input
              type="time"
              name="time"
              required
              className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={formData.time}
              onChange={handleChange}
            />
          </div>

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
