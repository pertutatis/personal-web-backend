import { NextRequest } from 'next/server'
import { corsMiddleware } from '@/contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { executeWithErrorHandling } from '@/contexts/shared/infrastructure/http/executeWithErrorHandling'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'
import { PostgresAuthRepository } from '@/contexts/backoffice/auth/infrastructure/PostgresAuthRepository'
import { AuthController } from '@/contexts/backoffice/auth/infrastructure/rest/AuthController'
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator'
import { JwtTokenGenerator } from '@/contexts/backoffice/auth/infrastructure/JwtTokenGenerator'
import { getAuthConnection } from '../config/database'
import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { DatabaseConnectionFactory } from '@/contexts/shared/infrastructure/persistence/DatabaseConnectionFactory';
import { getBlogDatabaseConfig } from '@/contexts/shared/infrastructure/config/database';

export async function POST(request: NextRequest) {
  return executeWithErrorHandling(
    async () => {
      const authToken = request.headers.get('Authorization')?.replace('Bearer ', '')

      if (!authToken) {
        return HttpNextResponse.unauthorized(
          {
            type: 'Unauthorized',
            message: 'Authorization header is required'
          },
          request.headers.get('origin')
        )
      }

      const connection = await DatabaseConnectionFactory.create(getBlogDatabaseConfig());
      const repository = new PostgresAuthRepository(connection)
      const uuidGenerator = new OfficialUuidGenerator()
      const jwtGenerator = new JwtTokenGenerator(
        process.env.JWT_SECRET || 'default-secret',
        process.env.JWT_EXPIRES_IN || '1h'
      )
      
      const controller = new AuthController(repository, uuidGenerator, jwtGenerator)
      
      try {
        const result = await controller.refreshToken(authToken)
        await connection.close()
        return HttpNextResponse.ok(result, request.headers.get('origin'))
      } catch (error: any) {
        await connection.close()
        
        if (error.status === 401) {
          return HttpNextResponse.unauthorized(
            {
              type: 'InvalidToken',
              message: 'Invalid token'
            },
            request.headers.get('origin')
          )
        }

        Logger.error('Refresh token error:', error)
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
