# OAuth Setup Guide for Google and Facebook Authentication

## Overview
This guide will help you set up Google and Facebook OAuth authentication for your WashHub application.

## ✅ What's Already Done
- NextAuth.js installed and configured
- MongoDB adapter set up
- Login and Register components updated with OAuth buttons
- User model updated to support OAuth users
- Session provider added to the app

## 🔧 Setup Instructions

### 1. Google OAuth Setup

#### Step 1: Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

#### Step 2: Create a New Project (if needed)
- Click on the project dropdown at the top
- Click "New Project"
- Name it "WashHub" and click Create

#### Step 3: Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API"
- Click on it and press "Enable"

#### Step 4: Create OAuth Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth client ID"
- If prompted, configure the OAuth consent screen:
  - Choose "External" user type
  - Fill in App name: "WashHub"
  - Add your email for support
  - Add Authorized domains: localhost (for development)
  - Click Save and Continue through the rest

#### Step 5: Configure OAuth Client
- Application type: "Web application"
- Name: "WashHub Web Client"
- Authorized JavaScript origins:
  - http://localhost:3000
  - http://localhost:3001 (if needed)
- Authorized redirect URIs:
  - http://localhost:3000/api/auth/callback/google
  - http://localhost:3001/api/auth/callback/google (if needed)
- Click "Create"

#### Step 6: Copy Credentials
- Copy the "Client ID" and "Client Secret"
- Update your `.env` file:
  ```env
  GOOGLE_CLIENT_ID=your-actual-client-id-here
  GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
  ```

---

### 2. Facebook OAuth Setup

#### Step 1: Go to Facebook Developers
- Visit: https://developers.facebook.com/
- Sign in with your Facebook account

#### Step 2: Create a New App
- Click "My Apps" > "Create App"
- Choose "Consumer" as the app type
- Click "Next"

#### Step 3: Fill in App Details
- App Name: "WashHub"
- App Contact Email: Your email
- Click "Create App"

#### Step 4: Add Facebook Login Product
- In the dashboard, find "Facebook Login"
- Click "Set Up"
- Choose "Web" platform

#### Step 5: Configure OAuth Settings
- Go to "Facebook Login" > "Settings" in the left sidebar
- Add Valid OAuth Redirect URIs:
  - http://localhost:3000/api/auth/callback/facebook
  - http://localhost:3001/api/auth/callback/facebook (if needed)
- Save Changes

#### Step 6: Get App Credentials
- Go to "Settings" > "Basic" in the left sidebar
- Copy "App ID" and "App Secret"
- Update your `.env` file:
  ```env
  FACEBOOK_CLIENT_ID=your-actual-app-id-here
  FACEBOOK_CLIENT_SECRET=your-actual-app-secret-here
  ```

#### Step 7: Make App Live (Optional)
- For production, switch your app from "Development" to "Live" mode
- In Settings > Basic, toggle the App Mode switch

---

## 🚀 Testing Your Setup

### 1. Restart Your Development Server
```bash
npm run dev
```

### 2. Test Google Login
- Go to http://localhost:3000/login
- Click the "Google" button
- Sign in with your Google account
- You should be redirected to the homepage

### 3. Test Facebook Login
- Go to http://localhost:3000/login
- Click the "Facebook" button
- Sign in with your Facebook account
- You should be redirected to the homepage

### 4. Check Database
- Check your MongoDB database
- You should see a new user created with:
  - `authProvider: 'google'` or `'facebook'`
  - `authProviderId: <provider-specific-id>`

---

## 🔒 Production Setup

### For Google:
1. Add your production domain to Authorized JavaScript origins
2. Add production callback URL: `https://yourdomain.com/api/auth/callback/google`
3. Update `NEXTAUTH_URL` in production `.env`

### For Facebook:
1. Add production domain to App Domains in Settings > Basic
2. Add production callback URL: `https://yourdomain.com/api/auth/callback/facebook`
3. Switch app to Live mode
4. Complete the App Review if needed
5. Update `NEXTAUTH_URL` in production `.env`

---

## 📝 Environment Variables Reference

Make sure your `.env` file has all these variables:

```env
# Database
MONGO_DB_URL=mongodb://localhost:27017/carWashDB
MONGODB_URI=mongodb://localhost:27017/carWashDB

# JWT
JWT_SECRET=your-jwt-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Razorpay
RAZOR_KEY_ID=your-razorpay-key
RAZOR_KEY_SECRET=your-razorpay-secret
```

---

## 🐛 Troubleshooting

### Google OAuth Issues:
- **Error: redirect_uri_mismatch**
  - Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
  - Check for trailing slashes

- **Error: Access blocked**
  - Complete the OAuth consent screen configuration
  - Add test users if in development mode

### Facebook OAuth Issues:
- **Error: URL Blocked**
  - Check Valid OAuth Redirect URIs in Facebook Login settings
  - Make sure your app is in Development mode for localhost testing

- **Error: App Not Setup**
  - Ensure Facebook Login product is added to your app
  - Check that all required settings are configured

### General Issues:
- **Session not persisting**
  - Check `NEXTAUTH_SECRET` is set in `.env`
  - Restart your development server

- **MongoDB connection issues**
  - Verify `MONGODB_URI` is correct
  - Make sure MongoDB is running

---

## 🎉 Features Included

✅ Google OAuth Login & Signup  
✅ Facebook OAuth Login & Signup  
✅ Traditional email/password login  
✅ Automatic user creation for OAuth users  
✅ Session management with NextAuth  
✅ MongoDB integration  
✅ Seamless user experience  
✅ Loading states and error handling  
✅ Dark mode compatible  

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)

---

## ⚠️ Important Notes

1. **Never commit your `.env` file** to version control
2. Keep your OAuth secrets secure
3. Use different credentials for development and production
4. Regularly rotate your secrets for security
5. Monitor your OAuth usage in the respective consoles

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check your server logs
3. Verify all environment variables are set correctly
4. Ensure your OAuth apps are properly configured
5. Test with incognito/private browsing to rule out cache issues
