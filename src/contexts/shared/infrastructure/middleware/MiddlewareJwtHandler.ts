import { JwtTokenGenerator } from '@/contexts/backoffice/auth/infrastructure/JwtTokenGenerator'
import { Logger } from '../Logger'
import { AuthConfig } from '../config/AuthConfig'

export class MiddlewareJwtHandler {
  private static instance: MiddlewareJwtHandler
  private jwtGenerator: JwtTokenGenerator

  private constructor() {
    Logger.info('Initializing MiddlewareJwtHandler')
    const config = AuthConfig.getConfiguration()
    this.jwtGenerator = new JwtTokenGenerator(config.secret, config.expiresIn)
  }

  public static getInstance(): MiddlewareJwtHandler {
    if (!MiddlewareJwtHandler.instance) {
      MiddlewareJwtHandler.instance = new MiddlewareJwtHandler()
    }
    return MiddlewareJwtHandler.instance
  }

  public async generateToken(payload: { id: string; email: string }) {
    try {
      Logger.info('Generating token with payload:', payload)
      
      const token = await this.jwtGenerator.generate(payload)
      Logger.info('Token generated successfully')
      
      return token
    } catch (error) {
      Logger.error('Failed to generate token:', error)
      throw error
    }
  }

  public async verifyToken(token: string) {
    try {
      Logger.info('Verifying token')
      
      const decoded = await this.jwtGenerator.verify(token)
      Logger.info('Token verified successfully')
      
      return decoded
    } catch (error) {
      Logger.error('Failed to verify token:', error)
      throw error
    }
  }

  public getConfiguration() {
    const config = AuthConfig.getConfiguration()
    const exportableSecret = config.secret.substring(0, 3) + '...' + config.secret.substring(config.secret.length - 3)
    return {
      secret: exportableSecret,
      expiresIn: config.expiresIn,
      secretLength: config.secret.length
    }
  }

  public getJwtGenerator(): JwtTokenGenerator {
    return this.jwtGenerator
  }
}
