import { PostgresMigrations } from '../PostgresMigrations'
import { Logger } from '../Logger'
import { Environment } from '../Environment'
import { Pool } from 'pg'

export class TestHelper {
  private static pools: Pool[] = []

  static async waitForDatabases(): Promise<void> {
    Logger.info('Waiting for databases to be ready...')
    
    if (!Environment.isTest()) {
      throw new Error('waitForDatabases can only be run in test environment')
    }

    try {
      // Cerrar cualquier conexión existente primero
      await this.closeConnections()

      const migrations = [
        new PostgresMigrations('test_articles'),
        new PostgresMigrations('test_books'),
        new PostgresMigrations('auth_test')
      ]

      // Crear nuevas conexiones
      const pools = await Promise.all(
        migrations.map(async (migration) => {
          const pool = await migration.getPool()
          // Verificar la conexión
          await pool.query('SELECT 1')
          return pool
        })
      )

      this.pools = pools
      Logger.info('✅ Database connections established')
    } catch (error) {
      Logger.error('❌ Error connecting to databases:', error)
      // Asegurar que cerramos las conexiones en caso de error
      await this.closeConnections()
      throw error
    }
  }

  static async closeConnections(): Promise<void> {
    Logger.info('Closing database connections...')

    try {
      await Promise.all(
        this.pools.map(pool => pool.end())
      )
      this.pools = []
      Logger.info('✅ Database connections closed')
    } catch (error) {
      Logger.error('❌ Error closing database connections:', error)
      throw error
    }
  }

  static async cleanAllDatabases(): Promise<void> {
    return this.cleanEnvironment()
  }

  static async cleanEnvironment(): Promise<void> {
    Logger.info('Cleaning up test environment...')
    
    if (!Environment.isTest()) {
      throw new Error('cleanEnvironment can only be run in test environment')
    }

    try {
      // Asegurar que todas las conexiones existentes estén cerradas
      await this.closeConnections()

      const articlesMigrations = new PostgresMigrations('test_articles')
      const booksMigrations = new PostgresMigrations('test_books')
      const authMigrations = new PostgresMigrations('auth_test')

      // Obtener nuevas conexiones para la limpieza
      const migrations = [articlesMigrations, booksMigrations, authMigrations]
      const cleanOps = migrations.map(async (migration) => {
        try {
          await migration.clean()
        } finally {
          const pool = await migration.getPool()
          if (pool) {
            await pool.end()
          }
        }
      })

      await Promise.all(cleanOps)
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
