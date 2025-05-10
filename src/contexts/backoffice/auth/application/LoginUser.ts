import { AuthRepository } from '../domain/AuthRepository'
import { JWTGenerator } from '../domain/JWTGenerator'
import { PasswordHash } from '../domain/PasswordHash'
import { EmailVO } from '../domain/EmailVO'
import { InvalidCredentials } from './InvalidCredentials'
import { Logger } from '@/contexts/shared/infrastructure/Logger'
import { TokenPayload } from '../domain/TokenPayload'

export class LoginUser {
  constructor(
    private repository: AuthRepository,
    private jwtGenerator: JWTGenerator
  ) {}

  async run({ email, password }: { email: string; password: string }): Promise<{ token: string }> {
    Logger.info('Login attempt for user:', { email })
    
    const emailVO = new EmailVO(email)
    const user = await this.repository.findByEmail(emailVO)
    
    if (!user) {
      Logger.info('User not found:', { email })
      throw new InvalidCredentials()
    }

    const passwordHash = new PasswordHash(user.passwordHash.toString())
    const isValid = await passwordHash.compare(password)

    if (!isValid) {
      Logger.info('Invalid password for user:', { email })
      throw new InvalidCredentials()
    }

    Logger.info('User logged in successfully:', { email })
    
    const payload: TokenPayload = {
      userId: user.id.value,
      email: user.email.value
    }
    
    const token = await this.jwtGenerator.generate(payload)
    
    return { token }
  }
}
