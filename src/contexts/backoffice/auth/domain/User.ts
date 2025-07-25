import { UserId } from './UserId'
import { EmailVO } from './EmailVO'
import { PasswordHash } from './PasswordHash'

export class User {
  constructor(
    readonly id: UserId,
    readonly email: EmailVO,
    readonly password: PasswordHash,
  ) {}

  static async create(params: {
    id: UserId
    email: EmailVO
    plainPassword: string
  }): Promise<User> {
    const passwordHash = await PasswordHash.create(params.plainPassword)
    return new User(params.id, params.email, passwordHash)
  }

  static async fromPrimitives(data: {
    id: string
    email: string
    password_hash: string
  }): Promise<User> {
    return new User(
      new UserId(data.id),
      new EmailVO(data.email),
      new PasswordHash(data.password_hash),
    )
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return this.password.compare(plainPassword)
  }

  toPrimitives() {
    return {
      id: this.id.value,
      email: this.email.value,
      password_hash: this.password.toString(),
    }
  }
}
