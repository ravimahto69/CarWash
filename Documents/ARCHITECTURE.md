# Architecture & Component Documentation - WashHub

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  (React Components, Next.js Pages, Dark Mode Context)  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS APP ROUTER                         │
│  (Pages, Layouts, File-based Routing)                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              API MIDDLEWARE LAYER                       │
│  (Authentication, Error Handling, Request Parsing)     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              API ROUTE HANDLERS                         │
│  (/api/booking, /api/payment, /api/services, etc.)    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│           BUSINESS LOGIC LAYER                          │
│  (Validation, Processing, Business Rules)              │
└────────────────┬────────────────────────────────────────┘
                 │
       ┌─────────┼─────────┐
       ▼         ▼         ▼
    ┌──────┐ ┌──────┐ ┌──────────┐
    │ DB   │ │Email │ │ Razorpay │
    │Mongo │ │Service   │ Gateway  │
    │ DB   │ │      │ │          │
    └──────┘ └──────┘ └──────────┘
```

---

## 📁 Project Directory Structure

### Source Code Organization

```
src/app/
├── api/                              # Backend API routes
│   ├── admin/
│   │   ├── route.js                  # Admin operations
│   │   └── bookings/
│   │       └── route.js              # Fetch admin bookings
│   ├── booking/
│   │   ├── route.js                  # Booking CRUD
│   │   ├── all/
│   │   │   └── route.js              # Get all bookings
│   │   ├── user/
│   │   │   └── [email]/
│   │   │       └── route.js          # Get user bookings
│   │   └── status/
│   │       └── route.js              # Update booking status
│   ├── contact/
│   │   └── route.js                  # Contact form submission
│   ├── payment/
│   │   ├── route.js                  # Base payment endpoint
│   │   ├── create/
│   │   │   └── route.js              # Create payment order
│   │   ├── verify/
│   │   │   └── route.js              # Verify payment signature
│   │   ├── details/
│   │   │   └── route.js              # Get payment info
│   │   └── link/
│   │       └── route.js              # Generate payment link
│   ├── reviews/
│   │   └── route.js                  # Reviews CRUD
│   ├── services/
│   │   ├── route.js                  # Services CRUD
│   │   └── [id]/
│   │       └── route.js              # Update specific service
│   ├── stores/
│   │   └── route.js                  # Stores management
│   ├── user/
│   │   └── route.js                  # User management
│   ├── login/
│   │   └── route.js                  # User login
│   ├── register/
│   │   └── route.js                  # User registration
│   └── email/
│       └── route.js                  # Email sending
│
├── component/                        # React components
│   ├── Admin.jsx                     # Admin dashboard
│   ├── Book.jsx                      # Booking form
│   ├── BookingConfirmation.jsx       # Confirmation page
│   ├── Contact.jsx                   # Contact form
│   ├── Dashboard.jsx                 # User dashboard
│   ├── Footer.jsx                    # Footer component
│   ├── Header.jsx                    # Header/Navigation
│   ├── Home.jsx                      # Home page
│   ├── Login.jsx                     # Login form
│   ├── NearbyStores.jsx              # Store locator
│   ├── Payment.jsx                   # Payment gateway
│   ├── Register.jsx                  # Registration form
│   ├── ReviewSection.jsx             # Reviews display
│   ├── Services.jsx                  # Services listing
│   ├── StoreCard.jsx                 # Individual store card
│   ├── Theme.jsx                     # Theme provider
│   ├── UserDashboard.jsx             # User dashboard content
│   ├── UserProfile.jsx               # User profile
│   └── __tests__/                    # Component tests
│
├── context/                          # React Context
│   └── ThemeContext.js               # Dark mode context
│
├── lib/                              # Utility functions
│   └── db.js                         # MongoDB connection
│
├── models/                           # MongoDB Schemas
│   ├── Booking.js                    # Booking model
│   ├── Contact.js                    # Contact form model
│   ├── Payment.js                    # Payment model
│   ├── Review.js                     # Review model
│   ├── Service.js                    # Service model
│   ├── Store.js                      # Store model
│   ├── User.js                       # User model
│   └── __tests__/                    # Model tests
│
├── admin/                            # Admin pages
│   ├── page.js                       # Admin dashboard page
│   └── bookings/
│       └── page.js                   # Bookings management
│
├── book/                             # Booking pages
│   ├── page.js                       # Server component
│   └── BookPageClient.jsx            # Client component
│
├── contact/                          # Contact pages
│   └── page.js                       # Contact form page
│
├── dashboard/                        # User dashboard
│   └── page.js                       # Dashboard page
│
├── login/                            # Authentication pages
│   └── page.js                       # Login page
│
├── register/                         # Registration
│   └── page.js                       # Register page
│
├── profile/                          # User profile
│   ├── page.js                       # Server component
│   └── ProfilePageClient.jsx         # Client component
│
├── payment/                          # Payment page
│   └── page.js                       # Payment processing
│
├── services/                         # Services page
│   └── page.js                       # Services listing
│
├── nearby-stores/                    # Store locator
│   └── page.js                       # Stores page
│
├── booking-confirmation/             # Confirmation
│   └── page.js                       # Confirmation page
│
├── layout.js                         # Root layout
├── page.js                           # Home page
├── globals.css                       # Global styles
└── print-styles.css                  # Print styles
```

---

## 🔄 Data Flow Architecture

### User Registration Flow

```
User Input (Registration Form)
    ↓
Validation (frontend)
    ↓
POST /api/register
    ↓
Server-side Validation
    ├─ Check email format
    ├─ Check password strength
    ├─ Check email uniqueness
    └─ Validate phone number
    ↓
Hash Password (bcryptjs)
    ↓
Create User in MongoDB
    ↓
Return Success Response
    ↓
localStorage.setItem('auth_user')
    ↓
Redirect to Dashboard/Login
```

### Booking Flow

```
User Navigation to /book
    ↓
Check Authentication
    ├─ If Not Logged In → Redirect /login
    └─ If Logged In → Load Booking Page
    ↓
Display Booking Form
    ├─ Personal Details
    ├─ Vehicle Selection
    ├─ Service Selection
    ├─ Date/Time Selection
    └─ Additional Notes
    ↓
User Submits Form
    ↓
Client-side Validation
    ↓
Calculate Service Price
    ↓
POST /api/booking (with amount)
    ↓
Server Validation
    ↓
Create Booking Record
    ↓
Return Booking ID
    ↓
Redirect to Payment Page
```

### Payment Flow

```
User Clicks "Pay Now"
    ↓
POST /api/payment/create
    ├─ Validate Amount
    ├─ Validate Booking ID
    └─ Create Razorpay Order
    ↓
Razorpay Order Created
    ↓
Return Order Details to Frontend
    ↓
Load Razorpay Modal
    ↓
User Enters Payment Details
    ├─ Card/UPI/Net Banking
    └─ OTP Verification
    ↓
Payment Processing by Razorpay
    ↓
Razorpay Returns:
    ├─ Payment ID
    ├─ Order ID
    └─ Signature
    ↓
POST /api/payment/verify
    ↓
Verify HMAC Signature
    ├─ Generate HMAC-SHA256
    ├─ Compare with Razorpay Signature
    └─ If Match → Success
    ↓
Update Payment Status to "completed"
    ↓
Update Booking Status to "confirmed"
    ↓
Update Booking Amount
    ↓
Send Confirmation Email
    ↓
Redirect to Confirmation Page
```

---

## 🧩 Component Details

### Header Component
**File:** `src/app/component/Header.jsx`

**Purpose:** Main navigation bar

**Features:**
- Logo and site branding
- Navigation links (Home, Services, Book, About, Contact)
- User authentication status display
- Login/Register buttons for anonymous users
- User profile dropdown for authenticated users
- Dark mode toggle
- Mobile hamburger menu
- Responsive design

**State Management:**
```javascript
- isLoggedIn: boolean (from localStorage)
- userEmail: string (from auth_user)
- isDark: boolean (from ThemeContext)
- isMobileMenuOpen: boolean (local state)
```

**Key Methods:**
- `handleLogout()` - Clear localStorage and redirect
- `toggleDarkMode()` - Update theme context
- `toggleMobileMenu()` - Show/hide mobile menu

---

### Footer Component
**File:** `src/app/component/Footer.jsx`

**Purpose:** Site footer with links and contact info

**Sections:**
1. **Company Info**
   - About WashHub
   - Mission statement
   - Contact email

2. **Quick Links**
   - Home
   - Services
   - About
   - Contact

3. **Social Media**
   - Facebook
   - Instagram
   - Twitter
   - LinkedIn

4. **Legal**
   - Privacy Policy
   - Terms of Service
   - Cookie Policy

---

### Home Component
**File:** `src/app/component/Home.jsx`

**Purpose:** Landing page

**Sections:**
1. **Hero Section**
   - Headline: "Professional Car Wash Services"
   - CTA Button: "Book Now"
   - Background image/video

2. **How It Works**
   - Step 1: Browse Services
   - Step 2: Select Date/Time
   - Step 3: Make Payment
   - Step 4: Get Service

3. **Featured Services**
   - Service cards with icons
   - Pricing information
   - "Learn More" links

4. **Customer Testimonials**
   - Carousel of reviews
   - Customer names and photos
   - Star ratings

5. **Call to Action**
   - Final CTA button
   - Contact information

---

### Services Component
**File:** `src/app/component/Services.jsx`

**Purpose:** Display available services

**Features:**
- List all services
- Filter by vehicle type
- Show pricing for each vehicle type
- "Book Now" button for each service
- Service descriptions
- Average rating display

**State:**
```javascript
- services: Array<Service>
- selectedVehicleType: string
- filteredServices: Array<Service>
- loading: boolean
```

---

### Book Component (Client)
**File:** `src/app/component/Book.jsx`

**Purpose:** Booking form for car wash services

**Form Sections:**
1. **Personal Details**
   - Name (required)
   - Phone (required)
   - Email (required)

2. **Vehicle Details**
   - Brand (required) - e.g., Mahindra, Honda, Maruti
   - Model (required) - e.g., Scorpio, City, Alto
   - Vehicle Type (required) - SUV, Sedan, Bike, Truck

3. **Service Selection**
   - Service type dropdown
   - Price display (calculated based on vehicle type)
   - Service description

4. **Schedule**
   - Date picker (optional)
   - Time picker (optional)

5. **Additional Info**
   - Preferred location (optional)
   - Special notes (optional)

**Validation:**
- All required fields checked
- Email format validation
- Phone number format validation
- Future date selection only

**On Submit:**
1. Calculate service price from selected service
2. Include amount in booking request
3. POST to /api/booking with all data
4. Get booking ID from response
5. Redirect to payment page with booking ID and amount

---

### Payment Component
**File:** `src/app/component/Payment.jsx`

**Purpose:** Handle payment processing via Razorpay

**Features:**
- Display order details (amount, booking ID, service)
- Razorpay payment form
- Payment status display
- Error handling and retries
- Confirmation after successful payment

**Process:**
1. Get booking ID and amount from URL params
2. Display booking summary
3. Load Razorpay SDK
4. Create payment order via /api/payment/create
5. Open Razorpay modal when user clicks "Pay"
6. Handle payment success/failure
7. Verify payment via /api/payment/verify
8. Redirect to confirmation or show error

---

### BookingConfirmation Component
**File:** `src/app/component/BookingConfirmation.jsx`

**Purpose:** Show booking confirmation after payment

**Displays:**
- Success message
- Booking details
  - Booking ID (reference number)
  - Service type
  - Vehicle details
  - Amount paid
  - Booking date and time
- Customer details
- Next steps:
  - "View My Bookings"
  - "Book Another Service"
  - "Contact Support"
- Download receipt option

---

### Login Component
**File:** `src/app/component/Login.jsx`

**Purpose:** User authentication

**Features:**
- Email input field
- Password input field
- "Remember Me" checkbox
- "Forgot Password?" link
- "Sign Up" link for new users
- Form validation
- Error messages display
- Loading state during submission

**On Login Success:**
1. Store user data in localStorage as `auth_user`
2. Format: `{ _id, name, email, token }`
3. Redirect to dashboard or booking page
4. Show success message

**Error Handling:**
- Invalid credentials
- Network errors
- Server errors

---

### Register Component
**File:** `src/app/component/Register.jsx`

**Purpose:** New user registration

**Form Fields:**
- Full Name (required)
- Email (required, unique)
- Phone Number (required)
- Password (required, min 6 characters)
- Confirm Password (must match)
- Terms & Conditions checkbox (required)

**Validation:**
- All fields required
- Email format validation
- Password strength check
- Password match verification
- Terms acceptance mandatory

**On Register Success:**
1. Show success message
2. Auto-login user (optional)
3. Redirect to dashboard
4. Send confirmation email

---

### UserDashboard Component
**File:** `src/app/component/UserDashboard.jsx`

**Purpose:** Display user's bookings and activity

**Sections:**
1. **Welcome Message**
   - "Welcome back, [User Name]"
   - Last booking date

2. **Quick Stats**
   - Total bookings
   - Completed bookings
   - Pending bookings
   - Total spent

3. **Recent Bookings**
   - Table/Card view
   - Columns: Service, Date, Status, Amount
   - Status badges (pending, completed, cancelled)
   - Action buttons (View Details, Cancel, Review)

4. **Booking Details Modal**
   - Full booking information
   - Payment status
   - Customer service details
   - Cancel booking option

5. **Reviews Section**
   - Display existing reviews
   - Option to add review for completed bookings
   - Star rating selector
   - Comment text area

---

### UserProfile Component
**File:** `src/app/component/UserProfile.jsx`

**Purpose:** User account management

**Sections:**
1. **Profile Information**
   - Name
   - Email
   - Phone number
   - Join date

2. **Edit Profile**
   - Update name
   - Update phone
   - Update photo (optional)

3. **Security**
   - Change password form
   - Current password validation
   - New password confirmation

4. **Preferences**
   - Email notifications (Yes/No)
   - Promotional emails (Yes/No)
   - SMS notifications (Yes/No)

5. **Account Actions**
   - Download data
   - Delete account button
   - Logout button

---

### Admin Component
**File:** `src/app/component/Admin.jsx`

**Purpose:** Admin dashboard for managing the platform

**Features:**

1. **Bookings Management**
   - Table view of all bookings
   - Filter by status
   - Sort by date, customer, amount
   - Search functionality
   - Mark as completed
   - Cancel booking
   - View booking details

2. **Services Management**
   - List all services
   - Create new service
   - Edit service
   - Delete service
   - Set prices per vehicle type

3. **Payment Monitoring**
   - View all payments
   - Filter by status
   - Payment details
   - Amount total
   - Transaction history

4. **Customer Reviews**
   - Display all reviews
   - Sort by rating
   - Filter by service
   - Response option for reviews

5. **Analytics**
   - Total revenue
   - Number of bookings
   - Average rating
   - Charts and graphs
   - Trends over time

6. **Settings**
   - Store information
   - Business hours
   - Pricing configuration

---

### NearbyStores Component
**File:** `src/app/component/NearbyStores.jsx`

**Purpose:** Display store locations and information

**Features:**
- Map integration (Google Maps/Leaflet)
- Store list with details
- Filter by city
- Distance calculation
- Operating hours
- Contact information
- Directions link

**Data Displayed:**
- Store name
- Address
- Phone
- Email
- Hours of operation
- Services available
- Get Directions button

---

### ReviewSection Component
**File:** `src/app/component/ReviewSection.jsx`

**Purpose:** Display and manage reviews

**Features:**
1. **Reviews Display**
   - Customer name
   - Star rating (1-5)
   - Review text
   - Service type
   - Date of review
   - Helpful count

2. **Add Review**
   - Only for completed bookings
   - Star rating selector
   - Comment input field
   - Character limit (500)
   - Submit button

3. **Filters**
   - Sort by rating
   - Sort by date
   - Filter by service type
   - Filter by rating

4. **Statistics**
   - Average rating display
   - Total reviews count
   - Rating distribution chart

---

### Theme Component
**File:** `src/app/component/Theme.jsx`

**Purpose:** Theme provider for dark mode

**Features:**
- Detect system preference (prefers-color-scheme)
- Allow manual toggle
- Persist theme preference to localStorage
- Apply theme to entire application
- CSS variables for theming

**Context Values:**
```javascript
{
  isDark: boolean,
  toggleTheme: function
}
```

---

## 🔗 Component Relationships

```
App Root (layout.js)
├── ThemeContext Provider
├── Header
├── Routes
│   ├── / → Home
│   ├── /services → Services
│   ├── /book → Book (Protected)
│   │   └── BookPageClient (Client Component)
│   ├── /payment → Payment (Protected)
│   ├── /booking-confirmation → BookingConfirmation
│   ├── /contact → Contact
│   ├── /login → Login
│   ├── /register → Register
│   ├── /dashboard → UserDashboard (Protected)
│   │   └── ReviewSection (sub-component)
│   ├── /profile → UserProfile (Protected)
│   │   └── ProfilePageClient (Client Component)
│   ├── /nearby-stores → NearbyStores
│   ├── /admin → Admin (Protected, Admin Only)
│   │   └── Admin Dashboard
│   │       ├── Bookings Tab
│   │       ├── Services Tab
│   │       ├── Payments Tab
│   │       └── Reviews Tab
│   └── /admin/bookings → Admin Bookings Detail
└── Footer
```

---

## 🔐 Authentication & Authorization

### Protected Routes

**Route Protection Mechanism:**
```javascript
useEffect(() => {
  try {
    const authUser = localStorage.getItem('auth_user');
    if (!authUser) {
      router.push('/login');
    }
  } catch (error) {
    router.push('/login');
  }
}, [router]);
```

**Protected Pages:**
- `/book` - Booking page
- `/payment` - Payment page
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/admin` - Admin dashboard
- `/admin/bookings` - Admin bookings

---

## 🎨 Styling Architecture

**CSS Approach:**
- Tailwind CSS for utility classes
- Dark mode support via `dark:` prefix
- Custom CSS variables for theming
- Print styles for receipts

**Global Styles:** `src/app/globals.css`
**Print Styles:** `src/app/print-styles.css`

---

**Last Updated:** January 21, 2026
