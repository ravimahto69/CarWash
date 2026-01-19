'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Tag, Empty, Spin } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const Dashboard = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const loadUserBookings = async () => {
      try {
        const authUser = localStorage.getItem('auth_user');
        if (!authUser) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(authUser);
        setUserName(user?.name || 'User');
        setUserEmail(user?.email || '');

        if (!user?.email) {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/user/bookings?email=${encodeURIComponent(user.email)}`);
        const json = await res.json();

        if (json?.success) {
          setBookings(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserBookings();
  }, [router]);

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: 'orange', icon: <SyncOutlined spin />, text: 'Pending' },
      paid: { color: 'blue', icon: <CheckCircleOutlined />, text: 'Paid' },
      completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' },
      cancelled: { color: 'red', icon: <CloseCircleOutlined />, text: 'Cancelled' },
    };

    const config = statusMap[status] || statusMap.pending;
    return (
      <Tag color={config.color} icon={config.icon} className="text-sm font-semibold">
        {config.text}
      </Tag>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-6 md:px-20 transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, <span className="font-semibold">{userName}</span>! Here's your booking history.
        </p>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <Empty
            description={
              <span className="text-gray-600 dark:text-gray-400">
                No bookings yet. Start by booking a service!
              </span>
            }
          >
            <button
              onClick={() => router.push('/book')}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Book Now
            </button>
          </Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <Card
              key={booking._id}
              className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {booking.service}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Booking ID: {booking._id?.slice(-8)}
                  </p>
                </div>
                {getStatusTag(booking.bookingStatus)}
              </div>

              {/* Vehicle Info */}
              <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CarOutlined className="text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {booking.vehicleType}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 ml-6">
                  {booking.brand} {booking.model}
                </p>
              </div>

              {/* Details Grid */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CalendarOutlined className="text-gray-500 dark:text-gray-400" />
                  <span>{formatDate(booking.date)}</span>
                </div>
                
                {booking.time && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <ClockCircleOutlined className="text-gray-500 dark:text-gray-400" />
                    <span>{booking.time}</span>
                  </div>
                )}

                {booking.location && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <EnvironmentOutlined className="text-gray-500 dark:text-gray-400" />
                    <span>{booking.location}</span>
                  </div>
                )}

                {booking.amount && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <DollarOutlined className="text-gray-500 dark:text-gray-400" />
                    <span className="font-bold text-blue-600 dark:text-blue-400">₹{booking.amount}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{booking.notes}</p>
                </div>
              )}

              {/* Timestamp */}
              <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                Booked on {new Date(booking.createdAt).toLocaleString('en-IN')}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Action Button */}
      {bookings.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/book')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Book Another Service
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
