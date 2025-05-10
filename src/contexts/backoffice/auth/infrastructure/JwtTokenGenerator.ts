import { JWTGenerator } from '../domain/JWTGenerator'
import { TokenPayload } from '../domain/TokenPayload'
import * as jwt from 'jsonwebtoken'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export class JwtTokenGenerator implements JWTGenerator {
  constructor(private readonly secret: string) {}

  async generate(payload: TokenPayload): Promise<string> {
    try {
      Logger.info('Generating JWT token for user:', { userId: payload.userId })
      
      const token = jwt.sign(
        payload,
        this.secret,
        { expiresIn: '24h' }
      )

      Logger.info('JWT token generated successfully')
      return token
    } catch (error) {
      Logger.error('Error generating JWT token:', error)
      throw error
    }
  }

  async verify(token: string): Promise<TokenPayload> {
    try {
      Logger.info('Verifying JWT token')
      
      const decoded = jwt.verify(token, this.secret) as TokenPayload
      
      if (!decoded.userId || !decoded.email) {
        throw new Error('Invalid token payload')
      }
      
      Logger.info('JWT token verified successfully')
      return decoded
    } catch (error) {
      Logger.error('Error verifying JWT token:', error)
      throw error
    }
  }
}
