import { LoginUser } from '../../application/LoginUser'
import { RegisterUser } from '../../application/RegisterUser'
import { AuthRepository } from '../../domain/AuthRepository'
import { JWTGenerator } from '../../domain/JWTGenerator'
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator'
import { UserAlreadyExists } from '../../application/UserAlreadyExists'
import { InvalidCredentials } from '../../application/InvalidCredentials'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export class AuthController {
  private registerUseCase: RegisterUser
  private loginUseCase: LoginUser
  private jwtGenerator: JWTGenerator

  constructor(
    repository: AuthRepository,
    uuidGenerator: UuidGenerator,
    jwtGenerator: JWTGenerator
  ) {
    this.registerUseCase = new RegisterUser(repository, uuidGenerator)
    this.loginUseCase = new LoginUser(repository, jwtGenerator)
    this.jwtGenerator = jwtGenerator
  }

  async refreshToken(token: string): Promise<{ token: string }> {
    try {
      Logger.info('Processing token refresh request')
      
      // Verificar el token actual
      const payload = await this.jwtGenerator.verify(token)
      
      if (!payload || !payload.id || !payload.email) {
        throw new Error('Invalid token payload')
      }
      
      // Generar un nuevo token con el mismo payload
      const newToken = await this.jwtGenerator.generate({
        id: payload.id,
        email: payload.email
      })

      Logger.info('Token refreshed successfully:', { userId: payload.id })
      
      return { token: newToken }
    } catch (error) {
      Logger.error('Token refresh failed:', error)
      throw { status: 401, error: 'Invalid token' }
    }
  }

  async register(params: { email: string; password: string }): Promise<{ id: string }> {
    try {
      Logger.info('Processing registration request:', { email: params.email })
      
      const userId = await this.registerUseCase.run(params)
      
      Logger.info('Registration successful:', { email: params.email, userId })
      return { id: userId }
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
        Logger.info('Registration failed - user already exists:', { email: params.email })
        throw {
          status: 409,
          error: 'User already exists'
        }
      }
      
      Logger.error('Registration failed:', error)
      throw { status: 500, error: 'Internal server error' }
    }
  }

  async login(params: { email: string; password: string }): Promise<{ token: string }> {
    try {
      Logger.info('Processing login request:', { email: params.email })
      
      const result = await this.loginUseCase.run(params)
      
      Logger.info('Login successful:', { email: params.email })
      return result
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        Logger.info('Login failed - invalid credentials:', { email: params.email })
        const errorData = {
          type: (error as InvalidCredentials).type,
          message: (error as InvalidCredentials).message
        }
        throw {
          status: 401,
          error: errorData
        }
      }
      
      Logger.error('Login failed:', error)
      throw { status: 500, error: 'Internal server error' }
    }
  }
}
