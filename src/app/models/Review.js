import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    userId: {
      type: String,
      required: true, // email
    },
    userName: {
      type: String,
      required: true,
    },
    serviceId: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    verified: {
      type: Boolean,
      default: true, // Mark as verified since it's from a real booking
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
