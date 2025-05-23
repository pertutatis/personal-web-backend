import { test, expect } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'

test.describe('CORS Implementation', () => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://diegopertusa.netlify.app',
    'https://diegopertusa.com'
  ]

  test('should handle OPTIONS requests correctly', async ({ request }) => {
    for (const origin of allowedOrigins) {
      const response = await request.fetch('/api/backoffice/articles', {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'GET'
        }
      })

      expect(response.status()).toBe(200)
      expect(response.headers()['access-control-allow-origin']).toBe(origin)
      expect(response.headers()['access-control-allow-methods']).toContain('GET')
      expect(response.headers()['access-control-allow-headers']).toContain('Content-Type')
    }
  })

  test('should reject requests from non-allowed origins', async ({ request }) => {
    const response = await request.get('/api/backoffice/articles', {
      headers: {
        'Origin': 'http://malicious-site.com'
      }
    })

    expect(response.status()).toBe(403)
  })

  test('should include CORS headers in successful responses', async ({ request }) => {
    const origin = 'http://localhost:5173'
    const token = await AuthHelper.generateToken()

    const response = await request.get('/api/backoffice/articles', {
      headers: {
        'Origin': origin,
        'Authorization': `Bearer ${token}`
      }
    })

    expect(response.status()).toBe(200)
    expect(response.headers()['access-control-allow-origin']).toBe(origin)
  })

  test('should include CORS headers in error responses', async ({ request }) => {
    const origin = 'http://localhost:5173'

    const response = await request.get('/api/backoffice/articles', {
      headers: {
        'Origin': origin,
        'Authorization': 'Bearer invalid-token'
      }
    })

    expect(response.status()).toBe(401)
    expect(response.headers()['access-control-allow-origin']).toBe(origin)
  })

  const endpoints = [
    '/api/backoffice/auth/login',
    '/api/backoffice/auth/register',
    '/api/backoffice/articles',
    '/api/backoffice/books'
  ]

  for (const endpoint of endpoints) {
    test(`${endpoint} should handle preflight requests`, async ({ request }) => {
      const origin = 'http://localhost:5173'
      
      const response = await request.fetch(endpoint, {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type,authorization'
        }
      })

      expect(response.status()).toBe(200)
      expect(response.headers()['access-control-allow-origin']).toBe(origin)
      expect(response.headers()['access-control-allow-methods']).toContain('POST')
      expect(response.headers()['access-control-allow-headers']).toContain('Content-Type')
      expect(response.headers()['access-control-allow-headers']).toContain('Authorization')
    })
  }
})
