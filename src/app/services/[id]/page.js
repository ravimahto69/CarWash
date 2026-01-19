'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Spin, Button, Empty, Rate, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ReviewSection from '@/app/component/ReviewSection';

const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadService();
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        setUserName(user.name || 'User');
        setUserEmail(user.email || '');
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/services/${serviceId}`);
      const data = await res.json();
      if (data.success) {
        setService(data.data);
      } else {
        message.error('Service not found');
      }
    } catch (err) {
      console.error('Failed to load service:', err);
      message.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Spin size="large" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 md:px-20">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          className="mb-4"
        >
          Go Back
        </Button>
        <Empty description="Service not found" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 md:px-20 transition-colors">
      {/* Back Button */}
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => router.back()}
        className="mb-6 h-10 font-semibold"
      >
        Go Back
      </Button>

      {/* Service Details */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 border-2 border-gray-200 rounded-2xl shadow-lg mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-8 text-white rounded-xl mb-6">
          <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
          <p className="text-blue-100 text-lg">{service.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Service Details</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-1">Duration</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {service.durationMin} minutes
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-2">Available for</p>
                <div className="flex flex-wrap gap-2">
                  {service.vehicleTags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-2">Pricing</p>
                <div className="space-y-2">
                  {Object.entries(service.prices || {}).map(([vehicle, price]) => (
                    <div key={vehicle} className="flex justify-between items-center">
                      <span className="text-gray-800 dark:text-gray-300">{vehicle}</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">₹{price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  service.isActive 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {service.isActive ? '✓ Active' : '✗ Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ready to Book?</h3>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-8 rounded-2xl text-white text-center h-full flex flex-col justify-between">
              <div>
                <p className="text-blue-100 text-lg mb-4">
                  Get your vehicle professionally cleaned with our {service.name} service
                </p>
                <div className="text-4xl font-bold mb-2">
                  Starting from
                </div>
                <div className="text-5xl font-bold mb-6">
                  ₹{Math.min(...Object.values(service.prices || {1: 0}))}
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem('selectedService', service._id);
                  router.push('/book');
                }}
                className="w-full py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors text-lg"
              >
                Book This Service
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Reviews Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700">
        <ReviewSection 
          serviceId={service._id}
          bookingId={null}
          userName={userName}
          userEmail={userEmail}
        />
      </div>
    </div>
  );
};

export default ServiceDetailPage;
