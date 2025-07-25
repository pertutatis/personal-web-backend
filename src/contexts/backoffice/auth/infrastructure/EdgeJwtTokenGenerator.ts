import { TokenPayload } from '../domain/JWTGenerator'
import { BaseJwtTokenGenerator } from './BaseJwtTokenGenerator'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export class EdgeJwtTokenGenerator extends BaseJwtTokenGenerator {
  constructor(secret: string, expiresIn: string | number) {
    super(secret, expiresIn)
  }

  private getSecretKey(): Uint8Array {
    return new TextEncoder().encode(this.secret)
  }

  private parseExpiresIn(expiresIn: string | number): string {
    // Si es un número como string, conviértelo a segundos para jose
    if (typeof expiresIn === 'string' && /^\d+$/.test(expiresIn)) {
      return `${parseInt(expiresIn, 10)}s`
    }
    // Si ya es un número, añade "s" para indicar segundos
    if (typeof expiresIn === 'number') {
      return `${expiresIn}s`
    }
    // Si ya tiene formato de tiempo como "1h", devuélvelo tal cual
    return expiresIn as string
  }

  async generate(payload: TokenPayload): Promise<string> {
    const secretKey = this.getSecretKey()
    Logger.info('Generating token', {
      secretPreview: `${this.secret.substring(0, 3)}...${this.secret.substring(this.secret.length - 3)}`,
    })

    // Convertir el formato de expiresIn al formato que espera jose
    const expirationTime = this.parseExpiresIn(this.expiresIn)

    const { SignJWT } = await import('jose')
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secretKey)

    return jwt
  }

  async verify(token: string): Promise<TokenPayload | null> {
    try {
      const secretKey = this.getSecretKey()
      Logger.info('Verifying token', {
        tokenPreview: token.substring(0, 20) + '...',
        secretPreview: `${this.secret.substring(0, 3)}...${this.secret.substring(this.secret.length - 3)}`,
      })

      const { jwtVerify } = await import('jose')
      const { payload } = await jwtVerify(token, secretKey)
      Logger.info('Token verified successfully', { payload })
      return payload as TokenPayload
    } catch (error) {
      Logger.error('Error verifying token', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      })
      return null
    }
  }
}
