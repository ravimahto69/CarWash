# Quick Start Guide - WashHub

Get the WashHub car wash platform running in 5 minutes!

---

## ⚡ 5-Minute Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Razorpay account

### Step 1: Download & Install (1 min)

```bash
# Clone the project
git clone https://github.com/yourusername/carwash.git
cd CarWash

# Install packages
npm install
```

### Step 2: Get API Keys (2 min)

**MongoDB Connection String:**
1. Go to https://mongodb.com/cloud/atlas
2. Login/Sign up
3. Create cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string

**Razorpay Keys:**
1. Go to https://razorpay.com
2. Login to dashboard
3. Settings → API Keys
4. Copy Key ID and Key Secret

### Step 3: Create .env.local (1 min)

```bash
# Create file in root directory
touch .env.local

# Add this content:
MONGO_URI=your_mongodb_connection_string_here
RAZOR_KEY_ID=your_razorpay_key_id
RAZOR_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your_random_secret_key_here_32_chars_min
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 4: Run Development Server (1 min)

```bash
npm run dev
```

### Step 5: Access Application (Done!)

Open browser: **http://localhost:3000**

---

## 🧪 Test the Application

### 1. Create Account
- Click "Register"
- Fill in form with test data
- Click "Register"

### 2. Login
- Click "Login"
- Enter your email and password
- Click "Login"

### 3. Book a Service
- Click "Book Now" or navigate to `/book`
- Select vehicle type and model
- Choose service
- Click "Next"

### 4. Make Payment
- You'll be redirected to payment
- Click "Pay Now"
- Use test card: **4111 1111 1111 1111**
- Expiry: Any future date
- CVV: Any 3 digits
- Click "Pay"

### 5. Confirm Booking
- You should see success message
- Your booking is confirmed!

---

## 📁 Important Files & Directories

```
CarWash/
├── src/app/
│   ├── api/              ← Backend routes
│   ├── component/        ← React components
│   ├── models/           ← Database models
│   └── lib/db.js         ← Database connection
├── .env.local            ← Your secrets (NEVER commit)
├── .env.example          ← Template (commit this)
├── package.json          ← Dependencies
└── next.config.mjs       ← Next.js config
```

---

## 🔍 Key Pages

| Page | Path | Purpose |
|------|------|---------|
| Home | `/` | Homepage |
| Register | `/register` | Create account |
| Login | `/login` | Sign in |
| Services | `/services` | Browse services |
| Book | `/book` | Make booking |
| Payment | `/payment` | Pay for booking |
| Dashboard | `/dashboard` | View bookings |
| Profile | `/profile` | Manage account |
| Admin | `/admin` | Manage platform |

---

## 🆘 Troubleshooting

### Port 3000 Already in Use
```bash
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MONGO_URI Error
```
Error: connect ENOTFOUND
```
**Solution:**
1. Check MongoDB URI is correct
2. Add your IP to MongoDB whitelist
3. Check username/password (URL encode special chars)

### Payment Fails
```
Error: Signature verification failed
```
**Solution:**
1. Use test keys (rzp_test_)
2. Verify RAZOR_KEY_SECRET is correct
3. Check for extra spaces in keys

### Database Won't Connect
```
Error: MongoNetworkError
```
**Solution:**
1. Internet connection working
2. IP is whitelisted in MongoDB Atlas
3. Cluster is not paused

---

## 📚 Documentation Files

Read these for more info:

| File | Topic |
|------|-------|
| `README.md` | Overview & features |
| `ARCHITECTURE.md` | System design & components |
| `API_DOCUMENTATION.md` | All API endpoints |
| `DATABASE_MODELS.md` | Database schemas |
| `DEPLOYMENT.md` | Deployment guides |
| `.env.example` | Environment variables |

---

## 🚀 Next Steps

### For Development
1. Read `ARCHITECTURE.md` to understand structure
2. Read `API_DOCUMENTATION.md` for available endpoints
3. Check `DATABASE_MODELS.md` for data structure
4. Create test data using API endpoints
5. Build features using existing components

### For Deployment
1. Set up GitHub repository
2. Choose deployment platform (Vercel recommended)
3. Follow `DEPLOYMENT.md` guide
4. Set up production database
5. Update Razorpay to live keys

### For Customization
1. Update colors in `tailwind.config.js`
2. Modify services in database
3. Add/remove features in components
4. Customize email templates
5. Add business logic to API routes

---

## 🎯 Common Tasks

### Add New Service
```bash
# Using API
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Service",
    "prices": {"SUV": 500, "Sedan": 400}
  }'
```

### Create Admin User
```javascript
// In MongoDB directly
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

### Reset Database
```bash
# Clear all collections
# Use MongoDB Compass GUI
# Or delete database and recreate
```

### Check Logs
```bash
# Terminal logs
npm run dev
# Shows all API calls and errors

# Database logs
# MongoDB Atlas → Logs (in Atlas UI)
```

---

## 💡 Tips & Tricks

### Dark Mode Test
1. Click theme icon in header
2. Should toggle dark mode
3. Preference saves in localStorage

### Mobile Responsive
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test on different screen sizes

### API Testing
```bash
# Use Thunder Client, Postman, or curl
curl -X GET http://localhost:3000/api/services

# Test with authentication
curl -X GET http://localhost:3000/api/booking/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Database Queries
```bash
# Using MongoDB Compass
1. Download and install MongoDB Compass
2. Connect with MONGO_URI
3. Browse collections
4. Run queries
5. Export/import data
```

---

## 📞 Support Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Razorpay Docs](https://razorpay.com/docs)
- [Tailwind Docs](https://tailwindcss.com)

### Community
- GitHub Issues: Report bugs
- Stack Overflow: Ask questions
- Discord: Join community
- GitHub Discussions: Feature requests

### Contact
- Email: support@washhub.com
- Website: www.washhub.com
- GitHub: github.com/yourusername/carwash

---

## ✅ Checklist Before Going Live

- [ ] All environment variables set
- [ ] Database indexes created
- [ ] Razorpay live keys configured
- [ ] HTTPS/SSL enabled
- [ ] Monitoring setup (Sentry, etc)
- [ ] Backups configured
- [ ] Team trained
- [ ] Performance tested
- [ ] Security audit done
- [ ] Deployment automated

---

## 🎓 Learning Path

**Week 1: Setup & Basics**
- [ ] Complete this quick start
- [ ] Read ARCHITECTURE.md
- [ ] Understand file structure
- [ ] Test all pages

**Week 2: Backend**
- [ ] Read API_DOCUMENTATION.md
- [ ] Understand database models
- [ ] Test API endpoints
- [ ] Create test data

**Week 3: Frontend**
- [ ] Learn component structure
- [ ] Modify components
- [ ] Update styles
- [ ] Add new features

**Week 4: Deployment**
- [ ] Read DEPLOYMENT.md
- [ ] Set up staging
- [ ] Deploy to production
- [ ] Monitor performance

---

## 🎨 Customization Guide

### Change Colors
```javascript
// tailwind.config.js
theme: {
  colors: {
    primary: '#your-color',
    secondary: '#your-color'
  }
}
```

### Change Service Prices
```bash
# Use admin panel at /admin
# Or update database directly
```

### Change Logo
```javascript
// src/app/component/Header.jsx
// Replace with your logo
<img src="/your-logo.png" />
```

### Change Business Name
```bash
# Find "WashHub" and replace with your name
# Update .env variables
# Update favicon and metadata
```

---

**Happy Coding! 🚀**

For detailed information, check the other documentation files.

**Last Updated:** January 21, 2026
