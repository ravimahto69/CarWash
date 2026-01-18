import Razorpay from 'razorpay';
import Payment from '../../../models/Payment';
import dbConnection from '../../../lib/db';

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_KEY_SECRET,
});

export async function POST(req) {
  try {
    await dbConnection();
    const body = await req.json();
    const { amount, bookingId, userId, customerName, customerEmail, customerPhone, serviceType } = body || {};

    if (!amount || !bookingId || !userId || !customerEmail) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Create payment link
    const link = await razorpay.paymentLink.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      accept_partial: false,
      description: `Car Wash - ${serviceType || 'Service'}`,
      reference_id: bookingId.toString(),
      customer: {
        name: customerName || 'Customer',
        email: customerEmail,
        contact: customerPhone,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        bookingId: bookingId.toString(),
        userId: userId.toString(),
        serviceType: serviceType || 'Service',
      },
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/booking-confirmation?bookingId=${bookingId}`,
      callback_method: 'get',
    });

    // Save payment record
    await Payment.create({
      bookingId,
      userId,
      amount,
      razorpayOrderId: link.id,
      status: 'pending',
      paymentMethod: 'razorpay_link',
      metadata: {
        customerName,
        customerEmail,
        customerPhone,
        serviceType,
        link: link.short_url,
      },
    });

    return Response.json({
      success: true,
      data: {
        linkId: link.id,
        shortUrl: link.short_url,
        amount: link.amount,
        currency: link.currency,
      },
    });
  } catch (error) {
    console.error('Payment link error:', error);
    return Response.json({ success: false, error: error.message || 'Payment link creation failed' }, { status: 500 });
  }
}
