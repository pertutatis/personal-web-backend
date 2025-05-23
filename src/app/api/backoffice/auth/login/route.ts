import { NextRequest, NextResponse } from 'next/server'
import { corsMiddleware, applyCorsHeaders } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { PostgresAuthRepository } from '@/contexts/backoffice/auth/infrastructure/PostgresAuthRepository'
import { AuthController } from '@/contexts/backoffice/auth/infrastructure/rest/AuthController'
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator'
import { JwtTokenGenerator } from '@/contexts/backoffice/auth/infrastructure/JwtTokenGenerator'
import { getAuthConnection } from '../config/database'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(
    async () => {
      const body = await request.json()
      const { email, password } = body

      if (!email || !password) {
        return HttpNextResponse.badRequest('Email and password are required')
      }

      const connection = await getAuthConnection()
      const repository = new PostgresAuthRepository(connection)
      const uuidGenerator = new OfficialUuidGenerator()
      const jwtGenerator = new JwtTokenGenerator(
        process.env.JWT_SECRET || 'default-secret',
        process.env.JWT_EXPIRES_IN || '1h'
      )
      
      const controller = new AuthController(repository, uuidGenerator, jwtGenerator)
      
      try {
        const { token } = await controller.login({ email, password })
        await connection.close()
        return HttpNextResponse.ok({ token }, request.headers.get('origin'))
      } catch (error: any) {
        await connection.close()
        if (error.status === 401) {
          const response = NextResponse.json({
            error: error.error
          }, { status: 401 })
          return applyCorsHeaders(response, request.headers.get('origin'))
        }
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
