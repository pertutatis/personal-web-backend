import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // Vite default port
  'https://diegopertusa.netlify.app',
  'https://diegopertusa.com',
]

/**
 * CORS middleware for blog endpoints.
 * Restricts access to specific domains and localhost for development.
 */
export function corsMiddleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin')

  // If no origin or it's not in the allowed list, block the request
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  // Return response with CORS headers for allowed origins
  // For OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '3600', // Cache preflight requests for 1 hour
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

  // For non-OPTIONS requests that are not allowed
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(null, {
      status: 403,
      statusText: 'Forbidden',
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  // For regular requests that are allowed
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '3600',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

/**
 * Helper to apply CORS headers to a response
 */
export function applyCorsHeaders(
  response: NextResponse,
  origin: string | null,
): NextResponse {
  // Only apply headers if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    )
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}
