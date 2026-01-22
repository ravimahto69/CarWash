# OAuth Setup - Quick Start

## 🚀 Quick Steps to Get Google & Facebook Login Working

### 1. Get Google Credentials (5 minutes)
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### 2. Get Facebook Credentials (5 minutes)
1. Go to https://developers.facebook.com/
2. Create a new app (Consumer type)
3. Add Facebook Login product
4. Add redirect URI: `http://localhost:3000/api/auth/callback/facebook`
5. Copy App ID and Secret to `.env`

### 3. Update .env File
```env
GOOGLE_CLIENT_ID=paste-your-google-client-id
GOOGLE_CLIENT_SECRET=paste-your-google-client-secret
FACEBOOK_CLIENT_ID=paste-your-facebook-app-id
FACEBOOK_CLIENT_SECRET=paste-your-facebook-app-secret
```

### 4. Restart Server
```bash
npm run dev
```

### 5. Test It!
- Visit http://localhost:3000/login
- Click Google or Facebook button
- Sign in and you're done! 🎉

---

## 📋 What Has Been Implemented

✅ **NextAuth.js Integration**
- OAuth authentication system
- Session management
- MongoDB adapter for user storage

✅ **Google OAuth**
- Login with Google button
- Auto user creation
- Secure authentication flow

✅ **Facebook OAuth**
- Login with Facebook button
- Auto user creation
- Secure authentication flow

✅ **Enhanced UI**
- Loading states for OAuth buttons
- Error handling
- Smooth redirects
- Beautiful animations

✅ **Database Updates**
- User model supports OAuth
- Tracks auth provider (google/facebook)
- Maintains backward compatibility with email/password

---

## 🎯 File Changes Made

1. **New Files:**
   - `/src/app/api/auth/[...nextauth]/route.js` - NextAuth configuration
   - `/src/app/lib/mongodb-client.js` - MongoDB client for NextAuth
   - `/src/app/component/NextAuthProvider.jsx` - Session provider wrapper

2. **Updated Files:**
   - `/src/app/component/Login.jsx` - Added Google/Facebook OAuth
   - `/src/app/component/Register.jsx` - Added Google/Facebook OAuth
   - `/src/app/models/User.js` - Added OAuth fields
   - `/src/app/layout.js` - Wrapped with SessionProvider
   - `.env` - Added OAuth credentials

3. **Installed Packages:**
   - `next-auth` - Authentication library
   - `@auth/mongodb-adapter` - MongoDB integration

---

## 🔑 Environment Variables Needed

```env
# Required for NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (get from Facebook Developers)
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Existing (keep these)
MONGODB_URI=mongodb://localhost:27017/carWashDB
JWT_SECRET=your-jwt-secret
```

---

## 💡 How It Works

1. **User clicks Google/Facebook button**
2. NextAuth redirects to provider's login page
3. User authorizes the app
4. Provider redirects back with auth code
5. NextAuth exchanges code for user info
6. System checks if user exists in MongoDB
7. If new user → creates account automatically
8. If existing → updates with OAuth info
9. User is logged in and redirected to homepage

---

## 🎨 User Experience

- **First time users:** Automatically creates account with Google/Facebook
- **Existing users:** Can link OAuth to existing account
- **Smooth flow:** No page reloads, loading indicators shown
- **Error handling:** Clear messages if something goes wrong
- **Dark mode:** Full support for dark theme

---

## 📱 Testing Checklist

- [ ] Google login button appears on /login
- [ ] Facebook login button appears on /login
- [ ] Google signup button appears on /register
- [ ] Facebook signup button appears on /register
- [ ] Clicking Google button opens Google login
- [ ] Clicking Facebook button opens Facebook login
- [ ] Successful login redirects to homepage
- [ ] User data saved in MongoDB
- [ ] Can logout and login again
- [ ] Traditional email/password still works

---

## 🔐 Security Features

- JWT-based sessions
- Secure OAuth flow
- MongoDB session storage
- Environment variable protection
- CSRF protection (built-in NextAuth)
- Secure cookie handling

---

## 📖 Full Documentation

See [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md) for detailed setup instructions including:
- Step-by-step Google Cloud Console setup
- Step-by-step Facebook Developers setup
- Production deployment guide
- Troubleshooting common issues
- Security best practices

---

## ⚡ Next Steps

1. Get OAuth credentials from Google and Facebook
2. Add them to your `.env` file
3. Restart your development server
4. Test the login flow
5. Deploy to production when ready!

---

## 🆘 Common Issues

**"redirect_uri_mismatch" error?**
→ Check your redirect URIs match exactly in Google/Facebook console

**OAuth buttons not working?**
→ Verify credentials in `.env` file, restart server

**User not created in database?**
→ Check MongoDB is running, verify MONGODB_URI

**Session not persisting?**
→ Clear browser cookies, check NEXTAUTH_SECRET is set

---

For detailed troubleshooting, see the full [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md)
