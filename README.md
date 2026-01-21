# WashHub - Car Wash Booking Platform

A comprehensive Next.js-based car wash booking and management platform with admin dashboard, real-time payment integration, and service management.

## 🚀 Quick Overview

WashHub is a full-stack web application that allows users to:
- Browse and book car wash services
- Make secure payments via Razorpay
- Track booking status
- View their booking history and profile
- Leave reviews and ratings

Admins can:
- Manage bookings and their status
- Manage services and pricing
- Monitor payments and fulfillment
- View customer reviews and analytics

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Installation & Setup](#installation--setup)
3. [Environment Configuration](#environment-configuration)
4. [Features](#features)
5. [API Documentation](#api-documentation)
6. [Database Models](#database-models)
7. [Component Architecture](#component-architecture)
8. [Authentication Flow](#authentication-flow)
9. [Payment Integration](#payment-integration)
10. [Deployment Guide](#deployment-guide)

## 📁 Project Structure

```
CarWash/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   ├── component/        # React components
│   │   ├── models/           # MongoDB schemas
│   │   ├── lib/              # Utility functions
│   │   ├── context/          # React contexts
│   │   ├── layout.js         # Root layout
│   │   ├── page.js           # Home page
│   │   ├── globals.css       # Global styles
│   │   ├── admin/            # Admin routes
│   │   ├── book/             # Booking page
│   │   ├── booking-confirmation/  # Confirmation page
│   │   ├── contact/          # Contact page
│   │   ├── dashboard/        # User dashboard
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── profile/          # User profile
│   │   ├── payment/          # Payment page
│   │   ├── services/         # Services listing
│   │   └── nearby-stores/    # Store locations
├── public/                   # Static files
├── coverage/                 # Test coverage reports
├── .env                      # Environment variables (IGNORED)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── jest.config.js           # Jest testing config
├── next.config.mjs          # Next.js config
├── tailwind.config.js       # Tailwind CSS config
└── package.json             # Dependencies

```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ or higher
- MongoDB Atlas account (or local MongoDB)
- Razorpay account
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd CarWash
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env.local` file in the root directory (see [Environment Configuration](#environment-configuration))

### Step 4: Run Development Server
```bash
npm run dev
```

Access the application at `http://localhost:3000`

### Step 5: Build for Production
```bash
npm run build
npm start
```

## 🔐 Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Razorpay Payment Gateway
RAZOR_KEY_ID=your_razorpay_key_id
RAZOR_KEY_SECRET=your_razorpay_key_secret

# Email Configuration (if using)
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# API URL (for production)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Getting API Keys

**MongoDB Atlas:**
1. Create account at mongodb.com
2. Create a cluster
3. Get connection string from "Connect" button

**Razorpay:**
1. Create account at razorpay.com
2. Go to Settings → API Keys
3. Copy Key ID and Key Secret

## ✨ Features

### User Features
- ✅ User Registration & Login
- ✅ Browse Services by Vehicle Type
- ✅ Book Car Wash Services
- ✅ Secure Payment via Razorpay
- ✅ View Booking History
- ✅ Track Booking Status (Pending/Confirmed/Completed/Cancelled)
- ✅ User Profile Management
- ✅ Leave Reviews & Ratings
- ✅ Find Nearby Stores
- ✅ Dark Mode Support

### Admin Features
- ✅ Admin Dashboard
- ✅ Manage All Bookings
- ✅ Mark Bookings as Completed
- ✅ Cancel Bookings
- ✅ Manage Services (CRUD operations)
- ✅ Set Prices per Vehicle Type
- ✅ View All Payments
- ✅ View Customer Reviews
- ✅ Manage Stores & Locations

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "9876543210"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token"
  }
}
```

### Booking Endpoints

#### Create Booking
```
POST /api/booking
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "brand": "Mahindra",
  "model": "Scorpio",
  "vehicleType": "SUV",
  "service": "Basic Wash",
  "amount": 399,
  "location": "Downtown Store",
  "notes": "Extra interior cleaning"
}

Response: 201 Created
{
  "success": true,
  "bookingId": "booking_id",
  "data": {
    "_id": "booking_id",
    "name": "John Doe",
    "service": "Basic Wash",
    "status": "pending"
  }
}
```

#### Get Booking
```
GET /api/booking?id=booking_id

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "booking_id",
    "name": "John Doe",
    "service": "Basic Wash",
    "amount": 399,
    "bookingStatus": "pending",
    "createdAt": "2026-01-21T10:30:00Z"
  }
}
```

#### Get All Bookings (Admin)
```
GET /api/booking/all

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "booking_id_1",
      "name": "John Doe",
      "service": "Basic Wash",
      "amount": 399,
      "bookingStatus": "pending"
    },
    ...
  ]
}
```

### Payment Endpoints

#### Create Payment Order
```
POST /api/payment/create
Content-Type: application/json

{
  "amount": 399,
  "bookingId": "booking_id",
  "userId": "user_id",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "serviceType": "Basic Wash"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "orderId": "razorpay_order_id",
    "amount": 39900,
    "currency": "INR",
    "keyId": "razorpay_key_id"
  }
}
```

#### Verify Payment
```
POST /api/payment/verify
Content-Type: application/json

{
  "razorpayPaymentId": "pay_xxxxx",
  "razorpayOrderId": "order_xxxxx",
  "razorpaySignature": "signature_xxxxx"
}

Response: 200 OK
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "amount": 399,
    "status": "completed"
  }
}
```

### Services Endpoints

#### Get All Services
```
GET /api/services

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "service_id",
      "name": "Basic Wash",
      "description": "Water rinse + shampoo",
      "prices": {
        "Sedan": 149,
        "SUV": 199
      },
      "createdAt": "2026-01-21T10:00:00Z"
    }
  ]
}
```

#### Create Service (Admin)
```
POST /api/services
Content-Type: application/json

{
  "name": "Premium Wash",
  "description": "Complete exterior + interior cleaning",
  "prices": {
    "Sedan": 599,
    "SUV": 799
  }
}

Response: 201 Created
{
  "success": true,
  "data": {
    "_id": "service_id",
    "name": "Premium Wash"
  }
}
```

### Review Endpoints

#### Add Review
```
POST /api/reviews
Content-Type: application/json

{
  "bookingId": "booking_id",
  "userId": "user_id",
  "rating": 5,
  "comment": "Excellent service!",
  "serviceType": "Basic Wash"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "_id": "review_id",
    "rating": 5,
    "comment": "Excellent service!"
  }
}
```

#### Get All Reviews
```
GET /api/reviews

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "_id": "review_id",
      "rating": 5,
      "comment": "Excellent service!",
      "serviceType": "Basic Wash",
      "createdAt": "2026-01-21T10:30:00Z"
    }
  ]
}
```

## 📊 Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (required),
  phone: String (required),
  bookingCount: Number (default: 0),
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required),
  email: String (required),
  brand: String (required) - Vehicle brand
  model: String (required) - Vehicle model
  vehicleType: String (required) - SUV, Sedan, Bike, Truck, etc.
  service: String (required) - Service type
  amount: Number (default: 0) - Service cost
  bookingStatus: String - pending, paid, completed, cancelled
  date: String - Booking date
  time: String - Booking time
  location: String - Store location
  notes: String - Additional notes
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

### Payment Model
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Booking),
  userId: ObjectId (ref: User),
  amount: Number (required),
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: String - pending, completed, failed
  transactionId: String,
  metadata: {
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    serviceType: String,
    bookingDate: Date
  },
  failureReason: String,
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

### Service Model
```javascript
{
  _id: ObjectId,
  name: String (required) - Service name
  description: String - Service description
  prices: Object - Prices per vehicle type
    {
      "Sedan": 149,
      "SUV": 199,
      "Bike": 99
    }
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

### Review Model
```javascript
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Booking),
  userId: ObjectId (ref: User),
  rating: Number (1-5, required),
  comment: String,
  serviceType: String,
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

### Store Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  address: String (required),
  city: String,
  latitude: Number,
  longitude: Number,
  phone: String,
  email: String,
  hours: String - Operating hours
  createdAt: Date (timestamp)
}
```

### Contact Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  phone: String,
  subject: String,
  message: String (required),
  createdAt: Date (timestamp)
}
```

## 🧩 Component Architecture

### Core Components

#### Header
- Navigation bar with logo
- User authentication status
- Cart/booking info
- Dark mode toggle
- Mobile responsive menu

**Location:** `src/app/component/Header.jsx`

#### Footer
- Company info
- Quick links
- Contact information
- Social media links
- Terms & Privacy

**Location:** `src/app/component/Footer.jsx`

#### Home
- Hero section with CTA
- Featured services carousel
- How it works section
- Testimonials
- Call to action

**Location:** `src/app/component/Home.jsx`

#### Services
- Service listings
- Filter by vehicle type
- Service details
- Pricing information
- Book button

**Location:** `src/app/component/Services.jsx`

#### Book
- Multi-step booking form
- Personal details input
- Vehicle selection
- Service selection
- Date/time picker
- Additional notes
- Submit booking

**Location:** `src/app/component/Book.jsx`
**Flow:**
1. User enters personal details
2. Selects vehicle type and model
3. Chooses service
4. Selects date and time
5. Submits booking
6. Redirected to payment

#### Payment
- Razorpay integration
- Amount display
- Payment gateway modal
- Payment confirmation
- Order receipt

**Location:** `src/app/component/Payment.jsx`

#### BookingConfirmation
- Order confirmation page
- Booking details display
- Booking reference number
- Next steps information
- Download receipt option

**Location:** `src/app/component/BookingConfirmation.jsx`

#### Login
- Email/password login form
- Remember me option
- Forgot password link
- Registration link
- Form validation

**Location:** `src/app/component/Login.jsx`
**Authentication Flow:**
1. User enters email and password
2. Validates credentials against database
3. Creates JWT token if valid
4. Stores token in localStorage
5. Redirects to dashboard

#### Register
- Registration form with validation
- Name, email, phone, password
- Password strength indicator
- Terms acceptance
- Confirmation email (optional)

**Location:** `src/app/component/Register.jsx`

#### UserDashboard
- User's booking history
- Current bookings
- Booking status tracking
- Review section
- Profile quick access

**Location:** `src/app/component/UserDashboard.jsx`

#### UserProfile
- User information display
- Edit profile form
- Change password
- Booking history
- Contact information

**Location:** `src/app/component/UserProfile.jsx`

#### Admin
- Admin dashboard
- Booking management
- Service management
- Payment monitoring
- Analytics & reports

**Location:** `src/app/component/Admin.jsx`

#### NearbyStores
- Store locations map
- Store listings
- Operating hours
- Contact information
- Distance calculation

**Location:** `src/app/component/NearbyStores.jsx`

#### ReviewSection
- Customer reviews display
- Rating stars
- Add new review form
- Review filtering

**Location:** `src/app/component/ReviewSection.jsx`

## 🔐 Authentication Flow

### Registration Process
```
User Registration Form
        ↓
Validate Input (email, password, phone)
        ↓
Hash Password (bcryptjs)
        ↓
Create User in Database
        ↓
Return Success Message
        ↓
Redirect to Login
```

### Login Process
```
User Login Form
        ↓
Find User by Email
        ↓
Compare Password Hash
        ↓
Generate JWT Token
        ↓
Store Token in localStorage
        ↓
Redirect to Dashboard
```

### Protected Routes
- `/dashboard` - Requires authentication
- `/book` - Requires authentication
- `/profile` - Requires authentication
- `/admin` - Requires admin role
- `/payment` - Requires authentication

**Implementation:**
- `useEffect` hook checks `localStorage.auth_user`
- If not authenticated, redirect to `/login`
- Token persists across sessions

## 💳 Payment Integration

### Razorpay Flow

```
User Clicks Pay
        ↓
Create Order via /api/payment/create
        ↓
Razorpay Modal Opens
        ↓
User Enters Card/UPI Details
        ↓
Payment Processing
        ↓
Razorpay Returns Payment ID + Signature
        ↓
Verify Signature via /api/payment/verify
        ↓
Update Booking Status
        ↓
Show Confirmation
```

### Key Components

**Payment Gateway Integration:**
- Razorpay SDK loaded in `page.jsx`
- Payment form with customer details
- Secure signature verification
- Error handling and retry logic

**Order Creation:**
1. Amount converted to paise (₹399 → 39900)
2. Order created with metadata
3. Payment record saved to database
4. Order ID returned to frontend

**Signature Verification:**
1. HMAC-SHA256 signature generated
2. Compared with Razorpay signature
3. If match: payment successful
4. If no match: payment failed

## 🚀 Deployment Guide

### Deployment on Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Import project

3. **Set Environment Variables**
   - In Vercel dashboard: Settings → Environment Variables
   - Add all variables from `.env.local`:
     - MONGO_URI
     - RAZOR_KEY_ID
     - RAZOR_KEY_SECRET
     - JWT_SECRET

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Access your live application

### Manual Deployment on Server

1. **SSH into Server**
```bash
ssh user@your-server-ip
```

2. **Clone Repository**
```bash
git clone your-repo-url
cd CarWash
```

3. **Install Dependencies**
```bash
npm install --production
npm run build
```

4. **Set Environment Variables**
```bash
nano .env.local
# Add all environment variables
```

5. **Start Application**
```bash
npm start
# Or use PM2
pm2 start npm --name "carwash" -- start
```

6. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **SSL Certificate (Let's Encrypt)**
```bash
certbot --nginx -d yourdomain.com
```

## 📝 Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Files
- `src/app/__tests__/auth-utils.test.js` - Authentication utilities
- `src/app/__tests__/utils.test.js` - General utilities
- Component tests in `__tests__` directories

## 🐛 Troubleshooting

### Issue: .env variables not loading
**Solution:** Make sure `.env.local` is in the root directory and restart dev server

### Issue: Database connection fails
**Solution:** Check MONGO_URI is correct and IP whitelist includes your IP

### Issue: Payment failing with signature error
**Solution:** Verify RAZOR_KEY_SECRET is correct (check for extra spaces)

### Issue: Authentication not persisting
**Solution:** Check if localStorage is enabled in browser

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Razorpay Integration Guide](https://razorpay.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created by: Ravi Mahto

## 📞 Support

For support, email: krravi073@gmail.com.com

---

**Last Updated:** January 21, 2026
