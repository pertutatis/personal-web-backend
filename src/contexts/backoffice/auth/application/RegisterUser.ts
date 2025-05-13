import { AuthRepository } from '../domain/AuthRepository'
import { EmailVO } from '../domain/EmailVO'
import { User } from '../domain/User'
import { UserId } from '../domain/UserId'
import { UserAlreadyExists } from './UserAlreadyExists'
import { UuidGenerator } from '@/contexts/shared/domain/UuidGenerator'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export class RegisterUser {
  constructor(
    private repository: AuthRepository,
    private uuidGenerator: UuidGenerator
  ) {}

  async run({ email, password }: { email: string; password: string }): Promise<string> {
    Logger.info('Registering user with email:', email)
    
    const emailVO = new EmailVO(email)
    
    const existingUser = await this.repository.findByEmail(emailVO)
    if (existingUser) {
      Logger.info('User already exists:', { email })
      throw new UserAlreadyExists(email)
    }

    const generatedId = this.uuidGenerator.generate()
    const userId = new UserId(generatedId)
    const user = await User.create({
      id: userId,
      email: emailVO,
      plainPassword: password
    })
    
    await this.repository.save(user)
    Logger.info('User registered successfully:', { email, userId: generatedId })
    
    return generatedId
  }
}
