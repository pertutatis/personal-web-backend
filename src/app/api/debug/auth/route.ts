import { NextResponse } from 'next/server'
import { JwtTokenGenerator } from '@/contexts/backoffice/auth/infrastructure/JwtTokenGenerator'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

const TEST_SECRET = 'test_secret'
const TEST_EXPIRES = '1h'

export async function GET() {
  try {
    Logger.info('Debug route accessed')

    const jwtGenerator = new JwtTokenGenerator(TEST_SECRET, TEST_EXPIRES)
    const payload = {
      id: 'debug-user',
      email: 'debug@test.com'
    }

    Logger.info('Attempting to generate token with:', {
      payload,
      secretLength: TEST_SECRET.length,
      secretStart: TEST_SECRET.substring(0, 3)
    })

    // Generar token
    const token = await jwtGenerator.generate(payload)
    Logger.info('Token generated:', { tokenLength: token.length })
    
    // Verificar token inmediatamente
    const decoded = await jwtGenerator.verify(token)
    Logger.info('Token verified:', { decoded })

    const exportableSecret = TEST_SECRET.substring(0, 3) + '...' + TEST_SECRET.substring(TEST_SECRET.length - 3)

    return NextResponse.json({
      message: 'Auth debug info',
      token,
      decoded,
      env: process.env.NODE_ENV || 'development',
      config: {
        secret: TEST_SECRET,
        expiresIn: TEST_EXPIRES,
        secretLength: TEST_SECRET.length
      },
      generatedToken: token
    }, { status: 200 })
  } catch (error) {
    Logger.error('Debug operation failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json({
      error: 'Token operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
