import Payment from '../../models/Payment';
import { connectDB } from '../../lib/db';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

export async function POST(req) {
  try {
    await connectDB();

    const { amount, bookingId, userId, customerName, customerEmail, customerPhone, serviceType } = req.body;

    // Validate required fields
    if (!amount || !bookingId || !userId || !customerEmail) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${bookingId}_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
      notes: {
        bookingId: bookingId.toString(),
        userId: userId.toString(),
        serviceType: serviceType,
      },
    });

    // Save payment record in database
    const payment = await Payment.create({
      bookingId,
      userId,
      amount,
      razorpayOrderId: order.id,
      status: 'pending',
      metadata: {
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        bookingDate: new Date(),
      },
    });

    return Response.json(
      {
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          paymentId: payment._id,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Payment creation error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}
