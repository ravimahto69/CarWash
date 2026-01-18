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
    const required = ['name', 'address']
    const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === '')
    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    await dbConnection()

    const store = await Store.create({
      name: body.name,
      address: body.address,
      city: body.city || '',
      state: body.state || '',
      zip: body.zip || '',
      phone: body.phone || '',
      latitude: body.latitude !== undefined ? Number(body.latitude) : undefined,
      longitude: body.longitude !== undefined ? Number(body.longitude) : undefined,
      isActive: body.isActive !== undefined ? !!body.isActive : true,
    })

    return NextResponse.json({ success: true, data: store }, { status: 201 })
  } catch (err) {
    console.error('Stores POST error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create store' }, { status: 500 })
  }
}
