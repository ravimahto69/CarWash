# API Documentation - WashHub

Complete reference guide for all API endpoints in the WashHub application.

## Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

Most endpoints require authentication via JWT token stored in `localStorage`.

**Token Storage:**
```javascript
localStorage.setItem('auth_user', JSON.stringify({
  _id: 'user_id',
  email: 'user@example.com',
  token: 'jwt_token_here'
}));
```

---

## 📋 User Management

### Register User
Creates a new user account.

**Endpoint:** `POST /register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "9876543210"
}
```

**Request Validation:**
- `name`: Required, string, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `phone`: Required, valid phone number

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "bookingCount": 0,
    "createdAt": "2026-01-21T10:00:00Z",
    "updatedAt": "2026-01-21T10:00:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

**Error Codes:**
- `400`: Missing fields, invalid email format, email already exists
- `500`: Server error during registration

---

### Login User
Authenticates user and returns JWT token.

**Endpoint:** `POST /login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isAdmin": false
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Error Codes:**
- `400`: Missing email or password
- `401`: Invalid credentials
- `404`: User not found
- `500`: Server error

---

## 🚗 Bookings

### Create Booking
Creates a new car wash booking.

**Endpoint:** `POST /booking`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token} (optional)
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "brand": "Mahindra",
  "model": "Scorpio",
  "vehicleType": "SUV",
  "service": "Basic Wash - 300",
  "amount": 300,
  "date": "2026-01-25",
  "time": "14:30",
  "location": "Downtown Store",
  "notes": "Extra interior cleaning"
}
```

**Request Validation:**
- `name`: Required
- `phone`: Required
- `email`: Required, valid email
- `brand`: Required (vehicle brand)
- `model`: Required (vehicle model)
- `vehicleType`: Required (SUV, Sedan, Bike, Truck, etc.)
- `service`: Required
- `amount`: Optional (defaults to 0)
- `date`, `time`, `location`, `notes`: Optional

**Success Response (201 Created):**
```json
{
  "success": true,
  "bookingId": "507f1f77bcf86cd799439012",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "email": "john@example.com",
    "service": "Basic Wash - 300",
    "amount": 300,
    "bookingStatus": "pending",
    "createdAt": "2026-01-21T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing required fields: brand, model"
}
```

**Error Codes:**
- `400`: Missing required fields
- `500`: Database error

---

### Get Booking by ID
Retrieves details of a specific booking.

**Endpoint:** `GET /booking?id={bookingId}`

**Query Parameters:**
- `id`: Required, booking ObjectId

**Headers:**
```
Authorization: Bearer {token} (optional)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john@example.com",
    "brand": "Mahindra",
    "model": "Scorpio",
    "vehicleType": "SUV",
    "service": "Basic Wash - 300",
    "amount": 300,
    "bookingStatus": "pending",
    "date": "2026-01-25",
    "time": "14:30",
    "location": "Downtown Store",
    "notes": "Extra interior cleaning",
    "createdAt": "2026-01-21T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing booking id"
}
```

**Error Codes:**
- `400`: Missing booking ID
- `404`: Booking not found
- `500`: Server error

---

### Get User Bookings
Retrieves all bookings for a specific user.

**Endpoint:** `GET /booking/user/{userEmail}`

**Path Parameters:**
- `userEmail`: User's email address

**Headers:**
```
Authorization: Bearer {token} (optional)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "service": "Basic Wash",
      "amount": 300,
      "bookingStatus": "completed",
      "createdAt": "2026-01-20T10:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "John Doe",
      "service": "Premium Wash",
      "amount": 500,
      "bookingStatus": "pending",
      "createdAt": "2026-01-21T10:30:00Z"
    }
  ]
}
```

---

### Get All Bookings (Admin)
Retrieves all bookings in the system.

**Endpoint:** `GET /booking/all`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "service": "Basic Wash",
      "amount": 300,
      "bookingStatus": "pending",
      "createdAt": "2026-01-21T10:30:00Z"
    }
  ],
  "total": 150,
  "pending": 45,
  "completed": 100,
  "cancelled": 5
}
```

---

### Update Booking Status (Admin)
Updates the status of a booking.

**Endpoint:** `PUT /booking/{bookingId}`

**Path Parameters:**
- `bookingId`: Booking ObjectId

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "bookingStatus": "completed"
}
```

**Valid Status Values:**
- `pending` - Initial status
- `paid` - Payment received
- `completed` - Service completed
- `cancelled` - Booking cancelled

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "bookingStatus": "completed",
    "updatedAt": "2026-01-21T14:30:00Z"
  }
}
```

---

### Cancel Booking
Cancels an existing booking.

**Endpoint:** `DELETE /booking/{bookingId}`

**Path Parameters:**
- `bookingId`: Booking ObjectId

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "bookingStatus": "cancelled"
  }
}
```

---

## 💳 Payments

### Create Payment Order
Creates a Razorpay order for booking payment.

**Endpoint:** `POST /payment/create`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 299,
  "bookingId": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "serviceType": "Basic Wash"
}
```

**Request Validation:**
- `amount`: Required, number > 0
- `bookingId`: Required, valid ObjectId
- `userId`: Required, valid ObjectId
- `customerEmail`: Required, valid email
- `customerName`, `customerPhone`, `serviceType`: Optional

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "orderId": "order_KR62JP5QL7ZJQP",
    "amount": 29900,
    "currency": "INR",
    "paymentId": "507f1f77bcf86cd799439014",
    "keyId": "rzp_test_XXXXXXX"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

**Error Codes:**
- `400`: Missing required fields
- `500`: Razorpay API error

---

### Verify Payment
Verifies Razorpay payment signature and updates booking.

**Endpoint:** `POST /payment/verify`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpayPaymentId": "pay_KR62JP5QL7ZJQP",
  "razorpayOrderId": "order_KR62JP5QL7ZJQP",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "507f1f77bcf86cd799439014",
    "transactionId": "pay_KR62JP5QL7ZJQP",
    "amount": 299,
    "status": "completed"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Payment verification failed"
}
```

**Error Codes:**
- `400`: Missing fields, signature verification failed
- `404`: Payment record not found
- `500`: Server error

**Post-Verification Actions:**
- Payment status updated to "completed"
- Booking status updated to "confirmed"
- User receives confirmation email

---

### Get Payment Details
Retrieves payment information for a booking.

**Endpoint:** `GET /payment/details?bookingId={bookingId}`

**Query Parameters:**
- `bookingId`: Booking ObjectId

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "amount": 299,
    "status": "completed",
    "razorpayPaymentId": "pay_KR62JP5QL7ZJQP",
    "transactionId": "pay_KR62JP5QL7ZJQP",
    "createdAt": "2026-01-21T11:00:00Z"
  }
}
```

---

## 🧹 Services

### Get All Services
Retrieves list of all available services.

**Endpoint:** `GET /services`

**Query Parameters (Optional):**
- `vehicleType`: Filter by vehicle type (e.g., "SUV", "Sedan")
- `limit`: Number of results (default: 50)
- `skip`: Skip results (pagination, default: 0)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Basic Wash",
      "description": "Water rinse + shampoo",
      "prices": {
        "Sedan": 149,
        "SUV": 199,
        "Bike": 99,
        "Truck": 299
      },
      "createdAt": "2026-01-01T00:00:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Premium Wash",
      "description": "Complete exterior + interior cleaning",
      "prices": {
        "Sedan": 499,
        "SUV": 699,
        "Bike": 399,
        "Truck": 899
      },
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 8,
  "limit": 50,
  "skip": 0
}
```

---

### Create Service (Admin)
Creates a new service.

**Endpoint:** `POST /services`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "Deluxe Wash",
  "description": "Full body wash with wax coating",
  "prices": {
    "Sedan": 799,
    "SUV": 999,
    "Bike": 699,
    "Truck": 1299
  }
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Deluxe Wash",
    "description": "Full body wash with wax coating",
    "prices": {
      "Sedan": 799,
      "SUV": 999,
      "Bike": 699,
      "Truck": 1299
    },
    "createdAt": "2026-01-21T12:00:00Z"
  }
}
```

---

### Update Service (Admin)
Updates an existing service.

**Endpoint:** `PUT /services/{serviceId}`

**Path Parameters:**
- `serviceId`: Service ObjectId

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "Deluxe Wash",
  "description": "Full body wash with wax coating and air dry",
  "prices": {
    "Sedan": 899,
    "SUV": 1099,
    "Bike": 799,
    "Truck": 1399
  }
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Service updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Deluxe Wash",
    "updatedAt": "2026-01-21T12:30:00Z"
  }
}
```

---

### Delete Service (Admin)
Deletes a service.

**Endpoint:** `DELETE /services/{serviceId}`

**Path Parameters:**
- `serviceId`: Service ObjectId

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## ⭐ Reviews

### Add Review
Creates a new review for a service.

**Endpoint:** `POST /reviews`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Excellent service! The staff was very professional.",
  "serviceType": "Basic Wash"
}
```

**Request Validation:**
- `bookingId`: Required, valid ObjectId
- `userId`: Required, valid ObjectId
- `rating`: Required, number between 1-5
- `comment`: Optional, string max 500 characters
- `serviceType`: Optional, string

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439021",
    "rating": 5,
    "comment": "Excellent service! The staff was very professional.",
    "serviceType": "Basic Wash",
    "createdAt": "2026-01-21T12:45:00Z"
  }
}
```

---

### Get All Reviews
Retrieves all reviews.

**Endpoint:** `GET /reviews`

**Query Parameters (Optional):**
- `serviceType`: Filter by service type
- `minRating`: Filter by minimum rating
- `limit`: Number of results (default: 50)
- `skip`: Pagination (default: 0)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "rating": 5,
      "comment": "Excellent service!",
      "serviceType": "Basic Wash",
      "createdAt": "2026-01-21T12:45:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439022",
      "rating": 4,
      "comment": "Good service, could be faster",
      "serviceType": "Premium Wash",
      "createdAt": "2026-01-20T10:30:00Z"
    }
  ],
  "total": 145,
  "averageRating": 4.6,
  "limit": 50,
  "skip": 0
}
```

---

## 📍 Stores

### Get All Stores
Retrieves list of all car wash stores.

**Endpoint:** `GET /stores`

**Query Parameters (Optional):**
- `city`: Filter by city
- `limit`: Number of results (default: 50)
- `skip`: Pagination (default: 0)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439025",
      "name": "Downtown Wash Center",
      "address": "123 Main Street",
      "city": "New York",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "phone": "555-0123",
      "email": "downtown@washhub.com",
      "hours": "Mon-Sun: 8AM-8PM",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "total": 12
}
```

---

### Create Store (Admin)
Creates a new store location.

**Endpoint:** `POST /stores`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "Midtown Wash Center",
  "address": "456 Park Avenue",
  "city": "New York",
  "latitude": 40.7500,
  "longitude": -73.9900,
  "phone": "555-0456",
  "email": "midtown@washhub.com",
  "hours": "Mon-Sun: 7AM-9PM"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Store created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439026",
    "name": "Midtown Wash Center",
    "city": "New York",
    "createdAt": "2026-01-21T13:00:00Z"
  }
}
```

---

## 💬 Contact

### Submit Contact Form
Submits a contact message.

**Endpoint:** `POST /contact`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "subject": "Service Inquiry",
  "message": "I want to know about your enterprise packages."
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-21T13:15:00Z"
  }
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request**
```json
{
  "success": false,
  "error": "Invalid request format or missing required fields"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Authentication required or invalid token"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "You don't have permission to access this resource"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error. Please try again later."
}
```

---

## Rate Limiting

API has the following rate limits:

- **Authenticated Users:** 100 requests/minute
- **Unauthenticated Users:** 20 requests/minute
- **Payment Endpoints:** 10 requests/minute

---

## Pagination

For endpoints that return lists, use pagination:

```
GET /api/bookings?limit=10&skip=20
```

- `limit`: Maximum 100 results per page (default: 50)
- `skip`: Number of results to skip (default: 0)

**Pagination Response:**
```json
{
  "success": true,
  "data": [...],
  "total": 250,
  "limit": 10,
  "skip": 20,
  "pages": 25
}
```

---

**Last Updated:** January 21, 2026
