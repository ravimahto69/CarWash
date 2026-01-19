import mongoose from 'mongoose'

const PricesSchema = new mongoose.Schema(
  {
    bike: { type: Number, min: 0 },
    hatchback: { type: Number, min: 0 },
    sedan: { type: Number, min: 0 },
    suv: { type: Number, min: 0 },
    luxury: { type: Number, min: 0 },
    pickup: { type: Number, min: 0 },
    truck: { type: Number, min: 0 },
    ev: { type: Number, min: 0 },
    any: { type: Number, min: 0 },
  },
  { _id: false }
)

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    // legacy single price (kept for backward compatibility)
    price: { type: Number, min: 0 },
    // structured per-vehicle pricing
    prices: { type: PricesSchema, default: {} },
    durationMin: { type: Number, min: 0 },
    vehicleTags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema)
