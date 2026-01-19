import dbConnection from '@/app/lib/db';
import Review from '@/app/models/Review';
import Booking from '@/app/models/Booking';

export async function POST(req) {
  try {
    await dbConnection();
    const body = await req.json();
    const { bookingId, userId, userName, serviceId, serviceName, vehicleType, rating, comment } = body;

    if (!bookingId || !userId || !serviceId || !rating) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return Response.json({ error: 'Review already exists for this booking' }, { status: 400 });
    }

    const review = new Review({
      bookingId,
      userId,
      userName,
      serviceId,
      serviceName,
      vehicleType,
      rating,
      comment: comment || '',
      verified: true,
    });

    await review.save();
    return Response.json({ success: true, data: review }, { status: 201 });
  } catch (err) {
    console.error('Review creation error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnection();
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return Response.json({ error: 'serviceId is required' }, { status: 400 });
    }

    const reviews = await Review.find({ serviceId, verified: true })
      .sort({ createdAt: -1 })
      .populate('bookingId', 'vehicleType brand model');

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return Response.json({
      success: true,
      data: reviews,
      averageRating: parseFloat(avgRating),
      totalReviews: reviews.length,
    });
  } catch (err) {
    console.error('Review fetch error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
