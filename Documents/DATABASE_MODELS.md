# Database Schema & Models Documentation - WashHub

Comprehensive documentation of all MongoDB models and their relationships.

---

## 🗄️ Database Overview

**Database Name:** `carwash-db`

**Collections:**
1. users
2. bookings
3. payments
4. services
5. reviews
6. stores
7. contacts

**Total Fields:** 80+
**Relationships:** One-to-Many, One-to-One

---

## 👤 User Model

**File:** `src/app/models/User.js`

**Collection:** `users`

**Purpose:** Store user account information and authentication details

### Schema Definition

```javascript
{
  _id: ObjectId,
  
  // Authentication
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    // Note: Never return password in responses
    select: false
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/
  },
  
  // Profile
  profileImage: {
    type: String,
    default: null
  },
  
  // Statistics
  bookingCount: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Preferences
  isAdmin: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "bookingCount": 5,
  "totalSpent": 2500,
  "averageRating": 4.8,
  "isAdmin": false,
  "emailNotifications": true,
  "createdAt": "2026-01-01T10:00:00.000Z",
  "updatedAt": "2026-01-21T15:30:00.000Z"
}
```

### Indexes

```javascript
// Unique index on email
db.users.createIndex({ email: 1 }, { unique: true })

// Index for admin users
db.users.createIndex({ isAdmin: 1 })

// Compound index for statistics
db.users.createIndex({ averageRating: -1, totalSpent: -1 })
```

### Queries

```javascript
// Find user by email
User.findOne({ email: "john@example.com" })

// Get admin users
User.find({ isAdmin: true })

// Get top rated users
User.find().sort({ averageRating: -1 }).limit(10)

// Update booking count
User.updateOne(
  { _id: userId },
  { $inc: { bookingCount: 1 } }
)
```

---

## 🚗 Booking Model

**File:** `src/app/models/Booking.js`

**Collection:** `bookings`

**Purpose:** Store all car wash booking information

### Schema Definition

```javascript
{
  _id: ObjectId,
  
  // Customer Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  
  // Vehicle Information
  brand: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "Mahindra",
      "Honda",
      "Maruti",
      "Hyundai",
      "Toyota",
      "Tata",
      "Bajaj",
      "Royal Enfield",
      "Hero",
      "Yamaha",
      "Other"
    ]
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ["Sedan", "SUV", "Hatchback", "Bike", "Scooter", "Truck"]
  },
  
  // Service Information
  service: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  
  // Booking Status
  bookingStatus: {
    type: String,
    enum: ["pending", "paid", "completed", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  
  // Schedule Information
  date: {
    type: String,
    trim: true,
    default: null
  },
  time: {
    type: String,
    trim: true,
    default: null
  },
  
  // Additional Details
  location: {
    type: String,
    trim: true,
    default: ""
  },
  notes: {
    type: String,
    trim: true,
    default: ""
  },
  
  // Payment Reference
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    default: null
  },
  
  // References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "brand": "Mahindra",
  "model": "Scorpio",
  "vehicleType": "SUV",
  "service": "Basic Wash - 300",
  "amount": 300,
  "bookingStatus": "completed",
  "paymentStatus": "completed",
  "date": "2026-01-25",
  "time": "14:30",
  "location": "Downtown Store",
  "notes": "Extra interior cleaning",
  "paymentId": ObjectId("507f1f77bcf86cd799439014"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": "2026-01-21T10:30:00.000Z",
  "updatedAt": "2026-01-21T14:00:00.000Z"
}
```

### Indexes

```javascript
// Email index for quick user lookup
db.bookings.createIndex({ email: 1 })

// Status indexes
db.bookings.createIndex({ bookingStatus: 1 })
db.bookings.createIndex({ paymentStatus: 1 })

// Date range queries
db.bookings.createIndex({ date: 1 })
db.bookings.createIndex({ createdAt: -1 })

// Compound index for filtering
db.bookings.createIndex({ 
  bookingStatus: 1, 
  createdAt: -1 
})

// Text search on notes
db.bookings.createIndex({ notes: "text", location: "text" })
```

### Queries

```javascript
// Get booking by ID
Booking.findById(bookingId)

// Get all bookings for a user
Booking.find({ email: userEmail }).sort({ createdAt: -1 })

// Get pending bookings
Booking.find({ bookingStatus: "pending" })

// Get completed bookings
Booking.find({ bookingStatus: "completed" })

// Get bookings by date range
Booking.find({
  date: {
    $gte: "2026-01-01",
    $lte: "2026-01-31"
  }
})

// Count bookings by status
Booking.aggregate([
  {
    $group: {
      _id: "$bookingStatus",
      count: { $sum: 1 }
    }
  }
])

// Get total revenue
Booking.aggregate([
  {
    $match: { bookingStatus: "completed" }
  },
  {
    $group: {
      _id: null,
      totalRevenue: { $sum: "$amount" }
    }
  }
])
```

---

## 💳 Payment Model

**File:** `src/app/models/Payment.js`

**Collection:** `payments`

**Purpose:** Track all payment transactions via Razorpay

### Schema Definition

```javascript
{
  _id: ObjectId,
  
  // References
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Payment Amount
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: "INR",
    enum: ["INR", "USD", "EUR"]
  },
  
  // Razorpay Details
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  
  // Transaction Information
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  transactionId: {
    type: String,
    default: null,
    unique: true,
    sparse: true
  },
  failureReason: {
    type: String,
    default: null
  },
  
  // Customer Information (Metadata)
  metadata: {
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    serviceType: String,
    vehicleType: String,
    bookingDate: Date
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ["card", "upi", "net_banking", "wallet", "unknown"],
    default: "unknown"
  },
  
  // Refund Information
  refundId: {
    type: String,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ["none", "partial", "full"],
    default: "none"
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "bookingId": ObjectId("507f1f77bcf86cd799439012"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "amount": 300,
  "currency": "INR",
  "razorpayOrderId": "order_KR62JP5QL7ZJQP",
  "razorpayPaymentId": "pay_KR62JP5QL7ZJQP",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d",
  "status": "completed",
  "transactionId": "pay_KR62JP5QL7ZJQP",
  "failureReason": null,
  "metadata": {
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "9876543210",
    "serviceType": "Basic Wash",
    "vehicleType": "SUV",
    "bookingDate": "2026-01-21T10:30:00.000Z"
  },
  "paymentMethod": "card",
  "refundId": null,
  "refundAmount": 0,
  "refundStatus": "none",
  "createdAt": "2026-01-21T11:00:00.000Z",
  "updatedAt": "2026-01-21T11:05:00.000Z"
}
```

### Indexes

```javascript
// Unique indexes
db.payments.createIndex({ razorpayOrderId: 1 }, { unique: true })
db.payments.createIndex({ transactionId: 1 }, { unique: true, sparse: true })

// Status indexes
db.payments.createIndex({ status: 1 })
db.payments.createIndex({ bookingId: 1 })
db.payments.createIndex({ userId: 1 })

// Date range queries
db.payments.createIndex({ createdAt: -1 })

// Compound indexes
db.payments.createIndex({ 
  status: 1, 
  createdAt: -1 
})
```

### Queries

```javascript
// Get payment by order ID
Payment.findOne({ razorpayOrderId: orderId })

// Get payment by booking
Payment.findOne({ bookingId: bookingId })

// Get user's payment history
Payment.find({ userId: userId }).sort({ createdAt: -1 })

// Get completed payments
Payment.find({ status: "completed" })

// Calculate daily revenue
Payment.aggregate([
  {
    $match: { status: "completed" }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      revenue: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: -1 }
  }
])

// Get failed payments
Payment.find({ 
  status: "failed",
  failureReason: { $exists: true }
})
```

---

## 🧹 Service Model

**File:** `src/app/models/Service.js`

**Collection:** `services`

**Purpose:** Define available car wash services and pricing

### Schema Definition

```javascript
{
  _id: ObjectId,
  
  // Service Name & Description
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  
  // Pricing by Vehicle Type
  prices: {
    type: Map,
    of: Number,
    required: true,
    // Structure:
    // {
    //   "Sedan": 149,
    //   "SUV": 199,
    //   "Bike": 99,
    //   "Truck": 299
    // }
  },
  
  // Service Details
  icon: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "name": "Basic Wash",
  "description": "Water rinse + shampoo",
  "prices": {
    "Sedan": 149,
    "SUV": 199,
    "Hatchback": 129,
    "Bike": 99,
    "Truck": 299
  },
  "icon": "🚗",
  "duration": 30,
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### Indexes

```javascript
// Unique index on name
db.services.createIndex({ name: 1 }, { unique: true })

// Active services
db.services.createIndex({ isActive: 1 })

// By creation date
db.services.createIndex({ createdAt: -1 })
```

### Queries

```javascript
// Get all active services
Service.find({ isActive: true })

// Get service by name
Service.findOne({ name: "Basic Wash" })

// Get price for specific vehicle
Service.findOne(
  { name: "Basic Wash" },
  { "prices.SUV": 1 }
)

// Update service price
Service.updateOne(
  { _id: serviceId },
  { $set: { "prices.Sedan": 199 } }
)

// Get all services sorted by name
Service.find().sort({ name: 1 })
```

---

## ⭐ Review Model

**File:** `src/app/models/Review.js`

**Collection:** `reviews`

**Purpose:** Store customer reviews and ratings

### Schema Definition

```javascript
{
  _id: ObjectId,
  
  // References
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Review Content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    enum: [1, 2, 3, 4, 5]
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ""
  },
  
  // Service Information
  serviceType: {
    type: String,
    trim: true
  },
  vehicleType: {
    type: String,
    trim: true
  },
  
  // Review Metadata
  isVerified: {
    type: Boolean,
    default: true
  },
  helpful: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439021"),
  "bookingId": ObjectId("507f1f77bcf86cd799439012"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "rating": 5,
  "comment": "Excellent service! The staff was very professional and efficient.",
  "serviceType": "Basic Wash",
  "vehicleType": "SUV",
  "isVerified": true,
  "helpful": 12,
  "createdAt": "2026-01-21T14:00:00.000Z",
  "updatedAt": "2026-01-21T14:00:00.000Z"
}
```

### Indexes

```javascript
// Rating index for sorting
db.reviews.createIndex({ rating: -1 })

// Date index
db.reviews.createIndex({ createdAt: -1 })

// Service type
db.reviews.createIndex({ serviceType: 1 })

// Verified reviews
db.reviews.createIndex({ isVerified: 1 })

// Compound index
db.reviews.createIndex({ 
  rating: -1, 
  helpful: -1, 
  createdAt: -1 
})
```

### Queries

```javascript
// Get reviews for a service
Review.find({ serviceType: "Basic Wash" }).sort({ rating: -1 })

// Get user's reviews
Review.find({ userId: userId })

// Get average rating
Review.aggregate([
  {
    $group: {
      _id: null,
      averageRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 }
    }
  }
])

// Get rating distribution
Review.aggregate([
  {
    $group: {
      _id: "$rating",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
])

// Top reviews by helpfulness
Review.find().sort({ helpful: -1 }).limit(10)
```

---

## 📍 Store Model

**File:** `src/app/models/Store.js`

**Collection:** `stores`

**Purpose:** Store location information

### Schema Definition

```javascript
{
  _id: ObjectId,
  
  // Store Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  
  // Location (Geo coordinates)
  latitude: Number,
  longitude: Number,
  
  // Contact Information
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Operating Hours
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  
  // Store Details
  manager: String,
  capacity: Number, // Number of bays
  services: [String], // Service types offered
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439025"),
  "name": "Downtown Wash Center",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "phone": "555-0123",
  "email": "downtown@washhub.com",
  "hours": {
    "monday": "8AM-8PM",
    "tuesday": "8AM-8PM",
    "wednesday": "8AM-8PM",
    "thursday": "8AM-8PM",
    "friday": "8AM-9PM",
    "saturday": "9AM-9PM",
    "sunday": "10AM-8PM"
  },
  "manager": "Mike Johnson",
  "capacity": 5,
  "services": ["Basic Wash", "Premium Wash", "Deluxe Wash"],
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### Indexes

```javascript
// City index
db.stores.createIndex({ city: 1 })

// Active stores
db.stores.createIndex({ isActive: 1 })

// Geo-spatial index for distance queries
db.stores.createIndex({ 
  latitude: "2dsphere", 
  longitude: "2dsphere" 
})
```

---

## 💬 Contact Model

**File:** `src/app/models/Contact.js`

**Collection:** `contacts`

**Purpose:** Store contact form submissions

### Schema Definition

```javascript
{
  _id: ObjectId,
  
  // Contact Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ""
  },
  
  // Message
  subject: {
    type: String,
    trim: true,
    default: ""
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  // Status
  status: {
    type: String,
    enum: ["new", "read", "responded"],
    default: "new"
  },
  
  // Response
  response: {
    type: String,
    default: null
  },
  respondedBy: {
    type: String,
    default: null
  },
  respondedAt: {
    type: Date,
    default: null
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Example Document

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439030"),
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543211",
  "subject": "Pricing Inquiry",
  "message": "I would like to know about your enterprise packages for corporate fleets.",
  "status": "new",
  "response": null,
  "respondedBy": null,
  "respondedAt": null,
  "createdAt": "2026-01-21T13:15:00.000Z",
  "updatedAt": "2026-01-21T13:15:00.000Z"
}
```

### Indexes

```javascript
// Status index
db.contacts.createIndex({ status: 1 })

// Email for deduplication
db.contacts.createIndex({ email: 1 })

// Date for sorting
db.contacts.createIndex({ createdAt: -1 })
```

---

## 🔗 Relationships Diagram

```
User (1) ──────── Many (Booking)
  |
  └─── Many (Review)
  └─── Many (Payment)

Booking (1) ────── One (Payment)
  |
  └─── One (Review)

Service (1) ────── Many (Booking) [implicit]
Service (1) ────── Many (Review) [via serviceType]

Store (1) ────── Many (Booking) [implicit, via location]

Contact (1) ────── Independent
```

---

## 📊 Sample Aggregation Queries

### Revenue by Service

```javascript
db.bookings.aggregate([
  {
    $match: { bookingStatus: "completed" }
  },
  {
    $group: {
      _id: "$service",
      revenue: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { revenue: -1 }
  }
])
```

### Customer Lifetime Value

```javascript
db.bookings.aggregate([
  {
    $match: { bookingStatus: "completed" }
  },
  {
    $group: {
      _id: "$email",
      totalSpent: { $sum: "$amount" },
      bookingCount: { $sum: 1 },
      lastBooking: { $max: "$createdAt" }
    }
  },
  {
    $sort: { totalSpent: -1 }
  }
])
```

### Service Performance by Vehicle Type

```javascript
db.bookings.aggregate([
  {
    $group: {
      _id: {
        service: "$service",
        vehicleType: "$vehicleType"
      },
      revenue: { $sum: "$amount" },
      count: { $sum: 1 },
      avgAmount: { $avg: "$amount" }
    }
  },
  {
    $sort: { revenue: -1 }
  }
])
```

---

**Last Updated:** January 21, 2026
