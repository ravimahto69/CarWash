'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Tag, Empty, Spin, Button, Modal, Rate, Input, message } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  DollarOutlined,
  ArrowRightOutlined,
  UserOutlined,
  MailOutlined,
  StarOutlined,
} from '@ant-design/icons';

const UserDashboard = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewedBookings, setReviewedBookings] = useState(new Set());

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
          
          // Check which bookings have reviews
          const bookingIds = (json.data || []).map(b => b._id);
          const reviewed = new Set();
          for (const id of bookingIds) {
            try {
              const reviewRes = await fetch(`/api/reviews/booking/${id}`);
              const reviewData = await reviewRes.json();
              if (reviewData.success && reviewData.hasReview) {
                reviewed.add(id);
              }
            } catch (err) {
              console.error(`Failed to check review for booking ${id}:`, err);
            }
          }
          setReviewedBookings(reviewed);
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

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setReviewModalVisible(true);
    setRating(0);
    setComment('');
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    if (rating === 0) {
      message.error('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          userId: userEmail,
          userName,
          serviceId: selectedBooking.serviceId || 'unknown',
          serviceName: selectedBooking.service,
          vehicleType: selectedBooking.vehicleType,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        message.success('Review submitted successfully!');
        setReviewModalVisible(false);
        setReviewedBookings(new Set([...reviewedBookings, selectedBooking._id]));
        setRating(0);
        setComment('');
      } else {
        message.error(data.error || 'Failed to submit review');
      }
    } catch (err) {
      message.error('Error submitting review');
      console.error(err);
    } finally {
      setSubmitting(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 md:px-20 transition-colors">
      {/* Header Section with User Info */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-3">📊 My Bookings</h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-100 mb-2">
                <UserOutlined className="text-xl" />
                <span className="text-lg font-semibold">{userName}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <MailOutlined className="text-lg" />
                <span className="text-sm">{userEmail}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{bookings.length}</p>
              <p className="text-blue-100 text-sm">Total Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700 border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <Empty
            description={
              <span className="text-gray-600 dark:text-gray-400 text-lg">
                No bookings yet. Start by booking a service!
              </span>
            }
          >
            <Button
              type="primary"
              size="large"
              onClick={() => router.push('/book')}
              className="mt-6 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none font-bold text-base"
              icon={<ArrowRightOutlined />}
            >
              Book Now
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map((booking, index) => (
            <Card
              key={booking._id}
              className="dark:bg-gray-800 dark:border-gray-700 border-2 border-gray-200 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 rounded-2xl overflow-hidden group"
            >
              {/* Status Badge at top */}
              <div className="absolute top-4 right-4 z-10">
                {getStatusTag(booking.bookingStatus)}
              </div>

              {/* Service Header */}
              <div className="mb-6 pr-20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {booking.service}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-13">
                  ID: {booking._id?.slice(-8).toUpperCase()}
                </p>
              </div>

              {/* Vehicle Info Card */}
              <div className="mb-5 p-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 rounded-xl border-2 border-blue-200 dark:border-blue-600">
                <div className="flex items-center gap-3">
                  <CarOutlined className="text-2xl text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">
                      {booking.vehicleType}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {booking.brand} {booking.model}
                    </p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Date */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                    <CalendarOutlined className="text-base" />
                    <span>Date</span>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm">
                    {formatDate(booking.date)}
                  </p>
                </div>

                {/* Time */}
                {booking.time && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                      <ClockCircleOutlined className="text-base" />
                      <span>Time</span>
                    </div>
                    <p className="font-bold text-gray-800 dark:text-white text-sm">
                      {booking.time}
                    </p>
                  </div>
                )}

                {/* Location */}
                {booking.location && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 col-span-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs mb-1">
                      <EnvironmentOutlined className="text-base" />
                      <span>Location</span>
                    </div>
                    <p className="font-bold text-gray-800 dark:text-white text-sm">
                      {booking.location}
                    </p>
                  </div>
                )}

                {/* Price */}
                {booking.amount && (
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 rounded-lg border-2 border-green-300 dark:border-green-600 col-span-2">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-xs mb-1">
                      <DollarOutlined className="text-base" />
                      <span>Amount Paid</span>
                    </div>
                    <p className="font-bold text-green-700 dark:text-green-300 text-lg">
                      ₹{booking.amount}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">📝 Notes:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg italic">
                    &quot;{booking.notes}&quot;
                  </p>
                </div>
              )}

              {/* Timestamp */}
              <div className="mt-4 text-xs text-gray-400 dark:text-gray-500 text-right">
                Booked {new Date(booking.createdAt).toLocaleDateString('en-IN')} at {new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>

              {/* Rate Service Button for Completed Bookings */}
              {(booking.bookingStatus === 'completed' || booking.bookingStatus === 'paid') && !reviewedBookings.has(booking._id) && (
                <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
                  <Button
                    type="primary"
                    block
                    size="large"
                    icon={<StarOutlined />}
                    onClick={() => handleOpenReviewModal(booking)}
                    className="h-11 font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 border-none shadow-md"
                  >
                    ⭐ Rate This Service
                  </Button>
                </div>
              )}

              {/* Already Reviewed Badge */}
              {reviewedBookings.has(booking._id) && (
                <div className="mt-4 pt-4 border-t-2 border-gray-200 dark:border-gray-600 text-center">
                  <Tag color="green" className="text-sm font-semibold px-4 py-1">
                    ✓ Already Reviewed
                  </Tag>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Action Button */}
      {bookings.length > 0 && (
        <div className="mt-12 text-center">
          <Button
            type="primary"
            size="large"
            onClick={() => router.push('/book')}
            className="h-12 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none font-bold text-base shadow-lg hover:shadow-xl transition-all"
            icon={<ArrowRightOutlined />}
          >
            Book Another Service
          </Button>
        </div>
      )}

      {/* Review Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ⭐ Rate Your Experience
          </span>
        }
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setRating(0);
          setComment('');
        }}
        footer={null}
        width={600}
        styles={{
          content: {
            backgroundColor: 'var(--modal-bg)',
            padding: 0,
          },
          header: {
            backgroundColor: 'var(--modal-header-bg)',
            borderBottom: '2px solid var(--modal-border)',
            padding: '16px 24px',
          },
          body: {
            backgroundColor: 'var(--modal-bg)',
            padding: '24px',
          },
        }}
        className="[&_.ant-modal-content]:!bg-white dark:[&_.ant-modal-content]:!bg-gray-800 [&_.ant-modal-header]:!bg-gradient-to-r [&_.ant-modal-header]:!from-blue-50 [&_.ant-modal-header]:!to-blue-100 dark:[&_.ant-modal-header]:!from-gray-800 dark:[&_.ant-modal-header]:!to-gray-900 [&_.ant-modal-header]:!border-b-2 [&_.ant-modal-header]:!border-blue-200 dark:[&_.ant-modal-header]:!border-gray-700"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Booking Info */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800 p-5 rounded-xl border-2 border-blue-300 dark:border-blue-600 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                  🚗
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wide">Service Details</p>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedBooking.service}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full font-semibold">
                  {selectedBooking.vehicleType}
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {selectedBooking.brand} {selectedBooking.model}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-600">
              <label className="block font-bold text-gray-900 dark:text-white mb-4 text-lg">
                ⭐ How would you rate this service? <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
                <Rate
                  value={rating}
                  onChange={setRating}
                  className="text-4xl [&_.ant-rate-star]:text-gray-300 dark:[&_.ant-rate-star]:text-gray-600 [&_.ant-rate-star-full]:text-yellow-500"
                  style={{ fontSize: '40px' }}
                />
                {rating > 0 && (
                  <div className="text-center ml-4">
                    <div className="text-3xl font-bold text-yellow-500">{rating}.0</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                      {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Poor'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-600">
              <label className="block font-bold text-gray-900 dark:text-white mb-3 text-lg">
                💬 Share your experience (Optional)
              </label>
              <Input.TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked or what could be improved..."
                rows={5}
                maxLength={500}
                showCount
                className="!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-white !border-2 !border-gray-300 dark:!border-gray-600 !rounded-lg text-base !leading-relaxed focus:!border-blue-500 dark:focus:!border-blue-400 hover:!border-blue-400 dark:hover:!border-blue-500"
                styles={{
                  textarea: {
                    color: 'inherit',
                    backgroundColor: 'transparent',
                  }
                }}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Tip: Detailed reviews help other customers make better decisions
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button
                type="primary"
                size="large"
                onClick={handleSubmitReview}
                loading={submitting}
                disabled={rating === 0}
                className="flex-1 h-12 font-bold text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 border-none shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : '✓ Submit Review'}
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setReviewModalVisible(false);
                  setRating(0);
                  setComment('');
                }}
                className="h-12 font-bold text-base border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserDashboard;
