/**
 * @jest-environment node
 */

describe('Distance Calculation Utilities', () => {
  // Haversine formula to calculate distance between two coordinates
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  test('calculates distance between same coordinates as zero', () => {
    const distance = calculateDistance(40.7128, -74.006, 40.7128, -74.006)
    expect(distance).toBeLessThan(0.01) // Account for floating point precision
  })

  test('calculates distance between New York and Los Angeles', () => {
    // NYC: 40.7128, -74.006 | LA: 34.0522, -118.2437
    const distance = calculateDistance(40.7128, -74.006, 34.0522, -118.2437)
    expect(distance).toBeGreaterThan(3900) // Approximately 3944 km
    expect(distance).toBeLessThan(4000)
  })

  test('calculates distance between nearby locations', () => {
    // Two points 1 km apart
    const distance = calculateDistance(40.7128, -74.006, 40.7228, -74.006)
    expect(distance).toBeGreaterThan(0.5)
    expect(distance).toBeLessThan(1.5)
  })

  test('distance is symmetric', () => {
    const distance1 = calculateDistance(40.7128, -74.006, 40.7228, -74.006)
    const distance2 = calculateDistance(40.7228, -74.006, 40.7128, -74.006)
    expect(distance1).toBeCloseTo(distance2, 5)
  })
})

describe('Data Validation Utilities', () => {
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function isValidPhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  test('validates correct email addresses', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
  })

  test('rejects invalid email addresses', () => {
    expect(isValidEmail('invalid.email')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('@example.com')).toBe(false)
  })

  test('validates correct phone numbers', () => {
    expect(isValidPhoneNumber('5550123456')).toBe(true)
    expect(isValidPhoneNumber('555-012-3456')).toBe(true)
  })

  test('rejects invalid phone numbers', () => {
    expect(isValidPhoneNumber('123')).toBe(false)
    expect(isValidPhoneNumber('12345678901')).toBe(false)
    expect(isValidPhoneNumber('abc-def-ghij')).toBe(false)
  })
})

describe('Price and Currency Utilities', () => {
  function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`
  }

  function calculateTax(amount, taxRate = 0.18) {
    return amount * taxRate
  }

  function calculateDiscount(amount, discountPercent) {
    return amount * (discountPercent / 100)
  }

  test('formats currency correctly', () => {
    expect(formatCurrency(100)).toBe('₹100.00')
    expect(formatCurrency(99.5)).toBe('₹99.50')
    expect(formatCurrency(1000)).toBe('₹1000.00')
  })

  test('calculates tax correctly', () => {
    expect(calculateTax(1000)).toBeCloseTo(180, 1)
    expect(calculateTax(100, 0.1)).toBeCloseTo(10, 1)
  })

  test('calculates discount correctly', () => {
    expect(calculateDiscount(1000, 10)).toBe(100)
    expect(calculateDiscount(500, 20)).toBe(100)
    expect(calculateDiscount(1000, 50)).toBe(500)
  })

  test('calculates final price with tax and discount', () => {
    const basePrice = 1000
    const discount = calculateDiscount(basePrice, 10) // 10% discount = 100
    const discountedPrice = basePrice - discount // 900
    const tax = calculateTax(discountedPrice, 0.18) // 18% tax = 162
    const finalPrice = discountedPrice + tax // 1062

    expect(finalPrice).toBeCloseTo(1062, 1)
  })
})
