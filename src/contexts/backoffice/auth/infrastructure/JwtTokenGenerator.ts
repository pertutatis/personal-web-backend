import { JWTGenerator } from '../domain/JWTGenerator'
import { TokenPayload } from '../domain/TokenPayload'
import { InvalidToken } from '../domain/InvalidToken'
import { sign, verify, JsonWebTokenError, TokenExpiredError, Secret, SignOptions } from 'jsonwebtoken'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export class JwtTokenGenerator implements JWTGenerator {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: number | string = '24h'
  ) {}

  async generate(payload: TokenPayload): Promise<string> {
    try {
      Logger.info('Generating JWT token for user:', { id: payload.id })
      
      const options = { expiresIn: this.expiresIn } as SignOptions
      const token = sign(payload, this.secret as Secret, options)

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
      
      const decoded = verify(token, this.secret as Secret) as TokenPayload
      
      if (!decoded.id || !decoded.email) {
        throw new InvalidToken()
      }
      
      Logger.info('JWT token verified successfully')
      return decoded
    } catch (error) {
      Logger.error('Error verifying JWT token:', error)
      if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
        throw new InvalidToken()
      }
      throw error
    }
  }
}
