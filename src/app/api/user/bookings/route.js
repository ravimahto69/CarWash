import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import Booking from '@/app/models/Booking'

export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    await dbConnection()
    
    // Find all bookings for this user's email, sorted by most recent first
    const bookings = await Booking.find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    )
  } catch (err) {
    console.error('User bookings GET error:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
