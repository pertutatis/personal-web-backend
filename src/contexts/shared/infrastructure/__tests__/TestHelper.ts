import { PostgresMigrations } from '../PostgresMigrations'
import { Logger } from '../Logger'
import { Environment } from '../Environment'

export class TestHelper {
  static async cleanEnvironment(): Promise<void> {
    Logger.info('Cleaning up test environment...')
    
    if (!Environment.isTest()) {
      throw new Error('cleanEnvironment can only be run in test environment')
    }

    try {
      const articlesMigrations = new PostgresMigrations('test_articles')
      const booksMigrations = new PostgresMigrations('test_books')
      const authMigrations = new PostgresMigrations('auth_test')

      await Promise.all([
        articlesMigrations.clean(),
        booksMigrations.clean(),
        authMigrations.clean()
      ])

      Logger.info('✅ Test environment cleaned up')
    } catch (error) {
      Logger.error('❌ Error cleaning up test environment:', error)
      throw error
    }
  }

  static async setupEnvironment(): Promise<void> {
    Logger.info('Setting up test environment...')
    
    if (!Environment.isTest()) {
      throw new Error('setupEnvironment can only be run in test environment')
    }

    try {
      const articlesMigrations = new PostgresMigrations('test_articles')
      const booksMigrations = new PostgresMigrations('test_books')
      const authMigrations = new PostgresMigrations('auth_test')

      await Promise.all([
        articlesMigrations.setup(),
        booksMigrations.setup(),
        authMigrations.setup()
      ])

      Logger.info('✅ Test environment setup completed')
    } catch (error) {
      Logger.error('❌ Error setting up test environment:', error)
      throw error
    }
  }
}
