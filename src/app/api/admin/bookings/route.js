import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import Booking from '@/app/models/Booking'
import Payment from '@/app/models/Payment'

const ALLOWED_STATUSES = ['pending', 'paid', 'completed', 'cancelled']

export async function GET(request) {
  try {
    await dbConnection()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const query = {}
    if (status && ALLOWED_STATUSES.includes(status)) {
      query.bookingStatus = status
    }

    if (from || to) {
      query.createdAt = {}
      if (from) query.createdAt.$gte = new Date(from)
      if (to) query.createdAt.$lte = new Date(to)
    }

    const skip = (page - 1) * limit
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const bookingIds = bookings.map((b) => b._id)
    const payments = await Payment.find({ bookingId: { $in: bookingIds } })
      .sort({ createdAt: -1 })
      .lean()

    const paymentMap = payments.reduce((acc, p) => {
      const key = String(p.bookingId)
      if (!acc[key]) acc[key] = []
      acc[key].push(p)
      return acc
    }, {})

    const results = bookings.map((b) => ({
      ...b,
      payments: paymentMap[String(b._id)] || [],
    }))

    const total = await Booking.countDocuments(query)

    return NextResponse.json({ data: results, page, limit, total })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    await dbConnection()
    const { bookingId, status } = await request.json()

    if (!bookingId || !status || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus: status },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ data: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
