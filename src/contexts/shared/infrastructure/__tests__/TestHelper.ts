import { Logger } from '../Logger'
import { Environment } from '../Environment'
import { Pool } from 'pg'
import { TestDatabase } from './TestDatabase'

import { PostgresMigrations } from '../PostgresMigrations';

export class TestHelper {
  private static readonly databases = {
    articles: 'test_articles',
    auth: 'auth_test'
  };

  static async waitForDatabases(): Promise<void> {
    // Logger.info('Waiting for databases to be ready...')
    
    if (!Environment.isTest()) {
      throw new Error('waitForDatabases can only be run in test environment')
    }

    try {
      // 1. Cerrar todas las conexiones existentes
      await TestDatabase.closeAll()

      // 2. Limpiar y configurar las bases de datos
      await Promise.all(Object.values(this.databases).map(async (dbName) => {
        const migrations = new PostgresMigrations(dbName)
        await migrations.clean()
        await migrations.setup()
      }))

      // 3. Crear nuevas conexiones
      await Promise.all([
        TestDatabase.getArticlesConnection(),
        // TestDatabase.getBooksConnection(),
        TestDatabase.getAuthConnection()
      ])

      // Logger.info('✅ Database connections established')
    } catch (error) {
      Logger.error('❌ Error connecting to databases:', error)
      await TestDatabase.closeAll()
      throw error
    }
  }

  static async closeConnections(): Promise<void> {
    // Logger.info('Closing database connections...')

    try {
      await TestDatabase.closeAll()
      // Logger.info('✅ Database connections closed')
    } catch (error) {
      Logger.error('❌ Error closing database connections:', error)
      throw error
    }
  }

  static async cleanAllDatabases(): Promise<void> {
    await TestDatabase.cleanAll()
  }

  static async cleanEnvironment(): Promise<void> {
    // Logger.info('Cleaning up test environment...')
    
    if (!Environment.isTest()) {
      throw new Error('cleanEnvironment can only be run in test environment')
    }

    try {
      await TestDatabase.cleanAll()
      // Logger.info('✅ Test environment cleaned up')
    } catch (error) {
      // Logger.error('❌ Error cleaning up test environment:', error)
      throw error
    }
  }

  static async setupEnvironment(): Promise<void> {
    Logger.info('Setting up test environment...')
    
    if (!Environment.isTest()) {
      throw new Error('setupEnvironment can only be run in test environment')
    }

    try {
      // Configurar bases de datos en secuencia para evitar problemas de concurrencia
      for (const dbName of Object.values(this.databases)) {
        const migrations = new PostgresMigrations(dbName)
        await migrations.setup()
      }

      await Promise.all([
        TestDatabase.getArticlesConnection(),
        // TestDatabase.getBooksConnection(),
        TestDatabase.getAuthConnection()
      ])

      Logger.info('✅ Test environment setup completed')
    } catch (error) {
      Logger.error('❌ Error setting up test environment:', error)
      throw error
    }
  }
}
