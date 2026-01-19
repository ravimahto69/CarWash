import dbConnection from '@/app/lib/db'
import Store from '@/app/models/Store'

export async function GET(req) {
  try {
    await dbConnection()

    // Clear existing stores (optional, comment out to keep)
    // await Store.deleteMany({})

    const sampleStores = [
      {
        name: 'Downtown Wash Center',
        description: 'Premium car washing facility in the heart of the city',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA',
        phone: '+1-555-123-4567',
        email: 'downtown@carwash.com',
        website: 'www.carwash.com',
        location: {
          type: 'Point',
          coordinates: [-74.006, 40.7128] // New York
        },
        services: [
          { name: 'Basic Wash', price: 19.99, duration: 15 },
          { name: 'Premium Wash', price: 29.99, duration: 30 },
          { name: 'Full Detail', price: 49.99, duration: 60 },
          { name: 'Interior Clean', price: 34.99, duration: 45 }
        ],
        photos: ['photo1.jpg', 'photo2.jpg'],
        rating: 4.8,
        reviewCount: 247,
        hours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '19:00' },
          sunday: { open: '10:00', close: '17:00' }
        },
        capacity: 10,
        currentQueue: 2,
        estimatedWaitTime: 5,
        facilities: {
          hasParking: true,
          hasWaitingArea: true,
          hasRestroom: true,
          hasWifi: true,
          hasRefreshments: true
        },
        isActive: true
      },
      {
        name: 'Uptown Wash Zone',
        description: 'Fast and reliable car washing in uptown area',
        address: '456 Oak Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10021',
        country: 'USA',
        phone: '+1-555-987-6543',
        email: 'uptown@carwash.com',
        location: {
          type: 'Point',
          coordinates: [-73.9657, 40.7806] // Uptown NYC
        },
        services: [
          { name: 'Basic Wash', price: 17.99, duration: 15 },
          { name: 'Premium Wash', price: 27.99, duration: 30 },
          { name: 'Interior Clean', price: 32.99, duration: 45 }
        ],
        photos: [],
        rating: 4.3,
        reviewCount: 89,
        hours: {
          monday: { open: '09:00', close: '19:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '19:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '21:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '10:00', close: '18:00' }
        },
        capacity: 8,
        currentQueue: 1,
        estimatedWaitTime: 3,
        facilities: {
          hasParking: true,
          hasWaitingArea: true,
          hasRestroom: false,
          hasWifi: false,
          hasRefreshments: true
        },
        isActive: true
      },
      {
        name: 'Premium Auto Spa',
        description: 'Luxury car washing and detailing services',
        address: '789 Park Lane',
        city: 'New York',
        state: 'NY',
        zip: '10075',
        country: 'USA',
        phone: '+1-555-456-7890',
        email: 'premium@carwash.com',
        location: {
          type: 'Point',
          coordinates: [-73.9597, 40.7681] // Upper East Side
        },
        services: [
          { name: 'Premium Wash', price: 39.99, duration: 30 },
          { name: 'Full Detail', price: 69.99, duration: 90 },
          { name: 'Ceramic Coating', price: 99.99, duration: 120 },
          { name: 'Interior Clean', price: 44.99, duration: 60 }
        ],
        photos: [],
        rating: 4.9,
        reviewCount: 156,
        hours: {
          monday: { open: '07:00', close: '20:00' },
          tuesday: { open: '07:00', close: '20:00' },
          wednesday: { open: '07:00', close: '20:00' },
          thursday: { open: '07:00', close: '20:00' },
          friday: { open: '07:00', close: '21:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '09:00', close: '19:00' }
        },
        capacity: 5,
        currentQueue: 5,
        estimatedWaitTime: 45,
        facilities: {
          hasParking: true,
          hasWaitingArea: true,
          hasRestroom: true,
          hasWifi: true,
          hasRefreshments: true
        },
        isActive: true
      },
      {
        name: 'Quick Wash Express',
        description: 'Fast and affordable car washing service',
        address: '321 Broadway',
        city: 'New York',
        state: 'NY',
        zip: '10007',
        country: 'USA',
        phone: '+1-555-789-0123',
        email: 'quickwash@carwash.com',
        location: {
          type: 'Point',
          coordinates: [-74.0089, 40.7128] // Downtown
        },
        services: [
          { name: 'Basic Wash', price: 14.99, duration: 10 },
          { name: 'Quick Polish', price: 22.99, duration: 20 }
        ],
        photos: [],
        rating: 4.1,
        reviewCount: 342,
        hours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '07:00', close: '22:00' },
          sunday: { open: '08:00', close: '21:00' }
        },
        capacity: 12,
        currentQueue: 6,
        estimatedWaitTime: 15,
        facilities: {
          hasParking: false,
          hasWaitingArea: true,
          hasRestroom: false,
          hasWifi: false,
          hasRefreshments: false
        },
        isActive: true
      },
      {
        name: 'Elite Car Care',
        description: 'Professional detailing and maintenance services',
        address: '555 5th Avenue',
        city: 'New York',
        state: 'NY',
        zip: '10017',
        country: 'USA',
        phone: '+1-555-234-5678',
        email: 'elite@carwash.com',
        location: {
          type: 'Point',
          coordinates: [-73.9776, 40.7549] // Midtown
        },
        services: [
          { name: 'Premium Wash', price: 35.99, duration: 30 },
          { name: 'Full Detail', price: 59.99, duration: 75 },
          { name: 'Paint Protection', price: 89.99, duration: 90 }
        ],
        photos: [],
        rating: 4.7,
        reviewCount: 201,
        hours: {
          monday: { open: '08:00', close: '19:00' },
          tuesday: { open: '08:00', close: '19:00' },
          wednesday: { open: '08:00', close: '19:00' },
          thursday: { open: '08:00', close: '19:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '19:00' },
          sunday: { open: '11:00', close: '18:00' }
        },
        capacity: 7,
        currentQueue: 3,
        estimatedWaitTime: 8,
        facilities: {
          hasParking: true,
          hasWaitingArea: true,
          hasRestroom: true,
          hasWifi: true,
          hasRefreshments: true
        },
        isActive: true
      }
    ]

    // Insert sample stores
    const result = await Store.insertMany(sampleStores)

    return Response.json({
      success: true,
      message: `${result.length} sample stores added successfully`,
      data: result
    })
  } catch (err) {
    console.error('Seed error:', err)
    return Response.json(
      { error: err.message || 'Failed to seed stores' },
      { status: 500 }
    )
  }
}
