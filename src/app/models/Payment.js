import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'razorpay',
    },
    transactionId: {
      type: String,
      sparse: true,
    },
    failureReason: {
      type: String,
      sparse: true,
    },
    metadata: {
      customerName: String,
      customerEmail: String,
      customerPhone: String,
      serviceType: String,
      bookingDate: Date,
      link: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
