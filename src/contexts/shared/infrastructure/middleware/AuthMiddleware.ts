import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Logger } from '../Logger'
import { JWTGenerator } from '../../../backoffice/auth/domain/JWTGenerator'

export class AuthMiddleware {
  constructor(private readonly jwtGenerator: JWTGenerator) {}

  async execute(request: NextRequest): Promise<NextResponse> {
    try {
      const authHeader = request.headers.get('authorization')
      if (!authHeader) {
        Logger.warn('No auth header provided in request')
        return NextResponse.json(
          { type: 'UnauthorizedError', message: 'No token provided' },
          { status: 401 }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      Logger.info('Processing authentication', { 
        path: request.nextUrl.pathname,
        method: request.method,
        tokenLength: token.length 
      })

      const decoded = await this.jwtGenerator.verify(token)
      if (!decoded) {
        Logger.warn('Token verification failed', { 
          path: request.nextUrl.pathname,
          method: request.method 
        })
        return NextResponse.json(
          { type: 'UnauthorizedError', message: 'Token verification failed' },
          { status: 401 }
        )
      }

      Logger.info('Authentication successful', { 
        userId: decoded.id,
        path: request.nextUrl.pathname,
        method: request.method 
      })

      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', decoded.id)
      requestHeaders.set('x-user-email', decoded.email)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      Logger.error('Authentication error', {
        path: request.nextUrl.pathname,
        method: request.method,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })

      return NextResponse.json(
        { type: 'UnauthorizedError', message: 'Token verification failed' },
        { status: 401 }
      )
    }
  }
}
