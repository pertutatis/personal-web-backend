import { NextRequest } from 'next/server'
import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { HttpNextResponse } from '@/contexts/shared/infrastructure/http/HttpNextResponse'

export async function GET(request: NextRequest) {
  try {
    Logger.info('Health check requested', {
      env: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN
    })

    return HttpNextResponse.ok({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      auth: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN
      }
    }, request.headers.get('origin'))
  } catch (error) {
    Logger.error('Health check failed:', error)
    return HttpNextResponse.internalServerError({
      type: 'HealthCheckError',
      message: error instanceof Error ? error.message : 'Health check failed'
    }, request.headers.get('origin'))
  }
}
