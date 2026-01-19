import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import Store from '@/app/models/Store'

export async function GET() {
  try {
    await dbConnection()
    const stores = await Store.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: stores }, { status: 200 })
  } catch (err) {
    console.error('Stores GET error:', err)
    return NextResponse.json({ success: false, error: 'Failed to load stores' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const required = ['name', 'address', 'latitude', 'longitude']
    const missing = required.filter((k) => !body?.[k] && body[k] !== 0 && body[k] !== false)
    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    await dbConnection()

    // Prepare store data
    const storeData = {
      name: body.name,
      address: body.address,
      city: body.city || '',
      state: body.state || '',
      zip: body.zip || '',
      phone: body.phone || '',
      latitude: Number(body.latitude),
      longitude: Number(body.longitude),
      // Create GeoJSON location object for geospatial queries
      location: {
        type: 'Point',
        coordinates: [Number(body.longitude), Number(body.latitude)] // [longitude, latitude]
      },
      isActive: body.isActive !== undefined ? !!body.isActive : true,
    }

    const store = await Store.create(storeData)

    return NextResponse.json({ success: true, data: store }, { status: 201 })
  } catch (err) {
    console.error('Stores POST error:', err)
    return NextResponse.json({ success: false, error: err.message || 'Failed to create store' }, { status: 500 })
  }
}
