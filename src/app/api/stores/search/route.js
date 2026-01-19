import dbConnection from '@/app/lib/db'
import Store from '@/app/models/Store'

// POST search with advanced filters
export async function POST(req) {
  try {
    await dbConnection()

    const body = await req.json()
    const {
      latitude,
      longitude,
      maxDistance = 5000,
      minRating = 0,
      maxRating = 5,
      availableBaysOnly = false,
      openNow = false,
      services = [],
      priceMin = 0,
      priceMax = 10000,
      limit = 20,
      skip = 0
    } = body

    // Validate coordinates
    if (!latitude || !longitude) {
      return Response.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Build query
    let query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      },
      isActive: true,
      rating: { $gte: minRating, $lte: maxRating }
    }

    // Filter by availability
    if (availableBaysOnly) {
      query.currentQueue = { $lt: mongoose.model('Store').findOne().select('capacity').lean() }
    }

    // Filter by services if provided
    if (services.length > 0) {
      query['services.name'] = { $in: services }
    }

    // Filter by price range if provided
    if (priceMin > 0 || priceMax < 10000) {
      query['services.price'] = {
        $gte: priceMin,
        $lte: priceMax
      }
    }

    // Execute query
    let stores = await Store.find(query)
      .select('-__v')
      .skip(skip)
      .limit(limit)
      .lean()

    // Filter by operating hours if needed
    if (openNow) {
      const now = new Date()
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()]
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })

      stores = stores.filter(store => {
        const dayHours = store.hours?.[dayOfWeek]
        if (!dayHours) return false
        return currentTime >= dayHours.open && currentTime <= dayHours.close
      })
    }

    // Calculate distance and estimated time for each store
    const storesWithDistance = stores.map(store => {
      const distance = calculateDistance(latitude, longitude, store.latitude, store.longitude)
      const estimatedTime = Math.ceil(distance / 2) + 5

      return {
        ...store,
        distance: parseFloat(distance.toFixed(2)),
        estimatedTime,
        availableBays: Math.max(0, store.capacity - store.currentQueue)
      }
    })

    // Sort by distance
    storesWithDistance.sort((a, b) => a.distance - b.distance)

    return Response.json({
      success: true,
      count: storesWithDistance.length,
      data: storesWithDistance
    })
  } catch (err) {
    console.error('Store search error:', err)
    return Response.json(
      { error: err.message || 'Failed to search stores' },
      { status: 500 }
    )
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180
}
