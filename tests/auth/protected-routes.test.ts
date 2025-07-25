import { test, expect } from '@playwright/test'
import { JwtTokenGenerator } from '@/contexts/backoffice/auth/infrastructure/JwtTokenGenerator'
import { Environment } from '@/contexts/shared/infrastructure/Environment'

test.describe('Protected Routes', () => {
  let jwtGenerator: JwtTokenGenerator
  let validToken: string

  test.beforeAll(async () => {
    // Crear token válido para tests
    jwtGenerator = new JwtTokenGenerator(
      Environment.getJwtSecret(),
      Environment.getJwtExpiresIn(),
    )
    validToken = await jwtGenerator.generate({
      id: 'test-user-id',
      email: 'test@example.com',
    })
  })

  test('should allow access to auth endpoints without token', async ({
    request,
  }) => {
    const loginResponse = await request.post('/api/backoffice/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'password123',
      },
    })
    expect(loginResponse.status()).toBe(400) // Invalid credentials, pero no 401
  })

  test('should reject access to articles without token', async ({
    request,
  }) => {
    const response = await request.get('/api/backoffice/articles')
    expect(response.status()).toBe(401)
    expect(await response.json()).toEqual({
      type: 'UnauthorizedError',
      message: 'No token provided',
    })
  })

  test('should reject access to books without token', async ({ request }) => {
    const response = await request.get('/api/backoffice/books')
    expect(response.status()).toBe(401)
    expect(await response.json()).toEqual({
      type: 'UnauthorizedError',
      message: 'No token provided',
    })
  })

  test('should reject access with invalid token format', async ({
    request,
  }) => {
    const response = await request.get('/api/backoffice/articles', {
      headers: {
        Authorization: 'Invalid token',
      },
    })
    expect(response.status()).toBe(401)
    expect(await response.json()).toEqual({
      type: 'UnauthorizedError',
      message: 'Invalid token format',
    })
  })

  test('should allow access to articles with valid token', async ({
    request,
  }) => {
    const response = await request.get('/api/backoffice/articles', {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    })
    expect(response.status()).toBe(200)
  })

  test('should allow access to books with valid token', async ({ request }) => {
    const response = await request.get('/api/backoffice/books', {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    })
    expect(response.status()).toBe(200)
  })

  test('should include user info in protected routes', async ({ request }) => {
    const response = await request.get('/api/backoffice/articles', {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    })
    expect(response.status()).toBe(200)

    // Verificar que el middleware añadió la información del usuario
    const userInfo = response.headers()['x-user-info']
    expect(userInfo).toBeDefined()
    const parsedUserInfo = JSON.parse(userInfo)
    expect(parsedUserInfo).toEqual({
      id: 'test-user-id',
      email: 'test@example.com',
    })
  })
})
