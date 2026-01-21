import Payment from '@/app/models/Payment';
import dbConnection from '@/app/lib/db';

export async function GET(req) {
  try {
    await dbConnection();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    const payment = await Payment.findById(id).populate('bookingId userId');

    if (!payment) {
      return Response.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, data: payment },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment fetch error:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch payment' },
      { status: 500 }
    );
  }
}
