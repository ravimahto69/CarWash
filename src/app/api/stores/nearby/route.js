import dbConnection from '@/app/lib/db'
import Store from '@/app/models/Store'

// GET nearby stores based on user location
export async function GET(req) {
  try {
    await dbConnection()

    const { searchParams } = new URL(req.url)
    const latitude = parseFloat(searchParams.get('latitude'))
    const longitude = parseFloat(searchParams.get('longitude'))
    const maxDistance = parseFloat(searchParams.get('maxDistance')) || 5000 // Default 5km
    const minRating = parseFloat(searchParams.get('minRating')) || 0
    const limit = parseInt(searchParams.get('limit')) || 20

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return Response.json(
        { error: 'Invalid latitude or longitude' },
        { status: 400 }
      )
    }

    // MongoDB geospatial query
    const stores = await Store.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      },
      rating: { $gte: minRating },
      isActive: true
    })
      .select('-__v')
      .limit(limit)
      .lean()

    // Calculate distance for each store
    const storesWithDistance = stores.map(store => {
      const distance = calculateDistance(
        latitude,
        longitude,
        store.latitude,
        store.longitude
      )
      const estimatedTime = Math.ceil(distance / 2) + 5 // Rough estimate: 30km/hr + 5 min waiting
      return {
        ...store,
        distance: parseFloat(distance.toFixed(2)), // in km
        estimatedTime // in minutes
      }
    })

    return Response.json({
      success: true,
      count: storesWithDistance.length,
      data: storesWithDistance
    })
  } catch (err) {
    console.error('Nearby stores error:', err)
    return Response.json(
      { error: err.message || 'Failed to fetch nearby stores' },
      { status: 500 }
    )
  }
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180
}
