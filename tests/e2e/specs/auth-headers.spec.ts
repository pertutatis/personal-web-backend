import { test, expect } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'
import { AuthConfig } from '@/contexts/shared/infrastructure/config/AuthConfig'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

test.describe('Auth Headers', () => {
  test('should use consistent configuration across components', async () => {
    const config = AuthConfig.getTestConfiguration()
    const token = await AuthHelper.generateToken()
    expect(token).toBeDefined()

    const decoded = await AuthHelper.verifyToken(token)
    expect(decoded).toHaveProperty('id')
    expect(decoded).toHaveProperty('email')
  })

  test('should make authenticated request successfully', async ({
    request,
  }) => {
    const token = await AuthHelper.generateToken()

    Logger.info('Making request with token:', {
      tokenLength: token.length,
      tokenStart: token.substring(0, 10) + '...',
    })

    const response = await request.get('/api/backoffice/articles', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(Array.isArray(body.items)).toBe(true)
  })

  test('should reject invalid tokens', async ({ request }) => {
    const response = await request.get('/api/backoffice/articles', {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
    })

    Logger.info('Invalid token rejected:', {
      status: response.status(),
      body: await response.json(),
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.type).toBe('UnauthorizedError')
    expect(body.message).toBe('Token verification failed')
  })

  test('should reject missing auth header', async ({ request }) => {
    const response = await request.get('/api/backoffice/books')

    Logger.info('Missing auth header rejected:', {
      status: response.status(),
      body: await response.json(),
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.type).toBe('UnauthorizedError')
    expect(body.message).toBe('No token provided')
  })
})
