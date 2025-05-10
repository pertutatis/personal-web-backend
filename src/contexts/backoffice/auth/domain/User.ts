import { UserId } from './UserId'
import { EmailVO } from './EmailVO'
import { PasswordHash } from './PasswordHash'

export class User {
  constructor(
    readonly id: UserId,
    readonly email: EmailVO,
    readonly passwordHash: PasswordHash
  ) {}

  static async create(id: string, email: string, password: string): Promise<User> {
    const userId = new UserId(id)
    const emailVO = new EmailVO(email)
    const passwordHash = await PasswordHash.create(password)

    return new User(userId, emailVO, passwordHash)
  }

  static async fromPrimitives(data: { id: string; email: string; password_hash: string }): Promise<User> {
    return new User(
      new UserId(data.id),
      new EmailVO(data.email),
      new PasswordHash(data.password_hash)
    )
  }

  toPrimitives() {
    return {
      id: this.id.value,
      email: this.email.value,
      password_hash: this.passwordHash.toString()
    }
  }
}
