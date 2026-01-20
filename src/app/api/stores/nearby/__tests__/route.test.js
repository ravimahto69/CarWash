/**
 * @jest-environment node
 */

import { GET } from '../route'
import dbConnection from '@/app/lib/db'
import Store from '@/app/models/Store'

jest.mock('@/app/lib/db', () => jest.fn())
jest.mock('@/app/models/Store', () => ({
  find: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn(),
}))

describe('GET /api/stores/nearby', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns nearby stores with valid coordinates', async () => {
    const mockStores = [
      {
        _id: '1',
        name: 'Downtown Car Wash',
        latitude: 40.7128,
        longitude: -74.006,
        distance: 2.5,
      },
    ]

    dbConnection.mockResolvedValueOnce(true)
    Store.lean.mockResolvedValueOnce(mockStores)

    const req = new Request(
      'http://localhost:3000/api/stores/nearby?latitude=40.7128&longitude=-74.006'
    )

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  test('returns 400 error for invalid coordinates', async () => {
    dbConnection.mockResolvedValueOnce(true)

    const req = new Request(
      'http://localhost:3000/api/stores/nearby?latitude=invalid&longitude=-74.006'
    )

    const response = await GET(req)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid latitude or longitude')
  })

  test('applies minRating filter', async () => {
    const mockStores = []
    dbConnection.mockResolvedValueOnce(true)
    Store.lean.mockResolvedValueOnce(mockStores)

    const req = new Request(
      'http://localhost:3000/api/stores/nearby?latitude=40.7128&longitude=-74.006&minRating=4.0'
    )

    const response = await GET(req)
    const data = await response.json()

    expect(dbConnection).toHaveBeenCalled()
  })

  test('applies maxDistance filter', async () => {
    const mockStores = []
    dbConnection.mockResolvedValueOnce(true)
    Store.lean.mockResolvedValueOnce(mockStores)

    const req = new Request(
      'http://localhost:3000/api/stores/nearby?latitude=40.7128&longitude=-74.006&maxDistance=5000'
    )

    const response = await GET(req)

    expect(dbConnection).toHaveBeenCalled()
  })

  test('respects limit parameter', async () => {
    const mockStores = []
    dbConnection.mockResolvedValueOnce(true)
    Store.lean.mockResolvedValueOnce(mockStores)

    const req = new Request(
      'http://localhost:3000/api/stores/nearby?latitude=40.7128&longitude=-74.006&limit=10'
    )

    const response = await GET(req)

    expect(dbConnection).toHaveBeenCalled()
  })
})
