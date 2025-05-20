import { NextResponse } from 'next/server'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export async function GET() {
  try {
    Logger.info('Health check requested', {
      env: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN
    })

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      auth: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN
      }
    })
  } catch (error) {
    Logger.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Health check failed'
      },
      { status: 500 }
    )
  }
}
