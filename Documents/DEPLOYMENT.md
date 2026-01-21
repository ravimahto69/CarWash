# Setup & Deployment Guide - WashHub

## 🛠️ Complete Setup Guide

### Phase 1: Prerequisites

Before you begin, ensure you have:

**System Requirements:**
- Node.js 18.17.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm)
- Git
- A code editor (VS Code recommended)

**External Accounts:**
1. **MongoDB Atlas** (Database)
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new project
   - Create a cluster

2. **Razorpay** (Payment Gateway)
   - Go to https://razorpay.com
   - Create business account
   - Complete KYC verification
   - Get API keys

3. **GitHub** (Version Control)
   - Create account if you don't have one
   - Create repository for your project

4. **Vercel** (Deployment - Optional)
   - Go to https://vercel.com
   - Sign up with GitHub

### Phase 2: Local Development Setup

#### Step 1: Clone the Repository
```bash
# Using HTTPS
git clone https://github.com/yourusername/carwash.git

# OR using SSH
git clone git@github.com:yourusername/carwash.git

# Navigate to project
cd CarWash
```

#### Step 2: Install Dependencies
```bash
# Install all required packages
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

**Key Dependencies Installed:**
```json
{
  "next": "^14.2.35",
  "react": "^18",
  "mongoose": "^8.0.0",
  "razorpay": "^2.9.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.2",
  "tailwindcss": "^3.3.0",
  "antd": "^5.11.0"
}
```

#### Step 3: Configure MongoDB

**Get Connection String:**
1. Log in to MongoDB Atlas
2. Navigate to Clusters → Connect
3. Choose "Connect your application"
4. Select Node.js driver
5. Copy connection string

**Format:**
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

**Add IP Whitelist:**
1. Go to Network Access
2. Add IP address of your computer
3. Or allow all IPs (0.0.0.0) for development

#### Step 4: Create Environment File

Create `.env.local` in the root directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/carwash-db?retryWrites=true&w=majority

# Razorpay Keys (From Dashboard → Settings → API Keys)
RAZOR_KEY_ID=rzp_test_XXXXXXXXXXXXXXX
RAZOR_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# JWT Secret (Generate random string)
JWT_SECRET=your_super_secure_random_jwt_key_here_min_32_chars

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Email Configuration (Optional)
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=app_specific_password

# Other Config
NODE_ENV=development
```

**How to Get Razorpay Keys:**
1. Log in to Razorpay Dashboard
2. Go to Settings → API Keys
3. You'll see two keys:
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret (keep this private!)

**Generate JWT Secret:**
```bash
# In terminal/PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output to JWT_SECRET
```

#### Step 5: Run Development Server

```bash
# Start the development server
npm run dev

# You should see:
# > ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

**Access the Application:**
- Open browser: http://localhost:3000
- You should see the WashHub homepage

#### Step 6: Verify Installation

**Test Checklist:**
- [ ] Homepage loads
- [ ] Services page accessible
- [ ] Can navigate to login
- [ ] Can navigate to registration
- [ ] Dark mode toggle works
- [ ] No console errors

### Phase 3: Database Setup

#### Create Initial Data

**Method 1: Using MongoDB Compass (GUI)**
1. Download MongoDB Compass
2. Connect using your MONGO_URI
3. Create collections:
   - users
   - bookings
   - payments
   - services
   - reviews
   - stores
   - contacts

**Method 2: Using API Endpoints**

Create initial services:
```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basic Wash",
    "description": "Water rinse + shampoo",
    "prices": {
      "Sedan": 149,
      "SUV": 199,
      "Bike": 99,
      "Truck": 299
    }
  }'
```

### Phase 4: Feature Testing

#### Test User Registration
1. Go to http://localhost:3000/register
2. Fill in form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "9876543210"
   - Password: "Test@123"
3. Click Register
4. Should redirect to login

#### Test Login
1. Go to http://localhost:3000/login
2. Enter registered email and password
3. Should redirect to dashboard
4. Check localStorage for auth_user

#### Test Booking
1. Go to http://localhost:3000/book
2. Fill in booking form
3. Should show price based on service and vehicle type
4. Submit booking
5. Should redirect to payment page

#### Test Payment
1. On payment page, should see Razorpay button
2. Click "Pay Now"
3. Use test card: 4111 1111 1111 1111
4. Expiry: Any future date
5. CVV: Any 3 digits
6. Should show success message

---

## 🚀 Deployment Guides

### Option 1: Deploy on Vercel (Easiest)

**Step 1: Push to GitHub**
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: WashHub car wash platform"
git branch -M main
git remote add origin https://github.com/yourusername/carwash.git
git push -u origin main
```

**Step 2: Connect Vercel**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select `CarWash` project
5. Click "Import"

**Step 3: Configure Environment Variables**
1. In Vercel Dashboard:
   - Project Settings → Environment Variables
   - Add each variable from `.env.local`:

```
MONGO_URI=mongodb+srv://...
RAZOR_KEY_ID=rzp_live_...
RAZOR_KEY_SECRET=...
JWT_SECRET=...
NEXT_PUBLIC_API_URL=https://your-domain.com
```

**Step 4: Deploy**
1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Once complete, you'll get a URL
4. Your app is now live!

**Update MongoDB IP Whitelist:**
```
Add Vercel's IP to MongoDB Atlas whitelist
1. MongoDB Atlas → Network Access
2. Add IP: 0.0.0.0 (allows all IPs for cloud)
```

**Custom Domain (Optional):**
1. In Vercel Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (15-30 mins)

---

### Option 2: Deploy on AWS EC2

**Step 1: Create EC2 Instance**
1. Go to AWS Console
2. Launch EC2 Instance
3. Select Ubuntu 22.04 LTS
4. Instance type: t3.small (minimum)
5. Security group: Allow ports 80, 443, 3000
6. Create key pair and download `.pem` file

**Step 2: Connect to Server**
```bash
# On your local machine
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-instance-ip
```

**Step 3: Install Node.js**
```bash
# Update packages
sudo apt update
sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

**Step 4: Clone Repository**
```bash
git clone https://github.com/yourusername/carwash.git
cd CarWash
npm install
```

**Step 5: Create Production Environment File**
```bash
# Using nano editor
nano .env.local

# Paste your production environment variables
# MONGO_URI (with production database)
# RAZOR_KEY_ID (production key)
# RAZOR_KEY_SECRET (production secret)
# JWT_SECRET
# NODE_ENV=production
# NEXT_PUBLIC_API_URL=https://yourdomain.com
```

**Step 6: Build and Start Application**
```bash
# Build for production
npm run build

# Test run
npm start

# Should show: ready - started server on 0.0.0.0:3000
```

**Step 7: Setup PM2 (Process Manager)**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start npm --name "carwash" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on reboot
sudo pm2 startup
```

**Step 8: Setup Nginx Reverse Proxy**
```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/carwash

# Add this configuration:
```
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/carwash /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

**Step 9: Setup SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts to configure
# Auto-renewal will be setup automatically
```

**Step 10: Setup Domain DNS**
1. Go to your domain registrar
2. Update DNS records:
   - A record: point to EC2 instance IP
   - CNAME: www points to yourdomain.com
3. Wait for DNS propagation (up to 48 hours)

**Step 11: Monitor Application**
```bash
# View PM2 logs
pm2 logs carwash

# Monitor resources
pm2 monit

# Check application status
pm2 status

# Restart application if needed
pm2 restart carwash
```

---

### Option 3: Deploy with Docker

**Step 1: Create Dockerfile**
```dockerfile
# Dockerfile in root directory
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Step 2: Create docker-compose.yml**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - RAZOR_KEY_ID=${RAZOR_KEY_ID}
      - RAZOR_KEY_SECRET=${RAZOR_KEY_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    restart: always
```

**Step 3: Build and Run**
```bash
docker build -t carwash .
docker run -p 3000:3000 --env-file .env.local carwash
```

---

## 📊 Production Checklist

Before going live, verify:

**Security:**
- [ ] All environment variables set correctly
- [ ] No sensitive data in code
- [ ] HTTPS/SSL certificate installed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured

**Performance:**
- [ ] Database indexes created
- [ ] Caching strategy implemented
- [ ] CDN configured (for static assets)
- [ ] Images optimized
- [ ] Code splitting configured

**Reliability:**
- [ ] Error logging setup (Sentry, LogRocket)
- [ ] Monitoring configured
- [ ] Automated backups enabled
- [ ] Database backup strategy
- [ ] Disaster recovery plan

**Testing:**
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests completed
- [ ] Load testing done
- [ ] Security testing completed

**Deployment:**
- [ ] CI/CD pipeline setup
- [ ] Staging environment tested
- [ ] Rollback plan documented
- [ ] Deployment playbook created
- [ ] Team trained on deployment

---

## 🔧 Troubleshooting

### Issue: MONGO_URI not connecting
```bash
# Check URI format
mongodb+srv://username:password@cluster.mongodb.net/dbname

# Common issues:
# 1. Wrong password - Check special characters (@, #, %) are URL encoded
# 2. IP not whitelisted - Add to MongoDB Atlas Network Access
# 3. User doesn't have database access - Create user with proper role

# Test connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"
```

### Issue: Razorpay payment fails
```bash
# Check test keys are being used
# Development: rzp_test_...
# Production: rzp_live_...

# Verify signature by checking:
# 1. RAZOR_KEY_SECRET is correct (no extra spaces)
# 2. Order ID format is correct
# 3. Payment ID format is correct
```

### Issue: Deployment fails
```bash
# Check build logs
npm run build

# Common issues:
# 1. Missing environment variables - Add to deployment platform
# 2. Compilation errors - Run build locally and fix
# 3. Memory issues - Increase server resources
# 4. Timeout - Increase timeout limits in deployment config
```

### Issue: Performance slow
```bash
# Check database queries
# Add indexes to frequently queried fields

# Reduce bundle size
npm run analyze

# Enable compression in next.config.js
# Enable image optimization
```

---

## 📈 Scaling Guide

### Database Scaling
```
1. Start: MongoDB Atlas M0 (Free)
2. Grow: M10 or larger cluster
3. Scale: Sharding for millions of records
4. Replicate: Multi-region for high availability
```

### Application Scaling
```
1. Single Server (Vercel free tier)
2. Multiple Servers (Load balanced)
3. Kubernetes Cluster (Container orchestration)
4. Global CDN (Geo-distributed)
```

### Monitoring & Analytics
```
- Setup: Sentry for error tracking
- Logs: CloudWatch or Stackdriver
- Metrics: Datadog or New Relic
- Analytics: Google Analytics or Mixpanel
```

---

## 📚 Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)
- [Razorpay Integration Guide](https://razorpay.com/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [AWS EC2 User Guide](https://docs.aws.amazon.com/ec2/)

---

**Last Updated:** January 21, 2026
