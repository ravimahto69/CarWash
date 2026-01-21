import Payment from '@/app/models/Payment';
import Booking from '@/app/models/Booking';
import dbConnection from '@/app/lib/db';
import crypto from 'crypto';

export async function POST(req) {
  try {
    await dbConnection();

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Validate required fields
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return Response.json(
        { success: false, error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const keySecret = process.env.RAZOR_KEY_SECRET;
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpaySignature) {
      // Payment verification failed
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        {
          status: 'failed',
          failureReason: 'Signature verification failed',
        }
      );

      return Response.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'completed',
        transactionId: razorpayPaymentId,
      },
      { new: true }
    );

    if (!payment) {
      return Response.json(
        { success: false, error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // Update booking status to confirmed
    if (payment.bookingId) {
      await Booking.findByIdAndUpdate(
        payment.bookingId,
        {
          amount: payment.amount,
          paymentStatus: 'completed',
          bookingStatus: 'confirmed',
          isPaid: true,
        },
        { new: true }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Payment verified successfully',
        data: {
          paymentId: payment._id,
          transactionId: payment.transactionId,
          amount: payment.amount,
          status: payment.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return Response.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
