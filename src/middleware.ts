import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  corsMiddleware,
  applyCorsHeaders,
  ALLOWED_ORIGINS
} from "./contexts/blog/shared/infrastructure/security/CorsMiddleware"
import { EdgeJwtTokenGenerator } from "./contexts/backoffice/auth/infrastructure/EdgeJwtTokenGenerator"
import { AuthConfig } from "./contexts/shared/infrastructure/config/AuthConfig"

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')

  // First check CORS
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return createErrorResponse(
      'ForbiddenError',
      'Origin not allowed',
      403,
      origin
    )
  }
  
  function createErrorResponse(type: string, message: string, status: number, origin: string | null) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin
      headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    }

    return new NextResponse(
      JSON.stringify({ type, message }),
      { status, headers }
    )
  }
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return corsMiddleware(request)
  }

  // Skip authentication for auth routes
  if (request.nextUrl.pathname.startsWith('/api/backoffice/auth/')) {
    const response = NextResponse.next()
    return origin ? applyCorsHeaders(response, origin) : response
  }

  // For other protected routes, check authentication
  if (request.nextUrl.pathname.startsWith('/api/backoffice/')) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return createErrorResponse(
        'UnauthorizedError',
        'Se requiere autenticación. Por favor, incluye el token JWT en el header Authorization: Bearer <token>',
        401,
        origin
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const config = AuthConfig.getTestConfiguration()
    const jwtGenerator = new EdgeJwtTokenGenerator(config.secret, config.expiresIn)

    try {
      const result = await jwtGenerator.verify(token)
      if (!result) {
        throw new Error('Token verification failed')
      }
    } catch (error) {
      const response = createErrorResponse(
        'UnauthorizedError',
        'Token verification failed',
        401,
        origin
      )

      // Asegurarnos de que los headers CORS se aplican correctamente
      if (origin && ALLOWED_ORIGINS.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      }

      return response
    }
  }

  // Continue with the request
  const response = NextResponse.next()
  
  // Add CORS headers to successful response
  return origin ? applyCorsHeaders(response, origin) : response
}

export const config = {
  matcher: "/api/:path*"
}
