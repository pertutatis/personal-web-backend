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

  constructor(
    repository: AuthRepository,
    uuidGenerator: UuidGenerator,
    jwtGenerator: JWTGenerator
  ) {
    this.registerUseCase = new RegisterUser(repository, uuidGenerator)
    this.loginUseCase = new LoginUser(repository, jwtGenerator)
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
        throw { status: 409, message: 'User already exists' }
      }
      
      Logger.error('Registration failed:', error)
      throw { status: 500, message: 'Internal server error' }
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
        throw { status: 401, message: 'Invalid credentials' }
      }
      
      Logger.error('Login failed:', error)
      throw { status: 500, message: 'Internal server error' }
    }
  }
}
