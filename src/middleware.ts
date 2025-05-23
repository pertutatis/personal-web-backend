import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { EdgeJwtTokenGenerator } from './contexts/backoffice/auth/infrastructure/EdgeJwtTokenGenerator'
import { AuthConfig } from './contexts/shared/infrastructure/config/AuthConfig'
import { AuthMiddleware } from './contexts/shared/infrastructure/middleware/AuthMiddleware'
import { Logger } from './contexts/shared/infrastructure/Logger'
import { corsMiddleware, applyCorsHeaders } from './contexts/blog/shared/infrastructure/security/CorsMiddleware'
import { ALLOWED_ORIGINS } from './contexts/blog/shared/infrastructure/security/CorsMiddleware'

export async function middleware(request: NextRequest) {
  try {
    Logger.info('Middleware processing request:', { url: request.url })
    const origin = request.headers.get('origin')
    const url = new URL(request.url)

    // Health endpoint should always work
    if (url.pathname === '/api/health') {
      Logger.info('Skipping auth for health endpoint')
      const response = NextResponse.next()
      return applyCorsHeaders(response, origin)
    }

    // Check origin for API requests
    if (url.pathname.startsWith('/api/') && origin && !ALLOWED_ORIGINS.includes(origin)) {
      const response = NextResponse.json(
        { type: 'ForbiddenError', message: 'Origin not allowed' },
        { status: 403 }
      )
      return applyCorsHeaders(response, origin)
    }

    // Handle OPTIONS requests
    if (request.method === 'OPTIONS') {
      return corsMiddleware(request)
    }


    // Skip auth for non-api routes
    if (!url.pathname.startsWith('/api/')) {
      Logger.info('Skipping auth for non-api route:', { pathname: url.pathname })
      const response = NextResponse.next()
      return applyCorsHeaders(response, origin)
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
      const response = NextResponse.next()
      return applyCorsHeaders(response, origin)
    }

    const config = process.env.NODE_ENV === 'test'
      ? AuthConfig.getTestConfiguration()
      : AuthConfig.getConfiguration()
    Logger.info('Using configuration:', { expiresIn: config.expiresIn })
    
    const jwtGenerator = new EdgeJwtTokenGenerator(config.secret, config.expiresIn)
    const authMiddleware = new AuthMiddleware(jwtGenerator)

    const response = await authMiddleware.execute(request)
    return applyCorsHeaders(response, origin)
  } catch (error) {
    Logger.error('Middleware error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    const response = NextResponse.json(
      { type: 'UnauthorizedError', message: 'Token validation failed' },
      { status: 401 }
    )
    
    return applyCorsHeaders(response, request.headers.get('origin'))
  }
}
