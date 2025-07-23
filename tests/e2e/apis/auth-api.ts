import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { APIRequestContext } from '@playwright/test'


export class AuthAPI {
  constructor(private request: APIRequestContext) {}

  async register(email: string, password: string) {
    try {
      Logger.info('[AuthAPI] Sending register request:', { email, password })
      
      const response = await this.request.post('/api/backoffice/auth/register', {
        data: {
          email,
          password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const responseBody = await response.text()
      Logger.info('[AuthAPI] Register response:', {
        status: response.status(),
        headers: response.headers(),
        body: responseBody
      })

      return {
        status: response.status(),
        body: responseBody ? JSON.parse(responseBody) : null
      }
    } catch (error) {
      Logger.error('[AuthAPI] Error in register request:', error)
      throw error
    }
  }

  private transformErrorResponse(response: any) {
    if (!response) return null;
    
    // Handle new error format (type + message)
    if (response.type === 'InvalidCredentials' || response.type === 'Unauthorized') {
      return { error: 'Invalid credentials' };
    }

    // Handle old error format (direct error message)
    if (response.error) {
      return response;
    }

    return response;
  }

  async login(email: string, password: string) {
    try {
      Logger.info('[AuthAPI] Sending login request:', { email, password })
      
      const response = await this.request.post('/api/backoffice/auth/login', {
        data: { email, password },
        headers: { 'Content-Type': 'application/json' }
      })

      const responseBody = await response.text()
      const parsedBody = responseBody ? JSON.parse(responseBody) : null
      const transformedBody = this.transformErrorResponse(parsedBody)

      Logger.info('[AuthAPI] Login response:', {
        status: response.status(),
        headers: response.headers(),
        body: transformedBody
      })

      return {
        status: response.status(),
        body: transformedBody
      }
    } catch (error) {
      Logger.error('[AuthAPI] Error in login request:', error)
      throw error
    }
  }
}
