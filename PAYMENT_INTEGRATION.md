# 💳 Payment Integration Documentation

## Overview

WashHub uses **Razorpay** as the payment gateway to handle secure online payments for car wash bookings. Razorpay is a leading payment solution in India with support for multiple payment methods (Credit/Debit Cards, UPI, Wallets, etc.).

---

## Table of Contents

1. [Setup & Installation](#setup--installation)
2. [Architecture](#architecture)
3. [API Routes](#api-routes)
4. [Database Schema](#database-schema)
5. [Frontend Components](#frontend-components)
6. [Payment Flow](#payment-flow)
7. [Testing](#testing)
8. [Environment Variables](#environment-variables)
9. [Troubleshooting](#troubleshooting)

---

## Setup & Installation

### 1. Install Razorpay Package

```bash
npm install razorpay
```

### 2. Create Razorpay Account

- Visit [razorpay.com](https://razorpay.com)
- Sign up and complete KYC
- Navigate to **Settings** > **API Keys**
- Copy your **Key ID** and **Key Secret**

### 3. Environment Variables

Add to `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** Use test keys for development, live keys for production.

---

## Architecture

### System Components

```
User Booking
    ↓
Payment Page (Frontend)
    ↓
Create Payment API → MongoDB (Payment Record)
    ↓
Razorpay Checkout SDK
    ↓
User Payment (Razorpay Gateway)
    ↓
Verify Payment API → Update Booking & Payment Status
    ↓
Booking Confirmation Page
```

---

## API Routes

### 1. **POST /api/payment/create**

Creates a new payment order in Razorpay.

**Request Body:**
```json
{
  "amount": 600,
  "bookingId": "65a2b1c3d4e5f6g7h8i9j0k1",
  "userId": "65a2b1c3d4e5f6g7h8i9j0k2",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "serviceType": "Premium Wash"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_12345abcde",
    "amount": 60000,
    "currency": "INR",
    "paymentId": "65a2b1c3d4e5f6g7h8i9j0k3",
    "keyId": "rzp_test_xxxxxxxxxxxxxxxx"
  }
}
```

**Status Codes:**
- `201` - Payment order created successfully
- `400` - Missing required fields
- `500` - Server error

---

### 2. **POST /api/payment/verify**

Verifies payment signature from Razorpay.

**Request Body:**
```json
{
  "razorpayPaymentId": "pay_12345abcde",
  "razorpayOrderId": "order_12345abcde",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "65a2b1c3d4e5f6g7h8i9j0k3",
    "transactionId": "pay_12345abcde",
    "amount": 600,
    "status": "completed"
  }
}
```

**Status Codes:**
- `200` - Payment verified successfully
- `400` - Signature verification failed
- `404` - Payment record not found
- `500` - Server error

---

### 3. **GET /api/payment/details**

Fetches payment details by ID.

**Query Parameters:**
- `id` - Payment ID (required)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65a2b1c3d4e5f6g7h8i9j0k3",
    "bookingId": "65a2b1c3d4e5f6g7h8i9j0k1",
    "userId": "65a2b1c3d4e5f6g7h8i9j0k2",
    "amount": 600,
    "currency": "INR",
    "razorpayOrderId": "order_12345abcde",
    "razorpayPaymentId": "pay_12345abcde",
    "status": "completed",
    "transactionId": "pay_12345abcde",
    "createdAt": "2024-01-18T10:30:00Z",
    "updatedAt": "2024-01-18T10:35:00Z"
  }
}
```

---

## Database Schema

### Payment Model

```javascript
{
  bookingId: ObjectId,           // Reference to Booking
  userId: ObjectId,               // Reference to User
  amount: Number,                 // Amount in INR
  currency: String,               // Default: 'INR'
  razorpayOrderId: String,       // Unique Razorpay Order ID
  razorpayPaymentId: String,     // Razorpay Payment ID (after payment)
  razorpaySignature: String,     // Signature for verification
  status: String,                 // 'pending' | 'completed' | 'failed' | 'cancelled'
  paymentMethod: String,          // Default: 'razorpay'
  transactionId: String,          // Payment ID (after successful payment)
  failureReason: String,          // Reason if payment fails
  metadata: {
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    serviceType: String,
    bookingDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Frontend Components

### 1. **Payment Component** (`src/app/component/Payment.jsx`)

Main payment page where users enter details and initiate payment.

**Features:**
- Order summary display
- Customer information form
- Razorpay payment gateway integration
- Real-time payment status
- Error handling and user feedback

**Props/Query Parameters:**
- `bookingId` - Booking ID
- `amount` - Amount to pay (in INR)
- `service` - Service type

**Usage:**
```jsx
<Link href={`/payment?bookingId=${bookingId}&amount=${amount}&service=Premium Wash`}>
  <Button>Proceed to Payment</Button>
</Link>
```

---

### 2. **Booking Confirmation Component** (`src/app/component/BookingConfirmation.jsx`)

Displays booking confirmation after successful payment.

**Features:**
- Booking details display
- Payment information
- Customer information
- Print and download invoice options
- Next steps guidance

**Query Parameters:**
- `bookingId` - Booking ID
- `paymentId` - Payment ID

**Usage:**
```jsx
// Automatically navigates here after successful payment
// URL: /booking-confirmation?bookingId=xxx&paymentId=yyy
```

---

## Payment Flow

### Step-by-Step Process

```
1. User completes booking form
                ↓
2. User clicks "Proceed to Payment"
                ↓
3. Redirected to /payment page with booking details
                ↓
4. Payment Component displays order summary
                ↓
5. User fills in customer details (name, email, phone)
                ↓
6. User clicks "Pay ₹XXX"
                ↓
7. Frontend calls POST /api/payment/create
                ↓
8. Backend creates Razorpay order and saves payment record
                ↓
9. Razorpay Checkout SDK displays payment modal
                ↓
10. User selects payment method (Card/UPI/Wallet/etc.)
                ↓
11. User completes payment
                ↓
12. Payment handler receives success response
                ↓
13. Frontend calls POST /api/payment/verify
                ↓
14. Backend verifies signature and updates payment status
                ↓
15. Backend updates booking as "confirmed" and "paid"
                ↓
16. Redirect to /booking-confirmation page
                ↓
17. Display confirmation with option to print/download invoice
```

---

## Testing

### Razorpay Test Cards

Use these test cards in development mode:

| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| **Success** | 4111 1111 1111 1111 | 12/25 | 123 |
| **Failed** | 4444 3333 2222 1111 | 12/25 | 123 |

### Test UPI IDs

- **Success**: success@razorpay
- **Failed**: failed@razorpay

### Testing Steps

1. Go to `/payment?bookingId=test&amount=100&service=Test`
2. Fill in form details
3. Click "Pay ₹100"
4. Use test card/UPI credentials
5. Verify payment in Razorpay Dashboard

---

## Environment Variables

### Required

```env
# Razorpay API Credentials
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# Database
MONGODB_URI=your_mongodb_connection_string

# API Base URL (for production)
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### Optional

```env
# Email Configuration (for payment receipts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Settings
PAYMENT_TIMEOUT=300 # seconds
MAX_PAYMENT_AMOUNT=100000 # INR
```

---

## Troubleshooting

### Common Issues

#### 1. "RAZORPAY_KEY_ID is undefined"
**Solution:** Add environment variables to `.env.local` and restart server

```bash
# Restart development server
npm run dev
```

#### 2. "Signature verification failed"
**Possible Causes:**
- Using test key in production
- Signature calculation error
- Order ID/Payment ID mismatch

**Solution:**
```javascript
// Verify you're using correct secret
const keySecret = process.env.RAZORPAY_KEY_SECRET;
// Double-check order and payment IDs match
```

#### 3. "Payment record not found"
**Solution:** Ensure payment record is created before verification
```javascript
// Check database connection
await connectDB();
// Verify payment exists in DB
const payment = await Payment.findOne({ razorpayOrderId });
```

#### 4. "Razorpay script not loading"
**Solution:** Check browser console for network errors
```javascript
// Verify CDN URL is accessible
// https://checkout.razorpay.com/v1/checkout.js
```

---

## Security Best Practices

### ✅ Do's

- ✅ Always verify signature on backend
- ✅ Never expose KEY_SECRET to frontend
- ✅ Use HTTPS in production
- ✅ Validate amount on backend before payment
- ✅ Log all payment transactions
- ✅ Store payment records in database

### ❌ Don'ts

- ❌ Don't store sensitive payment data
- ❌ Don't verify payment on frontend only
- ❌ Don't log payment IDs in debug mode
- ❌ Don't trust client-side amount validation
- ❌ Don't expose API keys in code

---

## Advanced Features

### Email Receipts
Send payment receipts via email after successful payment:
```javascript
// In verify route after successful payment
await sendPaymentReceipt(payment, booking);
```

### Refunds
To process refunds:
```javascript
const razorpay = new Razorpay({ key_id, key_secret });
await razorpay.payments.refund(razorpayPaymentId, {
  amount: refundAmount * 100, // in paise
});
```

### Payment Analytics
Track payment metrics in admin dashboard:
- Total revenue
- Payment success rate
- Failed transactions
- Top payment methods

---

## Support & Resources

- [Razorpay API Documentation](https://razorpay.com/docs/)
- [Razorpay Test Cards](https://razorpay.com/docs/payments/payments/test-card-numbers/)
- [Razorpay Support](https://support.razorpay.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 18, 2024 | Initial payment integration |

---

**Last Updated:** January 18, 2024  
**Created by:** GitHub Copilot  
**Status:** ✅ Production Ready
