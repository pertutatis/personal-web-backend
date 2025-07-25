export type TimeString =
  | `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`
  | number
  | string

export interface AuthConfigType {
  secret: string
  expiresIn: TimeString
}

export class AuthConfig {
  private static config: AuthConfigType = {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as TimeString,
  }

  private static testConfig: AuthConfigType = {
    secret: process.env.JWT_SECRET || 'test_secret',
    expiresIn: '1h' as TimeString,
  }

  static getConfiguration(): AuthConfigType {
    if (process.env.NODE_ENV === 'test') {
      return this.testConfig
    }
    return this.config
  }

  static getTestConfiguration(): AuthConfigType {
    return this.testConfig
  }

  static setConfiguration(config: AuthConfigType): void {
    this.config = config
  }
}
