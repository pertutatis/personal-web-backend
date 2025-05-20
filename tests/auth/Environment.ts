import { TimeString } from '@/contexts/shared/infrastructure/config/AuthConfig'

export class Environment {
  static getJwtSecret(): string {
    return process.env.JWT_SECRET ?? 'test_secret'
  }

  static getJwtExpiresIn(): TimeString {
    return (process.env.JWT_EXPIRES_IN ?? '1h') as TimeString
  }

  static getBaseUrl(): string {
    return process.env.BASE_URL ?? 'http://localhost:3000'
  }
}
