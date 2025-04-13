import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Configurar los headers CORS
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 horas

  // Manejar las solicitudes OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers
    })
  }

  return response
}

// Configurar el middleware para que solo se ejecute en las rutas de la API
export const config = {
  matcher: '/api/:path*'
}
