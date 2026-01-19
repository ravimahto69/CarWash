import mongoose from 'mongoose'

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    website: { type: String, trim: true },
    
    // GeoJSON for geospatial queries
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    
    // Legacy latitude/longitude (for compatibility)
    latitude: { type: Number },
    longitude: { type: Number },
    
    // Services offered
    services: [
      {
        name: String,
        price: Number,
        duration: Number // in minutes
      }
    ],
    
    // Store details
    photos: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    
    // Operating hours
    hours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    
    // Capacity
    capacity: { type: Number, default: 5 },
    currentQueue: { type: Number, default: 0 },
    estimatedWaitTime: { type: Number, default: 0 }, // in minutes
    
    // Facilities
    facilities: {
      hasParking: { type: Boolean, default: true },
      hasWaitingArea: { type: Boolean, default: true },
      hasRestroom: { type: Boolean, default: false },
      hasWifi: { type: Boolean, default: false },
      hasRefreshments: { type: Boolean, default: false }
    },
    
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Create geospatial index for location-based queries
StoreSchema.index({ location: '2dsphere' })

// Pre-save middleware to sync latitude/longitude from location
StoreSchema.pre('save', function() {
  if (this.location && this.location.coordinates && this.location.coordinates.length === 2) {
    this.longitude = this.location.coordinates[0]
    this.latitude = this.location.coordinates[1]
  }
})

export default mongoose.models.Store || mongoose.model('Store', StoreSchema)
