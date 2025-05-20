import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { EdgeJwtTokenGenerator } from './contexts/backoffice/auth/infrastructure/EdgeJwtTokenGenerator'
import { AuthConfig } from './contexts/shared/infrastructure/config/AuthConfig'
import { AuthMiddleware } from './contexts/shared/infrastructure/middleware/AuthMiddleware'
import { Logger } from './contexts/shared/infrastructure/Logger'

export async function middleware(request: NextRequest) {
  try {
    Logger.info('Middleware processing request:', { url: request.url })

    // Skip auth for health endpoint
    const url = new URL(request.url)
    if (url.pathname === '/api/health') {
      Logger.info('Skipping auth for health endpoint')
      return NextResponse.next()
    }

    // Skip auth for non-api routes
    if (!url.pathname.startsWith('/api/')) {
      Logger.info('Skipping auth for non-api route:', { pathname: url.pathname })
      return NextResponse.next()
    }

    // Skip auth for public api routes
    const publicRoutes = [
      '/api/auth-config',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/token',
      '/api/debug/auth',
      '/api/test-helpers'
    ]
    
    // Check if the current path is in public routes or starts with any of them
    if (publicRoutes.includes(url.pathname) || publicRoutes.some(route => url.pathname.startsWith(route))) {
      Logger.info('Skipping auth for public route:', { pathname: url.pathname })
      return NextResponse.next()
    }

    const config = process.env.NODE_ENV === 'test'
      ? AuthConfig.getTestConfiguration()
      : AuthConfig.getConfiguration()
    Logger.info('Using configuration:', { expiresIn: config.expiresIn })
    
    const jwtGenerator = new EdgeJwtTokenGenerator(config.secret, config.expiresIn)
    const authMiddleware = new AuthMiddleware(jwtGenerator)

    return await authMiddleware.execute(request)
  } catch (error) {
    Logger.error('Middleware error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      { type: 'UnauthorizedError', message: 'Token validation failed' },
      { status: 401 }
    )
  }
}
