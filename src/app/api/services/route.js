import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import Service from '@/app/models/Service'

export async function GET() {
  try {
    await dbConnection()
    const services = await Service.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: services }, { status: 200 })
  } catch (err) {
    console.error('Services GET error:', err)
    return NextResponse.json({ success: false, error: 'Failed to load services' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const required = ['name']
    const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === '')
    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    await dbConnection()

    // Normalize prices
    const prices = typeof body.prices === 'object' && body.prices !== null ? body.prices : {}
    // Backward compatibility: if price provided but no prices map
    if (!prices || Object.keys(prices).length === 0) {
      if (body.price !== undefined && body.price !== null && String(body.price).trim() !== '') {
        prices.any = Number(body.price)
      }
    } else {
      // ensure numbers
      for (const key of Object.keys(prices)) {
        const val = prices[key]
        prices[key] = val !== undefined && val !== null && String(val).trim() !== '' ? Number(val) : undefined
      }
    }

    const service = await Service.create({
      name: body.name,
      description: body.description || '',
      price: body.price !== undefined ? Number(body.price) : undefined,
      prices,
      durationMin: body.durationMin ? Number(body.durationMin) : undefined,
      vehicleTags: Array.isArray(body.vehicleTags) ? body.vehicleTags : [],
      isActive: body.isActive !== undefined ? !!body.isActive : true,
    })

    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (err) {
    console.error('Services POST error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 })
  }
}
