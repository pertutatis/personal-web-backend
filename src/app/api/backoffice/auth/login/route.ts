import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { initializeContainer, AuthControllerToken } from '@/contexts/backoffice/auth/infrastructure/DependencyInjection/container'

let containerInitialized = false
let container: any

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(
    async () => {
      const body = await request.json()
      const { email, password } = body

      if (!email || !password) {
        return HttpNextResponse.badRequest('Email and password are required')
      }

      if (!containerInitialized) {
        container = await initializeContainer()
        containerInitialized = true
      }

      const controller = container.get(AuthControllerToken)
      
      try {
        const { token } = await controller.login({ email, password })
        return HttpNextResponse.ok({ token }, request.headers.get('origin'))
      } catch (error: any) {
        if (error.status === 401) {
          return HttpNextResponse.unauthorized(
            {
              type: 'InvalidCredentials',
              message: 'Invalid credentials'
            },
            request.headers.get('origin')
          )
        }

        if (error instanceof Error && error.name === 'DatabaseConnectionError') {
          Logger.error('Database connection error:', error)
          return HttpNextResponse.internalServerError(
            error.message,
            request.headers.get('origin')
          )
        }

        Logger.error('Login error:', error)
        throw error
      }
    },
    request
  )
}

export async function OPTIONS(request: NextRequest) {
  const response = await corsMiddleware(request)
  return response
}
