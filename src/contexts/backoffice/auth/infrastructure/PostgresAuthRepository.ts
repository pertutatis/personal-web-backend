import { AuthRepository } from '../domain/AuthRepository'
import { User } from '../domain/User'
import { EmailVO } from '../domain/EmailVO'
import { UserId } from '../domain/UserId'
import { DatabaseConnection } from '@/contexts/shared/infrastructure/persistence/DatabaseConnection'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export class PostgresAuthRepository implements AuthRepository {
  constructor(private connection: DatabaseConnection) {}

  async save(user: User): Promise<void> {
    const data = user.toPrimitives()
    Logger.info('Saving user to database:', { email: data.email })

    try {
      await this.connection.execute(
        `INSERT INTO users (id, email, password_hash)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE
         SET email = $2, password_hash = $3`,
        [data.id, data.email, data.password_hash],
      )

      Logger.info('User saved successfully')
    } catch (error) {
      Logger.error('Error saving user:', error)
      throw error
    }
  }

  async findByEmail(email: EmailVO): Promise<User | null> {
    Logger.info('Finding user by email:', { email: email.value })

    try {
      const result = await this.connection.execute<{
        id: string
        email: string
        password_hash: string
      }>(
        `SELECT id, email, password_hash
         FROM users
         WHERE email = $1`,
        [email.value],
      )

      if (result.rows.length === 0) {
        Logger.info('User not found')
        return null
      }

      const userData = result.rows[0]
      Logger.info('User found')

      return User.fromPrimitives({
        id: userData.id,
        email: userData.email,
        password_hash: userData.password_hash,
      })
    } catch (error) {
      Logger.error('Error finding user by email:', error)
      throw error
    }
  }

  async findById(id: UserId): Promise<User | null> {
    Logger.info('Finding user by id:', { id: id.value })

    try {
      const result = await this.connection.execute<{
        id: string
        email: string
        password_hash: string
      }>(
        `SELECT id, email, password_hash
         FROM users
         WHERE id = $1`,
        [id.value],
      )

      if (result.rows.length === 0) {
        Logger.info('User not found')
        return null
      }

      const userData = result.rows[0]
      Logger.info('User found')

      return User.fromPrimitives({
        id: userData.id,
        email: userData.email,
        password_hash: userData.password_hash,
      })
    } catch (error) {
      Logger.error('Error finding user by id:', error)
      throw error
    }
  }
}
