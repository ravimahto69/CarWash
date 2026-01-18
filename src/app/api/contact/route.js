import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import Contact from '@/app/models/Contact'

export async function POST(req) {
	try {
		const body = await req.json()
		
		const required = ['name', 'email', 'message']
		const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === '')
		if (missing.length) {
			return NextResponse.json(
				{ success: false, error: `Missing required fields: ${missing.join(', ')}` },
				{ status: 400 }
			)
		}

		await dbConnection()
		

		const contact = await Contact.create({
			name: body.name,
			email: body.email,
			message: body.message,
		})

		return NextResponse.json(
			{ success: true, contactId: contact._id, data: contact },
			{ status: 201 }
		)
	} catch (err) {
		console.error('Contact POST error:', err)
		return NextResponse.json(
			{ success: false, error: err?.message || 'Failed to submit contact message' },
			{ status: 500 }
		)
	}
}

