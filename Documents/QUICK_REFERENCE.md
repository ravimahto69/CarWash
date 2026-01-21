# 📍 Location-Based Search - Quick Reference

## ⚡ Quick Start (2 minutes)

```
1. Run: http://localhost:3000/api/stores/seed
   → See "5 sample stores added successfully"

2. Go to: http://localhost:3000/nearby-stores
   → Click "Find Nearby" in navigation

3. Allow location when browser asks

4. See stores sorted by distance ✅
```

---

## 🔗 Key URLs

| Action | URL |
|--------|-----|
| 🏠 Find Nearby Stores | `/nearby-stores` |
| 📊 Seed Sample Data | `/api/stores/nearby?latitude=40.7128&longitude=-74.006&maxDistance=5000` |
| 🔍 Search Stores | `/api/stores/search` (POST) |
| 📍 Nearest Stores | `/api/stores/nearby` (GET) |

---

## 📱 Components

```jsx
// Main feature
import NearbyStores from '@/app/component/NearbyStores'

// Store card
import StoreCard from '@/app/component/StoreCard'

// Then use:
<NearbyStores />
```

---

## 🎯 Features

✅ Auto-detect location (5km radius)  
✅ Filter by distance (1-20km)  
✅ Filter by rating (0-5 stars)  
✅ Filter by price range  
✅ Check available bays  
✅ View operating hours  
✅ See facilities/amenities  
✅ Get Google Maps directions  
✅ Dark mode support  
✅ Mobile responsive  

---

## 🧪 Test Stores (After Seeding)

```
Downtown Wash Center     - 4.8⭐ - 0.8km - $19-$49
Premium Auto Spa         - 4.9⭐ - 5.2km - $24-$69
Elite Car Care          - 4.7⭐ - 4.2km - $24-$89
Uptown Wash Zone        - 4.3⭐ - 4.1km - $17-$39
Quick Wash Express      - 4.1⭐ - 0.5km - $14-$22
```

---

## 📊 API Quick Reference

### GET Nearby Stores
```javascript
fetch('/api/stores/nearby?latitude=40.7128&longitude=-74.006&maxDistance=5000')
  .then(r => r.json())
  .then(data => console.log(data.data))
```

### POST Search with Filters
```javascript
fetch('/api/stores/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    latitude: 40.7128,
    longitude: -74.006,
    maxDistance: 5000,
    minRating: 4,
    availableBaysOnly: true
  })
})
```

---

## 🛠️ Behind the Scenes

**Distance Calculation:** Haversine Formula  
**Location Indexing:** MongoDB 2dsphere  
**Geolocation:** Browser Geolocation API  
**Maps:** Google Maps Integration  

---

## 🎨 UI Colors

| Element | Color |
|---------|-------|
| Distance Badge | Blue |
| Available Bays | Green |
| Wait Time | Green |
| Rating | Yellow |
| Price | Green |
| Filter Panel | Blue |

---

## 🔧 Add Your Own Store

```javascript
// POST to /api/stores with:
{
  name: "My Wash Center",
  address: "123 Street",
  city: "New York",
  state: "NY",
  zip: "10001",
  phone: "+1-555-123-4567",
  location: {
    type: "Point",
    coordinates: [-74.006, 40.7128]
  },
  services: [
    { name: "Basic Wash", price: 19.99, duration: 15 }
  ],
  capacity: 10,
  rating: 4.5,
  reviewCount: 50,
  facilities: {
    hasParking: true,
    hasWaitingArea: true,
    hasWifi: false,
    hasRefreshments: false,
    hasRestroom: true
  }
}
```

---

## 📱 Mobile Checklist

- ✅ Responsive grid layout
- ✅ Touch-friendly buttons
- ✅ Fast geolocation access
- ✅ Scroll-friendly filters
- ✅ Modal details view
- ✅ Direct phone dialing
- ✅ Maps direction link

---

## 🚨 If Something's Wrong

| Problem | Solution |
|---------|----------|
| No stores showing | Visit `/api/stores/seed` first |
| Location not working | Check browser permissions, use fallback |
| Slow queries | Verify geospatial index exists |
| Distances wrong | Check coordinates format (lon, lat) |
| Filters not working | Clear browser cache, refresh page |

---

## 📈 Performance Tips

1. Limit results: `?limit=20`
2. Use geospatial index
3. Filter client-side for small datasets
4. Cache frequently accessed stores
5. Use `.lean()` for read-only queries

---

## 🎓 Learning Resources

- 📚 [MongoDB Geospatial](https://docs.mongodb.com/manual/geospatial-queries/)
- 🗺️ [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)
- 📍 [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- 🗺️ [Google Maps API](https://developers.google.com/maps)

---

## ✨ Pro Tips

1. **Test with different coordinates** - Try different cities
2. **Check browser console** - See API responses
3. **Use network tab** - Monitor API calls
4. **Try all filters** - See results change in real-time
5. **Test on mobile** - Full responsive experience

---

## 🚀 You're All Set!

Everything is configured and ready to use.  
Just visit `/nearby-stores` and start exploring!

**Happy car washing! 🚗✨**
