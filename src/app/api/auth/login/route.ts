import { NextRequest } from 'next/server'
import { PostgresAuthRepository } from '@/contexts/backoffice/auth/infrastructure/PostgresAuthRepository'
import { AuthController } from '@/contexts/backoffice/auth/infrastructure/rest/AuthController'
import { OfficialUuidGenerator } from '@/contexts/shared/infrastructure/OfficialUuidGenerator'
import { JwtTokenGenerator } from '@/contexts/backoffice/auth/infrastructure/JwtTokenGenerator'
import { getAuthConnection } from '../config/database'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400 }
      )
    }

    const connection = await getAuthConnection()
    const repository = new PostgresAuthRepository(connection)
    const uuidGenerator = new OfficialUuidGenerator()
    const jwtGenerator = new JwtTokenGenerator(process.env.JWT_SECRET || 'default-secret')
    
    const controller = new AuthController(repository, uuidGenerator, jwtGenerator)
    
    const { token } = await controller.login({ email, password })
    
    await connection.close()
    
    return new Response(
      JSON.stringify({ token }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error: any) {
    Logger.error('Error in login route:', error)

    const status = error.status || 500
    const message = error.message || 'Internal server error'

    return new Response(
      JSON.stringify({ error: message }),
      { 
        status,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
