import mongoose from 'mongoose'

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    phone: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Store || mongoose.model('Store', StoreSchema)
