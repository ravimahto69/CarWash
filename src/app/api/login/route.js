import { NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnection from '@/app/lib/db'
import User from '@/app/models/User'

export async function POST(req) {
	try {
		const body = await req.json()
		const JWT_SECRET = process.env.JWT_SECRET?.trim()

		if (!JWT_SECRET) {
			return NextResponse.json(
				{ success: false, error: 'Server misconfiguration: missing JWT_SECRET' },
				{ status: 500 }
			)
		}

		// Validate required fields
		const required = ['email', 'password']
		const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === '')
		if (missing.length) {
			return NextResponse.json(
				{ success: false, error: `Missing required fields: ${missing.join(', ')}` },
				{ status: 400 }
			)
		}

		await dbConnection()

		// Find user by email and include password for verification
		const user = await User.findOne({ email: body.email.toLowerCase() }).select('+password')
		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Compare password
		const isMatch = await bcryptjs.compare(body.password, user.password)
		if (!isMatch) {
			return NextResponse.json(
				{ success: false, error: 'Invalid email or password' },
				{ status: 401 }
			)
		}

		// Generate JWT token
		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
				role: user.role,
			},
			JWT_SECRET,
			{ expiresIn: '7d' }
		)

		const res = NextResponse.json(
			{
				success: true,
				message: 'Login successful',
				token,
				data: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			},
			{ status: 200 }
		)

		// Set token as httpOnly cookie for convenience
		res.cookies.set('auth_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		})

		return res
	} catch (err) {
		console.error('Login POST error:', err)
		return NextResponse.json(
			{ success: false, error: err?.message || 'Failed to login' },
			{ status: 500 }
		)
	}
}
