import { JWTGenerator, TokenPayload } from '../domain/JWTGenerator'
import jwt from 'jsonwebtoken'
import { Logger } from '../../../shared/infrastructure/Logger'
import { AuthConfigType, TimeString } from '../../../shared/infrastructure/config/AuthConfig'
import { InvalidToken } from '../domain/InvalidToken'

export class JwtTokenGenerator implements JWTGenerator {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: TimeString
  ) {}

  async generate(payload: TokenPayload): Promise<string> {
    try {
      const token = jwt.sign(payload as object, this.secret, {
        expiresIn: this.expiresIn as jwt.SignOptions['expiresIn']
      })

      Logger.info('Token generated successfully:', { 
        userId: payload.id,
        expiresIn: this.expiresIn
      })
      return token
    } catch (error) {
      Logger.error('Error generating token:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  }

  async verify(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload

      if (!decoded.id || !decoded.email) {
        Logger.error('Invalid token payload: missing required fields')
        throw new InvalidToken()
      }

      Logger.info('Token verified successfully:', { userId: decoded.id })
      return decoded
    } catch (error) {
      Logger.error('Error verifying token:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      throw new InvalidToken()
    }
  }
}
