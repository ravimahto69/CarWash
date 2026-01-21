# Complete Component Documentation - WashHub

Detailed documentation for all React components with implementation details, props, state management, and usage examples.

---

## 📋 Table of Contents

1. [Header Component](#header-component)
2. [Footer Component](#footer-component)
3. [Home Component](#home-component)
4. [Services Component](#services-component)
5. [Book Component](#book-component)
6. [Payment Component](#payment-component)
7. [BookingConfirmation Component](#booking-confirmation-component)
8. [Login Component](#login-component)
9. [Register Component](#register-component)
10. [UserDashboard Component](#user-dashboard-component)
11. [UserProfile Component](#user-profile-component)
12. [Admin Component](#admin-component)
13. [NearbyStores Component](#nearby-stores-component)
14. [ReviewSection Component](#review-section-component)
15. [Theme Component](#theme-component)
16. [StoreCard Component](#store-card-component)

---

## Header Component

**File:** `src/app/component/Header.jsx`

**Purpose:** Main navigation bar visible on all pages

### State Management

```javascript
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userEmail, setUserEmail] = useState(null);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const { isDark, toggleTheme } = useContext(ThemeContext);
```

### Props

This component doesn't accept props. It uses:
- `localStorage` for authentication state
- `ThemeContext` for dark mode
- `useRouter` from next/navigation for navigation

### Key Methods

```javascript
// Check if user is logged in
useEffect(() => {
  const authUser = localStorage.getItem('auth_user');
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      setIsLoggedIn(true);
      setUserEmail(user.email);
    } catch (err) {
      console.error('Error parsing auth user:', err);
    }
  }
}, []);

// Handle logout
const handleLogout = () => {
  localStorage.removeItem('auth_user');
  setIsLoggedIn(false);
  setUserEmail(null);
  router.push('/');
  setIsMobileMenuOpen(false);
};

// Navigate to page
const navigateTo = (path) => {
  router.push(path);
  setIsMobileMenuOpen(false);
};
```

### Layout Structure

```jsx
<header className="sticky top-0 z-50 bg-white dark:bg-gray-900">
  <nav className="max-w-7xl mx-auto px-4">
    {/* Logo */}
    <div className="flex items-center">
      <img src="/logo.png" alt="WashHub" />
      <span className="text-xl font-bold">WashHub</span>
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex space-x-6">
      <Link href="/">Home</Link>
      <Link href="/services">Services</Link>
      {isLoggedIn && <Link href="/book">Book Now</Link>}
      <Link href="/contact">Contact</Link>
    </div>

    {/* User Section */}
    <div className="flex items-center space-x-4">
      {/* Theme Toggle */}
      <button onClick={toggleTheme}>
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Auth Buttons or User Menu */}
      {isLoggedIn ? (
        <div className="relative group">
          <button>{userEmail}</button>
          <div className="hidden group-hover:block">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </div>

    {/* Mobile Menu Toggle */}
    <button 
      className="md:hidden"
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    >
      ☰
    </button>
  </nav>

  {/* Mobile Menu */}
  {isMobileMenuOpen && (
    <div className="md:hidden">
      {/* Mobile Navigation Items */}
    </div>
  )}
</header>
```

### Styles

```css
/* sticky header */
header {
  position: sticky;
  top: 0;
  z-index: 50;
}

/* dark mode support */
.dark:bg-gray-900

/* responsive menu */
@media (max-width: 768px) {
  .desktop-nav { display: none; }
  .mobile-toggle { display: block; }
}
```

### Usage Example

```jsx
// Used in layout.js (wraps entire app)
import Header from './component/Header';

export default function RootLayout() {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
```

---

## Footer Component

**File:** `src/app/component/Footer.jsx`

**Purpose:** Footer with company info, links, and contact details

### State Management

```javascript
// No state needed - purely presentational
```

### Key Sections

```jsx
<footer className="bg-gray-800 dark:bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8 py-12">
    
    {/* Company Info */}
    <div>
      <h3>About WashHub</h3>
      <p>Professional car wash services...</p>
      <p>Email: info@washhub.com</p>
    </div>

    {/* Quick Links */}
    <div>
      <h3>Quick Links</h3>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/services">Services</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </div>

    {/* Services */}
    <div>
      <h3>Services</h3>
      <ul>
        <li>Basic Wash</li>
        <li>Premium Wash</li>
        <li>Deluxe Wash</li>
      </ul>
    </div>

    {/* Social Media */}
    <div>
      <h3>Follow Us</h3>
      <div className="flex space-x-4">
        <a href="https://facebook.com">Facebook</a>
        <a href="https://instagram.com">Instagram</a>
        <a href="https://twitter.com">Twitter</a>
      </div>
    </div>

  </div>

  {/* Bottom Section */}
  <div className="border-t border-gray-700 py-6">
    <div className="max-w-7xl mx-auto flex justify-between">
      <p>&copy; 2026 WashHub. All rights reserved.</p>
      <div className="flex space-x-6">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </div>
    </div>
  </div>
</footer>
```

---

## Home Component

**File:** `src/app/component/Home.jsx`

**Purpose:** Landing page with hero, features, and CTA

### State Management

```javascript
const [services, setServices] = useState([]);
const [testimonials, setTestimonials] = useState([]);
const [loading, setLoading] = useState(true);
const router = useRouter();
```

### Key Sections

#### 1. Hero Section
```jsx
<section className="hero bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-4xl font-bold mb-4">
      Professional Car Wash Services
    </h1>
    <p className="text-xl mb-8">
      Quick, affordable, and eco-friendly car wash
    </p>
    <button 
      onClick={() => router.push('/book')}
      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold"
    >
      Book Now
    </button>
  </div>
</section>
```

#### 2. How It Works
```jsx
<section className="how-it-works py-16 bg-gray-50">
  <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
  <div className="grid grid-cols-4 gap-8">
    <div className="text-center">
      <div className="text-4xl mb-4">1️⃣</div>
      <h3>Browse Services</h3>
      <p>Choose from our range of services</p>
    </div>
    <div className="text-center">
      <div className="text-4xl mb-4">2️⃣</div>
      <h3>Select Date & Time</h3>
      <p>Pick convenient time slot</p>
    </div>
    <div className="text-center">
      <div className="text-4xl mb-4">3️⃣</div>
      <h3>Make Payment</h3>
      <p>Secure payment via Razorpay</p>
    </div>
    <div className="text-center">
      <div className="text-4xl mb-4">4️⃣</div>
      <h3>Get Service</h3>
      <p>Expert service at your location</p>
    </div>
  </div>
</section>
```

#### 3. Featured Services
```jsx
<section className="featured-services py-16">
  <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
  <div className="grid grid-cols-3 gap-8">
    {services.map(service => (
      <div key={service._id} className="card shadow-lg p-6">
        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <p className="text-2xl font-bold text-blue-600 mb-4">
          From ₹{Math.min(...Object.values(service.prices))}
        </p>
        <button 
          onClick={() => router.push('/book')}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Learn More
        </button>
      </div>
    ))}
  </div>
</section>
```

#### 4. Testimonials (Carousel)
```jsx
<section className="testimonials py-16 bg-gray-50">
  <h2 className="text-3xl font-bold text-center mb-12">What Customers Say</h2>
  <div className="max-w-3xl mx-auto">
    {testimonials.map((testimonial, index) => (
      <div 
        key={index}
        className={`${activeTestimonial === index ? 'block' : 'hidden'}`}
      >
        <blockquote className="text-xl italic text-center mb-4">
          "{testimonial.comment}"
        </blockquote>
        <p className="text-center font-bold">
          {testimonial.name} - ⭐ {testimonial.rating}/5
        </p>
      </div>
    ))}
  </div>
</section>
```

### Lifecycle Methods

```javascript
// Fetch services on mount
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

---

## Services Component

**File:** `src/app/component/Services.jsx`

**Purpose:** Display all available services with filtering

### State Management

```javascript
const [services, setServices] = useState([]);
const [selectedVehicleType, setSelectedVehicleType] = useState('SUV');
const [filteredServices, setFilteredServices] = useState([]);
const [loading, setLoading] = useState(true);
```

### Props

None - fetches data from API

### Methods

```javascript
// Fetch all services
const fetchServices = async () => {
  try {
    const res = await fetch('/api/services');
    const data = await res.json();
    if (data.success) {
      setServices(data.data);
      filterServices(data.data);
    }
  } catch (err) {
    console.error('Error fetching services:', err);
    alert('Failed to load services');
  } finally {
    setLoading(false);
  }
};

// Filter services by vehicle type
const filterServices = (allServices, vehicleType = selectedVehicleType) => {
  const filtered = allServices.map(service => ({
    ...service,
    price: service.prices[vehicleType] || 0
  }));
  setFilteredServices(filtered);
};

// Handle vehicle type change
const handleVehicleTypeChange = (type) => {
  setSelectedVehicleType(type);
  filterServices(services, type);
};
```

### Render Structure

```jsx
<div className="max-w-7xl mx-auto py-12">
  <h1 className="text-4xl font-bold mb-8">Our Services</h1>

  {/* Vehicle Type Filter */}
  <div className="mb-8 flex flex-wrap gap-4">
    {['Sedan', 'SUV', 'Hatchback', 'Bike', 'Truck'].map(type => (
      <button
        key={type}
        onClick={() => handleVehicleTypeChange(type)}
        className={`px-6 py-2 rounded ${
          selectedVehicleType === type 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200'
        }`}
      >
        {type}
      </button>
    ))}
  </div>

  {/* Services Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {loading ? (
      <p>Loading services...</p>
    ) : filteredServices.length > 0 ? (
      filteredServices.map(service => (
        <ServiceCard
          key={service._id}
          service={service}
          vehicleType={selectedVehicleType}
          onBook={() => router.push('/book')}
        />
      ))
    ) : (
      <p>No services available</p>
    )}
  </div>
</div>
```

---

## Book Component

**File:** `src/app/component/Book.jsx`

**Purpose:** Multi-step booking form

### State Management

```javascript
const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '',
  brand: '',
  model: '',
  vehicleType: '',
  service: '',
  date: '',
  time: '',
  location: '',
  notes: ''
});

const [selectedPrice, setSelectedPrice] = useState(0);
const [filteredServices, setFilteredServices] = useState([]);
const [loading, setLoading] = useState(false);
const [currentStep, setCurrentStep] = useState(1);
const router = useRouter();
```

### Form Validation

```javascript
const validateForm = () => {
  const required = [
    'name', 'phone', 'email', 'brand', 
    'model', 'vehicleType', 'service'
  ];
  
  for (let field of required) {
    if (!formData[field] || formData[field].trim() === '') {
      alert(`Please fill in ${field}`);
      return false;
    }
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert('Please enter valid email');
    return false;
  }
  
  // Phone validation (10 digits)
  if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
    alert('Please enter valid phone number');
    return false;
  }
  
  return true;
};
```

### Submit Handler

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    // Calculate service price
    const servicePrice = selectedPrice || 
      formData.service.match(/\d+/)?.[0] || 0;
    
    // Create booking
    const res = await fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...formData, 
        amount: servicePrice 
      })
    });
    
    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data?.error || 'Failed to create booking');
      return;
    }
    
    // Redirect to payment
    const bookingId = data.data?.id || data.data?._id;
    router.push(
      `/payment?bookingId=${bookingId}&amount=${servicePrice}&service=${encodeURIComponent(formData.service)}`
    );
    
  } catch (error) {
    console.error('Booking error:', error);
    alert('An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Multi-Step Form Sections

```jsx
<form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
  {currentStep === 1 && (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
      
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="input w-full"
        required
      />
      
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        className="input w-full"
        required
      />
      
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="input w-full"
        required
      />
      
      <button 
        onClick={() => setCurrentStep(2)}
        className="btn-primary mt-4"
      >
        Next →
      </button>
    </section>
  )}
  
  {currentStep === 2 && (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
      
      <select
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        className="input w-full"
      >
        <option>Select Vehicle Brand</option>
        <option>Mahindra</option>
        <option>Honda</option>
        {/* ... more options */}
      </select>
      
      <input
        type="text"
        name="model"
        placeholder="Vehicle Model"
        value={formData.model}
        onChange={handleChange}
        className="input w-full"
      />
      
      <select
        name="vehicleType"
        value={formData.vehicleType}
        onChange={handleChange}
        className="input w-full"
      >
        <option>Select Type</option>
        <option>SUV</option>
        <option>Sedan</option>
        {/* ... more options */}
      </select>
      
      <div className="flex space-x-2">
        <button 
          onClick={() => setCurrentStep(1)}
          className="btn-secondary"
        >
          ← Back
        </button>
        <button 
          onClick={() => setCurrentStep(3)}
          className="btn-primary"
        >
          Next →
        </button>
      </div>
    </section>
  )}
  
  {currentStep === 3 && (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Service & Schedule</h2>
      
      <select
        name="service"
        value={formData.service}
        onChange={handleServiceChange}
        className="input w-full"
      >
        <option>Select Service</option>
        {filteredServices.map(s => (
          <option key={s.type}>{s.type}</option>
        ))}
      </select>
      
      {selectedPrice > 0 && (
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-lg font-bold">
            Price: ₹{selectedPrice}
          </p>
        </div>
      )}
      
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="input w-full"
      />
      
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        className="input w-full"
      />
      
      <textarea
        name="notes"
        placeholder="Additional notes (optional)"
        value={formData.notes}
        onChange={handleChange}
        className="input w-full"
        rows="4"
      />
      
      <div className="flex space-x-2">
        <button 
          onClick={() => setCurrentStep(2)}
          className="btn-secondary"
        >
          ← Back
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Processing...' : 'Confirm & Pay'}
        </button>
      </div>
    </section>
  )}
</form>
```

---

## Payment Component

**File:** `src/app/component/Payment.jsx`

**Purpose:** Razorpay payment integration

### State Management

```javascript
const [bookingId, setBookingId] = useState('');
const [amount, setAmount] = useState(0);
const [service, setService] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const router = useRouter();
const searchParams = useSearchParams();
```

### Initialization

```javascript
useEffect(() => {
  // Get params from URL
  const bid = searchParams.get('bookingId');
  const amt = searchParams.get('amount');
  const svc = searchParams.get('service');
  
  setBookingId(bid);
  setAmount(parseInt(amt) || 0);
  setService(decodeURIComponent(svc || ''));
  
  // Load Razorpay script
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);
}, [searchParams]);
```

### Payment Handler

```javascript
const handlePayment = async () => {
  if (!bookingId || amount <= 0) {
    setError('Invalid booking details');
    return;
  }
  
  setLoading(true);
  try {
    // Get auth user
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    
    // Create payment order
    const res = await fetch('/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        bookingId,
        userId: authUser._id,
        customerName: authUser.name || 'Guest',
        customerEmail: authUser.email,
        customerPhone: authUser.phone || '',
        serviceType: service
      })
    });
    
    const data = await res.json();
    if (!data.success) {
      setError('Failed to create payment order');
      return;
    }
    
    // Open Razorpay checkout
    const razorpay = new Razorpay({
      key: data.data.keyId,
      order_id: data.data.orderId,
      handler: async (response) => {
        // Verify payment
        await verifyPayment(response);
      },
      prefill: {
        email: authUser.email,
        contact: authUser.phone
      }
    });
    
    razorpay.open();
    
  } catch (err) {
    console.error('Payment error:', err);
    setError('Failed to process payment');
  } finally {
    setLoading(false);
  }
};

// Verify payment signature
const verifyPayment = async (response) => {
  try {
    const res = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature
      })
    });
    
    const data = await res.json();
    if (data.success) {
      // Payment successful
      router.push(`/booking-confirmation?bookingId=${bookingId}`);
    } else {
      setError('Payment verification failed');
    }
  } catch (err) {
    console.error('Verification error:', err);
    setError('Verification failed');
  }
};
```

### UI Structure

```jsx
<div className="max-w-2xl mx-auto py-12">
  <div className="card shadow-lg p-8">
    <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>
    
    {/* Order Summary */}
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Booking ID:</span>
          <span className="font-mono">{bookingId}</span>
        </div>
        <div className="flex justify-between">
          <span>Service:</span>
          <span>{service}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount:</span>
          <span className="text-blue-600">₹{amount}</span>
        </div>
      </div>
    </div>
    
    {/* Error Message */}
    {error && (
      <div className="bg-red-50 border border-red-300 p-4 rounded mb-6">
        <p className="text-red-700">{error}</p>
      </div>
    )}
    
    {/* Payment Button */}
    <button
      onClick={handlePayment}
      disabled={loading || !bookingId}
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg disabled:opacity-50"
    >
      {loading ? 'Processing...' : `Pay ₹${amount} with Razorpay`}
    </button>
    
    {/* Security Info */}
    <div className="mt-6 pt-6 border-t">
      <p className="text-sm text-gray-600 text-center">
        🔒 Your payment is secure and encrypted
      </p>
    </div>
  </div>
</div>
```

---

## BookingConfirmation Component

**File:** `src/app/component/BookingConfirmation.jsx`

**Purpose:** Show booking confirmation after successful payment

### State Management

```javascript
const [booking, setBooking] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const searchParams = useSearchParams();
const router = useRouter();
```

### Data Fetching

```javascript
useEffect(() => {
  const fetchBooking = async () => {
    try {
      const bookingId = searchParams.get('bookingId');
      if (!bookingId) {
        setError('No booking ID provided');
        return;
      }
      
      const res = await fetch(`/api/booking?id=${bookingId}`);
      const data = await res.json();
      
      if (data.success) {
        setBooking(data.data);
      } else {
        setError('Failed to load booking details');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error loading booking');
    } finally {
      setLoading(false);
    }
  };
  
  fetchBooking();
}, [searchParams]);
```

### UI Structure

```jsx
<div className="max-w-2xl mx-auto py-12">
  {loading ? (
    <p>Loading confirmation...</p>
  ) : error ? (
    <div className="bg-red-50 p-6 rounded">
      <p className="text-red-700">{error}</p>
    </div>
  ) : booking ? (
    <div className="card shadow-lg p-8">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 mt-2">
          Your car wash service is confirmed
        </p>
      </div>
      
      {/* Booking Details */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Booking ID</p>
            <p className="font-mono font-bold">{booking._id}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-bold text-green-600">
              {booking.bookingStatus}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Service</p>
            <p className="font-bold">{booking.service}</p>
          </div>
          <div>
            <p className="text-gray-600">Amount Paid</p>
            <p className="font-bold text-blue-600">₹{booking.amount}</p>
          </div>
          <div>
            <p className="text-gray-600">Date</p>
            <p className="font-bold">{booking.date || 'TBD'}</p>
          </div>
          <div>
            <p className="text-gray-600">Time</p>
            <p className="font-bold">{booking.time || 'TBD'}</p>
          </div>
        </div>
      </div>
      
      {/* Customer Info */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Customer Information</h2>
        
        <div className="space-y-2">
          <p><span className="text-gray-600">Name:</span> {booking.name}</p>
          <p><span className="text-gray-600">Email:</span> {booking.email}</p>
          <p><span className="text-gray-600">Phone:</span> {booking.phone}</p>
          <p>
            <span className="text-gray-600">Vehicle:</span> 
            {booking.brand} {booking.model} ({booking.vehicleType})
          </p>
        </div>
      </div>
      
      {/* Next Steps */}
      <div className="bg-yellow-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Next Steps</h2>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Check your email for confirmation details</li>
          <li>You'll receive a reminder before your appointment</li>
          <li>Arrive 10 minutes early for check-in</li>
          <li>Service usually takes 30-60 minutes</li>
        </ol>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold"
        >
          View My Bookings
        </button>
        <button
          onClick={() => router.push('/book')}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold"
        >
          Book Another Service
        </button>
      </div>
      
      {/* Download Receipt */}
      <button
        onClick={() => window.print()}
        className="w-full mt-4 border-2 border-gray-300 py-2 rounded-lg font-bold"
      >
        📥 Download Receipt
      </button>
    </div>
  ) : null}
</div>
```

---

## Login Component

**File:** `src/app/component/Login.jsx`

**Purpose:** User authentication

### State Management

```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [rememberMe, setRememberMe] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [showPassword, setShowPassword] = useState(false);
const router = useRouter();
```

### Form Validation

```javascript
const validateForm = () => {
  if (!email.trim()) {
    setError('Email is required');
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('Please enter valid email');
    return false;
  }
  
  if (!password) {
    setError('Password is required');
    return false;
  }
  
  if (password.length < 6) {
    setError('Password must be at least 6 characters');
    return false;
  }
  
  return true;
};
```

### Submit Handler

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok || !data.success) {
      setError(data?.error || 'Login failed');
      return;
    }
    
    // Store user data
    localStorage.setItem('auth_user', JSON.stringify(data.data));
    
    // Optional: Remember me
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    }
    
    // Redirect to dashboard
    router.push('/dashboard');
    
  } catch (err) {
    console.error('Login error:', err);
    setError('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### UI Structure

```jsx
<div className="max-w-md mx-auto py-12">
  <div className="card shadow-lg p-8">
    <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
    
    {/* Error Message */}
    {error && (
      <div className="bg-red-50 border border-red-300 p-4 rounded mb-4">
        <p className="text-red-700">{error}</p>
      </div>
    )}
    
    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-bold mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input w-full"
        />
      </div>
      
      <div>
        <label className="block text-gray-700 font-bold mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="remember" className="text-sm">
          Remember me
        </label>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
    
    {/* Links */}
    <div className="mt-6 space-y-2">
      <p className="text-sm text-center">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </p>
      <p className="text-sm text-center">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline font-bold">
          Sign up here
        </Link>
      </p>
    </div>
  </div>
</div>
```

---

## Register Component

**File:** `src/app/component/Register.jsx`

**Purpose:** New user registration

### State Management

```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

const [agreedToTerms, setAgreedToTerms] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [passwordStrength, setPasswordStrength] = useState(0);
const router = useRouter();
```

### Password Strength Check

```javascript
const checkPasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  
  setPasswordStrength(strength);
};

const handlePasswordChange = (e) => {
  const password = e.target.value;
  setFormData(prev => ({ ...prev, password }));
  checkPasswordStrength(password);
};
```

### Form Validation

```javascript
const validateForm = () => {
  const { name, email, phone, password, confirmPassword } = formData;
  
  if (!name.trim()) {
    setError('Name is required');
    return false;
  }
  
  if (!email.trim()) {
    setError('Email is required');
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('Please enter valid email');
    return false;
  }
  
  if (!phone.trim()) {
    setError('Phone number is required');
    return false;
  }
  
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    setError('Please enter valid 10-digit phone number');
    return false;
  }
  
  if (!password) {
    setError('Password is required');
    return false;
  }
  
  if (password.length < 6) {
    setError('Password must be at least 6 characters');
    return false;
  }
  
  if (password !== confirmPassword) {
    setError('Passwords do not match');
    return false;
  }
  
  if (!agreedToTerms) {
    setError('You must agree to terms and conditions');
    return false;
  }
  
  return true;
};
```

### Submit Handler

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  
  if (!validateForm()) return;
  
  setLoading(true);
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
    });
    
    const data = await res.json();
    
    if (!res.ok || !data.success) {
      setError(data?.error || 'Registration failed');
      return;
    }
    
    setSuccess('Registration successful! Redirecting to login...');
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);
    
  } catch (err) {
    console.error('Registration error:', err);
    setError('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### UI Structure

```jsx
<div className="max-w-md mx-auto py-12">
  <div className="card shadow-lg p-8">
    <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
    
    {/* Error/Success Messages */}
    {error && (
      <div className="bg-red-50 border border-red-300 p-4 rounded mb-4">
        <p className="text-red-700">{error}</p>
      </div>
    )}
    
    {success && (
      <div className="bg-green-50 border border-green-300 p-4 rounded mb-4">
        <p className="text-green-700">{success}</p>
      </div>
    )}
    
    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-bold mb-2">Full Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="input w-full"
          required
        />
      </div>
      
      <div>
        <label className="block font-bold mb-2">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="input w-full"
          required
        />
      </div>
      
      <div>
        <label className="block font-bold mb-2">Phone Number</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="10-digit phone number"
          className="input w-full"
          required
        />
      </div>
      
      <div>
        <label className="block font-bold mb-2">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
          placeholder="At least 6 characters"
          className="input w-full"
          required
        />
        
        {/* Password Strength Meter */}
        {formData.password && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className={`h-full rounded transition-all ${
                  passwordStrength <= 1 ? 'bg-red-500' :
                  passwordStrength <= 2 ? 'bg-yellow-500' :
                  passwordStrength <= 3 ? 'bg-blue-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              />
            </div>
            <p className="text-sm mt-1 text-gray-600">
              {passwordStrength === 0 ? 'Weak' :
               passwordStrength === 1 ? 'Fair' :
               passwordStrength === 2 ? 'Good' :
               passwordStrength === 3 ? 'Strong' :
               'Very Strong'}
            </p>
          </div>
        )}
      </div>
      
      <div>
        <label className="block font-bold mb-2">Confirm Password</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          className="input w-full"
          required
        />
      </div>
      
      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mr-2 mt-1"
          required
        />
        <label htmlFor="terms" className="text-sm">
          I agree to the{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </label>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
    
    {/* Link to Login */}
    <p className="text-sm text-center mt-6">
      Already have an account?{' '}
      <Link href="/login" className="text-blue-600 hover:underline font-bold">
        Login here
      </Link>
    </p>
  </div>
</div>
```

---

## User Dashboard Component

**File:** `src/app/component/UserDashboard.jsx`

**Purpose:** Display user's booking history and status

### State Management

```javascript
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedBooking, setSelectedBooking] = useState(null);
const [filterStatus, setFilterStatus] = useState('all');
const [userEmail, setUserEmail] = useState('');
```

### Data Fetching

```javascript
useEffect(() => {
  // Get user email
  const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  setUserEmail(authUser.email);
  
  // Fetch bookings
  fetchBookings(authUser.email);
}, []);

const fetchBookings = async (email) => {
  try {
    const res = await fetch(`/api/booking/user/${email}`);
    const data = await res.json();
    
    if (data.success) {
      setBookings(data.data);
    }
  } catch (err) {
    console.error('Error fetching bookings:', err);
  } finally {
    setLoading(false);
  }
};
```

### Filter & Statistics

```javascript
const filteredBookings = filterStatus === 'all'
  ? bookings
  : bookings.filter(b => b.bookingStatus === filterStatus);

const stats = {
  total: bookings.length,
  completed: bookings.filter(b => b.bookingStatus === 'completed').length,
  pending: bookings.filter(b => b.bookingStatus === 'pending').length,
  totalSpent: bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
};
```

### UI Structure

```jsx
<div className="max-w-6xl mx-auto py-12">
  <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>
  
  {/* Stats Cards */}
  <div className="grid grid-cols-4 gap-4 mb-8">
    <div className="bg-blue-50 p-6 rounded-lg">
      <p className="text-gray-600 text-sm">Total Bookings</p>
      <p className="text-3xl font-bold">{stats.total}</p>
    </div>
    <div className="bg-green-50 p-6 rounded-lg">
      <p className="text-gray-600 text-sm">Completed</p>
      <p className="text-3xl font-bold">{stats.completed}</p>
    </div>
    <div className="bg-yellow-50 p-6 rounded-lg">
      <p className="text-gray-600 text-sm">Pending</p>
      <p className="text-3xl font-bold">{stats.pending}</p>
    </div>
    <div className="bg-purple-50 p-6 rounded-lg">
      <p className="text-gray-600 text-sm">Total Spent</p>
      <p className="text-3xl font-bold">₹{stats.totalSpent}</p>
    </div>
  </div>
  
  {/* Filter Buttons */}
  <div className="mb-8 flex flex-wrap gap-2">
    {['all', 'pending', 'completed', 'cancelled'].map(status => (
      <button
        key={status}
        onClick={() => setFilterStatus(status)}
        className={`px-4 py-2 rounded-lg font-bold capitalize ${
          filterStatus === status
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {status}
      </button>
    ))}
  </div>
  
  {/* Bookings Table */}
  {loading ? (
    <p>Loading bookings...</p>
  ) : filteredBookings.length > 0 ? (
    <div className="card shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="text-left p-4">Service</th>
            <th className="text-left p-4">Vehicle</th>
            <th className="text-left p-4">Amount</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Date</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map(booking => (
            <tr key={booking._id} className="border-b hover:bg-gray-50">
              <td className="p-4">{booking.service}</td>
              <td className="p-4">
                {booking.brand} {booking.model}
              </td>
              <td className="p-4 font-bold">₹{booking.amount}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  booking.bookingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.bookingStatus === 'paid' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.bookingStatus}
                </span>
              </td>
              <td className="p-4">{booking.createdAt?.split('T')[0]}</td>
              <td className="p-4">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="text-blue-600 hover:underline font-bold"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="text-center py-12">
      <p className="text-gray-600 mb-4">No bookings yet</p>
      <Link
        href="/book"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
      >
        Book Now
      </Link>
    </div>
  )}
  
  {/* Booking Details Modal */}
  {selectedBooking && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-8">
        <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Booking ID</p>
            <p className="font-mono">{selectedBooking._id}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-bold">{selectedBooking.bookingStatus}</p>
          </div>
          {/* More details */}
        </div>
        
        <button
          onClick={() => setSelectedBooking(null)}
          className="w-full bg-gray-200 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>
```

---

## Admin Component

**File:** `src/app/component/Admin.jsx`

**Purpose:** Admin dashboard for managing platform

### State Management

```javascript
const [activeTab, setActiveTab] = useState('bookings');
const [bookings, setBookings] = useState([]);
const [services, setServices] = useState([]);
const [payments, setPayments] = useState([]);
const [reviews, setReviews] = useState([]);
const [loading, setLoading] = useState(true);
const [stats, setStats] = useState({});
```

### Tab Structure

```javascript
const tabs = [
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'services', label: 'Services', icon: '🧹' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' }
];
```

### Bookings Management

```jsx
{activeTab === 'bookings' && (
  <div>
    <div className="flex justify-between mb-6">
      <h2 className="text-2xl font-bold">Bookings</h2>
      <select
        onChange={(e) => filterBookingsByStatus(e.target.value)}
        className="input"
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
    
    <div className="card shadow-lg">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">Customer</th>
            <th className="text-left p-4">Service</th>
            <th className="text-left p-4">Amount</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id} className="border-b">
              <td className="p-4">{booking.name}</td>
              <td className="p-4">{booking.service}</td>
              <td className="p-4">₹{booking.amount}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded text-sm ${
                  booking.bookingStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.bookingStatus}
                </span>
              </td>
              <td className="p-4 space-x-2">
                {booking.bookingStatus !== 'completed' && (
                  <button
                    onClick={() => updateBookingStatus(booking._id, 'completed')}
                    className="text-green-600 hover:underline font-bold"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="text-red-600 hover:underline font-bold"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
```

### Services Management

```jsx
{activeTab === 'services' && (
  <div>
    <div className="flex justify-between mb-6">
      <h2 className="text-2xl font-bold">Services</h2>
      <button
        onClick={() => setShowCreateServiceForm(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
      >
        + Add Service
      </button>
    </div>
    
    {/* Services Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map(service => (
        <div key={service._id} className="card shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => editService(service)}
                className="text-blue-600 font-bold"
              >
                Edit
              </button>
              <button
                onClick={() => deleteService(service._id)}
                className="text-red-600 font-bold"
              >
                Delete
              </button>
            </div>
          </div>
          
          {/* Prices */}
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-bold mb-2">Prices</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(service.prices).map(([type, price]) => (
                <div key={type}>
                  <span className="text-sm text-gray-600">{type}:</span>
                  <span className="font-bold"> ₹{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

---

## Theme Component

**File:** `src/app/component/Theme.jsx`

**Purpose:** Dark mode theme provider

### Implementation

```javascript
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
  }, []);
  
  // Apply theme to document
  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    applyTheme(newValue);
  };
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Usage in App

```javascript
// In layout.js
import { ThemeProvider } from './component/Theme';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
```

---

## ReviewSection Component

**File:** `src/app/component/ReviewSection.jsx`

**Purpose:** Display and manage reviews

### State Management

```javascript
const [reviews, setReviews] = useState([]);
const [newReview, setNewReview] = useState({
  rating: 5,
  comment: ''
});
const [loading, setLoading] = useState(true);
const [userEmail, setUserEmail] = useState('');
const [canReview, setCanReview] = useState(false);
```

### Add Review Handler

```javascript
const handleAddReview = async (e) => {
  e.preventDefault();
  
  if (!newReview.comment.trim()) {
    alert('Please write a comment');
    return;
  }
  
  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: bookingId,
        userId: userId,
        rating: newReview.rating,
        comment: newReview.comment,
        serviceType: serviceType
      })
    });
    
    const data = await res.json();
    if (data.success) {
      setReviews([data.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      alert('Review posted successfully!');
    }
  } catch (err) {
    console.error('Error posting review:', err);
    alert('Failed to post review');
  }
};
```

### UI Structure

```jsx
<div className="max-w-4xl mx-auto py-12">
  <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
  
  {/* Statistics */}
  <div className="bg-gray-50 p-6 rounded-lg mb-8">
    <div className="flex items-center">
      <div className="text-4xl font-bold mr-4">{averageRating}</div>
      <div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={i < Math.round(averageRating) ? '⭐' : '☆'}
            >
              {i < Math.round(averageRating) ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        <p className="text-gray-600">Based on {reviews.length} reviews</p>
      </div>
    </div>
  </div>
  
  {/* Add Review Form */}
  {canReview && (
    <form onSubmit={handleAddReview} className="card shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold mb-4">Share Your Experience</h3>
      
      <div className="mb-4">
        <label className="block font-bold mb-2">Rating</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
              className="text-3xl"
            >
              {star <= newReview.rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block font-bold mb-2">Your Review</label>
        <textarea
          value={newReview.comment}
          onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Share your experience..."
          className="input w-full"
          rows="4"
        />
        <p className="text-sm text-gray-600 mt-1">
          {newReview.comment.length}/500 characters
        </p>
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
      >
        Post Review
      </button>
    </form>
  )}
  
  {/* Reviews List */}
  <div className="space-y-4">
    {reviews.length > 0 ? (
      reviews.map(review => (
        <div key={review._id} className="card shadow p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold">{review.userName || 'Anonymous'}</h4>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < review.rating ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
          <p className="text-gray-700">{review.comment}</p>
          <div className="mt-2 flex space-x-4">
            <button className="text-sm text-gray-600">
              👍 Helpful ({review.helpful || 0})
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-600 py-8">
        No reviews yet. Be the first to review!
      </p>
    )}
  </div>
</div>
```

---

## StoreCard Component

**File:** `src/app/component/StoreCard.jsx`

**Purpose:** Display individual store information

### Props

```javascript
StoreCard.propTypes = {
  store: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    hours: PropTypes.object,
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }),
  distance: PropTypes.number, // in km
  onViewMore: PropTypes.func
};
```

### Component Structure

```jsx
const StoreCard = ({ store, distance, onViewMore }) => {
  return (
    <div className="card shadow-lg p-6 hover:shadow-xl transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{store.name}</h3>
          {distance && (
            <p className="text-sm text-blue-600">
              📍 {distance.toFixed(1)} km away
            </p>
          )}
        </div>
      </div>
      
      {/* Address */}
      <div className="mb-4 pb-4 border-b">
        <p className="text-gray-700">{store.address}</p>
      </div>
      
      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <p className="text-sm">
          <span className="font-bold">📞 </span>
          <a href={`tel:${store.phone}`} className="text-blue-600">
            {store.phone}
          </a>
        </p>
        <p className="text-sm">
          <span className="font-bold">✉️ </span>
          <a href={`mailto:${store.email}`} className="text-blue-600">
            {store.email}
          </a>
        </p>
      </div>
      
      {/* Hours */}
      <div className="mb-4 pb-4 border-b">
        <h4 className="font-bold mb-2">Hours</h4>
        <div className="text-sm space-y-1">
          {Object.entries(store.hours || {}).map(([day, hours]) => (
            <div key={day} className="flex justify-between">
              <span className="capitalize">{day}:</span>
              <span>{hours}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Button */}
      <button
        onClick={onViewMore}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
      >
        Get Directions
      </button>
    </div>
  );
};

export default StoreCard;
```

---

## NearbyStores Component

**File:** `src/app/component/NearbyStores.jsx`

**Purpose:** Find and display nearby stores

### State Management

```javascript
const [stores, setStores] = useState([]);
const [userLocation, setUserLocation] = useState(null);
const [sortedStores, setSortedStores] = useState([]);
const [selectedCity, setSelectedCity] = useState('');
const [loading, setLoading] = useState(true);
```

### Location & Distance Calculation

```javascript
// Get user location
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }
}, []);

// Calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
```

---

**Last Updated:** January 21, 2026
