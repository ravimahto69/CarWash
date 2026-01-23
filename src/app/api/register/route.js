import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import User from '@/app/models/User'
import bcryptjs from 'bcryptjs'

export async function POST(req) {
  try {
    const body = await req.json()

    // Validate required fields
    const required = ['name', 'email', 'password', 'confirmPassword']
    const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === '')
    if (missing.length) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if passwords match
    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Check password length
    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    await dbConnection()

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email.toLowerCase() })
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(body.password, 10)

    // Create the user
    const user = await User.create({
      name: body.name,
      email: body.email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      authProvider: null,
      authProviderId: null,
    })

    return NextResponse.json(
      {
        success: true,
        userId: user._id,
        message: 'User registered successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('Register POST error:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to register user' },
      { status: 500 }
    )
  }
}
