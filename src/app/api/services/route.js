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
    const required = ['name', 'price']
    const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === '')
    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    await dbConnection()

    const service = await Service.create({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      duration: body.duration || '',
      isActive: body.isActive !== undefined ? !!body.isActive : true,
    })

    return NextResponse.json({ success: true, data: service }, { status: 201 })
  } catch (err) {
    console.error('Services POST error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 })
  }
}
