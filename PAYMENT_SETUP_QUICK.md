# ⚡ Payment Integration - Quick Setup Guide

## 🚀 5-Minute Setup

### Step 1: Install Package
```bash
npm install razorpay
```

### Step 2: Add Environment Variables
Create/update `.env.local`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Get Test Credentials
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up (free account)
3. Go to Settings → API Keys
4. Copy test keys (prefixed with `rzp_test_`)

### Step 4: Integrate with Booking
Update your booking component to add "Proceed to Payment" button:

```jsx
// In src/app/component/Book.jsx
import Link from 'next/link';

<Link href={`/payment?bookingId=${bookingId}&amount=${amount}&service=${service}`}>
  <Button type="primary" size="large">
    Proceed to Payment
  </Button>
</Link>
```

### Step 5: Test Payment
1. Start dev server: `npm run dev`
2. Complete a booking
3. Click "Proceed to Payment"
4. Use test card: **4111 1111 1111 1111**
5. Expiry: 12/25, CVV: 123
6. Check booking confirmation page

---

## 📁 Files Created/Modified

### New Files
- ✅ `src/app/models/Payment.js` - Payment schema
- ✅ `src/app/api/payment/create/route.js` - Create payment order
- ✅ `src/app/api/payment/verify/route.js` - Verify payment
- ✅ `src/app/api/payment/details/route.js` - Fetch payment details
- ✅ `src/app/component/Payment.jsx` - Payment page
- ✅ `src/app/component/BookingConfirmation.jsx` - Confirmation page
- ✅ `src/app/payment/page.js` - Payment route
- ✅ `src/app/booking-confirmation/page.js` - Confirmation route

### Documentation
- ✅ `PAYMENT_INTEGRATION.md` - Complete documentation
- ✅ `PAYMENT_SETUP_QUICK.md` - This file

---

## 🧪 Test Scenarios

### ✅ Successful Payment
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- **Result:** ✅ Payment confirmed

### ❌ Failed Payment
- Card: 4444 3333 2222 1111
- Expiry: Any future date
- CVV: Any 3 digits
- **Result:** ❌ Payment failed

### 💰 UPI Test
- Success UPI: **success@razorpay**
- Failed UPI: **failed@razorpay**

---

## 🔒 Security Checklist

- [ ] Never commit `.env.local` to git
- [ ] Use test keys in development
- [ ] Use live keys ONLY in production
- [ ] Verify signature on backend ALWAYS
- [ ] Keep KEY_SECRET secret (never expose to frontend)
- [ ] Validate amount on backend
- [ ] Log all transactions

---

## 🐛 Quick Troubleshooting

### Issue: "RAZORPAY_KEY_ID is undefined"
```bash
# Solution: Restart development server
npm run dev
```

### Issue: Signature verification failed
```javascript
// Check in src/app/api/payment/verify/route.js
// Make sure RAZORPAY_KEY_SECRET is correct
console.log(process.env.RAZORPAY_KEY_SECRET); // Should show your secret
```

### Issue: Payment page shows blank
```bash
# Check browser console (F12)
# Verify booking ID and amount are in URL
# ?bookingId=xxx&amount=600&service=Premium
```

---

## 📊 Payment Flow Diagram

```
User Booking Form
        ↓
   Click "Proceed to Payment"
        ↓
   /payment page loads
        ↓
   Fill customer details
        ↓
   Click "Pay ₹XXX"
        ↓
   Razorpay Modal Opens
        ↓
   Select Payment Method
        ↓
   Enter Payment Details
        ↓
   Complete Payment
        ↓
   Verify Signature (Backend)
        ↓
   Update Booking Status
        ↓
   /booking-confirmation page
        ↓
   Print/Download Invoice
```

---

## 📞 Next Steps

1. **Add Email Notifications** - Send receipts after payment
2. **Refund System** - Process refunds from admin panel
3. **Admin Payment Dashboard** - View all transactions
4. **Invoice Generation** - Generate PDF invoices
5. **Payment Analytics** - Track revenue metrics

---

## 💡 Tips

- Test with test cards first before going live
- Use Razorpay Dashboard to monitor transactions
- Set up webhooks for real-time updates
- Implement error handling for network failures
- Add retry mechanism for failed payments

---

## 🎯 You're All Set!

Payment integration is now active. Users can book and pay online! 🎉

For detailed documentation, see: `PAYMENT_INTEGRATION.md`

---

**Need help?** Check the troubleshooting section in `PAYMENT_INTEGRATION.md`
