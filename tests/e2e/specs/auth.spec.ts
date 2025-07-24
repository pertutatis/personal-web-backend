import { test, expect } from '@playwright/test'
import { AuthAPI } from '../apis/auth-api'
import { TestHelper } from '@/contexts/shared/infrastructure/__tests__/TestHelper'
import { PostgresMigrations } from '@/contexts/shared/infrastructure/PostgresMigrations'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

test.describe('Auth API', () => {
  test.beforeEach(async () => {
    // Solo inicializar la base de datos de auth para las pruebas de autenticación
    const authMigrations = new PostgresMigrations('test_blog')
    await authMigrations.clean()
    await authMigrations.setup()
  })

  test.afterEach(async () => {
    const authMigrations = new PostgresMigrations('test_blog')
    await authMigrations.clean()
  })

  test('should register a new user successfully', async ({ request }) => {
    try {
      const authApi = new AuthAPI(request)
      const email = 'test@example.com'
      const password = 'Valid1Password!'

      const response = await authApi.register(email, password)
      Logger.info('Register response:', response)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(typeof response.body.id).toBe('string')
    } catch (error) {
      Logger.error('Error in register test:', error)
      throw error
    }
  })

  test('should login with valid credentials', async ({ request }) => {
    try {
      const authApi = new AuthAPI(request)
      const email = 'login@example.com'
      const password = 'Valid1Password!'

      // Register first
      const registerResponse = await authApi.register(email, password)
      Logger.info('Register response for login test:', registerResponse)

      // Then login
      const loginResponse = await authApi.login(email, password)
      Logger.info('Login response:', loginResponse)

      expect(loginResponse.status).toBe(200)
      expect(loginResponse.body).toHaveProperty('token')
      expect(typeof loginResponse.body.token).toBe('string')
    } catch (error) {
      Logger.error('Error in login test:', error)
      throw error
    }
  })

  test('should return 409 when registering with existing email', async ({ request }) => {
    try {
      const authApi = new AuthAPI(request)
      const email = 'duplicate@example.com'
      const password = 'Valid1Password!'

      // First registration
      const firstResponse = await authApi.register(email, password)
      Logger.info('First register response:', firstResponse)

      // Second registration with same email
      const secondResponse = await authApi.register(email, password)
      Logger.info('Second register response:', secondResponse)

      expect(secondResponse.status).toBe(409)
      expect(secondResponse.body).toEqual({
        error: 'User already exists'
      })
    } catch (error) {
      Logger.error('Error in duplicate email test:', error)
      throw error
    }
  })

  test('should return 401 with invalid credentials', async ({ request }) => {
    try {
      const authApi = new AuthAPI(request)
      const email = 'nonexistent@example.com'
      const password = 'WrongPassword1!'

      const response = await authApi.login(email, password)
      Logger.info('Invalid credentials response:', response)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        error: 'Invalid credentials'
      })
    } catch (error) {
      Logger.error('Error in invalid credentials test:', error)
      throw error
    }
  })
})
