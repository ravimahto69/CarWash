'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, message, Spin, Empty, Tag } from 'antd';
import { StarOutlined, StarFilled, UserOutlined } from '@ant-design/icons';

const ReviewSection = ({ serviceId, bookingId, userName, userEmail }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?serviceId=${serviceId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
        setAverageRating(data.averageRating);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  const checkIfReviewed = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews/booking/${bookingId}`);
      const data = await res.json();
      if (data.success) {
        setHasReviewed(data.hasReview);
      }
    } catch (err) {
      console.error('Failed to check review status:', err);
    }
  }, [bookingId]);

  useEffect(() => {
    loadReviews();
    if (bookingId) {
      checkIfReviewed();
    }
  }, [serviceId, bookingId, loadReviews, checkIfReviewed]);

  const handleSubmitReview = async () => {
    if (!bookingId) {
      message.error('Booking ID is required');
      return;
    }

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
          bookingId,
          userId: userEmail,
          userName,
          serviceId,
          serviceName: 'Service',
          vehicleType: 'Vehicle',
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        message.success('Review submitted successfully!');
        setRating(0);
        setComment('');
        setShowForm(false);
        setHasReviewed(true);
        loadReviews();
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

  return (
  <section className="mt-16">
    {/* ---------------- HEADER ---------------- */}
    <div className="mb-8">
      <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white">
        ⭐ Customer Reviews
      </h3>

      <div className="flex items-center gap-4 mt-3">
        <span className="text-4xl font-bold text-yellow-500">
          {averageRating.toFixed(1)}
        </span>

        <div>
          <div className="flex items-center gap-3">
            {[...Array(5)].map((_, i) => (
              i < Math.floor(averageRating) ? (
                <StarFilled key={i} className="text-2xl" style={{ color: '#eab308' }} />
              ) : (
                <StarOutlined key={i} className="text-2xl text-gray-300 dark:text-gray-600" />
              )
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Based on {reviews.length} verified review{reviews.length !== 1 && 's'}
          </p>
        </div>

        <Tag color="green" className="ml-2">
          Trusted Reviews
        </Tag>
      </div>
    </div>

    {/* ---------------- WRITE REVIEW CTA ---------------- */}
    {bookingId && !hasReviewed && (
      <Card className="mb-10 border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30">
        {!showForm ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-lg font-bold text-gray-800 dark:text-white">
                Had a good experience?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your review helps other customers choose better.
              </p>
            </div>

            <Button
              type="primary"
              size="large"
              onClick={() => setShowForm(true)}
              className="font-bold"
            >
              ✍️ Write a Review
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="font-semibold block mb-2">
                Rate the service *
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      {i < rating ? (
                        <StarFilled className="text-3xl" style={{ color: '#eab308' }} />
                      ) : (
                        <StarOutlined className="text-3xl text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <span className="text-lg font-bold text-yellow-500" style={{ color: '#eab308' }}>
                    {rating} / 5
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Share your experience (optional)
              </label>
              <Input.TextArea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Example: The service was on time and very professional."
                rows={4}
                maxLength={300}
                showCount
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="primary"
                loading={submitting}
                onClick={handleSubmitReview}
                className="font-bold"
              >
                Submit Review
              </Button>

              <Button
                onClick={() => {
                  setShowForm(false)
                  setRating(0)
                  setComment('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    )}

    {/* ---------------- REVIEWS LIST ---------------- */}
    {loading ? (
      <div className="flex justify-center py-10">
        <Spin size="large" />
      </div>
    ) : reviews.length === 0 ? (
      <Empty description="No reviews yet">
        <p className="text-sm text-gray-500 mt-2">
          Be the first to share your experience.
        </p>
      </Empty>
    ) : (
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {/* Header with Avatar and Rating */}
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-base">
                    {review.userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span>📅</span>
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    i < review.rating ? (
                      <StarFilled key={i} className="text-yellow-500 text-base" style={{ color: '#eab308' }} />
                    ) : (
                      <StarOutlined key={i} className="text-gray-300 dark:text-gray-600 text-base" />
                    )
                  ))}
                </div>
                <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-500">
                  {review.rating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Comment */}
            {review.comment && (
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                  &quot;{review.comment}&quot;
                </p>
              </div>
            )}

            {/* Footer with Tags */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                🚗 {review.vehicleType}
              </span>
              {review.verified && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                  ✓ Verified Service
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
)

};

export default ReviewSection;
