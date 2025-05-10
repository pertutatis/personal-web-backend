import * as bcrypt from 'bcrypt'
import { Logger } from '@/contexts/shared/infrastructure/Logger'

export class PasswordHash {
  constructor(private readonly hash: string) {}

  static async create(password: string): Promise<PasswordHash> {
    try {
      Logger.info('Creating password hash')
      const saltRounds = 10
      const hash = await bcrypt.hash(password, saltRounds)
      return new PasswordHash(hash)
    } catch (error) {
      Logger.error('Error creating password hash:', error)
      throw error
    }
  }

  async compare(plainPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, this.hash)
    } catch (error) {
      Logger.error('Error comparing passwords:', error)
      throw error
    }
  }

  toString(): string {
    return this.hash
  }
}
