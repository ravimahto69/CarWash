# 🚗 WashHub - Car Wash Booking System

<div align="center">

![WashHub](https://img.shields.io/badge/WashHub-Car%20Wash%20Booking-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black)
![React](https://img.shields.io/badge/React-18-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC)

**A comprehensive car wash booking and management system built with Next.js and MongoDB**

[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Installation](#-installation) •
[Usage](#-usage) •
[API Documentation](#-api-documentation) •
[Contributing](#-contributing)

</div>

---

## 📖 Overview

**WashHub** is a modern, full-stack web application designed for car wash businesses to manage their operations efficiently. It provides a seamless booking experience for customers and powerful management tools for administrators. The platform supports multiple vehicle types (bikes, hatchbacks, sedans, SUVs, EVs, luxury cars) and offers various service packages including foam wash, interior spa, ceramic prep, and luxury detailing.

### Key Highlights

- 🎯 **Multi-Vehicle Support**: Services for bikes, cars, SUVs, EVs, and luxury vehicles
- 📍 **Location-Based Services**: Find nearby car wash centers with geospatial queries
- 💳 **Integrated Payments**: Razorpay payment gateway integration
- 👥 **User Management**: Role-based access control (User/Admin)
- 📊 **Admin Dashboard**: Complete booking and service management
- 🌙 **Dark Mode**: Full dark mode support with theme context
- 📱 **Responsive Design**: Mobile-first, responsive UI using Ant Design
- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- ⭐ **Review System**: Customer reviews and ratings for bookings
- 🧪 **Test Coverage**: Comprehensive Jest test suite

---

## ✨ Features

### For Customers

#### 🏠 Home Page
- Browse signature service packages with detailed descriptions
- View popular quick picks with pricing
- Discover nearest washing centers with location details
- Responsive hero section with service highlights

#### 🔐 Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password encryption using bcrypt
- Role-based authorization (User/Admin)

#### 🛒 Booking Services
- Select from various service packages
- Choose vehicle type (bike, hatchback, sedan, SUV, luxury, pickup, truck, EV)
- Schedule booking with date and time
- Add location and special notes
- Real-time price calculation based on vehicle type

#### 💳 Payment Integration
- Razorpay payment gateway integration
- Create payment orders
- Secure payment verification
- Payment link generation
- View payment details and transaction history

#### 👤 User Profile
- Update personal information
- Manage multiple addresses (home, work, other)
- Store payment methods (credit card, debit card, UPI, wallet)
- View booking history
- Set notification preferences
- View and edit profile picture

#### ⭐ Reviews & Ratings
- Submit reviews for completed bookings
- Rate service quality
- View reviews from other customers

#### 📍 Location Services
- Find nearby car wash stores
- Geospatial queries based on user location
- Search stores by city or area
- View store details (address, phone, hours, facilities)
- Get directions via Google Maps integration

### For Administrators

#### 📊 Admin Dashboard
- View all bookings with status tracking
- Filter bookings by status (pending, paid, completed, cancelled)
- Manage booking lifecycle
- Access detailed booking information
- Export and print booking reports

#### 🏢 Store Management
- Add/Edit/Delete washing centers
- Set store location with coordinates
- Manage operating hours
- Define capacity and queue management
- Add store facilities (parking, WiFi, waiting area, etc.)
- Upload store photos

#### 🧽 Service Management
- Create and manage service packages
- Set pricing for different vehicle types
- Define service duration
- Add service descriptions
- Activate/Deactivate services
- Tag services with vehicle compatibility

#### 📧 Contact Management
- View and respond to customer inquiries
- Track contact form submissions
- Customer support ticket system

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 14.2.35](https://nextjs.org/) - React framework with App Router
- **UI Library**: [React 18](https://react.dev/) - JavaScript library for building user interfaces
- **Component Library**: [Ant Design](https://ant.design/) - Enterprise-class UI components
- **Styling**: [TailwindCSS 3.4.1](https://tailwindcss.com/) - Utility-first CSS framework
- **Icons**: [@ant-design/icons](https://ant.design/components/icon/) - Icon component library
- **State Management**: React Context API (ThemeContext for dark mode)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime
- **API Routes**: Next.js API Routes - Serverless API endpoints
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL document database
- **ODM**: [Mongoose 9.1.4](https://mongoosejs.com/) - MongoDB object modeling

### Authentication & Security
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) - Token-based authentication
- **Password Hashing**: [bcryptjs 3.0.3](https://github.com/dcodeIO/bcrypt.js) - Password encryption
- **Token Library**: [jsonwebtoken 9.0.3](https://github.com/auth0/node-jsonwebtoken)

### Payment
- **Payment Gateway**: [Razorpay 2.9.6](https://razorpay.com/) - Payment processing

### Testing
- **Test Framework**: [Jest 29.7.0](https://jestjs.io/) - JavaScript testing framework
- **Testing Library**: [@testing-library/react 14.1.2](https://testing-library.com/) - React component testing
- **DOM Testing**: [@testing-library/jest-dom 6.1.5](https://github.com/testing-library/jest-dom)
- **User Event**: [@testing-library/user-event 14.5.1](https://github.com/testing-library/user-event)
- **Mocking**: [jest-mock-extended 3.0.5](https://github.com/marchaos/jest-mock-extended)
- **Environment**: [jest-environment-jsdom 29.7.0](https://jestjs.io/docs/configuration#testenvironment-string)

### Development Tools
- **Code Quality**: [ESLint 8](https://eslint.org/) - JavaScript linter
- **Build Tool**: [PostCSS 8](https://postcss.org/) - CSS transformation tool
- **Package Manager**: npm - Node package manager

---

## 📁 Project Structure

```
CarWash/
├── src/
│   └── app/
│       ├── __tests__/              # Test files
│       ├── admin/                  # Admin dashboard pages
│       │   ├── bookings/          # Admin booking management
│       │   └── page.js            # Admin home page
│       ├── api/                    # API routes
│       │   ├── admin/             # Admin-specific endpoints
│       │   │   └── bookings/      # Admin booking routes
│       │   ├── booking/           # Booking endpoints
│       │   ├── contact/           # Contact form endpoints
│       │   ├── login/             # Authentication login
│       │   ├── payment/           # Payment processing
│       │   │   ├── create/        # Create payment order
│       │   │   ├── details/       # Payment details
│       │   │   ├── link/          # Payment link generation
│       │   │   └── verify/        # Payment verification
│       │   ├── register/          # User registration
│       │   ├── reviews/           # Review management
│       │   │   └── booking/       # Booking-specific reviews
│       │   ├── services/          # Service management
│       │   │   ├── seed/          # Seed sample services
│       │   │   └── [id]/          # Individual service routes
│       │   ├── stores/            # Store management
│       │   │   ├── nearby/        # Find nearby stores
│       │   │   │   └── __tests__/ # Store API tests
│       │   │   ├── search/        # Store search
│       │   │   └── seed/          # Seed sample stores
│       │   └── user/              # User-specific endpoints
│       │       ├── addresses/     # User address management
│       │       ├── bookings/      # User booking history
│       │       ├── payment-methods/ # User payment methods
│       │       └── profile/       # User profile management
│       ├── book/                  # Booking page
│       ├── booking-confirmation/  # Booking confirmation page
│       ├── component/             # Reusable components
│       │   ├── __tests__/         # Component tests
│       │   ├── Footer.jsx         # Footer component
│       │   ├── Header.jsx         # Header component
│       │   ├── Home.jsx           # Home page component
│       │   └── ...                # Other components
│       ├── contact/               # Contact page
│       ├── context/               # React Context providers
│       │   └── ThemeContext.js    # Theme (dark mode) context
│       ├── dashboard/             # User dashboard
│       ├── lib/                   # Utility libraries
│       │   └── db.js              # Database connection
│       ├── login/                 # Login page
│       ├── models/                # Mongoose schemas
│       │   ├── __tests__/         # Schema tests
│       │   ├── Booking.js         # Booking model
│       │   ├── Contact.js         # Contact model
│       │   ├── Payment.js         # Payment model
│       │   ├── Review.js          # Review model
│       │   ├── Service.js         # Service model
│       │   ├── Store.js           # Store model
│       │   └── User.js            # User model
│       ├── nearby-stores/         # Nearby stores page
│       ├── payment/               # Payment pages
│       ├── profile/               # User profile page
│       ├── register/              # Registration page
│       ├── services/              # Services listing/detail pages
│       │   └── [id]/              # Individual service page
│       ├── fonts/                 # Custom fonts
│       ├── favicon.ico            # Favicon
│       ├── globals.css            # Global styles
│       ├── layout.js              # Root layout component
│       ├── page.js                # Home page
│       └── print-styles.css       # Print-specific styles
├── .eslintrc.json                 # ESLint configuration
├── .gitignore                     # Git ignore rules
├── jest.config.js                 # Jest configuration
├── jest.setup.js                  # Jest setup file
├── jsconfig.json                  # JavaScript configuration
├── next.config.mjs                # Next.js configuration
├── package.json                   # Project dependencies
├── package-lock.json              # Dependency lock file
├── postcss.config.mjs             # PostCSS configuration
├── tailwind.config.js             # TailwindCSS configuration
└── README.md                      # Project documentation
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/ravimahto69/CarWash.git
cd CarWash
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js and React
- MongoDB and Mongoose
- Ant Design components
- TailwindCSS
- JWT and bcrypt for authentication
- Razorpay SDK
- Jest and testing libraries
- And all other dependencies

### Step 3: Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
# MongoDB Configuration
MONGO_DB_URL=mongodb://localhost:27017/carwash
# For MongoDB Atlas, use: mongodb+srv://<username>:<password>@cluster.mongodb.net/carwash

# JWT Secret for Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production

# Razorpay Payment Gateway Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Application URL (for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- **Never commit the `.env` file to version control**
- Use strong, unique values for `JWT_SECRET`
- Get Razorpay credentials from [Razorpay Dashboard](https://dashboard.razorpay.com/)

### Step 4: Database Setup

#### Option A: Local MongoDB

1. Start MongoDB service:
   ```bash
   # On macOS/Linux
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

2. Verify MongoDB is running:
   ```bash
   mongosh
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to `.env` as `MONGO_DB_URL`

### Step 5: Seed Sample Data (Optional)

Seed the database with sample stores and services:

```bash
# Seed sample stores
curl -X POST http://localhost:3000/api/stores/seed

# Seed sample services
curl -X POST http://localhost:3000/api/services/seed
```

Or visit these URLs in your browser after starting the development server.

---

## 💻 Usage

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Code Quality

Run ESLint to check code quality:

```bash
npm run lint
```

### Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Test files are located in:
- `src/app/component/__tests__/` - Component tests
- `src/app/models/__tests__/` - Model/Schema tests
- `src/app/api/stores/nearby/__tests__/` - API route tests

---

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,              // Required, trimmed
  email: String,             // Required, unique, lowercase
  password: String,          // Required, min 6 chars, hashed
  role: String,              // 'user' or 'admin', default: 'user'
  phone: String,             // Optional
  profilePicture: String,    // Optional URL
  bio: String,               // Max 500 characters
  addresses: [{              // Array of addresses
    label: String,           // 'home', 'work', 'other'
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean,
    createdAt: Date
  }],
  paymentMethods: [{         // Array of payment methods
    type: String,            // 'credit_card', 'debit_card', 'upi', 'wallet'
    cardNumber: String,      // Last 4 digits only
    cardHolder: String,
    expiryMonth: String,
    expiryYear: String,
    cardBrand: String,
    upiId: String,
    walletProvider: String,
    walletId: String,
    isDefault: Boolean,
    isActive: Boolean,
    createdAt: Date
  }],
  preferences: {
    emailNotifications: Boolean,
    smsNotifications: Boolean,
    marketingEmails: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model

```javascript
{
  name: String,              // Required
  phone: String,             // Required
  email: String,             // Required
  brand: String,             // Car brand, required
  model: String,             // Car model, required
  vehicleType: String,       // Required (bike, hatchback, sedan, etc.)
  service: String,           // Service name, required
  amount: Number,            // Price, default: 0
  bookingStatus: String,     // 'pending', 'paid', 'completed', 'cancelled'
  date: String,              // Booking date
  time: String,              // Booking time
  location: String,          // Service location
  notes: String,             // Additional notes
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model

```javascript
{
  name: String,              // Required
  description: String,       // Service description
  price: Number,             // Legacy single price (min: 0)
  prices: {                  // Per-vehicle pricing
    bike: Number,
    hatchback: Number,
    sedan: Number,
    suv: Number,
    luxury: Number,
    pickup: Number,
    truck: Number,
    ev: Number,
    any: Number
  },
  durationMin: Number,       // Service duration in minutes
  vehicleTags: [String],     // Compatible vehicle types
  isActive: Boolean,         // Service availability
  createdAt: Date,
  updatedAt: Date
}
```

### Store Model

```javascript
{
  name: String,              // Required
  description: String,
  address: String,           // Required
  city: String,
  state: String,
  zip: String,
  country: String,           // Default: 'India'
  phone: String,
  email: String,
  website: String,
  location: {                // GeoJSON for geospatial queries
    type: String,            // 'Point'
    coordinates: [Number]    // [longitude, latitude]
  },
  latitude: Number,          // Legacy (synced from location)
  longitude: Number,         // Legacy (synced from location)
  services: [{
    name: String,
    price: Number,
    duration: Number         // Minutes
  }],
  photos: [String],          // Array of photo URLs
  rating: Number,            // 0-5, default: 0
  reviewCount: Number,       // Default: 0
  hours: {                   // Operating hours
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    // ... other days
  },
  capacity: Number,          // Default: 5
  currentQueue: Number,      // Default: 0
  estimatedWaitTime: Number, // Minutes, default: 0
  facilities: {
    hasParking: Boolean,
    hasWaitingArea: Boolean,
    hasRestroom: Boolean,
    hasWifi: Boolean,
    hasRefreshments: Boolean
  },
  isActive: Boolean,         // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Model

```javascript
{
  bookingId: ObjectId,       // Reference to Booking
  userId: ObjectId,          // Reference to User
  orderId: String,           // Razorpay order ID
  paymentId: String,         // Razorpay payment ID
  signature: String,         // Payment signature for verification
  amount: Number,            // Payment amount
  currency: String,          // Default: 'INR'
  status: String,            // 'pending', 'completed', 'failed'
  method: String,            // Payment method used
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model

```javascript
{
  bookingId: ObjectId,       // Reference to Booking
  userId: ObjectId,          // Reference to User
  rating: Number,            // 1-5 stars
  comment: String,           // Review text
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Model

```javascript
{
  name: String,              // Required
  email: String,             // Required
  phone: String,
  subject: String,
  message: String,           // Required
  status: String,            // 'new', 'read', 'replied'
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/booking
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "John Doe",
  "phone": "+91-9876543210",
  "email": "john@example.com",
  "brand": "Toyota",
  "model": "Camry",
  "vehicleType": "sedan",
  "service": "Premium Wash",
  "amount": 599,
  "date": "2024-01-25",
  "time": "10:00 AM",
  "location": "123 Main St, City",
  "notes": "Please call before arrival"
}
```

#### Get User Bookings
```http
GET /api/user/bookings
Authorization: Bearer {token}
```

#### Get All Bookings (Admin)
```http
GET /api/admin/bookings
Authorization: Bearer {token}
```

### Service Endpoints

#### Get All Services
```http
GET /api/services
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "service_id",
      "name": "Premium Wash",
      "description": "Complete exterior and interior cleaning",
      "prices": {
        "bike": 199,
        "hatchback": 399,
        "sedan": 599,
        "suv": 899
      },
      "durationMin": 45,
      "isActive": true
    }
  ]
}
```

#### Get Service by ID
```http
GET /api/services/{id}
```

#### Seed Sample Services
```http
POST /api/services/seed
```

### Store Endpoints

#### Get All Stores
```http
GET /api/stores
```

#### Search Stores
```http
GET /api/stores/search?query=downtown
```

#### Find Nearby Stores
```http
GET /api/stores/nearby?lat=28.6139&lng=77.2090&maxDistance=5000
```

**Parameters:**
- `lat` - Latitude (required)
- `lng` - Longitude (required)
- `maxDistance` - Maximum distance in meters (default: 5000)

#### Seed Sample Stores
```http
POST /api/stores/seed
```

### Payment Endpoints

#### Create Payment Order
```http
POST /api/payment/create
Content-Type: application/json
Authorization: Bearer {token}

{
  "amount": 599,
  "bookingId": "booking_id"
}
```

#### Verify Payment
```http
POST /api/payment/verify
Content-Type: application/json
Authorization: Bearer {token}

{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

#### Get Payment Details
```http
GET /api/payment/details?bookingId={booking_id}
Authorization: Bearer {token}
```

### User Profile Endpoints

#### Get Profile
```http
GET /api/user/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/user/profile
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "John Doe Updated",
  "phone": "+91-9876543210",
  "bio": "Car enthusiast"
}
```

#### Get Addresses
```http
GET /api/user/addresses
Authorization: Bearer {token}
```

#### Add Address
```http
POST /api/user/addresses
Content-Type: application/json
Authorization: Bearer {token}

{
  "label": "home",
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India",
  "isDefault": true
}
```

#### Get Payment Methods
```http
GET /api/user/payment-methods
Authorization: Bearer {token}
```

### Review Endpoints

#### Create Review
```http
POST /api/reviews
Content-Type: application/json
Authorization: Bearer {token}

{
  "bookingId": "booking_id",
  "rating": 5,
  "comment": "Excellent service!"
}
```

#### Get Reviews for Booking
```http
GET /api/reviews/booking/{bookingId}
```

### Contact Endpoints

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "subject": "Inquiry",
  "message": "I have a question about your services"
}
```

---

## 🎨 Frontend Pages

### Public Pages

1. **Home (`/`)** - Landing page with services and nearby stores
2. **Services (`/services`)** - Browse all available services
3. **Service Detail (`/services/[id]`)** - Detailed service information
4. **Login (`/login`)** - User authentication
5. **Register (`/register`)** - New user registration
6. **Contact (`/contact`)** - Contact form
7. **Nearby Stores (`/nearby-stores`)** - Find stores near you

### Protected Pages (Require Login)

1. **Dashboard (`/dashboard`)** - User dashboard
2. **Book Service (`/book`)** - Create new booking
3. **Profile (`/profile`)** - User profile management
4. **Booking Confirmation (`/booking-confirmation`)** - Booking success page
5. **Payment (`/payment`)** - Payment processing pages

### Admin Pages (Require Admin Role)

1. **Admin Dashboard (`/admin`)** - Admin overview
2. **Manage Bookings (`/admin/bookings`)** - View and manage all bookings

---

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication:

1. **User Registration**: Password is hashed using bcrypt before storing
2. **Login**: Credentials are verified and a JWT token is issued
3. **Token Storage**: Client stores the token (typically in localStorage or cookies)
4. **Protected Routes**: API routes verify the token in the Authorization header
5. **Role-Based Access**: Admin routes check for `role: 'admin'` in the token payload

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💳 Payment Integration

The application uses Razorpay for payment processing:

### Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get API keys from the dashboard
3. Add keys to `.env` file
4. The payment flow:
   - Client creates an order via `/api/payment/create`
   - Razorpay checkout opens with order details
   - User completes payment
   - Payment is verified via `/api/payment/verify`
   - Booking status is updated to 'paid'

### Test Cards (Test Mode)

Use these test cards for development:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

---

## 🌍 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGO_DB_URL` | MongoDB connection string | Yes | `mongodb://localhost:27017/carwash` |
| `JWT_SECRET` | Secret key for JWT signing | Yes | `your_super_secure_secret_key` |
| `RAZORPAY_KEY_ID` | Razorpay public key | Yes (for payments) | `rzp_test_xxxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | Yes (for payments) | `xxxxxxxxxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_APP_URL` | Application URL | No | `http://localhost:3000` |

---

## 🧪 Testing

The project includes comprehensive test coverage using Jest and React Testing Library.

### Test Structure

```
src/app/
├── component/__tests__/         # Component tests
│   ├── Login.test.js
│   └── NearbyStores.test.js
├── models/__tests__/            # Schema validation tests
│   └── schemas.test.js
└── api/stores/nearby/__tests__/ # API route tests
    └── route.test.js
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Coverage Report

After running `npm run test:coverage`, open `coverage/lcov-report/index.html` in a browser to view the detailed coverage report.

### Writing Tests

Example test structure:

```javascript
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   - Go to your project dashboard on Vercel
   - Navigate to Settings → Environment Variables
   - Add all variables from your `.env` file

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Deploy to Other Platforms

#### Railway

1. Create a new project on [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Add environment variables in the Railway dashboard
4. Deploy automatically on push

#### DigitalOcean App Platform

1. Create a new app on [DigitalOcean](https://www.digitalocean.com/products/app-platform)
2. Connect your repository
3. Configure build command: `npm run build`
4. Configure run command: `npm start`
5. Add environment variables

#### Self-Hosted (VPS/Server)

1. **Install Node.js and MongoDB** on your server

2. **Clone and setup**:
   ```bash
   git clone https://github.com/ravimahto69/CarWash.git
   cd CarWash
   npm install
   npm run build
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env
   nano .env  # Edit with your values
   ```

4. **Run with PM2** (process manager):
   ```bash
   npm install -g pm2
   pm2 start npm --name "carwash" -- start
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx as reverse proxy** (optional):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
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

---

## 🤝 Contributing

We welcome contributions to the WashHub project! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CarWash.git
   cd CarWash
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

5. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

7. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes
   - Submit the pull request

### Contribution Guidelines

- **Code Style**: Follow the existing code style and use ESLint
- **Commits**: Write clear, descriptive commit messages
- **Tests**: Add tests for new features and ensure all tests pass
- **Documentation**: Update README and other docs for significant changes
- **Issues**: Check existing issues before creating new ones
- **Pull Requests**: Keep PRs focused on a single feature or fix

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- ♿ Accessibility improvements
- 🌍 Internationalization (i18n)
- 🔒 Security enhancements

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Ravi Mahto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Authors & Acknowledgments

### Author
- **Ravi Mahto** - [@ravimahto69](https://github.com/ravimahto69)

### Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [MongoDB](https://www.mongodb.com/) - Database Platform
- [Ant Design](https://ant.design/) - UI Component Library
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [Razorpay](https://razorpay.com/) - Payment Gateway
- [Vercel](https://vercel.com/) - Deployment Platform

---

## 📞 Support & Contact

### Get Help

- 📧 **Email**: [Contact via GitHub](https://github.com/ravimahto69)
- 🐛 **Issues**: [GitHub Issues](https://github.com/ravimahto69/CarWash/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/ravimahto69/CarWash/discussions)

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Ant Design Components](https://ant.design/components/overview/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Mobile App** - React Native mobile application
- [ ] **SMS Notifications** - Booking reminders and updates
- [ ] **Email Notifications** - Automated email confirmations
- [ ] **Advanced Analytics** - Business intelligence dashboard
- [ ] **Loyalty Program** - Reward points and discounts
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Real-time Chat** - Customer support chat
- [ ] **Calendar Integration** - Google Calendar sync
- [ ] **Invoice Generation** - PDF invoice downloads
- [ ] **Subscription Plans** - Monthly service packages
- [ ] **Push Notifications** - Web push notifications
- [ ] **Social Login** - Google/Facebook authentication
- [ ] **Advanced Search** - Filters and sorting options
- [ ] **Image Upload** - Vehicle photos for bookings
- [ ] **Staff Management** - Employee scheduling and tracking

---

## 📊 Project Status

**Current Version**: 0.1.0

**Status**: 🚧 Active Development

This project is actively maintained and new features are being added regularly. Feel free to star ⭐ the repository to stay updated!

---

## 🙏 Thank You

Thank you for checking out WashHub! If you find this project useful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code
- 📢 Sharing with others

---

<div align="center">

**Built with ❤️ by [Ravi Mahto](https://github.com/ravimahto69)**

[⬆ Back to Top](#-washhub---car-wash-booking-system)

</div>
