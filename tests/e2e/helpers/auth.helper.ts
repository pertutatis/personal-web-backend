import { EdgeJwtTokenGenerator } from '@/contexts/backoffice/auth/infrastructure/EdgeJwtTokenGenerator'
import { AuthConfig } from '@/contexts/shared/infrastructure/config/AuthConfig'
import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { TokenPayload } from '@/contexts/backoffice/auth/domain/JWTGenerator'

export class AuthHelper {
  private static instance: AuthHelper
  private jwtGenerator: EdgeJwtTokenGenerator

  constructor() {
    Logger.info('Initializing Auth Helper')
    const config = AuthConfig.getTestConfiguration()
    Logger.info('Getting test configuration with:', {
      secretLength: config.secret.length,
      expiresIn: config.expiresIn,
      secretPreview: `${config.secret.substring(0, 3)}...${config.secret.substring(config.secret.length - 3)}`,
    })

    Logger.info('Using test configuration:', {
      secret: config.secret,
      expiresIn: config.expiresIn,
    })

    this.jwtGenerator = new EdgeJwtTokenGenerator(
      config.secret,
      config.expiresIn,
    )
    Logger.info('Auth Helper initialized successfully')
  }

  private static getInstance(): AuthHelper {
    if (!AuthHelper.instance) {
      AuthHelper.instance = new AuthHelper()
    }
    return AuthHelper.instance
  }

  static async generateToken(): Promise<string> {
    return await AuthHelper.getInstance().generateTokenInstance()
  }

  static async verifyToken(token: string): Promise<TokenPayload> {
    return await AuthHelper.getInstance().verifyTokenInstance(token)
  }

  async generateTokenInstance(): Promise<string> {
    const payload: TokenPayload = {
      id: 'test-user-id',
      email: 'test@example.com',
    }

    const token = await this.jwtGenerator.generate(payload)
    Logger.info('Token generated:', {
      tokenLength: token.length,
      tokenStart: token.substring(0, 10) + '...',
    })

    return token
  }

  async verifyTokenInstance(token: string): Promise<TokenPayload> {
    const payload = await this.jwtGenerator.verify(token)
    if (!payload) {
      throw new Error('Token verification failed')
    }
    return payload
  }
  static async makeAuthenticatedRequest(
    request: any,
    url: string,
    options: any = {},
  ) {
    const token = await AuthHelper.generateToken()

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    }

    return request[options.method?.toLowerCase() || 'get'](url, {
      ...options,
      headers,
    })
  }
}
