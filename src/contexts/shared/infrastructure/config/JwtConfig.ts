import { Logger } from '../Logger'

const TEST_SECRET = 'test_secret'
const TEST_EXPIRES_IN = '1h'

export class JwtConfig {
  static getSecret(): string {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      Logger.error('JWT_SECRET environment variable is not defined')
      throw new Error('JWT_SECRET environment variable is not defined')
    }
    return secret
  }

  static getExpirationTime(): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h'
    Logger.info('Using JWT expiration:', { expiresIn })
    return expiresIn
  }

  static getTestConfiguration() {
    const secret = process.env.NODE_ENV === 'test' ? TEST_SECRET : this.getSecret()
    const expiresIn = process.env.NODE_ENV === 'test' ? TEST_EXPIRES_IN : this.getExpirationTime()

    Logger.info('JWT configuration:', { 
      env: process.env.NODE_ENV,
      isTest: process.env.NODE_ENV === 'test',
      secretLength: secret.length,
      expiresIn 
    })

    return {
      secret,
      expiresIn
    }
  }
}
