import { NextResponse } from 'next/server'
import dbConnection from '@/app/lib/db'
import Service from '@/app/models/Service'

// Seed India-specific packages with per-vehicle pricing
export async function POST() {
  try {
    await dbConnection()

    const packages = [
      {
        name: 'Bike Basic Wash',
        description: 'Quick foam wash for bikes/scooters; gentle rinse and wipe.',
        durationMin: 10,
        vehicleTags: ['bike'],
        prices: { bike: 199 },
        isActive: true,
      },
      {
        name: 'Bike Premium Foam',
        description: 'Thick foam, chain area clean, optional chain lube add-on.',
        durationMin: 15,
        vehicleTags: ['bike'],
        prices: { bike: 349 },
        isActive: true,
      },
      {
        name: 'Hatchback Express Wash',
        description: 'Exterior foam wash + quick interior wipe for hatchbacks.',
        durationMin: 25,
        vehicleTags: ['hatchback'],
        prices: { hatchback: 399 },
        isActive: true,
      },
      {
        name: 'Sedan Premium Wash',
        description: 'Exterior foam, interior vacuum, mats and dashboard sanitize.',
        durationMin: 30,
        vehicleTags: ['sedan'],
        prices: { sedan: 699 },
        isActive: true,
      },
      {
        name: 'SUV Deep Clean',
        description: 'Pressure rinse, foam, interior vacuum; ideal for SUVs/MUVs.',
        durationMin: 40,
        vehicleTags: ['suv'],
        prices: { suv: 899 },
        isActive: true,
      },
      {
        name: 'Interior Spa',
        description: 'Steam + vacuum, upholstery refresh, dashboard & console detail.',
        durationMin: 45,
        vehicleTags: ['bike', 'hatchback', 'sedan', 'suv'],
        prices: { bike: 299, hatchback: 599, sedan: 699, suv: 799 },
        isActive: true,
      },
      {
        name: 'Ceramic Coat Prep',
        description: 'Decontamination, clay, single-stage polish prior to coating.',
        durationMin: 90,
        vehicleTags: ['hatchback', 'sedan', 'suv', 'luxury', 'ev'],
        prices: { hatchback: 1499, sedan: 1699, suv: 1899, luxury: 2499, ev: 1799 },
        isActive: true,
      },
      {
        name: 'Luxury Detailing',
        description: 'Multi-stage polish, trim restore, tyre dressing, glass care.',
        durationMin: 120,
        vehicleTags: ['luxury'],
        prices: { luxury: 1999 },
        isActive: true,
      },
    ]

    // Upsert by name to avoid duplicates
    const ops = packages.map((pkg) => ({
      updateOne: {
        filter: { name: pkg.name },
        update: { $set: pkg },
        upsert: true,
      },
    }))

    await Service.bulkWrite(ops, { ordered: false })

    const all = await Service.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: all }, { status: 200 })
  } catch (err) {
    console.error('Services SEED error:', err)
    return NextResponse.json({ success: false, error: 'Failed to seed services' }, { status: 500 })
  }
}
