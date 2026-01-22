import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: function() {
        // Password not required for OAuth users
        return !this.authProvider;
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },
    authProvider: {
      type: String,
      enum: ['google', 'facebook', null],
      default: null,
    },
    authProviderId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Profile Information
    phone: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio must not exceed 500 characters'],
    },
    // Addresses
    addresses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        label: {
          type: String,
          enum: ['home', 'work', 'other'],
          default: 'home',
        },
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Payment Methods
    paymentMethods: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        type: {
          type: String,
          enum: ['credit_card', 'debit_card', 'upi', 'wallet'],
          required: true,
        },
        // For cards
        cardNumber: String, // Last 4 digits only (encrypted in production)
        cardHolder: String,
        expiryMonth: String,
        expiryYear: String,
        cardBrand: String,
        // For UPI
        upiId: String,
        // For Wallet
        walletProvider: String,
        walletId: String,
        // Common fields
        isDefault: {
          type: Boolean,
          default: false,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Preferences
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
