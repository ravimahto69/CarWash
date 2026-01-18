import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import Booking from '@/app/models/Booking'

export async function GET(req) {
	try {
		const id = req.nextUrl.searchParams.get('id')
		if (!id) {
			return NextResponse.json({ success: false, error: 'Missing booking id' }, { status: 400 })
		}

		await dbConnection()
		const booking = await Booking.findById(id)

		if (!booking) {
			return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 })
		}

		return NextResponse.json({ success: true, data: booking }, { status: 200 })
	} catch (err) {
		console.error('Booking GET error:', err)
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch booking' },
			{ status: 500 }
		)
	}
}

export async function POST(req) {
	try {
		const body = await req.json()

		const required = [
			'name',
			'phone',
			'email',
			'brand',
			'model',
			'vehicleType',
			'service',
		]

		const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === '')
		if (missing.length) {
			return NextResponse.json(
				{ success: false, error: `Missing required fields: ${missing.join(', ')}` },
				{ status: 400 }
			)
		}

		await dbConnection()

		const booking = await Booking.create({
			name: body.name,
			phone: body.phone,
			email: body.email,
			brand: body.brand,
			model: body.model,
			vehicleType: body.vehicleType,
			service: body.service,
			location: body.location || '',
			notes: body.notes || '',
		})

		return NextResponse.json(
			{ success: true, bookingId: booking._id, data: booking },
			{ status: 201 }
		)
	} catch (err) {
		console.error('Booking POST error:', err)
		return NextResponse.json(
			{ success: false, error: 'Failed to create booking' },
			{ status: 500 }
		)
	}
}
