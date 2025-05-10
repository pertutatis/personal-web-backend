import { APIRequestContext } from '@playwright/test'

export class AuthAPI {
  constructor(private request: APIRequestContext) {}

  async register(email: string, password: string) {
    try {
      console.log('[AuthAPI] Sending register request:', { email, password })
      
      const response = await this.request.post('/api/auth/register', {
        data: {
          email,
          password
        }
      })

      const responseBody = await response.text()
      console.log('[AuthAPI] Register response:', {
        status: response.status(),
        headers: response.headers(),
        body: responseBody
      })

      return {
        status: response.status(),
        body: responseBody ? JSON.parse(responseBody) : null
      }
    } catch (error) {
      console.error('[AuthAPI] Error in register request:', error)
      throw error
    }
  }

  async login(email: string, password: string) {
    try {
      console.log('[AuthAPI] Sending login request:', { email, password })
      
      const response = await this.request.post('/api/auth/login', {
        data: {
          email,
          password
        }
      })

      const responseBody = await response.text()
      console.log('[AuthAPI] Login response:', {
        status: response.status(),
        headers: response.headers(),
        body: responseBody
      })

      return {
        status: response.status(),
        body: responseBody ? JSON.parse(responseBody) : null
      }
    } catch (error) {
      console.error('[AuthAPI] Error in login request:', error)
      throw error
    }
  }
}
