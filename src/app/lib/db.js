import mongoose from 'mongoose'

const MONGO_URL = process.env.MONGO_DB_URL

if (!MONGO_URL) {
    throw new Error('Please set the MONGO_DB_URL environment variable')
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function dbConnection() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URL, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }).catch(err => {
            console.error('MongoDB connection error:', err)
            throw err
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnection