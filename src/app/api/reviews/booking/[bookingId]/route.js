import dbConnection from '@/app/lib/db';
import Review from '@/app/models/Review';
import Booking from '@/app/models/Booking';

export async function GET(req, { params }) {
  try {
    await dbConnection();
    const { bookingId } = params;

    if (!bookingId) {
      return Response.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const existingReview = await Review.findOne({ bookingId });

    return Response.json({
      success: true,
      booking: {
        _id: booking._id,
        service: booking.service,
        vehicleType: booking.vehicleType,
        brand: booking.brand,
        model: booking.model,
        status: booking.bookingStatus,
        date: booking.date,
      },
      hasReview: !!existingReview,
      review: existingReview || null,
    });
  } catch (err) {
    console.error('Booking review check error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
