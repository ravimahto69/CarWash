import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true }
)

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
