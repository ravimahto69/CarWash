import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import Service from '@/app/models/Service'

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    await dbConnection()

    // Normalize prices
    const prices = typeof body.prices === 'object' && body.prices !== null ? body.prices : {}
    if (body.prices) {
      for (const key of Object.keys(body.prices)) {
        const val = body.prices[key]
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          prices[key] = Number(val)
        }
      }
    }

    const updateData = {
      ...(body.name && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.durationMin !== undefined && { durationMin: Number(body.durationMin) }),
      ...(body.vehicleTags && { vehicleTags: Array.isArray(body.vehicleTags) ? body.vehicleTags : [] }),
      ...(Object.keys(prices).length > 0 && { prices }),
      ...(body.isActive !== undefined && { isActive: !!body.isActive }),
    }

    const service = await Service.findByIdAndUpdate(id, updateData, { new: true })

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: service }, { status: 200 })
  } catch (err) {
    console.error('Services PUT error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Service ID is required' },
        { status: 400 }
      )
    }

    await dbConnection()
    const service = await Service.findByIdAndDelete(id)

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Service deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error('Services DELETE error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
