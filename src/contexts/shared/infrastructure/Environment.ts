export class Environment {
  static isTest(): boolean {
    return process.env.NODE_ENV === 'test'
  }

  static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development'
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  }

  static getDatabase(name: string): string {
    if (this.isTest()) {
      return `${name}_test`
    }
    return name
  }

  static getAuthDatabase(): string {
    return this.getDatabase('auth')
  }

  static getJwtSecret(): string {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined')
    }
    return secret
  }

  static getJwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '24h'
  }
}
