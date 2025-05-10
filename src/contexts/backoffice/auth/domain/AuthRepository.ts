import { User } from './User'
import { EmailVO } from './EmailVO'
import { UserId } from './UserId'

export interface AuthRepository {
  save(user: User): Promise<void>
  findByEmail(email: EmailVO): Promise<User | null>
  findById(id: UserId): Promise<User | null>
}
