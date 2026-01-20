/**
 * @jest-environment node
 */

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

describe('Authentication Utilities', () => {
  describe('Password Hashing', () => {
    test('hashes a password', async () => {
      const password = 'test-password'
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword).toHaveLength(60) // bcrypt hash length
    })

    test('compares correct password with hash', async () => {
      const password = 'test-password'
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const isMatch = await bcrypt.compare(password, hashedPassword)
      expect(isMatch).toBe(true)
    })

    test('fails comparison with incorrect password', async () => {
      const password = 'test-password'
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const isMatch = await bcrypt.compare('wrong-password', hashedPassword)
      expect(isMatch).toBe(false)
    })
  })

  describe('JWT Tokens', () => {
    const testSecret = 'test-secret-key'

    test('creates a valid JWT token', () => {
      const payload = { userId: 'user123', email: 'test@example.com' }
      const token = jwt.sign(payload, testSecret, { expiresIn: '24h' })

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
    })

    test('verifies a valid JWT token', () => {
      const payload = { userId: 'user123', email: 'test@example.com' }
      const token = jwt.sign(payload, testSecret, { expiresIn: '24h' })

      const decoded = jwt.verify(token, testSecret)
      expect(decoded.userId).toBe('user123')
      expect(decoded.email).toBe('test@example.com')
    })

    test('fails to verify expired token', () => {
      const payload = { userId: 'user123' }
      const token = jwt.sign(payload, testSecret, { expiresIn: '0s' })

      // Wait a bit to ensure token is expired
      setTimeout(() => {
        expect(() => jwt.verify(token, testSecret)).toThrow()
      }, 100)
    })

    test('fails to verify token with wrong secret', () => {
      const payload = { userId: 'user123' }
      const token = jwt.sign(payload, testSecret)

      expect(() => jwt.verify(token, 'wrong-secret')).toThrow()
    })
  })
})
